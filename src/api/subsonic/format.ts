import moment from 'moment';
import path from 'path';
import {DBObjectType} from '../../db/db.types';
import {Album} from '../../engine/album/album.model';
import {Artist} from '../../engine/artist/artist.model';
import {Bookmark} from '../../engine/bookmark/bookmark.model';
import {ChatMessage} from '../../engine/chat/chat.model';
import {Episode} from '../../engine/episode/episode.model';
import {Folder} from '../../engine/folder/folder.model';
import {Genre} from '../../engine/genre/genre.model';
import {ArtistIndex, FolderIndex, FolderIndexEntry} from '../../engine/index/index.model';
import {NowPlaying} from '../../engine/nowplaying/nowplaying.model';
import {Playlist} from '../../engine/playlist/playlist.model';
import {PlayQueue} from '../../engine/playqueue/playqueue.model';
import {Podcast} from '../../engine/podcast/podcast.model';
import {Radio} from '../../engine/radio/radio.model';
import {Root} from '../../engine/root/root.model';
import {State, States} from '../../engine/state/state.model';
import {Track} from '../../engine/track/track.model';
import {User} from '../../engine/user/user.model';
import {AudioFormatType, AudioMimeTypes, PodcastStatus} from '../../model/jam-types';
import {LastFM} from '../../model/lastfm-rest-data';
import {Subsonic} from '../../model/subsonic-rest-data';
import {fileSuffix} from '../../utils/fs-utils';

export interface SubsonicAPIResponse {
	'subsonic-response': Subsonic.Response;
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

	static defaultProperties(): Subsonic.Response {
		return {
			status: 'ok',
			version: '1.16.0'
		};
	}

