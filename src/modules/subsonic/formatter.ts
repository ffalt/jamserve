import {
	SubsonicAlbumID3,
	SubsonicAlbumInfo,
	SubsonicArtist,
	SubsonicArtistID3,
	SubsonicArtistInfo,
	SubsonicArtistInfo2,
	SubsonicBookmark,
	SubsonicChatMessage,
	SubsonicChild,
	SubsonicDirectory,
	SubsonicGenre,
	SubsonicIndex,
	SubsonicIndexID3,
	SubsonicInternetRadioStation,
	SubsonicMusicFolder,
	SubsonicNowPlayingEntry,
	SubsonicPlaylist,
	SubsonicPlaylistWithSongs,
	SubsonicPlayQueue,
	SubsonicPodcastChannel,
	SubsonicPodcastEpisode,
	SubsonicResponse,
	SubsonicSimilarSongs,
	SubsonicSimilarSongs2,
	SubsonicUser
} from './model/subsonic-rest-data.js';
import moment from 'moment';
import { Orm } from '../engine/services/orm.service.js';
import { Root } from '../../entity/root/root.js';
import { User } from '../../entity/user/user.js';
import { FolderIndex, FolderIndexEntry } from '../../entity/folder/folder.model.js';
import { State } from '../../entity/state/state.js';
import { IndexResult, IndexResultGroup } from '../../entity/base/base.js';
import { Artist } from '../../entity/artist/artist.js';
import { Folder } from '../../entity/folder/folder.js';
import path from 'path';
import { Album } from '../../entity/album/album.js';
import { Collection } from '../orm/index.js';
import { Genre } from '../../entity/genre/genre.js';
import { LastFM } from '../audio/clients/lastfm-rest-data.js';
import { Track } from '../../entity/track/track.js';
import { fileSuffix } from '../../utils/fs-utils.js';
import mimeTypes from 'mime-types';
import { AudioFormatType, PodcastStatus } from '../../types/enums.js';
import { NowPlaying } from '../../entity/nowplaying/nowplaying.js';
import { Podcast } from '../../entity/podcast/podcast.js';
import { Episode } from '../../entity/episode/episode.js';
import { Playlist } from '../../entity/playlist/playlist.js';
import { Bookmark } from '../../entity/bookmark/bookmark.js';
import { PlayQueue } from '../../entity/playqueue/playqueue.js';
import { Radio } from '../../entity/radio/radio.js';
import { Chat } from '../../entity/chat/chat.js';

export interface SubsonicAPIResponse {
	'subsonic-response': SubsonicResponse;
}

export interface StateMap {
	[id: string]: State;
}

export class SubsonicFormatter {
	static FAIL = {
		GENERIC: 0,
		PARAMETER: 10,
		CLIENT_OLD: 20,
		SERVER_OLD: 30,
		CREDENTIALS: 40,
		UNAUTH: 50,
		NOTFOUND: 70
	};

	static ERRORS = {
		LOGIN_FAILED: { code: SubsonicFormatter.FAIL.CREDENTIALS, fail: 'Wrong username or password.' },
		PARAM_MISSING: { code: SubsonicFormatter.FAIL.PARAMETER, fail: 'Required parameter is missing.' },
		PARAM_INVALID: { code: SubsonicFormatter.FAIL.PARAMETER, fail: 'Required parameter is invalid.' },
		SERVER_OLD: { code: SubsonicFormatter.FAIL.SERVER_OLD, fail: 'Incompatible Subsonic REST protocol version. Server must upgrade.' },
		CLIENT_OLD: { code: SubsonicFormatter.FAIL.CLIENT_OLD, fail: 'Incompatible Subsonic REST protocol version. Client must upgrade.' },
		NOT_FOUND: { code: SubsonicFormatter.FAIL.NOTFOUND, fail: `The requested data was not found.` },
		UNAUTH: { code: SubsonicFormatter.FAIL.UNAUTH, fail: 'Not authorised' },
		NO_SHARING: { code: SubsonicFormatter.FAIL.UNAUTH, fail: 'Sharing is disabled on this server.' },
		NOT_IMPLEMENTED: { code: SubsonicFormatter.FAIL.NOTFOUND, fail: 'Not implemented' }
	};

