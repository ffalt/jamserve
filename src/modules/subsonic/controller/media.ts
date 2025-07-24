import { Episode } from '../../../entity/episode/episode.js';
import { Track } from '../../../entity/track/track.js';
import {
	SubsonicParameterCaptions,
	SubsonicParameterCoverArt,
	SubsonicParameterHLS,
	SubsonicParameterID,
	SubsonicParameterLyrics,
	SubsonicParameterLyricsByID,
	SubsonicParameterStream,
	SubsonicParameterUsername
} from '../model/subsonic-rest-params.js';
import { logger } from '../../../utils/logger.js';

import { DBObjectType } from '../../../types/enums.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { ApiBinaryResult } from '../../deco/express/express-responder.js';
import { SubsonicResponseLyrics, SubsonicResponseLyricsList, SubsonicStructuredLyrics } from '../model/subsonic-rest-data.js';
import { ApiImageTypes, ApiStreamTypes } from '../../../types/consts.js';
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';
import { SubsonicApiError, SubsonicFormatter } from '../formatter.js';
import { StreamOptions } from '../../../entity/stream/stream.service.js';
import path from 'node:path';

const log = logger('SubsonicApi');

@SubsonicController()
export class SubsonicMediaRetrievalApi {
	/**
	 * Streams a given media file.
	 * Since 1.0.0
	 */
	@SubsonicRoute('/stream', {
		summary: 'Stream',
		description: 'Streams a given media file.',
		tags: ['Media Retrieval'],
		binary: ApiStreamTypes
	})
	async stream(@SubsonicParams() query: SubsonicParameterStream, @SubsonicCtx() { orm, engine, user }: Context): Promise<ApiBinaryResult> {
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
		const o = await orm.findInStreamTypes(query.id);
		if (!o?.obj) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NOT_FOUND));
		}
		const opts: StreamOptions = {
			maxBitRate: query.maxBitRate !== undefined && query.maxBitRate > 0 ? query.maxBitRate : undefined,
			format: query.format,
			timeOffset: query.timeOffset !== undefined && query.timeOffset > 0 ? query.timeOffset : undefined
		};
		switch (o.objType) {
			case DBObjectType.track: {
				const res = await engine.stream.streamTrack(o.obj as Track, opts);
				engine.nowPlaying.reportTrack(orm, o.obj as Track, user).catch(error => log.error(error)); // do not wait
				return res;
			}
			case DBObjectType.episode: {
				const result = await engine.stream.streamEpisode(o.obj as Episode, opts);
				engine.nowPlaying.reportEpisode(orm, o.obj as Episode, user).catch(error => log.error(error)); // do not wait
				return result;
			}
			default:
		}
		return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.PARAM_INVALID));
	}

	/**
	 * Downloads a given media file. Similar to stream, but this method returns the original media data without transcoding or downsampling.
	 * Since 1.0.0
	 */
	@SubsonicRoute('/download', {
		summary: 'Download',
		description: 'Downloads a given media file. Similar to stream, but this method returns the original media data without transcoding or downsampling.',
		tags: ['Media Retrieval'],
		binary: ApiStreamTypes
	})
	async download(@SubsonicParams() query: SubsonicParameterID, @SubsonicCtx() { orm, engine, user }: Context): Promise<ApiBinaryResult> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		A string which uniquely identifies the file to download. Obtained by calls to getMusicDirectory.
		 */
		if (!query.id) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NOT_FOUND));
		}
		const o = await orm.findInDownloadTypes(query.id);
		if (!o?.obj) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NOT_FOUND));
		}
		return engine.download.getObjDownload(o.obj, o.objType, undefined, user);
	}

	/**
	 * Add support for synchronized lyrics, multiple languages, and retrieval by song ID
	 * https://opensubsonic.netlify.app/docs/endpoints/getlyricsbysongid/
	 */
	@SubsonicRoute('/getLyricsBySongId', () => SubsonicResponseLyricsList, {
		summary: 'Synchronized Lyrics',
		description: 'Searches for and returns lyrics for a given song.',
		tags: ['Media Retrieval']
	})
	async getLyricsBySongId(@SubsonicParams() query: SubsonicParameterLyricsByID, @SubsonicCtx() { engine, orm }: Context): Promise<SubsonicResponseLyricsList> {
		const track = await orm.Track.findOneOrFailByID(query.id);
		const tag = await track.tag.get();
		const structuredLyrics: Array<SubsonicStructuredLyrics> = [];
		let hasSynced = false;
		let hasUnssynced = false;

		const splitLyrics = (lyrics: string): SubsonicStructuredLyrics => {
			const l: SubsonicStructuredLyrics = { lang: 'und', synced: false };
			l.line = lyrics.split('\n').map(value => ({ value }));
			return l;
		};
		if (tag?.syncedlyrics) {
			structuredLyrics.push(splitLyrics(tag.syncedlyrics));
			hasSynced = true;
		}
		if (tag?.lyrics) {
			structuredLyrics.push(splitLyrics(tag.lyrics));
			hasUnssynced = true;
		}
		if (!hasSynced) {
			const slyrics = await engine.audio.extractTagLyrics(path.join(track.path, track.fileName));
			if (slyrics) {
				const l: SubsonicStructuredLyrics = { lang: slyrics.language || 'und', synced: true };
				l.line = slyrics.events.map(value => ({ value: value.text, start: value.timestamp }));
				structuredLyrics.push(l);
			}
		}
		if (tag?.artist && tag?.title) {
			const trackLyrics = await engine.metadata.lyricsLrcLibByTrackTag(orm, track, tag);
			if (trackLyrics?.syncedLyrics && !hasSynced) {
				structuredLyrics.push(splitLyrics(trackLyrics.syncedLyrics));
				hasUnssynced = true;
			}
			if (trackLyrics?.lyrics && !hasUnssynced) {
				structuredLyrics.push(splitLyrics(trackLyrics.lyrics));
			}
			if (!hasSynced && !hasUnssynced) {
				const lyrics = await engine.metadata.lyricsOVH(orm, tag.artist, tag.title);
				if (lyrics?.lyrics) {
					structuredLyrics.push(splitLyrics(lyrics.lyrics));
				}
			}
		}
		return { lyricsList: { structuredLyrics } };
	}

	/**
	 * Searches for and returns lyrics for a given song.
	 * Since 1.2.0
	 */
	@SubsonicRoute('/getLyrics', () => SubsonicResponseLyrics, {
		summary: 'Lyrics',
		description: 'Searches for and returns lyrics for a given song.',
		tags: ['Media Retrieval']
	})
	async getLyrics(@SubsonicParams() query: SubsonicParameterLyrics, @SubsonicCtx() { orm, engine }: Context): Promise<SubsonicResponseLyrics> {
		/*
		 Parameter 	Required 	Default 	Comment
		 artist 	No 		The artist name.
		 title 	No 		The song title.
		 */
		if (!query.artist || !query.title) {
			return { lyrics: { value: '' } };
		}
		const lyrics = await engine.metadata.lyricsOVH(orm, query.artist, query.title);
		if (!lyrics?.lyrics) {
			return { lyrics: { value: '' } };
		}
		return { lyrics: { artist: query.artist, title: query.title, value: lyrics.lyrics.replaceAll('\r\n', '\n') } };
	}

	/**
	 * Returns a cover art image.
	 * Since 1.0.0
	 */
	@SubsonicRoute('/getCoverArt', {
		summary: 'Cover Art',
		description: 'Returns a cover art image.',
		tags: ['Media Retrieval'],
		binary: ApiImageTypes
	})
	async getCoverArt(@SubsonicParams() query: SubsonicParameterCoverArt, @SubsonicCtx() { orm, engine }: Context): Promise<ApiBinaryResult> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The ID of a song, album or artist.
		 size 	No 		If specified, scale image to this size.
		 */
		const o = await orm.findInImageTypes(query.id);
		if (!o?.obj) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NOT_FOUND));
		}
		return engine.image.getObjImage(orm, o.obj, o.objType, query.size);
	}

	/**
	 * Returns the avatar (personal image) for a user.
	 * Since 1.8.0
	 */
	@SubsonicRoute('/getAvatar', {
		summary: 'Avatar',
		description: 'Returns the avatar (personal image) for a user.',
		tags: ['Media Retrieval'],
		binary: ApiImageTypes
	})
	async getAvatar(@SubsonicParams() query: SubsonicParameterUsername, @SubsonicCtx() { orm, engine }: Context): Promise<ApiBinaryResult> {
		/*
		 Parameter 	Required 	Default 	Comment
		 username 	Yes 		The user in question.
		 */
		const name = query.username;
		const user = await engine.user.findByName(orm, name);
		if (!user) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NOT_FOUND));
		}
		return engine.image.getObjImage(orm, user, DBObjectType.user);
	}

	/**
	 * Returns captions (subtitles) for a video. Use getVideoInfo to get a list of available captions.
	 * Since 1.14.0
	 */
	@SubsonicRoute('/getCaptions', {
		summary: 'Captions',
		description: 'Returns captions (subtitles) for a video. Use getVideoInfo to get a list of available captions.',
		tags: ['Media Retrieval']
	})
	async getCaptions(@SubsonicParams() _query: SubsonicParameterCaptions, @SubsonicCtx() _ctx: Context): Promise<ApiBinaryResult> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The ID of the video.
		format 	No 		Preferred captions format ("srt" or "vtt").
		 */
		return {};
	}

	/**
	 * Creates an HLS (HTTP Live Streaming) playlist used for streaming video or audio. HLS is a streaming protocol implemented by Apple and works by breaking the overall stream
	 * into a sequence of small HTTP-based file downloads. It's supported by iOS and newer versions of Android. This method also supports adaptive bitrate streaming, see the bitRate parameter.
	 * Since 1.8.0
	 */
	@SubsonicRoute('/hls.m3u8', {
		summary: 'HLS',
		description: 'Creates an HLS (HTTP Live Streaming) playlist used for streaming video or audio.',
		tags: ['Media Retrieval'],
		binary: ['application/vnd.apple.mpegurl']
	})
	async hls(@SubsonicParams() _query: SubsonicParameterHLS, @SubsonicCtx() _ctx: Context): Promise<ApiBinaryResult> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		A string which uniquely identifies the media file to stream.
		 bitRate 	No 		If specified, the server will attempt to limit the bitrate to this value, in kilobits per second. If this parameter is specified more than once,
		 the server will create a variant playlist, suitable for adaptive bitrate streaming. The playlist will support streaming at all the specified bitrates.
		 The server will automatically choose video dimensions that are suitable for the given bitrates. Since 1.9.0 you may explicitly request a certain width (480)
		  and height (360) like so: bitRate=1000@480x360
		 */
		return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NOT_IMPLEMENTED));
	}
}
