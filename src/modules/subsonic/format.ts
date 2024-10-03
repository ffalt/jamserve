import moment from 'moment';
import path from 'path';
import { Album } from '../../entity/album/album.js';
import { Artist } from '../../entity/artist/artist.js';
import { Bookmark } from '../../entity/bookmark/bookmark.js';
import { Chat } from '../../entity/chat/chat.js';
import { Episode } from '../../entity/episode/episode.js';
import { Folder } from '../../entity/folder/folder.js';
import { Genre } from '../../entity/genre/genre.js';
import { NowPlaying } from '../../entity/nowplaying/nowplaying.js';
import { Playlist } from '../../entity/playlist/playlist.js';
import { PlayQueue } from '../../entity/playqueue/playqueue.js';
import { Podcast } from '../../entity/podcast/podcast.js';
import { Radio } from '../../entity/radio/radio.js';
import { Root } from '../../entity/root/root.js';
import { State } from '../../entity/state/state.js';
import { Track } from '../../entity/track/track.js';
import { User } from '../../entity/user/user.js';
import { fileSuffix } from '../../utils/fs-utils.js';
import { AudioFormatType, PodcastStatus } from '../../types/enums.js';
import mimeTypes from 'mime-types';
import { FolderIndex, FolderIndexEntry } from '../../entity/folder/folder.model.js';
import { LastFM } from '../audio/clients/lastfm-rest-data.js';
import { IndexResult, IndexResultGroup } from '../../entity/base/base.js';
import { Collection } from '../orm/index.js';
import {
	SubsonicAlbumID3,
	SubsonicAlbumInfo,
	SubsonicArtist,
	SubsonicArtistID3, SubsonicArtistInfo, SubsonicArtistInfo2, SubsonicBookmark,
	SubsonicChatMessage, SubsonicChild,
	SubsonicDirectory, SubsonicGenre,
	SubsonicIndex,
	SubsonicIndexID3, SubsonicInternetRadioStation,
	SubsonicMusicFolder, SubsonicNowPlayingEntry, SubsonicPlaylist, SubsonicPlaylistWithSongs, SubsonicPlayQueue, SubsonicPodcastChannel, SubsonicPodcastEpisode,
	SubsonicResponse, SubsonicSimilarSongs, SubsonicSimilarSongs2,
	SubsonicUser
} from './model/subsonic-rest-data.js';

export interface SubsonicAPIResponse {
	'subsonic-response': SubsonicResponse;
}