	static defaultProperties(): SubsonicResponse {
		return {
			status: 'ok',
			version: '1.16.0'
		};
	}

	static packFail(code: number, txt?: string): SubsonicAPIResponse {
		/*
		 <?xml version="1.0" encoding="UTF-8"?>
		 <subsonic-response xmlns="http://Subsonicorg/restapi"
		 status="failed" version="1.1.0">
		 <error code="40" message="Wrong username or password"/>
		 </subsonic-response>

		 The following error codes are defined:
		 Code 	Description
		 0 	A generic error.
		 10 	Required parameter is missing.
		 20 	Incompatible Subsonic REST protocol version. Client must upgrade.
		 30 	Incompatible Subsonic REST protocol version. Server must upgrade.
		 40 	Wrong username or password.
		 50 	user is not authorized for the given operation.
		 60 	The trial period for the Subsonic server is over. Please upgrade to Subsonic Premium. Visit Subsonicorg for details.
		 70 	The requested data was not found.
		 */

		const codeStrings: { [num: number]: string } = {
			0: 'A generic error.',
			10: 'Required parameter is missing.',
			20: 'Incompatible Subsonic REST protocol version. Client must upgrade.',
			30: 'Incompatible Subsonic REST protocol version. Server must upgrade.',
			40: 'Wrong username or password.',
			50: 'user is not authorized for the given operation.',
			70: 'The requested data was not found.'
		};

		return {
			'subsonic-response': {
				...SubsonicFormatter.defaultProperties(), status: 'failed', error: {
					code,
					message: txt || codeStrings[code]
				}
			}
		};
	}

	static packResponse(o: SubsonicResponse): SubsonicAPIResponse {
		return {
			'subsonic-response': { ...SubsonicFormatter.defaultProperties(), ...o }
		};
	}

	static packOK(): SubsonicAPIResponse {
		return {
			'subsonic-response': SubsonicFormatter.defaultProperties()
		};
	}

	static formatSubSonicDate(date?: Date): string | undefined {
		if (date === undefined) {
			return;
		}
		return moment(date).utc().format(); // .format('YYYY-MM-DDThh:mm:ss.000Z');
	}

	static async packRoot(orm: Orm, root: Root): Promise<SubsonicMusicFolder> {
		return { id: await orm.Subsonic.subsonicID(root.id), name: root.name };
	}

	static packUser(user: User): SubsonicUser {
		return {
			username: user.name,
			email: user.email,
			maxBitRate: user.maxBitRate,
			avatarLastChanged: undefined, // user.avatarLastChanged !== undefined ? FORMAT.formatSubSonicDate(user.avatarLastChanged) : undefined,
			folder: undefined,
			scrobblingEnabled: false, // user.scrobblingEnabled,
			adminRole: user.roleAdmin,
			settingsRole: user.roleAdmin, // user.roles.settingsRole,
			downloadRole: user.roleStream, // user.roles.downloadRole,
			uploadRole: user.roleUpload,
			playlistRole: user.roleAdmin, // user.roles.playlistRole,
			coverArtRole: user.roleAdmin, // user.roles.coverArtRole,
			commentRole: user.roleAdmin, // user.roles.commentRole,
			podcastRole: user.rolePodcast,
			streamRole: user.roleStream,
			jukeboxRole: false, // user.roles.jukeboxRole,
			shareRole: false, // user.roles.shareRole,
			videoConversionRole: false // user.roles.videoConversionRole
		};
	}

	static async packFolderIndexArtist(orm: Orm, entry: FolderIndexEntry, state?: State): Promise<SubsonicArtist> {
		/*
<xs:complexType name="Artist">
	<xs:attribute name="id" type="xs:string" use="required"/>
	<xs:attribute name="name" type="xs:string" use="required"/>
	<xs:attribute name="starred" type="xs:dateTime" use="optional"/> <!-- Added in 1.10.1 -->
	<xs:attribute name="userRating" type="sub:UserRating" use="optional"/>  <!-- Added in 1.13.0 -->
	<xs:attribute name="averageRating" type="sub:AverageRating" use="optional"/>  <!-- Added in 1.13.0 -->
</xs:complexType>
	 */
		return {
			id: await orm.Subsonic.subsonicID(entry.id),
			name: entry.name,
			starred: state && state.faved ? SubsonicFormatter.formatSubSonicDate(state.faved) : undefined,
			userRating: state?.rated && state?.rated > 0 ? state.rated : undefined
			// TODO: averageRating
		};
	}

