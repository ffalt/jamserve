import moment from 'moment';
import {Track as ORMTrack} from '../../../entity/track/track';
import {Track, TrackBase} from '../../../entity/track/track.model';
import {DBObjectType, FolderType, JamObjectType, PodcastStatus} from '../../../types/enums';
import {Podcast as ORMPodcast} from '../../../entity/podcast/podcast';
import {Session as ORMSession} from '../../../entity/session/session';
import {Artwork as ORMArtwork} from '../../../entity/artwork/artwork';
import {State as ORMState} from '../../../entity/state/state';
import {PlaylistEntry as ORMPlaylistEntry} from '../../../entity/playlistentry/playlist-entry';
import {Episode as ORMEpisode, EpisodeChapter, EpisodeEnclosure} from '../../../entity/episode/episode';
import {PlayQueue as ORMPlayQueue} from '../../../entity/playqueue/playqueue';
import {PlayQueueEntry as ORMPlayQueueEntry} from '../../../entity/playqueueentry/playqueue-entry';
import {Folder as ORMFolder} from '../../../entity/folder/folder';
import {Artist as ORMArtist} from '../../../entity/artist/artist';
import {User as ORMUser, User} from '../../../entity/user/user';
import {User as RESTUser} from '../../../entity/user/user.model';
import {Root as ORMRoot} from '../../../entity/root/root';
import {Series as ORMSeries} from '../../../entity/series/series';
import {Bookmark as ORMBookmark} from '../../../entity/bookmark/bookmark';
import {Radio as ORMRadio} from '../../../entity/radio/radio';
import {Playlist as ORMPlaylist} from '../../../entity/playlist/playlist';
import {Series, SeriesBase, SeriesIndex} from '../../../entity/series/series.model';
import {Artist, ArtistBase, ArtistIndex} from '../../../entity/artist/artist.model';
import {Album as ORMAlbum} from '../../../entity/album/album';
import {Album, AlbumIndex} from '../../../entity/album/album.model';
import {Orm} from './orm.service';
import {State} from '../../../entity/state/state.model';
import {Inject, InRequestScope} from 'typescript-ioc';
import {MediaBase, MediaInfo, MediaTag} from '../../../entity/tag/tag.model';
import {Chat as ORMChat} from '../../../entity/chat/chat';
import {Tag as ORMTag} from '../../../entity/tag/tag';
import {Chat} from '../../../entity/chat/chat.model';
import {Folder, FolderBase, FolderIndex, FolderParent, FolderTag} from '../../../entity/folder/folder.model';
import {Artwork, ArtworkBase} from '../../../entity/artwork/artwork.model';
import {Episode, EpisodeBase, EpisodeUpdateStatus} from '../../../entity/episode/episode.model';
import {Podcast, PodcastBase, PodcastIndex, PodcastUpdateStatus} from '../../../entity/podcast/podcast.model';
import {Radio, RadioIndex} from '../../../entity/radio/radio.model';
import {Bookmark, BookmarkBase} from '../../../entity/bookmark/bookmark.model';
import {Root, RootUpdateStatus} from '../../../entity/root/root.model';
import {IoService} from './io.service';
import {Playlist, PlaylistIndex} from '../../../entity/playlist/playlist.model';
import {PlayQueue} from '../../../entity/playqueue/playqueue.model';
import {PodcastService} from '../../../entity/podcast/podcast.service';
import {EpisodeService} from '../../../entity/episode/episode.service';
import {NowPlaying as ORMNowPlaying} from '../../../entity/nowplaying/nowplaying';
import {NowPlaying} from '../../../entity/nowplaying/nowplaying.model';
import {IncludesAlbumArgs, IncludesAlbumChildrenArgs} from '../../../entity/album/album.args';
import {IncludesSeriesArgs, IncludesSeriesChildrenArgs} from '../../../entity/series/series.args';
import {IncludesNowPlayingArgs} from '../../../entity/nowplaying/nowplaying.args';
import {IncludesTrackArgs} from '../../../entity/track/track.args';
import {IncludesArtistArgs, IncludesArtistChildrenArgs} from '../../../entity/artist/artist.args';
import {IncludesBookmarkChildrenArgs} from '../../../entity/bookmark/bookmark.args';
import {IncludesPlayQueueArgs} from '../../../entity/playqueue/playqueue.args';
import {IncludesPlaylistArgs} from '../../../entity/playlist/playlist.args';
import {IncludesFolderArgs, IncludesFolderChildrenArgs} from '../../../entity/folder/folder.args';
import {IncludesRadioArgs} from '../../../entity/radio/radio.args';
import {IncludesPodcastArgs, IncludesPodcastChildrenArgs} from '../../../entity/podcast/podcast.args';
import {IncludesEpisodeArgs, IncludesEpisodeParentArgs} from '../../../entity/episode/episode.args';
import {IncludesRootArgs} from '../../../entity/root/root.args';
import {IncludesArtworkArgs, IncludesArtworkChildrenArgs} from '../../../entity/artwork/artwork.args';
import {IncludesUserArgs} from '../../../entity/user/user.args';
import {UserSession} from '../../../entity/settings/user-session.model';
import {parseAgent} from '../../../entity/session/session.utils';
import {IndexResult, IndexResultGroup} from '../../../entity/base/base';
import {AudioModule} from '../../audio/audio.module';
import {MetaDataService} from '../../../entity/metadata/metadata.service';
import {ExtendedInfo} from '../../../entity/metadata/metadata.model';
import {TrackService} from '../../../entity/track/track.service';