	static packFail(code: number, txt?: string): SubsonicAPIResponse {
		/*
		 <?xml version="1.0" encoding="UTF-8"?>
		 <subsonic-response xmlns="http://subsonic.org/restapi"
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
		 60 	The trial period for the Subsonic server is over. Please upgrade to Subsonic Premium. Visit subsonic.org for details.
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

	static packResponse<T>(o: Subsonic.Response): SubsonicAPIResponse {
		return {
			'subsonic-response': {...FORMAT.defaultProperties(), ...o}
		};
	}

	static packOK(): SubsonicAPIResponse {
		return {
			'subsonic-response': FORMAT.defaultProperties()
		};
	}

	static formatSubSonicDate(date: number): string {
		return moment(date).utc().format(); // .format('YYYY-MM-DDThh:mm:ss.000Z');
	}

	static packRoot(root: Root): Subsonic.MusicFolder {
		return {id: parseInt(root.id, 10), name: root.name};
	}

	static packUser(user: User): Subsonic.User {
		return {
			username: user.name,
			email: user.email,
			maxBitRate: user.maxBitRate,
			avatarLastChanged: undefined, // user.avatarLastChanged !== undefined ? FORMAT.formatSubSonicDate(user.avatarLastChanged) : undefined,
			folder: user.allowedFolder ? user.allowedFolder.map(s => parseInt(s, 10)) : undefined,
			scrobblingEnabled: user.scrobblingEnabled,
			adminRole: user.roles.admin,
			settingsRole: user.roles.admin, // user.roles.settingsRole,
			downloadRole: user.roles.stream, // user.roles.downloadRole,
			uploadRole: user.roles.upload,
			playlistRole: user.roles.admin, // user.roles.playlistRole,
			coverArtRole: user.roles.admin, // user.roles.coverArtRole,
			commentRole: user.roles.admin, // user.roles.commentRole,
			podcastRole: user.roles.podcast,
			streamRole: user.roles.stream,
			jukeboxRole: user.roles.admin, // user.roles.jukeboxRole,
			shareRole: user.roles.admin, // user.roles.shareRole,
			videoConversionRole: user.roles.admin // user.roles.videoConversionRole
		};
	}

	static packFolderIndexArtist(entry: FolderIndexEntry, state: State): Subsonic.Artist {
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
			id: entry.folder.id,
			name: entry.name,
			starred: state && state.faved ? FORMAT.formatSubSonicDate(state.faved) : undefined,
			userRating: state ? state.rated : undefined
			// TODO: averageRating
		};
	}

	static packFolderIndex(index: FolderIndex, states: States): Array<Subsonic.Index> {
		if (!index) {
			return [];
		}
		return index.groups.map(i => ({
			name: i.name,
			artist: i.entries.map(e => {
				return FORMAT.packFolderIndexArtist(e, states[e.folder.id]);
			})
		}));
	}

	static packArtistIndex(index: ArtistIndex, states: States): Array<Subsonic.IndexID3> {
		if (!index) {
			return [];
		}
		return index.groups.map(i => ({
			name: i.name,
			artist: i.entries.map(e => FORMAT.packArtist(e.artist, states[e.artist.id]))
		}));
	}

	static packDirectory(folder: Folder, state: State): Subsonic.Directory {
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
			parent: folder.parentID,
			name: path.basename(folder.path),
			starred: state && state.faved ? FORMAT.formatSubSonicDate(state.faved) : undefined
		};
	}

	static packFolderArtist(folder: Folder, state: State): Subsonic.Artist {
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
			name: folder.tag.title || folder.tag.artist || '',
			starred: state && state.faved ? FORMAT.formatSubSonicDate(state.faved) : undefined,
			userRating: state ? state.rated : undefined
		};
	}

	static packAlbum(album: Album, state: State): Subsonic.AlbumID3 {
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
		return {
			id: album.id,
			name: album.name,
			artist: album.artist,
			artistId: album.artistID,
			coverArt: album.id,
			songCount: album.trackIDs.length,
			duration: Math.trunc(album.duration),
			year: album.year,
			genre: album.genre,
			created: FORMAT.formatSubSonicDate(album.created),
			starred: state && state.faved ? FORMAT.formatSubSonicDate(state.faved) : undefined
		};
	}

	static packArtist(artist: Artist, state: State): Subsonic.ArtistID3 {
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
			albumCount: artist.albumIDs.length,
			starred: state && state.faved ? FORMAT.formatSubSonicDate(state.faved) : undefined
		};
	}

	static packAlbumInfo(info: LastFM.Album): Subsonic.AlbumInfo {
		const result: Subsonic.AlbumInfo = {
			notes: info.wiki ? info.wiki.content : undefined,
			musicBrainzId: info.mbid,
			lastFmUrl: info.url
		};
		(info.image || []).forEach(i => {
			if (i.size === 'small') {
				result.smallImageUrl = i.url;
			} else if (i.size === 'medium') {
				result.mediumImageUrl = i.url;
			} else if (i.size === 'large') {
				result.largeImageUrl = i.url;
			}
		});
		return result;
	}

	static packArtistInfo(info: LastFM.Artist, similar?: Array<Subsonic.Artist>): Subsonic.ArtistInfo {
		const result: Subsonic.ArtistInfo = {
			biography: info.bio ? info.bio.content : undefined,
			musicBrainzId: info.mbid,
			lastFmUrl: info.url,
			similarArtist: similar
		};
		(info.image || []).forEach(i => {
			if (i.size === 'small') {
				result.smallImageUrl = i.url;
			} else if (i.size === 'medium') {
				result.mediumImageUrl = i.url;
			} else if (i.size === 'large') {
				result.largeImageUrl = i.url;
			}
		});
		return result;
	}

	static packArtistInfo2(info: LastFM.Artist, similar?: Array<Subsonic.ArtistID3>): Subsonic.ArtistInfo2 {
		const result: Subsonic.ArtistInfo2 = {
			biography: info.bio ? info.bio.content : undefined,
			musicBrainzId: info.mbid,
			lastFmUrl: info.url,
			similarArtist: similar || []
		};
		(info.image || []).forEach(i => {
			if (i.size === 'small') {
				result.smallImageUrl = i.url;
			} else if (i.size === 'medium') {
				result.mediumImageUrl = i.url;
			} else if (i.size === 'large') {
				result.largeImageUrl = i.url;
			}
		});
		return result;
	}

	static packTrack(track: Track, state: State): Subsonic.Child {
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
		const result: Subsonic.Child = {
			id: track.id,
			parent: track.parentID || '',
			title: track.tag.title || track.name,
			album: track.tag.album,
			artist: track.tag.artist,
			isDir: false,
			coverArt: track.id,
			genre: track.tag.genre,
			year: track.tag.year,
			created: FORMAT.formatSubSonicDate(track.stat.created),
			duration: (track.media.duration !== undefined && !isNaN(track.media.duration)) ? Math.trunc(track.media.duration) : -1,
			bitRate: (track.media.bitRate !== undefined) ? Math.round(track.media.bitRate / 1000) : -1,
			track: track.tag.track,
			size: Math.trunc(track.stat.size / 10),
			suffix,
			contentType: AudioMimeTypes[suffix],
			isVideo: false,
			path: track.name, // TODO: add parent folders until root
			discNumber: track.tag.disc,
			albumId: track.albumID,
			artistId: track.artistID,
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
			result.transcodedContentType = AudioMimeTypes[result.transcodedSuffix];
		}
		return result;
	}

	static packNowPlaying(nowPlaying: NowPlaying, state: State): Subsonic.NowPlayingEntry {
		let entry: Subsonic.Child;
		switch (nowPlaying.obj.type) {
			case DBObjectType.track:
				entry = FORMAT.packTrack(nowPlaying.obj as Track, state);
				break;
			case DBObjectType.episode:
				entry = FORMAT.packPodcastEpisode(nowPlaying.obj as Episode, state);
				break;
			default:
				entry = {
					id: nowPlaying.obj.id,
					isDir: false,
					title: 'Unknown'
				};
		}
		const nowPlay = entry as Subsonic.NowPlayingEntry;
		nowPlay.username = nowPlaying.user.name;
		nowPlay.minutesAgo = Math.round(moment.duration(moment().diff(moment(nowPlaying.time))).asMinutes());
		nowPlay.playerId = 0;
		return nowPlay;
	}

	static packFolder(folder: Folder, state: State): Subsonic.Child {
		return {
			id: folder.id,
			path: folder.path,
			parent: folder.parentID,
			created: FORMAT.formatSubSonicDate(folder.stat.created),
			title: folder.tag.title || '',
			album: folder.tag.album,
			genre: folder.tag.genre,
			artist: folder.tag.artist,
			year: folder.tag.year,
			coverArt: folder.id,
			userRating: state ? state.rated : undefined,
			// "albumId": '',  // TODO: folder albumId if only one?
			// "artistId": '',  // TODO: folder artistId if only one?
			isDir: true,
			starred: state && state.faved ? FORMAT.formatSubSonicDate(state.faved) : undefined
		};
	}

	static packPodcast(podcast: Podcast, status?: PodcastStatus): Subsonic.PodcastChannel {
		return {
			id: podcast.id,
			url: podcast.url,
			errorMessage: podcast.errorMessage,
			title: podcast.tag ? podcast.tag.title : undefined,
			status: status ? PodcastStatus[status] : PodcastStatus[podcast.status],
			description: podcast.tag ? podcast.tag.description : undefined,
			coverArt: podcast.id,
			originalImageUrl: podcast.tag ? podcast.tag.image : undefined
		};
	}

	static packPodcastEpisode(episode: Episode, state: State, status?: PodcastStatus): Subsonic.PodcastEpisode {
		const result: Subsonic.PodcastEpisode = {
			// albumId:episode.albumId,
			// artistId:episode.artistId,
			// averageRating:episode.averageRating, // TODO: podcast episode state.averageRating
			// bookmarkPosition:episode.bookmarkPosition, // TODO: podcast episode state.bookmarkPosition
			streamId: episode.id,
			coverArt: episode.id,
			channelId: episode.podcastID,
			description: episode.summary,
			publishDate: episode.date !== undefined ? FORMAT.formatSubSonicDate(episode.date) : undefined,
			title: episode.name,
			status: status ? status : episode.status,
			id: episode.id,
			parent: episode.podcastID,
			artist: episode.tag ? episode.tag.artist : episode.author,
			album: episode.tag ? episode.tag.album : undefined,
			track: episode.tag ? episode.tag.track : undefined,
			year: episode.tag ? episode.tag.year : undefined,
			genre: episode.tag ? episode.tag.genre : undefined,
			discNumber: episode.tag ? episode.tag.disc : undefined,
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
			size: undefined,
			created: undefined,
			duration: undefined,
			bitRate: undefined
		};
		if (episode.path) {
			result.suffix = fileSuffix(episode.path);
			if (result.suffix !== AudioFormatType.mp3) {
				result.transcodedSuffix = AudioFormatType.mp3;
				result.transcodedContentType = AudioMimeTypes[result.transcodedSuffix];
			}
			result.contentType = AudioMimeTypes[result.suffix];
			if (episode.stat) {
				result.size = episode.stat.size;
				result.created = FORMAT.formatSubSonicDate(episode.stat.created);
			}
			if (episode.media) {
				result.duration = episode.media.duration ? Math.trunc(episode.media.duration) : undefined;
				result.bitRate = episode.media.bitRate !== undefined ? Math.round(episode.media.bitRate / 1000) : -1;
			}
		}
		return result;
	}

	static packPlaylist(playlist: Playlist): Subsonic.Playlist {
		return {
			id: playlist.id,
			name: playlist.name,
			comment: playlist.comment || '',
			public: playlist.isPublic,
			duration: Math.trunc(playlist.duration),
			created: FORMAT.formatSubSonicDate(playlist.created),
			changed: FORMAT.formatSubSonicDate(playlist.changed),
			coverArt: playlist.coverArt,
			allowedUser: playlist.allowedUser,
			songCount: playlist.trackIDs.length,
			owner: playlist.userID
		};
	}

	static packPlaylistWithSongs(playlist: Playlist, tracks: Array<Track>, states: States): Subsonic.PlaylistWithSongs {
		const result = FORMAT.packPlaylist(playlist) as Subsonic.PlaylistWithSongs;
		result.entry = tracks.map(track => FORMAT.packTrack(track, states[track.id]));
		return result;
	}

	static packBookmark(bookmark: Bookmark, username: string, child: Subsonic.Child): Subsonic.Bookmark {
		return {
			entry: child,
			username,
			position: bookmark.position,
			comment: bookmark.comment,
			created: FORMAT.formatSubSonicDate(bookmark.created),
			changed: FORMAT.formatSubSonicDate(bookmark.changed)
		};
	}

	static packSimilarSongs(childs: Array<Subsonic.Child>): Subsonic.SimilarSongs {
		return {
			song: childs
		};
	}

	static packSimilarSongs2(childs: Array<Subsonic.Child>): Subsonic.SimilarSongs2 {
		return {
			song: childs
		};
	}

	static packPlayQueue(playqueue: PlayQueue, user: User, childs: Array<Subsonic.Child>): Subsonic.PlayQueue {
		return {
			entry: childs,
			current: playqueue.currentID !== undefined ? parseInt(playqueue.currentID, 10) : undefined,
			position: playqueue.position,
			username: user.name,
			changed: playqueue.changed > 0 ? FORMAT.formatSubSonicDate(playqueue.changed) : '',
			changedBy: playqueue.changedBy || ''
		};
	}

	static packRadio(radio: Radio): Subsonic.InternetRadioStation {
		return {
			id: radio.id,
			name: radio.name,
			streamUrl: radio.url,
			homePageUrl: radio.homepage
		};
	}

	static packGenre(genre: Genre): Subsonic.Genre {
		return {
			content: genre.name,
			songCount: genre.trackCount,
			albumCount: genre.albumCount,
			artistCount: genre.artistCount
		};
	}

	static packChatMessage(message: ChatMessage): Subsonic.ChatMessage {
		return {
			username: message.username,
			time: message.time,
			message: message.message
		};
	}
}