export class FORMAT {
	static FAIL = {
		GENERIC: 0,
		PARAMETER: 10,
		CLIENT_OLD: 20,
		SERVER_OLD: 30,
		CREDENTIALS: 40,
		UNAUTH: 50,
		NOTFOUND: 70
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
				...FORMAT.defaultProperties(), status: 'failed', error: {
					code,
					message: txt || codeStrings[code]
				}
			}
		};
	}

	static packResponse(o: SubsonicResponse): SubsonicAPIResponse {
		return {
			'subsonic-response': { ...FORMAT.defaultProperties(), ...o }
		};
	}

	static packOK(): SubsonicAPIResponse {
		return {
			'subsonic-response': FORMAT.defaultProperties()
		};
	}

	static formatSubSonicDate(date?: Date): string | undefined {
		if (date === undefined) {
			return;
		}
		return moment(date).utc().format(); // .format('YYYY-MM-DDThh:mm:ss.000Z');
	}

	static packRoot(root: Root): SubsonicMusicFolder {
		return { id: parseInt(root.id, 10), name: root.name };
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

	static packFolderIndexArtist(entry: FolderIndexEntry, state?: State): SubsonicArtist {
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
			starred: state && state.faved ? FORMAT.formatSubSonicDate(state.faved) : undefined,
			userRating: state ? state.rated : undefined
			// TODO: averageRating
		};
	}

	static packFolderIndex(index: FolderIndex, states: State[]): Array<SubsonicIndex> {
		if (!index) {
			return [];
		}
		return index.groups.map(i => ({
			name: i.name,
			artist: i.items.map(e => {
				return FORMAT.packFolderIndexArtist(e, states.find(s => s.id === e.id));
			})
		}));
	}

	static async packArtistIndex(index: IndexResult<IndexResultGroup<Artist>>, states: State[]): Promise<Array<SubsonicIndexID3>> {
		if (!index) {
			return [];
		}
		return Promise.all(index.groups.map(async i => ({
			name: i.name,
			artist: await Promise.all(i.items.map(e => FORMAT.packArtist(e, states.find(s => s.id === e.id))))
		})));
	}

	static packDirectory(folder: Folder, state: State): SubsonicDirectory {
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
			starred: state && state.faved ? FORMAT.formatSubSonicDate(state.faved) : undefined
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
			starred: state && state.faved ? FORMAT.formatSubSonicDate(state.faved) : undefined,
			userRating: state ? state.rated : undefined
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

		 */
		const artist = await album.artist.get();
		return {
			id: album.id,
			name: album.name,
			artist: artist?.name,
			artistId: artist?.id,
			coverArt: album.id,
			songCount: await album.tracks.count(),
			duration: Math.trunc(album.duration),
			year: album.year,
			genre: await FORMAT.packGenres(album.genres),
			created: FORMAT.formatSubSonicDate(album.createdAt) as string,
			starred: state && state.faved ? FORMAT.formatSubSonicDate(state.faved) : undefined
		};
	}

	static async packGenres(genres: Collection<Genre>): Promise<string | undefined> {
		return genres && (await genres.count()) > 0 ? (await genres.getItems()).map(g => g.name).join(' / ') : undefined;
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
		 */
		return {
			id: artist.id,
			name: artist.name,
			coverArt: artist.id,
			albumCount: await artist.albums.count(),
			starred: state && state.faved ? FORMAT.formatSubSonicDate(state.faved) : undefined
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
		FORMAT.packImageInfo(info, result);
		return result;
	}

	static packArtistInfo(info: LastFM.Artist, similar?: Array<SubsonicArtist>): SubsonicArtistInfo {
		const result: SubsonicArtistInfo = {
			biography: info.bio ? info.bio.content : undefined,
			musicBrainzId: info.mbid,
			lastFmUrl: info.url,
			similarArtist: similar
		};
		FORMAT.packImageInfo(info, result);
		return result;
	}

	static packArtistInfo2(info: LastFM.Artist, similar?: Array<SubsonicArtistID3>): SubsonicArtistInfo2 {
		const result: SubsonicArtistInfo2 = {
			biography: info.bio ? info.bio.content : undefined,
			musicBrainzId: info.mbid,
			lastFmUrl: info.url,
			similarArtist: similar || []
		};
		FORMAT.packImageInfo(info, result);
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
		 */

		const suffix = fileSuffix(track.name);
		const tag = await track.tag.get();
		const result: SubsonicChild = {
			id: track.id,
			parent: track.folder.id() || '',
			title: tag?.title || track.name,
			album: tag?.album,
			artist: tag?.artist,
			isDir: false,
			coverArt: track.id,
			genre: (tag?.genres || []).join(' / '),
			year: tag?.year,
			created: FORMAT.formatSubSonicDate(track.statCreated),
			duration: (tag?.mediaDuration !== undefined && !isNaN(tag.mediaDuration)) ? Math.trunc(tag.mediaDuration) : -1,
			bitRate: (tag?.mediaBitRate !== undefined) ? Math.round(tag.mediaBitRate / 1000) : -1,
			track: tag?.trackNr,
			size: Math.trunc(track.fileSize / 10),
			suffix,
			contentType: mimeTypes.lookup(suffix) || 'audio/mpeg',
			isVideo: false,
			path: track.name, // TODO: add parent folders until root
			discNumber: tag?.disc,
			albumId: track.album.id(),
			artistId: track.artist.id(),
			type: 'music',
			userRating: state ? state.rated : undefined,
			starred: state && state.faved ? FORMAT.formatSubSonicDate(state.faved) : undefined,
			playCount: state && state.played ? state.played : 0,
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

	static async packNowPlaying(nowPlaying: NowPlaying, state: State): Promise<SubsonicNowPlayingEntry> {
		let entry: SubsonicChild;
		if (nowPlaying.track) {
			entry = await FORMAT.packTrack(nowPlaying.track, state);
		} else if (nowPlaying.episode) {
			entry = await FORMAT.packPodcastEpisode(nowPlaying.episode, state);
		} else {
			entry = {
				id: '',
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
			path: folder.path,
			parent: folder.parent.id(),
			created: FORMAT.formatSubSonicDate(folder.createdAt),
			title: folder.title || '',
			album: folder.album,
			genre: await FORMAT.packGenres(folder.genres),
			artist: folder.artist,
			year: folder.year,
			coverArt: folder.id,
			userRating: state ? state.rated : undefined,
			albumId: ((await folder.albums.getIDs()) || [])[0],
			artistId: ((await folder.artists.getIDs()) || [])[0],
			isDir: true,
			starred: state && state.faved ? FORMAT.formatSubSonicDate(state.faved) : undefined
		};
	}

	static packPodcast(podcast: Podcast, status?: PodcastStatus): SubsonicPodcastChannel {
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
			channelId: episode.podcast.id() || '',
			description: episode.summary,
			publishDate: episode.date !== undefined ? FORMAT.formatSubSonicDate(episode.date) : undefined,
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
			playCount: state && state.played ? state.played : 0,
			starred: state && state.faved ? FORMAT.formatSubSonicDate(state.faved) : undefined,
			userRating: state ? state.rated : undefined,
			isVideo: false,
			isDir: false,
			suffix: undefined,
			transcodedSuffix: undefined,
			transcodedContentType: undefined,
			path: undefined,
			size: episode.fileSize ? Math.trunc(episode.fileSize / 10) : undefined,
			created: FORMAT.formatSubSonicDate(episode.statCreated),
			duration: (tag?.mediaDuration !== undefined && !isNaN(tag.mediaDuration)) ? Math.trunc(tag.mediaDuration) : -1,
			bitRate: (tag?.mediaBitRate !== undefined) ? Math.round(tag.mediaBitRate / 1000) : -1
		};
		if (episode.path) {
			result.suffix = fileSuffix(episode.path);
			if (result.suffix !== AudioFormatType.mp3) {
				result.transcodedSuffix = AudioFormatType.mp3;
				result.transcodedContentType = mimeTypes.lookup(result.transcodedSuffix) || 'audio/mpeg';
			}
			result.contentType = mimeTypes.lookup(result.suffix) || 'audio/mpeg';
			result.size = episode.fileSize;
			result.created = FORMAT.formatSubSonicDate(episode.statCreated);
			result.duration = tag?.mediaDuration ? Math.trunc(tag.mediaDuration) : undefined;
			result.bitRate = tag?.mediaBitRate !== undefined ? Math.round(tag.mediaBitRate / 1000) : -1;
		}
		return result;
	}

	static async packPlaylist(playlist: Playlist): Promise<SubsonicPlaylist> {
		return {
			id: playlist.id,
			name: playlist.name,
			comment: playlist.comment || '',
			public: playlist.isPublic,
			duration: Math.trunc(playlist.duration),
			created: FORMAT.formatSubSonicDate(playlist.createdAt) as string,
			changed: FORMAT.formatSubSonicDate(playlist.updatedAt) as string,
			coverArt: playlist.coverArt,
			allowedUser: [], // playlist.allowedUser,
			songCount: await playlist.entries.count(),
			owner: playlist.user.id()
		};
	}

	static async packPlaylistWithSongs(playlist: Playlist, tracks: Array<Track>, states: State[]): Promise<SubsonicPlaylistWithSongs> {
		const result = await FORMAT.packPlaylist(playlist) as SubsonicPlaylistWithSongs;
		result.entry = await Promise.all(tracks.map(track => FORMAT.packTrack(track, states.find(s => s.id === track.id))));
		return result;
	}

	static packBookmark(bookmark: Bookmark, username: string, child: SubsonicChild): SubsonicBookmark {
		return {
			entry: child,
			username,
			position: bookmark.position,
			comment: bookmark.comment,
			created: FORMAT.formatSubSonicDate(bookmark.createdAt) as string,
			changed: FORMAT.formatSubSonicDate(bookmark.updatedAt) as string
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
			changed: FORMAT.formatSubSonicDate(playqueue.updatedAt) || '',
			changedBy: ''
		};
	}

	static packRadio(radio: Radio): SubsonicInternetRadioStation {
		return {
			id: radio.id,
			name: radio.name,
			streamUrl: radio.url,
			homePageUrl: radio.homepage
		};
	}

	static async packGenre(genre: Genre): Promise<SubsonicGenre> {
		return {
			content: genre.name,
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
