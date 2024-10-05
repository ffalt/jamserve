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
import { AlbumType, AudioFormatType, PodcastStatus } from '../../types/enums.js';
import { NowPlaying } from '../../entity/nowplaying/nowplaying.js';
import { Podcast } from '../../entity/podcast/podcast.js';
import { Episode } from '../../entity/episode/episode.js';
import { Playlist } from '../../entity/playlist/playlist.js';
import { Bookmark } from '../../entity/bookmark/bookmark.js';
import { PlayQueue } from '../../entity/playqueue/playqueue.js';
import { Radio } from '../../entity/radio/radio.js';
import { Chat } from '../../entity/chat/chat.js';
import { JAMSERVE_VERSION } from '../../version.js';

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
			version: '1.16.0',
			type: 'jam',
			serverVersion: JAMSERVE_VERSION,
			openSubsonic: true
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

	static async packRoot(root: Root): Promise<SubsonicMusicFolder> {
		return { id: root.id, name: root.name };
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

	static async packFolderIndexArtist(entry: FolderIndexEntry, state?: State): Promise<SubsonicArtist> {
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
			id: entry.id,
			name: entry.name,
			starred: state && state.faved ? SubsonicFormatter.formatSubSonicDate(state.faved) : undefined,
			userRating: state?.rated && state?.rated > 0 ? state.rated : undefined
			// TODO: averageRating
		};
	}

	static async packFolderIndex(index: FolderIndex, states: StateMap): Promise<Array<SubsonicIndex>> {
		if (!index) {
			return [];
		}
		const indexes: Array<SubsonicIndex> = [];
		for (const i of index.groups) {
			const artist: Array<SubsonicArtist> = [];
			for (const e of i.items) {
				artist.push(await SubsonicFormatter.packFolderIndexArtist(e, states[e.id]));
			}
			indexes.push({ name: i.name, artist });
		}
		return indexes;
	}

	static async packArtistIndex(index: IndexResult<IndexResultGroup<Artist>>, states: StateMap): Promise<Array<SubsonicIndexID3>> {
		if (!index) {
			return [];
		}
		const indexes: Array<SubsonicIndexID3> = [];
		for (const group of index.groups) {
			const artists: Array<SubsonicArtistID3> = [];
			for (const artist of group.items) {
				if ((await artist.albums.count()) > 0) {
					artists.push(await SubsonicFormatter.packArtist(artist, states[artist.id]));
				}
			}
			indexes.push({ name: group.name, artist: artists });
		}
		return indexes;
	}

	static async packDirectory(folder: Folder, state: State): Promise<SubsonicDirectory> {
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
			id: folder.id,
			parent: folder.parent.id(),
			name: path.basename(folder.path),
			starred: state && state.faved ? SubsonicFormatter.formatSubSonicDate(state.faved) : undefined
		};
	}

	static async packFolderArtist(folder: Folder, state?: State): Promise<SubsonicArtist> {
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
			id: folder.id,
			name: folder.title || folder.artist || '',
			starred: state && state.faved ? SubsonicFormatter.formatSubSonicDate(state.faved) : undefined,
			userRating: state?.rated && state?.rated > 0 ? state.rated : undefined
		};
	}

	static async packAlbum(album: Album, state?: State): Promise<SubsonicAlbumID3> {
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
		played?: string; // OpenSubsonic
		userRating?: number; // OpenSubsonic
		recordLabels?: Array<SubsonicListRecordLabel>; // OpenSubsonic
		musicBrainzId?: string; // OpenSubsonic
		genres?: Array<SubsonicListGenre>; // OpenSubsonic
		artists?: Array<SubsonicListArtist>; // OpenSubsonic
		displayArtist?: string; // OpenSubsonic
		releaseTypes?: Array<string>; // OpenSubsonic
		moods?: Array<string>; // OpenSubsonic
		sortName?: string; // OpenSubsonic
		originalReleaseDate?: SubsonicListDate; // OpenSubsonic
		releaseDate?: SubsonicListDate; // OpenSubsonic
		isCompilation?: boolean; // OpenSubsonic
		discTitles?: Array<SubsonicListDiscTitle>; // OpenSubsonic
		 */
		const artist = await album.artist.get();
		const genres = await album.genres.getItems();
		return {
			id: album.id,
			name: album.name,
			artist: artist?.name,
			artistId: artist?.id,
			coverArt: album.id,
			songCount: await album.tracks.count(),
			duration: SubsonicFormatter.packDuration(album.duration),
			year: album.year,
			genre: await SubsonicFormatter.packGenres(genres),
			created: SubsonicFormatter.formatSubSonicDate(album.createdAt) as string,
			starred: state && state.faved ? SubsonicFormatter.formatSubSonicDate(state.faved) : undefined,
			played: state && state.lastPlayed ? SubsonicFormatter.formatSubSonicDate(state.lastPlayed) : undefined,
			userRating: state?.rated && state?.rated > 0 ? state.rated : undefined,
			// recordLabels: [{name:'demo'}],
			musicBrainzId: album.mbReleaseID,
			genres: genres.length ? genres.map(g => ({ name: g.name })) : undefined,
			// artists: [{id:'demo', name:'demo'}],
			// displayArtist: 'Artist 1 feat. Artist 2',
			// releaseTypes: ['Album', 'Remixes'],
			// moods: ["slow", "cool"],
			// sortName: "lagerfeuer (8-bit)",
			// "originalReleaseDate": { "year": 2001, "month": 3, "day": 10 },
			// "releaseDate": { "year": 2001, "month": 3, "day": 10}
			isCompilation: album.albumType === AlbumType.compilation
			// "discTitles": [{ "disc": 0, "title": "Disc 0 title" }, { "disc": 2, "title": "Disc 1 title" }]
		};
	}

	static packDuration(duration?: number): number {
		if (!duration || duration <= 0 || isNaN(duration)) {
			return -1;
		}
		return Math.trunc(duration / 1000);
	}

	static packBitrate(bitrate?: number): number | undefined {
		return bitrate !== undefined ? Math.round(bitrate / 1000) : undefined;
	}

	static async packGenreCollection(genres: Collection<Genre>): Promise<string | undefined> {
		return genres && (await genres.count()) > 0 ? await SubsonicFormatter.packGenres(await genres.getItems()) : undefined;
	}

	static async packGenres(genres?: Array<Genre>): Promise<string | undefined> {
		return genres && genres?.length > 0 ? genres.map(g => g.name).join(' / ') : undefined;
	}

	static async packArtist(artist: Artist, state?: State): Promise<SubsonicArtistID3> {
		/*
		 <xs:complexType name="ArtistID3">
		 <xs:attribute name="id" type="xs:string" use="required"/>
		 <xs:attribute name="name" type="xs:string" use="required"/>
		 <xs:attribute name="coverArt" type="xs:string" use="optional"/>
		 <xs:attribute name="albumCount" type="xs:int" use="required"/>
		 <xs:attribute name="starred" type="xs:dateTime" use="optional"/>
		 </xs:complexType>
			musicBrainzId?: string; // OpenSubsonic
			sortName?: string; // OpenSubsonic
			roles?: Array<string>; // OpenSubsonic
		 */
		return {
			id: artist.id,
			name: artist.name,
			coverArt: artist.id,
			albumCount: await artist.albums.count(),
			starred: state && state.faved ? SubsonicFormatter.formatSubSonicDate(state.faved) : undefined,
			musicBrainzId: artist.mbArtistID,
			sortName: artist.nameSort
			// roles: artist.roles
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

	static async packTrack(track: Track, state?: State): Promise<SubsonicChild> {
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
		bitDepth?: number; //  OpenSubsonic
		samplingRate?: number; //  OpenSubsonic
		channelCount?: number; //  OpenSubsonic
		mediaType?: string; //  OpenSubsonic
		played?: string; //  OpenSubsonic
		bpm?: number; //  OpenSubsonic
		comment?: string; //  OpenSubsonic
		sortName?: string; //  OpenSubsonic
		musicBrainzId?: string; //  OpenSubsonic
		genres?: Array<SubsonicListGenre>; //  OpenSubsonic
		artists?: Array<SubsonicArtistsID3>; //  OpenSubsonic
		albumArtists?: Array<SubsonicArtistsID3>; //  OpenSubsonic
		contributors?: Array<SubsonicContributor>; //  OpenSubsonic
		displayArtist?: string; //  OpenSubsonic
		displayAlbumArtist?: string; //  OpenSubsonic
		displayComposer?: string; //  OpenSubsonic
		moods?: Array<string>; // OpenSubsonic
		replayGain?: SubSonicReplayGain; // OpenSubsonic
		 */

		const suffix = fileSuffix(track.name);
		const tag = await track.tag.get();
		const result: SubsonicChild = {
			id: track.id,
			parent: track.folder.id(),
			title: tag?.title || track.name,
			album: tag?.album,
			artist: tag?.artist,
			isDir: false,
			coverArt: track.id,
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
			albumId: track.album.id(),
			artistId: track.artist.id(),
			type: 'music',
			userRating: state?.rated && state?.rated > 0 ? state.rated : undefined,
			starred: state && state.faved ? SubsonicFormatter.formatSubSonicDate(state.faved) : undefined,
			playCount: state?.played && state?.played > 0 ? state.played : 0,
			// "rank": 0,
			// "averageRating": track.state.avgrated,
			// "bookmarkPosition": track.state.bookmark,
			// bitDepth: tag?.mediaBitDepth, //  OpenSubsonic
			samplingRate: tag?.mediaSampleRate,
			channelCount: tag?.mediaChannels,
			mediaType: 'song',
			played: state && state.lastPlayed ? SubsonicFormatter.formatSubSonicDate(state.lastPlayed) : undefined,
			// bpm: tag?.bpm; //  OpenSubsonic
			// comment: tag?.comment; //  OpenSubsonic
			sortName: tag?.titleSort,
			musicBrainzId: tag?.mbTrackID,
			genres: tag?.genres?.length ? tag.genres.map(g => ({ name: g })) : undefined
			// artists?: Array<SubsonicArtistsID3>; //  OpenSubsonic
			// albumArtists? : Array<SubsonicArtistsID3>; //  OpenSubsonic
			// contributors? : Array<SubsonicContributor>; //  OpenSubsonic
			// displayArtist? : string; //  OpenSubsonic
			// displayAlbumArtist? : string; //  OpenSubsonic
			// displayComposer? : string; //  OpenSubsonic
			// moods? : Array<string>; // OpenSubsonic
			// replayGain? : SubSonicReplayGain; // OpenSubsonic
		};
		if (suffix !== AudioFormatType.mp3) {
			result.transcodedSuffix = AudioFormatType.mp3;
			result.transcodedContentType = mimeTypes.lookup(result.transcodedSuffix) || 'audio/mpeg';
		}
		return result;
	}

	static async packNowPlaying(nowPlaying: NowPlaying, state: State): Promise<SubsonicNowPlayingEntry> {
		let entry: SubsonicChild;
		if (nowPlaying.track) {
			entry = await SubsonicFormatter.packTrack(nowPlaying.track, state);
		} else if (nowPlaying.episode) {
			entry = await SubsonicFormatter.packPodcastEpisode(nowPlaying.episode, state);
		} else {
			entry = {
				id: '0',
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

	static async packFolder(folder: Folder, state?: State): Promise<SubsonicChild> {
		return {
			id: folder.id,
			parent: folder.parent.id(),
			isDir: true,
			// path: folder.path,
			title: folder.title || path.basename(folder.path),
			album: folder.album,
			artist: folder.artist,
			year: folder.year,
			genre: await SubsonicFormatter.packGenreCollection(folder.genres),
			coverArt: folder.id,
			userRating: state?.rated && state?.rated > 0 ? state.rated : undefined,
			playCount: state?.played && state?.played > 0 ? state.played : 0,
			albumId: ((await folder.albums.getIDs()) || [])[0],
			artistId: ((await folder.artists.getIDs()) || [])[0],
			created: SubsonicFormatter.formatSubSonicDate(folder.createdAt),
			starred: state && state.faved ? SubsonicFormatter.formatSubSonicDate(state.faved) : undefined
		};
	}

	static async packPodcast(podcast: Podcast, status?: PodcastStatus): Promise<SubsonicPodcastChannel> {
		return {
			id: podcast.id,
			url: podcast.url,
			errorMessage: podcast.errorMessage,
			title: podcast.title,
			status: status ? PodcastStatus[status] : PodcastStatus[podcast.status],
			description: podcast.description,
			coverArt: podcast.id,
			originalImageUrl: podcast.image
		};
	}

	static async packPodcastEpisode(episode: Episode, state?: State, status?: PodcastStatus): Promise<SubsonicPodcastEpisode> {
		const tag = await episode.tag.get();
		const result: SubsonicPodcastEpisode = {
			// albumId:episode.albumId,
			// artistId:episode.artistId,
			// averageRating:episode.averageRating, // TODO: podcast episode state.averageRating
			// bookmarkPosition:episode.bookmarkPosition, // TODO: podcast episode state.bookmarkPosition
			streamId: episode.id,
			coverArt: episode.id,
			channelId: episode.podcast.idOrFail(),
			description: episode.summary,
			publishDate: episode.date !== undefined ? SubsonicFormatter.formatSubSonicDate(episode.date) : undefined,
			title: episode.name,
			status: status ? status : episode.status,
			id: episode.id,
			parent: episode.podcast.id(),
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
			id: playlist.id,
			name: playlist.name,
			comment: playlist.comment || '',
			public: playlist.isPublic,
			duration: SubsonicFormatter.packDuration(playlist.duration),
			created: SubsonicFormatter.formatSubSonicDate(playlist.createdAt) as string,
			changed: SubsonicFormatter.formatSubSonicDate(playlist.updatedAt) as string,
			coverArt: playlist.coverArt,
			allowedUser: [], // playlist.allowedUser,
			songCount: await playlist.entries.count(),
			owner: playlist.user.id()
		};
	}

	static async packPlaylistWithSongs(orm: Orm, playlist: Playlist, tracks: Array<Track>, states: StateMap): Promise<SubsonicPlaylistWithSongs> {
		const result = await SubsonicFormatter.packPlaylist(orm, playlist) as SubsonicPlaylistWithSongs;
		const entry: Array<SubsonicChild> = [];
		for (const track of tracks) {
			entry.push(await SubsonicFormatter.packTrack(track, states[track.id]));
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

	static async packRadio(radio: Radio): Promise<SubsonicInternetRadioStation> {
		return {
			id: radio.id,
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