@InRequestScope
export class TransformService {
	@Inject
	private ioService!: IoService;
	@Inject
	public podcastService!: PodcastService;
	@Inject
	public episodeService!: EpisodeService;
	@Inject
	public trackService!: TrackService;
	@Inject
	public audioModule!: AudioModule;
	@Inject
	public metaDataService!: MetaDataService;

	async trackBase(orm: Orm, o: ORMTrack, trackArgs: IncludesTrackArgs, user: User): Promise<TrackBase> {
		const tag = await o.tag.get();
		return {
			id: o.id,
			name: o.fileName || o.name,
			objType: JamObjectType.track,
			created: o.createdAt.valueOf(),
			duration: tag?.mediaDuration ?? 0,
			parentID: o.folder.idOrFail(),
			artistID: o.artist.id(),
			albumArtistID: o.albumArtist.id(),
			albumID: o.album.id(),
			seriesID: o.series.id(),
			tag: trackArgs.trackIncTag ? await this.mediaTag(orm, tag) : undefined,
			media: trackArgs.trackIncMedia ? await this.trackMedia(tag, o.fileSize) : undefined,
			tagRaw: trackArgs.trackIncRawTag ? await this.trackService.getRawTag(o) : undefined,
			state: trackArgs.trackIncState ? await this.state(orm, o.id, DBObjectType.track, user.id) : undefined
		};
	}

	async track(orm: Orm, o: ORMTrack, trackArgs: IncludesTrackArgs, user: User): Promise<Track> {
		return this.trackBase(orm, o, trackArgs, user);
	}

	async trackMedia(o: ORMTag | undefined, fileSize?: number): Promise<MediaInfo> {
		return {
			bitRate: o?.mediaBitRate,
			format: o?.mediaFormat,
			channels: o?.mediaChannels,
			sampleRate: o?.mediaSampleRate,
			size: fileSize
		};
	}


	async episodeBase(orm: Orm, o: ORMEpisode, episodeArgs: IncludesEpisodeArgs, user: User): Promise<EpisodeBase> {
		const chapters: Array<EpisodeChapter> | undefined = o.chaptersJSON ? JSON.parse(o.chaptersJSON) : undefined;
		const enclosures: Array<EpisodeEnclosure> | undefined = o.enclosuresJSON ? JSON.parse(o.enclosuresJSON) : undefined;
		const podcast = await o.podcast.getOrFail();
		const tag = await o.tag.get();
		return {
			id: o.id,
			name: o.name,
			objType: JamObjectType.episode,
			date: o.date.valueOf(),
			summary: o.summary,
			author: o.author,
			error: o.error,
			chapters,
			url: enclosures ? enclosures[0].url : undefined,
			link: o.link,
			guid: o.guid,
			podcastID: podcast.id,
			podcastName: podcast.name,
			status: this.episodeService.isDownloading(o.id) ? PodcastStatus.downloading : o.status,
			created: o.createdAt.valueOf(),
			duration: tag?.mediaDuration ?? o.duration ?? 0,
			tag: episodeArgs.episodeIncTag ? await this.mediaTag(orm, tag) : undefined,
			media: episodeArgs.episodeIncMedia ? await this.trackMedia(tag, o.fileSize) : undefined,
			tagRaw: episodeArgs.episodeIncRawTag && o.path ? await this.audioModule.readRawTag(o.path) : undefined,
			state: episodeArgs.episodeIncState ? await this.state(orm, o.id, DBObjectType.episode, user.id) : undefined
		};
	}

