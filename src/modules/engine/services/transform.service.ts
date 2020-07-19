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
import {OrmService} from './orm.service';
import {State} from '../../../entity/state/state.model';
import {Inject, Singleton} from 'typescript-ioc';
import {MediaBase, MediaInfo, MediaTag} from '../../../entity/tag/tag.model';
import {Chat as ORMChat} from '../../../entity/chat/chat';
import {Tag as ORMTag} from '../../../entity/tag/tag';
import {Chat} from '../../../entity/chat/chat.model';
import {Folder, FolderBase, FolderIndex, FolderParent, FolderTag} from '../../../entity/folder/folder.model';
import {Artwork, ArtworkBase} from '../../../entity/artwork/artwork.model';
import {Episode, EpisodeBase, EpisodeUpdateStatus} from '../../../entity/episode/episode.model';
import {Podcast, PodcastBase, PodcastIndex, PodcastUpdateStatus} from '../../../entity/podcast/podcast.model';
import path from 'path';
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
import {Base, IndexResult, IndexResultGroup} from '../../../entity/base/base';
import {AudioModule} from '../../audio/audio.module';
import {MetaDataService} from '../../../entity/metadata/metadata.service';
import {ExtendedInfo} from '../../../entity/metadata/metadata.model';

@Singleton
export class TransformService {
	@Inject
	private orm!: OrmService;
	@Inject
	private ioService!: IoService;
	@Inject
	public podcastService!: PodcastService;
	@Inject
	public episodeService!: EpisodeService;
	@Inject
	public audioModule!: AudioModule;
	@Inject
	public metaDataService!: MetaDataService;

	async trackBase(o: ORMTrack, trackArgs: IncludesTrackArgs, user: User): Promise<TrackBase> {
		await this.orm.Track.populate(o, ['tag']);
		return {
			id: o.id,
			name: o.fileName || o.name,
			objType: JamObjectType.track,
			created: o.createdAt.valueOf(),
			duration: o.tag?.mediaDuration ?? 0,
			parentID: o.folder.id,
			artistID: o.artist?.id,
			albumArtistID: o.albumArtist?.id,
			albumID: o.album?.id,
			seriesID: o.series?.id,
			tag: trackArgs.trackIncTag ? await this.mediaTag(o.tag) : undefined,
			media: trackArgs.trackIncMedia ? await this.trackMedia(o.tag, o.fileSize) : undefined,
			tagRaw: trackArgs.trackIncRawTag ? await this.mediaRawTag(path.join(o.path, o.fileName)) : undefined,
			state: trackArgs.trackIncState ? await this.state(o.id, DBObjectType.track, user.id) : undefined
		};
	}

	async track(o: ORMTrack, trackArgs: IncludesTrackArgs, user: User): Promise<Track> {
		return this.trackBase(o, trackArgs, user);
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


	async episodeBase(o: ORMEpisode, episodeArgs: IncludesEpisodeArgs, user: User): Promise<EpisodeBase> {
		const chapters: Array<EpisodeChapter> | undefined = o.chaptersJSON ? JSON.parse(o.chaptersJSON) : undefined;
		const enclosures: Array<EpisodeEnclosure> | undefined = o.enclosuresJSON ? JSON.parse(o.enclosuresJSON) : undefined;
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
			podcastID: o.podcast.id,
			podcastName: o.podcast.name,
			status: this.episodeService.isDownloading(o.id) ? PodcastStatus.downloading : o.status,
			created: o.createdAt.valueOf(),
			duration: o.tag?.mediaDuration ?? o.duration ?? 0,
			tag: episodeArgs.episodeIncTag ? await this.mediaTag(o.tag) : undefined,
			media: episodeArgs.episodeIncMedia ? await this.trackMedia(o.tag, o.fileSize) : undefined,
			tagRaw: episodeArgs.episodeIncRawTag && o.path ? await this.mediaRawTag(o.path) : undefined,
			state: episodeArgs.episodeIncState ? await this.state(o.id, DBObjectType.episode, user.id) : undefined
		};
	}

