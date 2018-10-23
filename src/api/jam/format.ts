import {JamServe} from '../../model/jamserve';
import path from 'path';
import {DBObjectType, FolderType} from '../../types';
import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import moment from 'moment';

export const APIVERSION = '0.1.0';

export class FORMAT {

	static packRoles(roles: JamServe.UserRoles): Jam.Roles {
		return {
			// coverArt: roles.coverArtRole ? true : undefined,
			stream: roles.streamRole ? true : undefined,
			upload: roles.uploadRole ? true : undefined,
			admin: roles.adminRole ? true : undefined,
			podcast: roles.podcastRole ? true : undefined,
			// settings: roles.settingsRole ? true : undefined,
			// download: roles.downloadRole ? true : undefined,
			// playlist: roles.playlistRole ? true : undefined,
			// comment: roles.commentRole ? true : undefined,
			// jukebox: roles.jukeboxRole ? true : undefined,
			// share: roles.shareRole ? true : undefined,
			// videoConversion: roles.videoConversionRole ? true : undefined
		};
	}

	static packUser(user: JamServe.User): Jam.User {
		return {
			id: user.id,
			created: user.created,
			name: user.name,
			email: user.email,
			roles: FORMAT.packRoles(user.roles)
		};
	}

	static packRoot(root: JamServe.Root, rootState: JamServe.RootState): Jam.Root {
		return {
			id: root.id,
			name: root.name,
			created: root.created,
			path: root.path,
			scanState: rootState
		};
	}

	static packFolderTag(folder: JamServe.Folder): Jam.FolderTag {
		let mbz: any = {
			artistID: folder.tag.mbArtistID,
			albumID: folder.tag.mbAlbumID
		};
		if (!Object.keys(mbz).find(key => !!mbz[key])) {
			mbz = undefined;
		}
		return {
			artist: folder.tag.artist,
			album: folder.tag.album,
			genre: folder.tag.genre,
			year: folder.tag.year,
			musicbrainz: mbz
		};
	}

	static packTrackTag(tag: JamServe.TrackTag): Jam.TrackTag {
		let mbz: Jam.TrackMBTag | undefined = {
			recordingID: tag.mbRecordingID,
			releaseTrackID: tag.mbReleaseTrackID,
			trackID: tag.mbTrackID,
			artistID: tag.mbArtistID,
			albumID: tag.mbAlbumID
		};
		if (!Object.keys(mbz).find(key => !!(<any>mbz)[key])) {
			mbz = undefined;
		}
		return {
			trackNr: tag.track,
			year: tag.year,
			title: tag.title,
			artist: tag.artist,
			album: tag.album,
			genre: tag.genre,
			musicbrainz: mbz
		};
	}

	static packFolder(folder: JamServe.Folder, includes: JamParameters.IncludesFolder): Jam.Folder {
		includes = includes || {};
		return {
			id: folder.id,
			parentID: folder.parentID,
			name: path.basename(folder.path),
			created: folder.stat.created,
			type: <Jam.FolderType>(folder.tag && (folder.tag.type !== undefined) ? (FolderType[folder.tag.type] || 'unknown') : 'unknown'),
			tag: includes.folderTag ? this.packFolderTag(folder) : undefined
		};
	}

	static packState(state?: JamServe.State): Jam.State {
		return {
			played: state && state.played > 0 ? state.played : undefined,
			lastplayed: state && state.lastplayed > 0 ? state.lastplayed : undefined,
			faved: state ? state.faved : undefined,
			rated: state && state.rated !== undefined ? state.rated : undefined
		};
	}

	static packStates(states: JamServe.States): Jam.States {
		const result: Jam.States = {};
		Object.keys(states).forEach(key => {
			result[key] = FORMAT.packState(states[key]);
		});
		return result;
	}

	static packArtist(artist: JamServe.Artist, includes: JamParameters.IncludesArtist): Jam.Artist {
		let mbz: any = {
			artistID: artist.mbArtistID
		};
		if (!Object.keys(mbz).find(key => !!mbz[key])) {
			mbz = undefined;
		}
		return {
			id: artist.id,
			name: artist.name,
			albumCount: artist.albumIDs.length,
			albumIDs: includes.artistAlbumIDs ? artist.albumIDs : undefined,
			trackIDs: includes.artistTracksIDs ? artist.trackIDs : undefined,
			trackCount: artist.trackIDs.length,
			created: artist.created,
			musicbrainz: mbz
		};
	}