	static async packFolderIndex(orm: Orm, index: FolderIndex, states: StateMap): Promise<Array<SubsonicIndex>> {
		if (!index) {
			return [];
		}
		const indexes: Array<SubsonicIndex> = [];
		for (const i of index.groups) {
			const artist: Array<SubsonicArtist> = [];
			for (const e of i.items) {
				artist.push(await SubsonicFormatter.packFolderIndexArtist(orm, e, states[e.id]));
			}
			indexes.push({ name: i.name, artist });
		}
		return indexes;
	}

	static async packArtistIndex(orm: Orm, index: IndexResult<IndexResultGroup<Artist>>, states: StateMap): Promise<Array<SubsonicIndexID3>> {
		if (!index) {
			return [];
		}
		const indexes: Array<SubsonicIndexID3> = [];
		for (const i of index.groups) {
			const artist: Array<SubsonicArtistID3> = [];
			for (const e of i.items) {
				artist.push(await SubsonicFormatter.packArtist(orm, e, states[e.id]));
			}
			indexes.push({ name: i.name, artist });
		}
		return indexes;
	}

	static async packDirectory(orm: Orm, folder: Folder, state: State): Promise<SubsonicDirectory> {
		/*
		 <xs:complexType name="Directory">
		 <xs:sequence>
		 <xs:element name="child" type="sub:Child" minOccurs="0" maxOccurs="unbounded"/>
		 </xs:sequence>
		 <xs:attribute name="id" type="xs:string" use="required"/>
		 <xs:attribute name="parent" type="xs:string" use="optional"/>
		 <xs:attribute name="name" type="xs:string" use="required"/>
		 <xs:attribute name="starred" type="xs:dateTime" use="optional"/> <!-- Added in 1.10.1 -->
		 </xs:complexType>
		 */
		return {
			id: await orm.Subsonic.subsonicID(folder.id),
			parent: await orm.Subsonic.mayBeSubsonicID(folder.parent.id()),
			name: path.basename(folder.path),
			starred: state && state.faved ? SubsonicFormatter.formatSubSonicDate(state.faved) : undefined
		};
	}

	static async packFolderArtist(orm: Orm, folder: Folder, state?: State): Promise<SubsonicArtist> {
		/*
    <xs:complexType name="Artist">
        <xs:attribute name="id" type="xs:string" use="required"/>
        <xs:attribute name="name" type="xs:string" use="required"/>
        <xs:attribute name="starred" type="xs:dateTime" use="optional"/> <!-- Added in 1.10.1 -->
        <xs:attribute name="userRating" type="sub:UserRating" use="optional"/>  <!-- Added in 1.13.0 -->
        <xs:attribute name="averageRating" type="sub:AverageRating" use="optional"/>  <!-- Added in 1.13.0 -->
    </xs:complexType>
		 */
		return {
			id: await orm.Subsonic.subsonicID(folder.id),
			name: folder.title || folder.artist || '',
			starred: state && state.faved ? SubsonicFormatter.formatSubSonicDate(state.faved) : undefined,
			userRating: state?.rated && state?.rated > 0 ? state.rated : undefined
		};
	}

	static async packAlbum(orm: Orm, album: Album, state?: State): Promise<SubsonicAlbumID3> {
		/*
		 <xs:complexType name="AlbumID3">
		 <xs:attribute name="id" type="xs:string" use="required"/>
		 <xs:attribute name="name" type="xs:string" use="required"/>
		 <xs:attribute name="artist" type="xs:string" use="optional"/>
		 <xs:attribute name="artistId" type="xs:string" use="optional"/>
		 <xs:attribute name="coverArt" type="xs:string" use="optional"/>
		 <xs:attribute name="songCount" type="xs:int" use="required"/>
		 <xs:attribute name="duration" type="xs:int" use="required"/>
		 <xs:attribute name="created" type="xs:dateTime" use="required"/>
		 <xs:attribute name="starred" type="xs:dateTime" use="optional"/>
		 <xs:attribute name="year" type="xs:int" use="optional"/> <!-- Added in 1.10.1 -->
		 <xs:attribute name="genre" type="xs:string" use="optional"/> <!-- Added in 1.10.1 -->

		 */
		const artist = await album.artist.get();
		const id = await orm.Subsonic.subsonicID(album.id);
		return {
			id,
			name: album.name,
			artist: artist?.name,
			artistId: await orm.Subsonic.mayBeSubsonicID(artist?.id),
			coverArt: id,
			songCount: await album.tracks.count(),
			duration: SubsonicFormatter.packDuration(album.duration),
			year: album.year,
			genre: await SubsonicFormatter.packGenres(album.genres),
			created: SubsonicFormatter.formatSubSonicDate(album.createdAt) as string,
			starred: state && state.faved ? SubsonicFormatter.formatSubSonicDate(state.faved) : undefined
		};
	}