	async episode(orm: Orm, o: ORMEpisode, episodeArgs: IncludesEpisodeArgs, episodeParentArgs: IncludesEpisodeParentArgs, podcastArgs: IncludesPodcastArgs, user: User): Promise<Episode> {
		return {
			...(await this.episodeBase(orm, o, episodeArgs, user)),
			podcast: await this.podcastBase(orm, await o.podcast.getOrFail(), podcastArgs, user)
		};
	}

	episodeStatus(o: ORMEpisode): EpisodeUpdateStatus {
		return this.episodeService.isDownloading(o.id) ? {status: PodcastStatus.downloading} : {status: o.status, error: o.error};
	}


	async podcastBase(orm: Orm, o: ORMPodcast, podcastArgs: IncludesPodcastArgs, user: User): Promise<PodcastBase> {
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			url: o.url,
			status: this.podcastService.isDownloading(o.id) ? PodcastStatus.downloading : o.status,
			lastCheck: o.lastCheck ? o.lastCheck.valueOf() : undefined,
			error: o.errorMessage,
			description: o.description,
			episodeIDs: podcastArgs.podcastIncEpisodeIDs ? (await o.episodes.getItems()).map(t => t.id) : undefined,
			episodeCount: podcastArgs.podcastIncEpisodeCount ? await o.episodes.count() : undefined,
			state: podcastArgs.podcastIncState ? await this.state(orm, o.id, DBObjectType.podcast, user.id) : undefined
		};
	}

	async podcast(orm: Orm, o: ORMPodcast, podcastArgs: IncludesPodcastArgs, podcastChildrenArgs: IncludesPodcastChildrenArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<Podcast> {
		return {
			...(await this.podcastBase(orm, o, podcastArgs, user)),
			episodes: podcastChildrenArgs.podcastIncEpisodes ? await Promise.all((await o.episodes.getItems()).map(t => this.episodeBase(orm, t, episodeArgs, user))) : undefined,
		};
	}

	async podcastIndex(orm: Orm, result: IndexResult<IndexResultGroup<ORMPodcast>>): Promise<PodcastIndex> {
		return this.index(result, async (item) => {
			return {
				id: item.id,
				name: item.name,
				episodeCount: await item.episodes.count()
			};
		});
	}

	podcastStatus(o: ORMPodcast): PodcastUpdateStatus {
		return this.podcastService.isDownloading(o.id) ? {status: PodcastStatus.downloading} : {status: o.status, error: o.errorMessage, lastCheck: o.lastCheck ? o.lastCheck.valueOf() : undefined};
	}


	async folderBase(orm: Orm, o: ORMFolder, folderArgs: IncludesFolderArgs, user: User): Promise<FolderBase> {
		let info: ExtendedInfo | undefined;
		if (folderArgs.folderIncInfo) {
			info =
				o.folderType === FolderType.artist ?
					await this.metaDataService.extInfo.byFolderArtist(orm, o) :
					await this.metaDataService.extInfo.byFolderAlbum(orm, o);
		}
		const parentID = o.parent.id();
		return {
			id: o.id,
			name: o.name,
			title: o.title,
			created: o.createdAt.valueOf(),
			type: o.folderType,
			level: o.level,
			parentID,
			trackCount: folderArgs.folderIncTrackCount ? await o.tracks.count() : undefined,
			folderCount: folderArgs.folderIncChildFolderCount ? await o.children.count() : undefined,
			artworkCount: folderArgs.folderIncArtworkCount ? await o.children.count() : undefined,
			tag: folderArgs.folderIncTag ? this.folderTag(o) : undefined,
			parents: folderArgs.folderIncParents ? await this.folderParents(orm, o) : undefined,
			trackIDs: folderArgs.folderIncTrackIDs ? (await o.tracks.getItems()).map(t => t.id) : undefined,
			folderIDs: folderArgs.folderIncFolderIDs ? (await o.children.getItems()).map(t => t.id) : undefined,
			artworkIDs: folderArgs.folderIncArtworkIDs ? (await o.artworks.getItems()).map(t => t.id) : undefined,
			info,
			state: folderArgs.folderIncSimilar ? await this.state(orm, o.id, DBObjectType.folder, user.id) : undefined
		};
	}

	async folderChildren(orm: Orm, o: ORMFolder, folderChildrenArgs: IncludesFolderChildrenArgs, user: User): Promise<Array<FolderBase>> {
		const folderArgs: IncludesFolderArgs = {
			folderIncTag: folderChildrenArgs.folderChildIncTag,
			folderIncState: folderChildrenArgs.folderChildIncState,
			folderIncChildFolderCount: folderChildrenArgs.folderChildIncChildFolderCount,
			folderIncTrackCount: folderChildrenArgs.folderChildIncTrackCount,
			folderIncArtworkCount: folderChildrenArgs.folderChildIncArtworkCount,
			folderIncParents: folderChildrenArgs.folderChildIncParents,
			folderIncInfo: folderChildrenArgs.folderChildIncInfo,
			folderIncSimilar: folderChildrenArgs.folderChildIncSimilar,
			folderIncArtworkIDs: folderChildrenArgs.folderChildIncArtworkIDs,
			folderIncTrackIDs: folderChildrenArgs.folderChildIncTrackIDs,
			folderIncFolderIDs: folderChildrenArgs.folderChildIncFolderIDs,
		};
		return await Promise.all((await o.children.getItems()).map(t => this.folderBase(orm, t, folderArgs, user)));
	}

	async folder(orm: Orm, o: ORMFolder, folderArgs: IncludesFolderArgs, folderChildrenArgs: IncludesFolderChildrenArgs, trackArgs: IncludesTrackArgs, artworkArgs: IncludesArtworkArgs, user: User): Promise<Folder> {
		return {
			...(await this.folderBase(orm, o, folderArgs, user)),
			tracks: folderChildrenArgs.folderIncChildren || folderChildrenArgs.folderIncTracks ?
				await Promise.all((await o.tracks.getItems()).map(t => this.trackBase(orm, t, trackArgs, user))) :
				undefined,
			folders: folderChildrenArgs.folderIncChildren || folderChildrenArgs.folderIncFolders ?
				await this.folderChildren(orm, o, folderChildrenArgs, user)
				: undefined,
			artworks: folderChildrenArgs.folderIncArtworks ?
				await Promise.all((await o.artworks.getItems()).map(t => this.artworkBase(orm, t, artworkArgs, user))) :
				undefined
		};
	}

	async folderIndex(orm: Orm, result: IndexResult<IndexResultGroup<ORMFolder>>): Promise<FolderIndex> {
		return this.index(result, async (item) => {
			return {
				id: item.id,
				name: item.name,
				trackCount: await item.tracks.count()
			};
		});
	}

	folderTag(o: ORMFolder): FolderTag {
		return {
			album: o.album,
			albumType: o.albumType,
			artist: o.artist,
			artistSort: o.artistSort,
			genres: o.genres,
			year: o.year,
			mbArtistID: o.mbArtistID,
			mbReleaseID: o.mbReleaseID,
			mbReleaseGroupID: o.mbReleaseGroupID
		};
	}

	async folderParents(orm: Orm, o: ORMFolder): Promise<Array<FolderParent>> {
		const result: Array<FolderParent> = [];
		let parent: ORMFolder | undefined = o;
		while (parent) {
			parent = await parent.parent.get();
			if (parent) {
				result.unshift({id: parent.id, name: parent.name});
			}
		}
		return result;
	}


	async seriesBase(orm: Orm, o: ORMSeries, seriesArgs: IncludesSeriesArgs, user: User): Promise<SeriesBase> {
		const artist = await o.artist.getOrFail();
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			artist: artist.name,
			artistID: artist.id,
			albumTypes: o.albumTypes,
			albumCount: seriesArgs.seriesIncAlbumCount ? await o.albums.count() : undefined,
			trackCount: seriesArgs.seriesIncTrackCount ? await o.tracks.count() : undefined,
			trackIDs: seriesArgs.seriesIncTrackIDs ? (await o.tracks.getItems()).map(t => t.id) : undefined,
			albumIDs: seriesArgs.seriesIncAlbumIDs ? (await o.albums.getItems()).map(a => a.id) : undefined,
			info: seriesArgs.seriesIncInfo ? await this.metaDataService.extInfo.bySeries(orm, o) : undefined,
			state: seriesArgs.seriesIncState ? await this.state(orm, o.id, DBObjectType.series, user.id) : undefined
		};
	}

	async series(orm: Orm, o: ORMSeries, seriesArgs: IncludesSeriesArgs, seriesChildrenArgs: IncludesSeriesChildrenArgs, albumArgs: IncludesAlbumArgs, trackArgs: IncludesTrackArgs, user: User): Promise<Series> {
		return {
			...(await this.seriesBase(orm, o, seriesArgs, user)),
			tracks: seriesChildrenArgs.seriesIncTracks ? await Promise.all((await o.tracks.getItems()).map(t => this.trackBase(orm, t, trackArgs, user))) : undefined,
			albums: seriesChildrenArgs.seriesIncAlbums ? await Promise.all((await o.albums.getItems()).map(t => this.albumBase(orm, t, albumArgs, user))) : undefined
		};
	}

	async transformSeriesIndex(orm: Orm, result: IndexResult<IndexResultGroup<ORMSeries>>): Promise<SeriesIndex> {
		return this.index(result, async (item) => {
			return {
				id: item.id,
				name: item.name,
				albumCount: await item.albums.count(),
				trackCount: await item.tracks.count()
			};
		});
	}


	async artistBase(orm: Orm, o: ORMArtist, artistArgs: IncludesArtistArgs, user: User): Promise<ArtistBase> {
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			albumCount: artistArgs.artistIncAlbumCount ? await o.albums.count() : undefined,
			trackCount: artistArgs.artistIncTrackCount ? await o.tracks.count() : undefined,
			seriesCount: artistArgs.artistIncSeriesCount ? await o.series.count() : undefined,
			mbArtistID: o.mbArtistID,
			genres: o.genres,
			albumTypes: o.albumTypes,
			state: artistArgs.artistIncState ? await this.state(orm, o.id, DBObjectType.artist, user.id) : undefined,
			trackIDs: artistArgs.artistIncTrackIDs ? (await o.tracks.getItems()).map(t => t.id) : undefined,
			albumIDs: artistArgs.artistIncAlbumIDs ? (await o.albums.getItems()).map(a => a.id) : undefined,
			seriesIDs: artistArgs.artistIncSeriesIDs ? (await o.series.getItems()).map(s => s.id) : undefined,
			info: artistArgs.artistIncInfo ? await this.metaDataService.extInfo.byArtist(orm, o) : undefined
		};
	}

	async artist(orm: Orm, o: ORMArtist, artistArgs: IncludesArtistArgs, artistChildrenArgs: IncludesArtistChildrenArgs, trackArgs: IncludesTrackArgs, albumArgs: IncludesAlbumArgs, seriesArgs: IncludesSeriesArgs, user: User): Promise<Artist> {
		return {
			...(await this.artistBase(orm, o, artistArgs, user)),
			tracks: artistChildrenArgs.artistIncTracks ? await Promise.all((await o.tracks.getItems()).map(t => this.trackBase(orm, t, trackArgs, user))) : undefined,
			albums: artistChildrenArgs.artistIncAlbums ? await Promise.all((await o.albums.getItems()).map(t => this.albumBase(orm, t, albumArgs, user))) : undefined,
			series: artistChildrenArgs.artistIncSeries ? await Promise.all((await o.series.getItems()).map(t => this.seriesBase(orm, t, seriesArgs, user))) : undefined
		};
	}

	async artistIndex(orm: Orm, result: IndexResult<IndexResultGroup<ORMArtist>>): Promise<ArtistIndex> {
		return this.index(result, async (item) => {
			return {
				id: item.id,
				name: item.name,
				albumCount: await item.albums.count(),
				trackCount: await item.tracks.count()
			};
		});
	}


	async albumBase(orm: Orm, o: ORMAlbum, albumArgs: IncludesAlbumArgs, user: User): Promise<Album> {
		const artist = await o.artist.getOrFail();
		const series = await o.series.get();
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			genres: o.genres,
			year: o.year,
			mbArtistID: o.mbArtistID,
			mbReleaseID: o.mbReleaseID,
			albumType: o.albumType,
			duration: o.duration,
			artistID: artist.id,
			artistName: artist.name,
			series: series?.name,
			seriesID: series?.id,
			seriesNr: o.seriesNr,
			state: albumArgs.albumIncState ? await this.state(orm, o.id, DBObjectType.album, user.id) : undefined,
			trackCount: albumArgs.albumIncTrackCount ? await o.tracks.count() : undefined,
			trackIDs: albumArgs.albumIncTrackIDs ? (await o.tracks.getItems()).map(t => t.id) : undefined,
			info: albumArgs.albumIncInfo ? await this.metaDataService.extInfo.byAlbum(orm, o) : undefined
		};
	}

	async album(orm: Orm, o: ORMAlbum, albumArgs: IncludesAlbumArgs, albumChildrenArgs: IncludesAlbumChildrenArgs, trackArgs: IncludesTrackArgs, artistIncludes: IncludesArtistArgs, user: User): Promise<Album> {
		const tracks = albumChildrenArgs.albumIncTracks ?
			await Promise.all((await o.tracks.getItems()).map(t => this.trackBase(orm, t, trackArgs, user))) :
			undefined;
		const artist = albumChildrenArgs.albumIncArtist ? await this.artistBase(orm, await o.artist.getOrFail(), artistIncludes, user) : undefined;
		return {
			...(await this.albumBase(orm, o, albumArgs, user)),
			tracks,
			artist
		};
	}

	async albumIndex(orm: Orm, result: IndexResult<IndexResultGroup<ORMAlbum>>): Promise<AlbumIndex> {
		return this.index(result, async (item) => {
			const artist = await item.artist.getOrFail();
			return {
				id: item.id,
				name: item.name,
				artist: artist.name,
				artistID: artist.id,
				trackCount: await item.tracks.count()
			};
		});
	}


	async artworkBase(orm: Orm, o: ORMArtwork, artworksArgs: IncludesArtworkArgs, user: User): Promise<ArtworkBase> {
		return {
			id: o.id,
			name: o.name,
			types: o.types,
			height: o.height,
			width: o.width,
			format: o.format,
			created: o.createdAt.valueOf(),
			state: artworksArgs.artworkIncState ? await this.state(orm, o.id, DBObjectType.artwork, user.id) : undefined,
			size: o.fileSize
		};
	}

	async artwork(orm: Orm, o: ORMArtwork, artworksArgs: IncludesArtworkArgs, artworkChildrenArgs: IncludesArtworkChildrenArgs, folderArgs: IncludesFolderArgs, user: User): Promise<Artwork> {
		return {
			...(await this.artworkBase(orm, o, artworksArgs, user)),
			folder: artworkChildrenArgs.artworkIncFolder ? await this.folderBase(orm, await o.folder.getOrFail(), folderArgs, user) : undefined
		};
	}


	async stateBase(orm: Orm, o: ORMState): Promise<State> {
		return {
			played: o.played,
			lastPlayed: o.lastPlayed ? o.lastPlayed.valueOf() : undefined,
			faved: o.faved ? o.faved.valueOf() : undefined,
			rated: o.rated
		};
	}

	async state(orm: Orm, id: string, type: DBObjectType, userID: string): Promise<State> {
		const state = await orm.State.findOrCreate(id, type, userID);
		return this.stateBase(orm, state);
	}


	async bookmarkBase(orm: Orm, o: ORMBookmark): Promise<BookmarkBase> {
		return {
			id: o.id,
			trackID: o.track.id(),
			episodeID: o.episode.id(),
			position: o.position,
			comment: o.comment,
			created: o.createdAt.valueOf(),
			changed: o.updatedAt.valueOf()
		};
	}

	async bookmark(orm: Orm, o: ORMBookmark, bookmarkArgs: IncludesBookmarkChildrenArgs, trackArgs: IncludesTrackArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<Bookmark> {
		return {
			...(await this.bookmarkBase(orm, o)),
			track: bookmarkArgs.bookmarkIncTrack && o.track.id() ? await this.trackBase(orm, await o.track.getOrFail(), trackArgs, user) : undefined,
			episode: bookmarkArgs.bookmarkIncTrack && o.episode.id() ? await this.episodeBase(orm, await o.episode.getOrFail(), episodeArgs, user) : undefined,
		};
	}


	async radio(orm: Orm, o: ORMRadio, radioArgs: IncludesRadioArgs, user: User): Promise<Radio> {
		return {
			id: o.id,
			name: o.name,
			url: o.url,
			homepage: o.homepage,
			created: o.createdAt.valueOf(),
			changed: o.updatedAt.valueOf(),
			state: radioArgs.radioState ? await this.state(orm, o.id, DBObjectType.radio, user.id) : undefined
		};
	}

	async radioIndex(orm: Orm, result: IndexResult<IndexResultGroup<ORMRadio>>): Promise<RadioIndex> {
		return this.index(result, async (item) => {
			return {
				id: item.id,
				name: item.name,
				url: item.url
			};
		});
	}

	async playlist(orm: Orm, o: ORMPlaylist, playlistArgs: IncludesPlaylistArgs, trackArgs: IncludesTrackArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<Playlist> {
		const u = await o.user.getOrFail();
		const entries = playlistArgs.playlistIncEntriesIDs || playlistArgs.playlistIncEntries ? await o.entries.getItems() : [];
		return {
			id: o.id,
			name: o.name,
			changed: o.updatedAt.valueOf(),
			duration: o.duration,
			created: o.createdAt.valueOf(),
			isPublic: o.isPublic,
			comment: o.comment,
			userID: u.id,
			userName: u.name,
			entriesCount: await o.entries.count(),
			entriesIDs: playlistArgs.playlistIncEntriesIDs ? entries.map(t => (t.track.id()) || (t.episode.id())) as Array<string> : undefined,
			entries: playlistArgs.playlistIncEntries ? await Promise.all(entries.map(t => this.playlistEntry(orm, t, trackArgs, episodeArgs, user))) : undefined,
			state: playlistArgs.playlistIncState ? await this.state(orm, o.id, DBObjectType.playlist, user.id) : undefined
		};
	}

	async playlistIndex(orm: Orm, result: IndexResult<IndexResultGroup<ORMPlaylist>>): Promise<PlaylistIndex> {
		return this.index(result, async (item) => {
			return {
				id: item.id,
				name: item.name,
				entryCount: await item.entries.count()
			};
		});
	}

	async playlistEntry(orm: Orm, o: ORMPlaylistEntry, trackArgs: IncludesTrackArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<MediaBase> {
		if (o.track.id()) {
			return await this.trackBase(orm, await o.track.getOrFail(), trackArgs, user);
		}
		if (o.episode.id()) {
			return await this.episodeBase(orm, await o.episode.getOrFail(), episodeArgs, user);
		}
		throw new Error('Internal: Invalid Playlist Entry');
	}


	async root(orm: Orm, o: ORMRoot, rootArgs: IncludesRootArgs, user: User): Promise<Root> {
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			path: user.roleAdmin ? o.path : undefined,
			status: this.ioService.getRootStatus(o.id),
			strategy: o.strategy
		};
	}

	rootStatus(root: ORMRoot): RootUpdateStatus {
		return this.ioService.getRootStatus(root.id);
	}


	async playQueueEntry(orm: Orm, o: ORMPlayQueueEntry, trackArgs: IncludesTrackArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<MediaBase> {
		if (o.track.id()) {
			return await this.trackBase(orm, await o.track.getOrFail(), trackArgs, user);
		}
		if (o.episode.id()) {
			return await this.episodeBase(orm, await o.episode.getOrFail(), episodeArgs, user);
		}
		throw new Error('Internal: Invalid PlayQueue Entry');
	}

	async playQueue(orm: Orm, o: ORMPlayQueue, playQueueArgs: IncludesPlayQueueArgs, trackArgs: IncludesTrackArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<PlayQueue> {
		const entries = playQueueArgs.playQueueEntriesIDs || playQueueArgs.playQueueEntries ?
			await o.entries.getItems() : [];
		const u = o.user.id() === user.id ? user : await o.user.getOrFail();
		return {
			changed: o.updatedAt.valueOf(),
			changedBy: o.changedBy,
			created: o.createdAt.valueOf(),
			currentIndex: o.current,
			mediaPosition: o.position,
			userID: u.id,
			userName: u.name,
			entriesCount: await o.entries.count(),
			entriesIDs: playQueueArgs.playQueueEntriesIDs ? entries.map(t => (t.track.id()) || (t.episode.id())) as Array<string> : undefined,
			entries: playQueueArgs.playQueueEntries ? await Promise.all(entries.map(t => this.playQueueEntry(orm, t, trackArgs, episodeArgs, user))) : undefined
		};
	}

	async mediaTag(orm: Orm, o?: ORMTag): Promise<MediaTag> {
		if (!o) {
			return {};
		}
		return {
			title: o.title,
			album: o.album,
			artist: o.artist,
			genres: o.genres,
			year: o.year,
			trackNr: o.trackNr,
			disc: o.disc,
			discTotal: o.discTotal,
			mbTrackID: o.mbTrackID,
			mbRecordingID: o.mbRecordingID,
			mbReleaseTrackID: o.mbReleaseTrackID,
			mbReleaseGroupID: o.mbReleaseGroupID,
			mbReleaseID: o.mbReleaseID,
			mbArtistID: o.mbArtistID,
			mbAlbumArtistID: o.mbAlbumArtistID
		};
	}


	async nowPlaying(orm: Orm, o: ORMNowPlaying, nowPlayingArgs: IncludesNowPlayingArgs, trackArgs: IncludesTrackArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<NowPlaying> {
		return {
			userName: o.user.name,
			userID: o.user.id,
			minutesAgo: Math.round(moment.duration(moment().diff(moment(o.time))).asMinutes()),
			trackID: nowPlayingArgs.nowPlayingIncTrackIDs ? o.track?.id : undefined,
			track: nowPlayingArgs.nowPlayingIncTracks && o.track ? (await this.trackBase(orm, o.track, trackArgs, user)) : undefined,
			episodeID: nowPlayingArgs.nowPlayingIncEpisodeIDs ? o.episode?.id : undefined,
			episode: nowPlayingArgs.nowPlayingIncEpisodes && o.episode ? (await this.episodeBase(orm, o.episode, episodeArgs, user)) : undefined
		};
	}

	async user(orm: Orm, o: ORMUser, userArgs: IncludesUserArgs, currentUser: User): Promise<RESTUser> {
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			email: (currentUser?.id === o.id || currentUser?.roleAdmin) ? o.email : undefined,
			roles: {
				admin: o.roleAdmin,
				podcast: o.rolePodcast,
				stream: o.roleStream,
				upload: o.roleUpload
			}
		};
	}

	chats(chats: Array<ORMChat>): Array<Chat> {
		return chats.map(c => {
			return {...c, created: c.created.valueOf()};
		});
	}

	userSession(orm: Orm, o: ORMSession): UserSession {
		const ua = parseAgent(o);
		return {
			id: o.id,
			client: o.client,
			expires: o.expires ? o.expires.valueOf() : undefined,
			mode: o.mode,
			platform: ua?.platform,
			os: ua?.os,
			agent: o.agent
		};
	}

	private async index<T, Y>(result: IndexResult<IndexResultGroup<T>>, mapItem: (item: T) => Promise<Y>): Promise<{
		lastModified: number;
		groups: Array<{ name: string; items: Array<Y> }>;
	}> {
		return {
			lastModified: new Date().valueOf(),
			groups: await Promise.all(result.groups.map(async (group) => {
				return {
					name: group.name,
					items: await Promise.all(group.items.map(async (item) => {
						return await mapItem(item);
					}))
				};
			}))
		};
	}

}