	static packAlbum(album: JamServe.Album, includes: JamParameters.IncludesAlbum): Jam.Album {
		let mbz: any = {
			artistID: album.mbArtistID,
			albumID: album.mbAlbumID
		};
		if (!Object.keys(mbz).find(key => !!mbz[key])) {
			mbz = undefined;
		}
		return {
			id: album.id,
			name: album.name,
			created: album.created,
			artist: album.artist,
			artistID: album.artistID,
			trackCount: album.trackIDs.length,
			tag: {
				genre: album.genre,
				year: album.year,
				duration: album.duration,
				created: album.created,
				musicbrainz: mbz
			},
			trackIDs: includes.albumTrackIDs ? album.trackIDs : undefined,
		};
	}

	static packArtistFolderInfo(info: JamServe.MetaInfo): Jam.ArtistFolderInfo {
		return {
			description: info.artist.description,
			lastFmUrl: info.album.url,
			smallImageUrl: info.album.image && info.album.image.small ? info.album.image.small : undefined,
			mediumImageUrl: info.album.image && info.album.image.medium ? info.album.image.medium : undefined,
			largeImageUrl: info.album.image && info.album.image.large ? info.album.image.large : undefined
		};
	}

	static packArtistInfo(info: JamServe.MetaInfo): Jam.ArtistInfo {
		return {
			description: info.artist.description,
			lastFmUrl: info.album.url,
			smallImageUrl: info.album.image && info.album.image.small ? info.album.image.small : undefined,
			mediumImageUrl: info.album.image && info.album.image.medium ? info.album.image.medium : undefined,
			largeImageUrl: info.album.image && info.album.image.large ? info.album.image.large : undefined
		};
	}

	static packAlbumFolderInfo(info: JamServe.MetaInfo): Jam.AlbumFolderInfo {
		return {
			description: info.album.description,
			lastFmUrl: info.album.url,
			releases: info.album.releases,
			smallImageUrl: info.album.image && info.album.image.small ? info.album.image.small : undefined,
			mediumImageUrl: info.album.image && info.album.image.medium ? info.album.image.medium : undefined,
			largeImageUrl: info.album.image && info.album.image.large ? info.album.image.large : undefined
		};
	}

	static packAlbumInfo(info: JamServe.MetaInfo): Jam.AlbumInfo {
		return {
			description: info.album.description,
			lastFmUrl: info.album.url,
			releases: info.album.releases,
			smallImageUrl: info.album.image && info.album.image.small ? info.album.image.small : undefined,
			mediumImageUrl: info.album.image && info.album.image.medium ? info.album.image.medium : undefined,
			largeImageUrl: info.album.image && info.album.image.large ? info.album.image.large : undefined
		};
	}

	static packGenre(genre: JamServe.Genre): Jam.Genre {
		return {
			name: genre.name,
			trackCount: genre.trackCount,
			albumCount: genre.albumCount,
			artistCount: genre.artistCount
		};
	}

	static packBookmark(bookmark: JamServe.Bookmark): Jam.TrackBookmark {
		return {
			trackID: bookmark.destID,
			comment: bookmark.comment,
			created: bookmark.created,
			changed: bookmark.changed,
			position: bookmark.position
		};
	}

	static packPodcast(podcast: JamServe.Podcast, status: string ): Jam.Podcast {
		return {
			id: podcast.id,
			url: podcast.url,
			created: podcast.created,
			lastCheck: podcast.lastCheck > 0 ? podcast.lastCheck : undefined,
			status: status,
			errorMessage: podcast.errorMessage,
			name: podcast.tag ? podcast.tag.title : podcast.url,
			description: podcast.tag ? podcast.tag.description : undefined
		};
	}