	static packDuration(duration?: number): number {
		if (!duration || duration <= 0 || isNaN(duration)) {
			return -1;
		}
		return Math.trunc(duration / 1000);
	}

	static packBitrate(bitrate?: number): number {
		return bitrate !== undefined ? Math.round(bitrate / 1000) : -1;
	}

	static async packGenres(genres: Collection<Genre>): Promise<string | undefined> {
		return genres && (await genres.count()) > 0 ? (await genres.getItems()).map(g => g.name).join(' / ') : undefined;
	}

	static async packArtist(orm: Orm, artist: Artist, state?: State): Promise<SubsonicArtistID3> {
		/*
		 <xs:complexType name="ArtistID3">
		 <xs:attribute name="id" type="xs:string" use="required"/>
		 <xs:attribute name="name" type="xs:string" use="required"/>
		 <xs:attribute name="coverArt" type="xs:string" use="optional"/>
		 <xs:attribute name="albumCount" type="xs:int" use="required"/>
		 <xs:attribute name="starred" type="xs:dateTime" use="optional"/>
		 </xs:complexType>
		 */
		const id = await orm.Subsonic.subsonicID(artist.id);
		return {
			id,
			name: artist.name,
			coverArt: id,
			albumCount: await artist.albums.count(),
			starred: state && state.faved ? SubsonicFormatter.formatSubSonicDate(state.faved) : undefined
		};
	}

	static packImageInfo(info: LastFM.Album | LastFM.Artist, result: SubsonicAlbumInfo | SubsonicArtistInfo): void {
		(info.image || []).forEach(i => {
			if (i.size === 'small') {
				result.smallImageUrl = i.url;
			} else if (i.size === 'medium') {
				result.mediumImageUrl = i.url;
			} else if (i.size === 'large') {
				result.largeImageUrl = i.url;
			}
		});
	}

	static packAlbumInfo(info: LastFM.Album): SubsonicAlbumInfo {
		const result: SubsonicAlbumInfo = {
			notes: info.wiki ? info.wiki.content : undefined,
			musicBrainzId: info.mbid,
			lastFmUrl: info.url
		};
		SubsonicFormatter.packImageInfo(info, result);
		return result;
	}

	static packArtistInfo(info: LastFM.Artist, similar?: Array<SubsonicArtist>): SubsonicArtistInfo {
		const result: SubsonicArtistInfo = {
			biography: info.bio ? info.bio.content : undefined,
			musicBrainzId: info.mbid,
			lastFmUrl: info.url,
			similarArtist: similar
		};
		SubsonicFormatter.packImageInfo(info, result);
		return result;
	}

	static packArtistInfo2(info: LastFM.Artist, similar?: Array<SubsonicArtistID3>): SubsonicArtistInfo2 {
		const result: SubsonicArtistInfo2 = {
			biography: info.bio ? info.bio.content : undefined,
			musicBrainzId: info.mbid,
			lastFmUrl: info.url,
			similarArtist: similar || []
		};
		SubsonicFormatter.packImageInfo(info, result);
		return result;
	}