	async episode(o: ORMEpisode, episodeArgs: IncludesEpisodeArgs, episodeParentArgs: IncludesEpisodeParentArgs, podcastArgs: IncludesPodcastArgs, user: User): Promise<Episode> {
		return {
			...(await this.episodeBase(o, episodeArgs, user)),
			podcast: await this.podcastBase(o.podcast, podcastArgs, user)
		}
	}

	episodeStatus(o: ORMEpisode): EpisodeUpdateStatus {
		return this.episodeService.isDownloading(o.id) ? {status: PodcastStatus.downloading} : {status: o.status, error: o.error};
	}


	async podcastBase(o: ORMPodcast, podcastArgs: IncludesPodcastArgs, user: User): Promise<PodcastBase> {
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			url: o.url,
			status: this.podcastService.isDownloading(o.id) ? PodcastStatus.downloading : o.status,
			lastCheck: o.lastCheck.valueOf(),
			error: o.errorMessage,
			description: o.description,
			episodeIDs: podcastArgs.podcastIncEpisodeIDs ? o.episodes.getItems().map(t => t.id) : undefined,
			episodeCount: podcastArgs.podcastIncEpisodeCount ? o.episodes.length : undefined,
			state: podcastArgs.podcastIncState ? await this.state(o.id, DBObjectType.podcast, user.id) : undefined
		};
	}

	async podcast(o: ORMPodcast, podcastArgs: IncludesPodcastArgs, podcastChildrenArgs: IncludesPodcastChildrenArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<Podcast> {
		await this.orm.Podcast.populate(o, ['episodes']);
		return {
			...(await this.podcastBase(o, podcastArgs, user)),
			episodes: podcastChildrenArgs.podcastIncEpisodes ? await Promise.all(o.episodes.getItems().map(t => this.episodeBase(t, episodeArgs, user))) : undefined,
		}
	}

	async podcastIndex(result: IndexResult<IndexResultGroup<ORMPodcast>>): Promise<PodcastIndex> {
		return this.index(result, async (item) => {
			await this.orm.Podcast.populate(item, ['episodes']);
			return {
				id: item.id,
				name: item.name,
				episodeCount: item.episodes.length
			};
		})
	}

	podcastStatus(o: ORMPodcast): PodcastUpdateStatus {
		return this.podcastService.isDownloading(o.id) ? {status: PodcastStatus.downloading} : {status: o.status, error: o.errorMessage, lastCheck: o.lastCheck};
	}


	async folderBase(o: ORMFolder, folderArgs: IncludesFolderArgs, user: User): Promise<FolderBase> {
		await this.populate(o, {
			'tracks': folderArgs.folderIncTrackIDs || folderArgs.folderIncTrackCount,
			'children': folderArgs.folderIncFolderIDs || folderArgs.folderIncChildFolderCount,
			'artworks': folderArgs.folderIncArtworkIDs || folderArgs.folderIncArtworkCount
		});
		let info: ExtendedInfo | undefined;
		if (folderArgs.folderIncInfo) {
			info =
				o.folderType === FolderType.artist ?
					await this.metaDataService.extInfo.byFolderArtist(o) :
					await this.metaDataService.extInfo.byFolderAlbum(o);
		}
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			type: o.folderType,
			level: o.level,
			parentID: o.parent?.id,
			trackCount: folderArgs.folderIncTrackCount ? o.tracks.length : undefined,
			folderCount: folderArgs.folderIncChildFolderCount ? o.children.length : undefined,
			artworkCount: folderArgs.folderIncArtworkCount ? o.children.length : undefined,
			tag: folderArgs.folderIncTag ? this.folderTag(o) : undefined,
			parents: folderArgs.folderIncParents ? await this.folderParents(o) : undefined,
			trackIDs: folderArgs.folderIncTrackIDs ? o.tracks.getItems().map(t => t.id) : undefined,
			folderIDs: folderArgs.folderIncFolderIDs ? o.children.getItems().map(t => t.id) : undefined,
			artworkIDs: folderArgs.folderIncArtworkIDs ? o.artworks.getItems().map(t => t.id) : undefined,
			info,
			state: folderArgs.folderIncSimilar ? await this.state(o.id, DBObjectType.folder, user.id) : undefined
		};
	}

	async folder(o: ORMFolder, folderArgs: IncludesFolderArgs, folderChildrenArgs: IncludesFolderChildrenArgs, trackArgs: IncludesTrackArgs, artworkArgs: IncludesArtworkArgs, user: User): Promise<Folder> {
		await this.populate(o, {
			'tracks': folderChildrenArgs.folderIncChildren || folderChildrenArgs.folderIncTracks,
			'children': folderChildrenArgs.folderIncChildren || folderChildrenArgs.folderIncFolders,
			'artworks': folderChildrenArgs.folderIncArtworks
		});
		return {
			...(await this.folderBase(o, folderArgs, user)),
			tracks: folderChildrenArgs.folderIncChildren || folderChildrenArgs.folderIncTracks ? await Promise.all(o.tracks.getItems().map(t => this.trackBase(t, trackArgs, user))) : undefined,
			folders: folderChildrenArgs.folderIncChildren || folderChildrenArgs.folderIncFolders ? await Promise.all(o.children.getItems().map(t => this.folderBase(t, folderArgs, user))) : undefined,
			artworks: folderChildrenArgs.folderIncArtworks ? await Promise.all(o.artworks.getItems().map(t => this.artworkBase(t, artworkArgs, user))) : undefined
		};
	}

	async folderIndex(result: IndexResult<IndexResultGroup<ORMFolder>>): Promise<FolderIndex> {
		return this.index(result, async (item) => {
			await this.orm.Folder.populate(item, ['tracks']);
			return {
				id: item.id,
				name: item.name,
				trackCount: item.tracks.length
			};
		})
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
		}
	}

	async folderParents(o: ORMFolder): Promise<Array<FolderParent>> {
		const result: Array<FolderParent> = [];
		let parent: ORMFolder | undefined = o;
		while (parent) {
			await this.orm.Folder.populate(parent, 'parent');
			parent = parent.parent;
			if (parent) {
				result.unshift({id: parent.id, name: parent.name});
			}
		}
		return result;
	}


	async seriesBase(o: ORMSeries, seriesArgs: IncludesSeriesArgs, user: User): Promise<SeriesBase> {
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			artist: o.artist.name,
			artistID: o.artist.id,
			albumTypes: o.albumTypes,
			albumCount: seriesArgs.seriesIncAlbumCount ? o.albums.length : undefined,
			trackCount: seriesArgs.seriesIncTrackCount ? o.tracks.length : undefined,
			trackIDs: seriesArgs.seriesIncTrackIDs ? (await o.tracks.getItems()).map(t => t.id) : undefined,
			albumIDs: seriesArgs.seriesIncAlbumIDs ? (await o.albums.getItems()).map(a => a.id) : undefined,
			info: seriesArgs.seriesIncInfo ? await this.metaDataService.extInfo.bySeries(o) : undefined,
			state: seriesArgs.seriesIncState ? await this.state(o.id, DBObjectType.series, user.id) : undefined
		}
	}

	async series(o: ORMSeries, seriesArgs: IncludesSeriesArgs, seriesChildrenArgs: IncludesSeriesChildrenArgs, albumArgs: IncludesAlbumArgs, trackArgs: IncludesTrackArgs, user: User): Promise<Series> {
		return {
			...(await this.seriesBase(o, seriesArgs, user)),
			tracks: seriesChildrenArgs.seriesIncTracks ? await Promise.all(o.tracks.getItems().map(t => this.trackBase(t, trackArgs, user))) : undefined,
			albums: seriesChildrenArgs.seriesIncAlbums ? await Promise.all(o.albums.getItems().map(t => this.albumBase(t, albumArgs, user))) : undefined
		}
	}

	async transformSeriesIndex(result: IndexResult<IndexResultGroup<ORMSeries>>): Promise<SeriesIndex> {
		return this.index(result, async (item) => {
			await this.orm.Series.populate(item, ['tracks', 'albums']);
			return {
				id: item.id,
				name: item.name,
				albumCount: item.albums.length,
				trackCount: item.tracks.length
			};
		});
	}


	async artistBase(o: ORMArtist, artistArgs: IncludesArtistArgs, user: User): Promise<ArtistBase> {
		await this.populate(o, {
			'tracks': artistArgs.artistIncTrackIDs || artistArgs.artistIncTrackCount,
			'albums': artistArgs.artistIncAlbumIDs || artistArgs.artistIncAlbumCount,
			'series': artistArgs.artistIncSeriesIDs || artistArgs.artistIncSeriesCount
		});
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			albumCount: artistArgs.artistIncAlbumCount ? o.albums.length : undefined,
			trackCount: artistArgs.artistIncTrackCount ? o.tracks.length : undefined,
			seriesCount: artistArgs.artistIncSeriesCount ? o.series.length : undefined,
			mbArtistID: o.mbArtistID,
			genres: o.genres,
			albumTypes: o.albumTypes,
			state: artistArgs.artistIncState ? await this.state(o.id, DBObjectType.artist, user.id) : undefined,
			trackIDs: artistArgs.artistIncTrackIDs ? o.tracks.getItems().map(t => t.id) : undefined,
			albumIDs: artistArgs.artistIncAlbumIDs ? o.albums.getItems().map(a => a.id) : undefined,
			seriesIDs: artistArgs.artistIncSeriesIDs ? o.series.getItems().map(s => s.id) : undefined,
			info: artistArgs.artistIncInfo ? await this.metaDataService.extInfo.byArtist(o) : undefined
		};
	}

	async artist(o: ORMArtist, artistArgs: IncludesArtistArgs, artistChildrenArgs: IncludesArtistChildrenArgs, trackArgs: IncludesTrackArgs, albumArgs: IncludesAlbumArgs, seriesArgs: IncludesSeriesArgs, user: User): Promise<Artist> {
		await this.populate(o, {
			'tracks': artistChildrenArgs.artistIncTracks,
			'albums': artistChildrenArgs.artistIncAlbums,
			'series': artistChildrenArgs.artistIncSeries
		});
		return {
			...(await this.artistBase(o, artistArgs, user)),
			tracks: artistChildrenArgs.artistIncTracks ? await Promise.all(o.tracks.getItems().map(t => this.trackBase(t, trackArgs, user))) : undefined,
			albums: artistChildrenArgs.artistIncAlbums ? await Promise.all(o.albums.getItems().map(t => this.albumBase(t, albumArgs, user))) : undefined,
			series: artistChildrenArgs.artistIncSeries ? await Promise.all(o.series.getItems().map(t => this.seriesBase(t, seriesArgs, user))) : undefined
		};
	}

	async artistIndex(result: IndexResult<IndexResultGroup<ORMArtist>>): Promise<ArtistIndex> {
		return this.index(result, async (item) => {
			await this.orm.Artist.populate(item, ['tracks', 'albums']);
			return {
				id: item.id,
				name: item.name,
				albumCount: item.albums.length,
				trackCount: item.tracks.length
			};
		})
	}


	async albumBase(o: ORMAlbum, albumArgs: IncludesAlbumArgs, user: User): Promise<Album> {
		await this.populate(o, {
			'tracks': albumArgs.albumIncTrackCount || albumArgs.albumIncTrackIDs,
			'artist': true,
			'series': true
		});
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
			artistID: o.artist.id,
			artistName: o.artist.name,
			series: o.series?.name,
			seriesID: o.series?.id,
			state: albumArgs.albumIncState ? await this.state(o.id, DBObjectType.album, user.id) : undefined,
			trackCount: albumArgs.albumIncTrackCount ? o.tracks.length : undefined,
			trackIDs: albumArgs.albumIncTrackIDs ? (await o.tracks.getItems()).map(t => t.id) : undefined,
			info: albumArgs.albumIncInfo ? await this.metaDataService.extInfo.byAlbum(o) : undefined
		};
	}

	async album(o: ORMAlbum, albumArgs: IncludesAlbumArgs, albumChildrenArgs: IncludesAlbumChildrenArgs, trackArgs: IncludesTrackArgs, artistIncludes: IncludesArtistArgs, user: User): Promise<Album> {
		await this.populate(o, {
			'tracks': albumChildrenArgs.albumIncTracks,
			'artist': albumChildrenArgs.albumIncArtist
		});
		const tracks = albumChildrenArgs.albumIncTracks ? await Promise.all(o.tracks.getItems().map(t => this.trackBase(t, trackArgs, user))) : undefined
		const artist = albumChildrenArgs.albumIncArtist ? await this.artistBase(o.artist, artistIncludes, user) : undefined;
		return {
			...(await this.albumBase(o, albumArgs, user)),
			tracks,
			artist
		}
	}

	async albumIndex(result: IndexResult<IndexResultGroup<ORMAlbum>>): Promise<AlbumIndex> {
		return this.index(result, async (item) => {
			await this.orm.Album.populate(item, ['tracks', 'artist']);
			return {
				id: item.id,
				name: item.name,
				artist: item.artist?.name,
				artistID: item.artist?.id,
				trackCount: item.tracks.length
			};
		})
	}


	async artworkBase(o: ORMArtwork, artworksArgs: IncludesArtworkArgs, user: User): Promise<ArtworkBase> {
		return {
			id: o.id,
			name: o.name,
			types: o.types,
			height: o.height,
			width: o.width,
			format: o.format,
			created: o.createdAt.valueOf(),
			state: artworksArgs.artworkIncState ? await this.state(o.id, DBObjectType.artwork, user.id) : undefined,
			size: o.fileSize
		};
	}

	async artwork(o: ORMArtwork, artworksArgs: IncludesArtworkArgs, artworkChildrenArgs: IncludesArtworkChildrenArgs, folderArgs: IncludesFolderArgs, user: User): Promise<Artwork> {
		return {
			...(await this.artworkBase(o, artworksArgs, user)),
			folder: artworkChildrenArgs.artworkIncFolder ? await this.folderBase(o.folder, folderArgs, user) : undefined
		};
	}


	async stateBase(o: ORMState): Promise<State> {
		return {
			played: o.played,
			lastPlayed: o.lastPlayed ? o.lastPlayed.valueOf() : undefined,
			faved: o.faved,
			rated: o.rated
		}
	}

	async state(id: string, type: DBObjectType, userID: string): Promise<State> {
		const state = await this.orm.State.findOrCreate(id, type, userID);
		return this.stateBase(state);
	}


	async bookmarkBase(o: ORMBookmark): Promise<BookmarkBase> {
		return {
			id: o.id,
			trackID: o.track?.id,
			episodeID: o.episode?.id,
			position: o.position,
			comment: o.comment,
			created: o.createdAt.valueOf(),
			changed: o.updatedAt.valueOf()
		};
	}

	async bookmark(o: ORMBookmark, bookmarkArgs: IncludesBookmarkChildrenArgs, trackArgs: IncludesTrackArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<Bookmark> {
		return {
			...(await this.bookmarkBase(o)),
			track: bookmarkArgs.bookmarkIncTrack && o.track ? await this.trackBase(o.track, trackArgs, user) : undefined,
			episode: bookmarkArgs.bookmarkIncTrack && o.episode ? await this.episodeBase(o.episode, episodeArgs, user) : undefined,
		};
	}


	async radio(o: ORMRadio, radioArgs: IncludesRadioArgs, user: User): Promise<Radio> {
		return {
			id: o.id,
			name: o.name,
			url: o.url,
			homepage: o.homepage,
			created: o.createdAt.valueOf(),
			changed: o.updatedAt.valueOf(),
			state: radioArgs.radioState ? await this.state(o.id, DBObjectType.radio, user.id) : undefined
		};
	}

	async radioIndex(result: IndexResult<IndexResultGroup<ORMRadio>>): Promise<RadioIndex> {
		return this.index(result, async (item) => {
			return {
				id: item.id,
				name: item.name,
				url: item.url
			};
		});
	}

	async playlist(o: ORMPlaylist, playlistArgs: IncludesPlaylistArgs, trackArgs: IncludesTrackArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<Playlist> {
		await this.orm.Playlist.populate(o, ['entries']);
		return {
			id: o.id,
			name: o.name,
			changed: o.updatedAt.valueOf(),
			duration: o.duration,
			created: o.createdAt.valueOf(),
			isPublic: o.isPublic,
			comment: o.comment,
			userID: o.user.id,
			userName: o.user.name,
			entriesCount: o.entries.length,
			entriesIDs: playlistArgs.playlistIncEntriesIDs ? o.entries.getItems().map(t => t.track?.id || t.episode?.id) as Array<string> : undefined,
			entries: playlistArgs.playlistIncEntries ? await Promise.all(o.entries.getItems().map(t => this.playlistEntry(t, trackArgs, episodeArgs, user))) : undefined,
			state: playlistArgs.playlistIncState ? await this.state(o.id, DBObjectType.playlist, user.id) : undefined
		}
	}

	async playlistIndex(result: IndexResult<IndexResultGroup<ORMPlaylist>>): Promise<PlaylistIndex> {
		return this.index(result, async (item) => {
			await this.orm.Playlist.populate(item, ['entries']);
			return {
				id: item.id,
				name: item.name,
				entryCount: item.entries.length
			};
		});
	}

	async playlistEntry(o: ORMPlaylistEntry, trackArgs: IncludesTrackArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<MediaBase> {
		if (o.track) {
			return await this.trackBase(o.track, trackArgs, user);
		} else if (o.episode) {
			return await this.episodeBase(o.episode, episodeArgs, user);
		}
		throw new Error('Internal: Invalid Playlist Entry')
	}


	async root(o: ORMRoot, rootArgs: IncludesRootArgs, user: User): Promise<Root> {
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


	async playQueueEntry(o: ORMPlayQueueEntry, trackArgs: IncludesTrackArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<MediaBase> {
		if (o.track) {
			return await this.trackBase(o.track, trackArgs, user);
		} else if (o.episode) {
			return await this.episodeBase(o.episode, episodeArgs, user);
		}
		throw new Error('Internal: Invalid PlayQueue Entry')
	}

	async playQueue(o: ORMPlayQueue, playQueueArgs: IncludesPlayQueueArgs, trackArgs: IncludesTrackArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<PlayQueue> {
		return {
			changed: o.updatedAt.valueOf(),
			changedBy: o.changedBy,
			created: o.createdAt.valueOf(),
			currentIndex: o.current,
			mediaPosition: o.position,
			userID: o.user.id,
			userName: o.user.name,
			entriesCount: o.entries.length,
			entriesIDs: playQueueArgs.playQueueEntriesIDs ? o.entries.getItems().map(t => t.track?.id || t.episode?.id) as Array<string> : undefined,
			entries: playQueueArgs.playQueueEntries ? await Promise.all(o.entries.getItems().map(t => this.playQueueEntry(t, trackArgs, episodeArgs, user))) : undefined
		}
	}


	async mediaRawTag(filename: string): Promise<any> {
		return this.audioModule.readRawTag(filename)
	}

	async mediaTag(o?: ORMTag): Promise<MediaTag> {
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
		}
	}


	async nowPlaying(o: ORMNowPlaying, nowPlayingArgs: IncludesNowPlayingArgs, trackArgs: IncludesTrackArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<NowPlaying> {
		return {
			userName: o.user.name,
			userID: o.user.id,
			minutesAgo: Math.round(moment.duration(moment().diff(moment(o.time))).asMinutes()),
			trackID: nowPlayingArgs.nowPlayingIncTrackIDs ? o.track?.id : undefined,
			track: nowPlayingArgs.nowPlayingIncTracks && o.track ? (await this.trackBase(o.track, trackArgs, user)) : undefined,
			episodeID: nowPlayingArgs.nowPlayingIncEpisodeIDs ? o.episode?.id : undefined,
			episode: nowPlayingArgs.nowPlayingIncEpisodes && o.episode ? (await this.episodeBase(o.episode, episodeArgs, user)) : undefined
		};
	}

	async user(o: ORMUser, userArgs: IncludesUserArgs, currentUser: User): Promise<RESTUser> {
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			email: o.email,
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
			return {...c, created: c.created.valueOf()}
		});
	}

	userSession(o: ORMSession): UserSession {
		const ua = parseAgent(o);
		return {
			id: o.id,
			client: o.client,
			expires: o.expires,
			mode: o.mode,
			platform: ua?.platform,
			os: ua?.os,
			agent: o.agent
		};
	}


	private async populate(items: Base | Array<Base>, fields: { [name: string]: boolean | undefined }): Promise<void> {
		const keys = Object.keys(fields);
		const pop: Array<string> = keys.map(key => (fields[key] ? key : undefined) as string).filter(d => !!d);
		if (pop.length > 0) {
			await this.orm.orm.em.populate(items, pop);
		}
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
				}
			}))
		};
	}

}