	static packTrack(track: JamServe.Track, includes: JamParameters.IncludesTrack): Jam.Track {
		includes = includes || {};
		return {
			id: track.id,
			parentID: track.parentID,
			artistID: track.artistID,
			albumID: track.albumID,
			name: track.name,
			created: track.stat.created,
			duration: track.media.duration || -1,
			media: includes.trackMedia ? {
				bitRate: track.media.bitRate || -1,
				format: track.media.format || '',
				channels: track.media.channels || -1,
				sampleRate: track.media.sampleRate || -1
			} : undefined,
			tag: includes.trackTag ? FORMAT.packTrackTag(track.tag) : undefined
		};
	}

	static packPodcastEpisode(episode: JamServe.Episode, includes: JamParameters.IncludesTrack, status: string): Jam.PodcastEpisode {
		return {
			id: episode.id,
			parentID: '',
			created: episode.stat ? episode.stat.created : 0,
			podcastID: episode.podcastID,
			status: status,
			errorMessage: episode.error,
			name: episode.title,
			duration: episode.media ? (episode.media.duration || -1) : -1,
			date: episode.date,
			title: episode.title,
			summary: episode.summary,
			guid: episode.guid,
			author: episode.author,
			link: episode.link,
			media: includes.trackMedia && episode.media ? {
				bitRate: episode.media.bitRate || -1,
				format: episode.media.format || '',
				channels: episode.media.channels || -1,
				sampleRate: episode.media.sampleRate || -1
			} : undefined,
			tag: includes.trackTag && episode.tag ? FORMAT.packTrackTag(episode.tag) : undefined
		};
	}

	static packNowPlaying(entry: JamServe.NowPlaying): Jam.NowPlaying {
		const playing: Jam.NowPlaying = {
			username: entry.user.name,
			minutesAgo: Math.round(moment.duration(moment().diff(moment(entry.time))).asMinutes())
		};
		switch (entry.obj.type) {
			case DBObjectType.track:
				playing.track = FORMAT.packTrack(<JamServe.Track>entry.obj, {});
				break;
			case DBObjectType.episode:
				const episode = <JamServe.Episode>entry.obj;
				playing.track = FORMAT.packPodcastEpisode(episode, {}, episode.status);
				break;
		}
		return playing;
	}

	static packPlaylist(playlist: JamServe.Playlist, includes: JamParameters.IncludesPlaylist): Jam.Playlist {
		return {
			id: playlist.id,
			name: playlist.name,
			userID: playlist.userID,
			comment: playlist.comment,
			isPublic: playlist.isPublic,
			duration: playlist.duration,
			created: playlist.created,
			changed: playlist.changed,
			trackCount: playlist.trackIDs.length,
			trackIDs: includes.playlistTracksIDs ? playlist.trackIDs : undefined
		};
	}

	static packFolderIndex(index: JamServe.FolderIndex): Jam.FolderIndex {
		return {
			lastModified: index.lastModified,
			groups: index.groups.map(i => ({
				name: i.name,
				entries: i.entries.map(e => {
					return {
						name: e.name,
						trackCount: e.trackCount,
						folderID: e.folder.id
					};
				})
			}))
		};
	}

	static packArtistIndex(index: JamServe.ArtistIndex): Jam.ArtistIndex {
		return {
			lastModified: index.lastModified,
			groups: index.groups.map(i => ({
				name: i.name,
				entries: i.entries.map(e => {
					return {
						name: e.artist.name,
						trackCount: e.artist.trackIDs.length,
						albumCount: e.artist.albumIDs.length,
						artistID: e.artist.id
					};
				})
			}))
		};
	}

	static packChatMessage(message: JamServe.ChatMessage): Jam.ChatMessage {
		return {
			username: message.username,
			userID: message.userID,
			time: message.time,
			message: message.message
		};
	}

	public static packPlayQueue(playQueue: JamServe.PlayQueue, includes: JamParameters.IncludesPlayQueue): Jam.PlayQueue {
		return {
			changed: playQueue.changed,
			changedBy: playQueue.changedBy,
			currentID: playQueue.currentID,
			position: playQueue.position,
			trackIDs: includes.playQueueTrackIDs ? playQueue.trackIDs : undefined
		};
	}
}