	static async packTrack(orm: Orm, track: Track, state?: State): Promise<SubsonicChild> {
		/*
		 <xs:complexType name="Child">
		 <xs:attribute name="id" type="xs:string" use="required"/>
		 <xs:attribute name="parent" type="xs:string" use="optional"/>
		 <xs:attribute name="isDir" type="xs:boolean" use="required"/>
		 <xs:attribute name="title" type="xs:string" use="required"/>
		 <xs:attribute name="album" type="xs:string" use="optional"/>
		 <xs:attribute name="artist" type="xs:string" use="optional"/>
		 <xs:attribute name="track" type="xs:int" use="optional"/>
		 <xs:attribute name="year" type="xs:int" use="optional"/>
		 <xs:attribute name="genre" type="xs:string" use="optional"/>
		 <xs:attribute name="coverArt" type="xs:string" use="optional"/>
		 <xs:attribute name="size" type="xs:long" use="optional"/>
		 <xs:attribute name="contentType" type="xs:string" use="optional"/>
		 <xs:attribute name="suffix" type="xs:string" use="optional"/>
		 <xs:attribute name="transcodedContentType" type="xs:string" use="optional"/>
		 <xs:attribute name="transcodedSuffix" type="xs:string" use="optional"/>
		 <xs:attribute name="duration" type="xs:int" use="optional"/>
		 <xs:attribute name="bitRate" type="xs:int" use="optional"/>
		 <xs:attribute name="path" type="xs:string" use="optional"/>
		 <xs:attribute name="isVideo" type="xs:boolean" use="optional"/> <!-- Added in 1.4.1 -->
		 <xs:attribute name="userRating" type="sub:UserRating" use="optional"/> <!-- Added in 1.6.0 -->
		 <xs:attribute name="averageRating" type="sub:AverageRating" use="optional"/> <!-- Added in 1.6.0 -->
		 <xs:attribute name="discNumber" type="xs:int" use="optional"/> <!-- Added in 1.8.0 -->
		 <xs:attribute name="created" type="xs:dateTime" use="optional"/> <!-- Added in 1.8.0 -->
		 <xs:attribute name="starred" type="xs:dateTime" use="optional"/> <!-- Added in 1.8.0 -->
		 <xs:attribute name="albumId" type="xs:string" use="optional"/> <!-- Added in 1.8.0 -->
		 <xs:attribute name="artistId" type="xs:string" use="optional"/> <!-- Added in 1.8.0 -->
		 <xs:attribute name="type" type="sub:MediaType" use="optional"/> <!-- Added in 1.8.0 -->
		 <xs:attribute name="bookmarkPosition" type="xs:long" use="optional"/> <!-- In millis. Added in 1.10.1 -->
		 </xs:complexType>
		 */

		const suffix = fileSuffix(track.name);
		const tag = await track.tag.get();
		const id = await orm.Subsonic.subsonicID(track.id);
		const result: SubsonicChild = {
			id,
			parent: await orm.Subsonic.mayBeSubsonicID(track.folder.id()),
			title: tag?.title || track.name,
			album: tag?.album,
			artist: tag?.artist,
			isDir: false,
			coverArt: id,
			genre: (tag?.genres || []).join(' / '),
			year: tag?.year,
			created: SubsonicFormatter.formatSubSonicDate(track.statCreated),
			duration: SubsonicFormatter.packDuration(tag?.mediaDuration),
			bitRate: SubsonicFormatter.packBitrate(tag?.mediaBitRate),
			track: tag?.trackNr,
			size: Math.trunc(track.fileSize / 10),
			suffix,
			contentType: mimeTypes.lookup(suffix) || 'audio/mpeg',
			isVideo: false,
			// path: path.join(track.path, track.fileName),
			discNumber: tag?.disc,
			albumId: await orm.Subsonic.mayBeSubsonicID(track.album.id()),
			artistId: await orm.Subsonic.mayBeSubsonicID(track.artist.id()),
			type: 'music',
			userRating: state?.rated && state?.rated > 0 ? state.rated : undefined,
			starred: state && state.faved ? SubsonicFormatter.formatSubSonicDate(state.faved) : undefined,
			playCount: state?.played && state?.played > 0 ? state.played : 0,
			transcodedSuffix: undefined,
			transcodedContentType: undefined
			// "rank": 0,
			// "averageRating": track.state.avgrated,
			// "bookmarkPosition": track.state.bookmark,
		};
		if (suffix !== AudioFormatType.mp3) {
			result.transcodedSuffix = AudioFormatType.mp3;
			result.transcodedContentType = mimeTypes.lookup(result.transcodedSuffix) || 'audio/mpeg';
		}
		return result;
	}

