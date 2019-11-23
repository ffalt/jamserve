import {DBObjectType} from '../../../db/db.types';
import {Episode} from '../../../engine/episode/episode.model';
import {Track} from '../../../engine/track/track.model';
import {Subsonic} from '../../../model/subsonic-rest-data';
import {SubsonicParameters} from '../../../model/subsonic-rest-params';
import {ApiBinaryResult} from '../../../typings';
import {logger} from '../../../utils/logger';
import {ApiOptions, SubsonicApiBase} from '../base';
import {FORMAT} from '../format';

const log = logger('SubsonicApi');

export class SubsonicMediaRetrievalApi extends SubsonicApiBase {

	/**
	 * Searches for and returns lyrics for a given song.
	 * Since 1.2.0
	 * http://your-server/rest/getLyrics.view
	 * @return Returns a <subsonic-response> element with a nested <lyrics> element on success. The <lyrics> element is empty if no matching lyrics was found.
	 */
	async getLyrics(req: ApiOptions<SubsonicParameters.Lyrics>): Promise<{ lyrics: Subsonic.Lyrics }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 artist 	No 		The artist name.
		 title 	No 		The song title.
		 */
		if (!req.query.artist || !req.query.title) {
			return {lyrics: {content: ''}};
		}
		const lyrics = await this.engine.audioModule.getLyrics(req.query.artist, req.query.title);
		if (!lyrics || !lyrics.lyrics) {
			return {lyrics: {content: ''}};
		}
		return {lyrics: {artist: req.query.artist, title: req.query.title, content: lyrics.lyrics.replace(/\r\n/g, '\n')}};
	}

	/**
	 * Returns a cover art image.
	 * Since 1.0.0
	 * http://your-server/rest/getCoverArt.view
	 * @return  Returns the cover art image in binary form.
	 */
	async getCoverArt(req: ApiOptions<SubsonicParameters.CoverArt>): Promise<ApiBinaryResult> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The ID of a song, album or artist.
		 size 	No 		If specified, scale image to this size.
		 */
		const o = await this.engine.store.findInAll(req.query.id);
		if (!o) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		return this.engine.imageService.getObjImage(o, req.query.size);
	}

	/**
	 * Returns the avatar (personal image) for a user.
	 * Since 1.8.0
	 * http://your-server/rest/getAvatar.view
	 * @return Returns the avatar image in binary form.
	 */
	async getAvatar(req: ApiOptions<SubsonicParameters.Username>): Promise<ApiBinaryResult> {
		/*
		 Parameter 	Required 	Default 	Comment
		 username 	Yes 		The user in question.
		 */
		const name = req.query.username;
		const user = await this.engine.userService.getByName(name);
		if (!user) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		return this.engine.imageService.getObjImage(user);
	}

	/**
	 * Returns captions (subtitles) for a video. Use getVideoInfo to get a list of available captions.
	 * Since 1.14.0
	 * http://your-server/rest/getCaptions.view
	 * @return 	Returns the raw video captions.
	 */
	async getCaptions(req: ApiOptions<SubsonicParameters.Captions>): Promise<ApiBinaryResult> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The ID of the video.
		format 	No 		Preferred captions format ("srt" or "vtt").
		 */
		return {};
	}

	/**
	 * Downloads a given media file. Similar to stream, but this method returns the original media data without transcoding or downsampling.
	 * Since 1.0.0
	 * http://your-server/rest/download.view
	 * @return Returns binary data on success, or an XML document on error (in which case the HTTP content type will start with "text/xml").
	 */
	async download(req: ApiOptions<SubsonicParameters.ID>): Promise<ApiBinaryResult> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		A string which uniquely identifies the file to download. Obtained by calls to getMusicDirectory.
		 */
		const o = await this.engine.store.findInAll(req.query.id);
		if (!o) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		return this.engine.downloadService.getObjDownload(o, undefined, req.user);
	}

	/**
	 * Streams a given media file.
	 * Since 1.0.0
	 * http://your-server/rest/stream.view
	 * @return Returns binary data on success, or an XML document on error (in which case the HTTP content type will start with "text/xml").
	 */
	async stream(req: ApiOptions<SubsonicParameters.Stream>): Promise<ApiBinaryResult> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		A string which uniquely identifies the file to stream. Obtained by calls to getMusicDirectory.
		 maxBitRate 	No 		(Since 1.2.0) If specified, the server will attempt to limit the bitrate to this value, in kilobits per second. If set to zero, no limit is imposed.
		 format 	No 		(Since 1.6.0) Specifies the preferred target format (e.g., "mp3" or "flv") in case there are multiple applicable transcodings. Starting with 1.9.0 you can use the special value "raw" to disable transcoding.
		 timeOffset 	No 		Only applicable to video streaming. If specified, start streaming at the given offset (in seconds) into the video. Typically used to implement video skipping.
		 size 	No 		(Since 1.6.0) Only applicable to video streaming. Requested video size specified as WxH, for instance "640x480".
		 estimateContentLength 	No 	false 	(Since 1.8.0). If set to "true", the Content-Length HTTP header will be set to an estimated value for transcoded or downsampled media.
		 converted 	No 	false 	(Since 1.14.0) Only applicable to video streaming. Subsonic can optimize videos for streaming by converting them to MP4. If a conversion exists for the video in question, then setting this parameter to "true" will cause the converted video to be returned instead of the original.
		 */
		const o = await this.engine.store.findInStores(req.query.id, this.engine.store.streamStores());
		if (!o) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		const maxBitRate = req.query.maxBitRate !== undefined && req.query.maxBitRate > 0 ? req.query.maxBitRate : undefined;
		switch (o.type) {
			case DBObjectType.track:
				const res = await this.engine.streamService.streamTrack(o as Track, req.query.format, maxBitRate, req.user);
				this.engine.nowPlayingService.reportTrack(o as Track, req.user).catch(e => log.error(e)); // do not wait
				return res;
			case DBObjectType.episode:
				const result = await this.engine.streamService.streamEpisode(o as Episode, req.query.format, maxBitRate, req.user);
				this.engine.nowPlayingService.reportEpisode(o as Episode, req.user).catch(e => log.error(e)); // do not wait
				return result;
			default:
		}
		return Promise.reject(Error('Invalid Object Type for Streaming'));
	}

	/**
	 * Creates an HLS (HTTP Live Streaming) playlist used for streaming video or audio. HLS is a streaming protocol implemented by Apple and works by breaking the overall stream
	 * into a sequence of small HTTP-based file downloads. It's supported by iOS and newer versions of Android. This method also supports adaptive bitrate streaming, see the bitRate parameter.
	 * Since 1.8.0
	 * http://your-server/rest/hls.m3u8
	 * @return Returns an M3U8 playlist on success (content type "application/vnd.apple.mpegurl"), or an XML document on error (in which case the HTTP content type will start with "text/xml").
	 */
	async hls(req: ApiOptions<SubsonicParameters.HLS>): Promise<ApiBinaryResult> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		A string which uniquely identifies the media file to stream.
		 bitRate 	No 		If specified, the server will attempt to limit the bitrate to this value, in kilobits per second. If this parameter is specified more than once,
		 the server will create a variant playlist, suitable for adaptive bitrate streaming. The playlist will support streaming at all the specified bitrates.
		 The server will automatically choose video dimensions that are suitable for the given bitrates. Since 1.9.0 you may explicitly request a certain width (480)
		  and height (360) like so: bitRate=1000@480x360
		 */
		return Promise.reject('not implemented');
	}

}