	static async packNowPlaying(orm: Orm, nowPlaying: NowPlaying, state: State): Promise<SubsonicNowPlayingEntry> {
		let entry: SubsonicChild;
		if (nowPlaying.track) {
			entry = await SubsonicFormatter.packTrack(orm, nowPlaying.track, state);
		} else if (nowPlaying.episode) {
			entry = await SubsonicFormatter.packPodcastEpisode(orm, nowPlaying.episode, state);
		} else {
			entry = {
				id: 0,
				isDir: false,
				title: 'Unknown'
			};
		}
		const nowPlay = entry as SubsonicNowPlayingEntry;
		nowPlay.username = nowPlaying.user.name;
		nowPlay.minutesAgo = Math.round(moment.duration(moment().diff(moment(nowPlaying.time))).asMinutes());
		nowPlay.playerId = 0;
		return nowPlay;
	}

	static async packFolder(orm: Orm, folder: Folder, state?: State): Promise<SubsonicChild> {
		const id = await orm.Subsonic.subsonicID(folder.id);
		return {
			id,
			parent: await orm.Subsonic.mayBeSubsonicID(folder.parent.id()),
			isDir: true,
			// path: folder.path,
			title: folder.title || path.basename(folder.path),
			album: folder.album,
			artist: folder.artist,
			year: folder.year,
			genre: await SubsonicFormatter.packGenres(folder.genres),
			coverArt: id,
			userRating: state?.rated && state?.rated > 0 ? state.rated : undefined,
			playCount: state?.played && state?.played > 0 ? state.played : 0,
			albumId: await orm.Subsonic.mayBeSubsonicID(((await folder.albums.getIDs()) || [])[0]),
			artistId: await orm.Subsonic.mayBeSubsonicID(((await folder.artists.getIDs()) || [])[0]),
			created: SubsonicFormatter.formatSubSonicDate(folder.createdAt),
			starred: state && state.faved ? SubsonicFormatter.formatSubSonicDate(state.faved) : undefined
		};
	}

	static async packPodcast(orm: Orm, podcast: Podcast, status?: PodcastStatus): Promise<SubsonicPodcastChannel> {
		return {
			id: await orm.Subsonic.subsonicID(podcast.id),
			url: podcast.url,
			errorMessage: podcast.errorMessage,
			title: podcast.title,
			status: status ? PodcastStatus[status] : PodcastStatus[podcast.status],
			description: podcast.description,
			coverArt: podcast.id,
			originalImageUrl: podcast.image
		};
	}

	static async packPodcastEpisode(orm: Orm, episode: Episode, state?: State, status?: PodcastStatus): Promise<SubsonicPodcastEpisode> {
		const tag = await episode.tag.get();
		const id = await orm.Subsonic.subsonicID(episode.id);
		const result: SubsonicPodcastEpisode = {
			// albumId:episode.albumId,
			// artistId:episode.artistId,
			// averageRating:episode.averageRating, // TODO: podcast episode state.averageRating
			// bookmarkPosition:episode.bookmarkPosition, // TODO: podcast episode state.bookmarkPosition
			streamId: id,
			coverArt: id,
			channelId: await orm.Subsonic.subsonicID(episode.podcast.idOrFail()),
			description: episode.summary,
			publishDate: episode.date !== undefined ? SubsonicFormatter.formatSubSonicDate(episode.date) : undefined,
			title: episode.name,
			status: status ? status : episode.status,
			id: await orm.Subsonic.subsonicID(episode.id),
			parent: await orm.Subsonic.mayBeSubsonicID(episode.podcast.id()),
			artist: tag ? tag.artist : episode.author,
			album: tag?.album,
			track: tag?.trackNr,
			year: tag?.year,
			genre: (tag?.genres || []).join(' / '),
			discNumber: tag?.disc,
			type: 'podcast',
			playCount: state?.played && state?.played > 0 ? state.played : 0,
			starred: state && state.faved ? SubsonicFormatter.formatSubSonicDate(state.faved) : undefined,
			userRating: state?.rated && state?.rated > 0 ? state.rated : undefined,
			isVideo: false,
			isDir: false,
			suffix: undefined,
			transcodedSuffix: undefined,
			transcodedContentType: undefined,
			path: undefined,
			size: episode.fileSize ? Math.trunc(episode.fileSize / 10) : undefined,
			created: SubsonicFormatter.formatSubSonicDate(episode.statCreated),
			duration: SubsonicFormatter.packDuration(tag?.mediaDuration),
			bitRate: SubsonicFormatter.packBitrate(tag?.mediaBitRate)
		};
		if (episode.path) {
			result.suffix = fileSuffix(episode.path);
			if (result.suffix !== AudioFormatType.mp3) {
				result.transcodedSuffix = AudioFormatType.mp3;
				result.transcodedContentType = mimeTypes.lookup(result.transcodedSuffix) || 'audio/mpeg';
			}
			result.contentType = mimeTypes.lookup(result.suffix) || 'audio/mpeg';
			result.size = episode.fileSize;
			result.created = SubsonicFormatter.formatSubSonicDate(episode.statCreated);
			result.duration = SubsonicFormatter.packDuration(tag?.mediaDuration);
			result.bitRate = SubsonicFormatter.packBitrate(tag?.mediaBitRate);
		}
		return result;
	}

	static async packPlaylist(orm: Orm, playlist: Playlist): Promise<SubsonicPlaylist> {
		return {
			id: await orm.Subsonic.subsonicID(playlist.id),
			name: playlist.name,
			comment: playlist.comment || '',
			public: playlist.isPublic,
			duration: SubsonicFormatter.packDuration(playlist.duration),
			created: SubsonicFormatter.formatSubSonicDate(playlist.createdAt) as string,
			changed: SubsonicFormatter.formatSubSonicDate(playlist.updatedAt) as string,
			coverArt: playlist.coverArt,
			allowedUser: [], // playlist.allowedUser,
			songCount: await playlist.entries.count(),
			owner: await orm.Subsonic.mayBeSubsonicID(playlist.user.id())
		};
	}

	static async packPlaylistWithSongs(orm: Orm, playlist: Playlist, tracks: Array<Track>, states: StateMap): Promise<SubsonicPlaylistWithSongs> {
		const result = await SubsonicFormatter.packPlaylist(orm, playlist) as SubsonicPlaylistWithSongs;
		const entry: Array<SubsonicChild> = [];
		for (const track of tracks) {
			entry.push(await SubsonicFormatter.packTrack(orm, track, states[track.id]));
		}
		result.entry = entry;
		return result;
	}

	static packBookmark(bookmark: Bookmark, username: string, child: SubsonicChild): SubsonicBookmark {
		return {
			entry: child,
			username,
			position: bookmark.position,
			comment: bookmark.comment,
			created: SubsonicFormatter.formatSubSonicDate(bookmark.createdAt) as string,
			changed: SubsonicFormatter.formatSubSonicDate(bookmark.updatedAt) as string
		};
	}

	static packSimilarSongs(childs: Array<SubsonicChild>): SubsonicSimilarSongs {
		return {
			song: childs
		};
	}

	static packSimilarSongs2(childs: Array<SubsonicChild>): SubsonicSimilarSongs2 {
		return {
			song: childs
		};
	}

	static packPlayQueue(playqueue: PlayQueue, user: User, childs: Array<SubsonicChild>): SubsonicPlayQueue {
		return {
			entry: childs,
			current: playqueue.current,
			position: playqueue.position,
			username: user.name,
			changed: SubsonicFormatter.formatSubSonicDate(playqueue.updatedAt) || '',
			changedBy: ''
		};
	}

	static async packRadio(orm: Orm, radio: Radio): Promise<SubsonicInternetRadioStation> {
		return {
			id: await orm.Subsonic.subsonicID(radio.id),
			name: radio.name,
			streamUrl: radio.url,
			homePageUrl: radio.homepage
		};
	}

	static async packGenre(genre: Genre): Promise<SubsonicGenre> {
		return {
			value: genre.name,
			songCount: await genre.tracks.count(),
			albumCount: await genre.albums.count(),
			artistCount: await genre.artists.count()
		};
	}

	static packChatMessage(message: Chat): SubsonicChatMessage {
		return {
			username: message.userName,
			time: message.created,
			message: message.message
		};
	}
}
