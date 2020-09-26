import moment from 'moment';
import {Track as ORMTrack} from '../../../entity/track/track';
import {Track} from '../../../entity/track/track.model';
import {Podcast as ORMPodcast} from '../../../entity/podcast/podcast';
import {Artwork as ORMArtwork} from '../../../entity/artwork/artwork';
import {PlaylistEntry as ORMPlaylistEntry} from '../../../entity/playlistentry/playlist-entry';
import {Episode as ORMEpisode} from '../../../entity/episode/episode';
import {PlayQueue as ORMPlayQueue} from '../../../entity/playqueue/playqueue';
import {PlayQueueEntry as ORMPlayQueueEntry} from '../../../entity/playqueueentry/playqueue-entry';
import {Folder as ORMFolder} from '../../../entity/folder/folder';
import {Artist as ORMArtist} from '../../../entity/artist/artist';
import {User} from '../../../entity/user/user';
import {Series as ORMSeries} from '../../../entity/series/series';
import {Bookmark as ORMBookmark} from '../../../entity/bookmark/bookmark';
import {Playlist as ORMPlaylist} from '../../../entity/playlist/playlist';
import {Series} from '../../../entity/series/series.model';
import {Artist} from '../../../entity/artist/artist.model';
import {Album as ORMAlbum} from '../../../entity/album/album';
import {Album} from '../../../entity/album/album.model';
import {Orm} from './orm.service';
import {Inject, InRequestScope} from 'typescript-ioc';
import {MediaBase} from '../../../entity/tag/tag.model';
import {Folder} from '../../../entity/folder/folder.model';
import {Artwork} from '../../../entity/artwork/artwork.model';
import {Episode} from '../../../entity/episode/episode.model';
import {Podcast} from '../../../entity/podcast/podcast.model';
import {Bookmark} from '../../../entity/bookmark/bookmark.model';
import {Playlist} from '../../../entity/playlist/playlist.model';
import {PlayQueue} from '../../../entity/playqueue/playqueue.model';
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
import {IncludesPodcastArgs, IncludesPodcastChildrenArgs} from '../../../entity/podcast/podcast.args';
import {IncludesEpisodeArgs, IncludesEpisodeParentArgs} from '../../../entity/episode/episode.args';
import {IncludesArtworkArgs, IncludesArtworkChildrenArgs} from '../../../entity/artwork/artwork.args';
import {ChatTransformService} from '../../../entity/chat/chat.transform';
import {GenreTransformService} from '../../../entity/genre/genre.transform';
import {RadioTransformService} from '../../../entity/radio/radio.transform';
import {RootTransformService} from '../../../entity/root/root.transform';
import {PodcastTransformService} from '../../../entity/podcast/podcast.transform';
import {EpisodeTransformService} from '../../../entity/episode/episode.transform';
import {FolderTransformService} from '../../../entity/folder/folder.transform';
import {TrackTransformService} from '../../../entity/track/track.transform';
import {SeriesTransformService} from '../../../entity/series/series.transform';
import {ArtistTransformService} from '../../../entity/artist/artist.transform';
import {AlbumTransformService} from '../../../entity/album/album.transform';
import {ArtworkTransformService} from '../../../entity/artwork/artwork.transform';
import {PlaylistTransformService} from '../../../entity/playlist/playlist.transform';
import {BookmarkTransformService} from '../../../entity/bookmark/bookmark.transform';
import {PlayQueueTransformService} from '../../../entity/playqueue/playqueue.transform';
import {BaseTransformService} from '../../../entity/base/base.transform';
import {SessionTransformService} from '../../../entity/session/session.transform';
import {UserTransformService} from '../../../entity/user/user.transform';

@InRequestScope
export class TransformService {
	@Inject Base!: BaseTransformService;
	@Inject Chat!: ChatTransformService;
	@Inject Genre!: GenreTransformService;
	@Inject Radio!: RadioTransformService;
	@Inject Root!: RootTransformService;
	@Inject Podcast!: PodcastTransformService;
	@Inject Episode!: EpisodeTransformService;
	@Inject Folder!: FolderTransformService;
	@Inject Track!: TrackTransformService;
	@Inject Series!: SeriesTransformService;
	@Inject Artist!: ArtistTransformService;
	@Inject Album!: AlbumTransformService;
	@Inject Artwork!: ArtworkTransformService;
	@Inject Playlist!: PlaylistTransformService;
	@Inject Bookmark!: BookmarkTransformService;
	@Inject PlayQueue!: PlayQueueTransformService;
	@Inject Session!: SessionTransformService;
	@Inject User!: UserTransformService;

	async album(orm: Orm, o: ORMAlbum, albumArgs: IncludesAlbumArgs, albumChildrenArgs: IncludesAlbumChildrenArgs, trackArgs: IncludesTrackArgs, artistIncludes: IncludesArtistArgs, user: User): Promise<Album> {
		return {
			...(await this.Album.albumBase(orm, o, albumArgs, user)),
			tracks: albumChildrenArgs.albumIncTracks ? await this.Track.trackBases(orm, await o.tracks.getItems(), trackArgs, user) : undefined,
			artist: albumChildrenArgs.albumIncArtist ? await this.Artist.artistBase(orm, await o.artist.getOrFail(), artistIncludes, user) : undefined
		};
	}

	async artist(orm: Orm, o: ORMArtist, artistArgs: IncludesArtistArgs, artistChildrenArgs: IncludesArtistChildrenArgs, trackArgs: IncludesTrackArgs, albumArgs: IncludesAlbumArgs, seriesArgs: IncludesSeriesArgs, user: User): Promise<Artist> {
		return {
			...(await this.Artist.artistBase(orm, o, artistArgs, user)),
			tracks: artistChildrenArgs.artistIncTracks ? await this.Track.trackBases(orm, await o.tracks.getItems(), trackArgs, user) : undefined,
			albums: artistChildrenArgs.artistIncAlbums ? await this.Album.albumBases(orm, await o.albums.getItems(), albumArgs, user) : undefined,
			series: artistChildrenArgs.artistIncSeries ? await this.Series.seriesBases(orm, await o.series.getItems(), seriesArgs, user) : undefined
		};
	}

	async artwork(orm: Orm, o: ORMArtwork, artworksArgs: IncludesArtworkArgs, artworkChildrenArgs: IncludesArtworkChildrenArgs, folderArgs: IncludesFolderArgs, user: User): Promise<Artwork> {
		return {
			...(await this.Artwork.artworkBase(orm, o, artworksArgs, user)),
			folder: artworkChildrenArgs.artworkIncFolder ? await this.Folder.folderBase(orm, await o.folder.getOrFail(), folderArgs, user) : undefined
		};
	}

	async bookmark(orm: Orm, o: ORMBookmark, bookmarkArgs: IncludesBookmarkChildrenArgs, trackArgs: IncludesTrackArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<Bookmark> {
		return {
			...(await this.Bookmark.bookmarkBase(orm, o)),
			track: bookmarkArgs.bookmarkIncTrack && o.track.id() ? await this.Track.trackBase(orm, await o.track.getOrFail(), trackArgs, user) : undefined,
			episode: bookmarkArgs.bookmarkIncTrack && o.episode.id() ? await this.Episode.episodeBase(orm, await o.episode.getOrFail(), episodeArgs, user) : undefined,
		};
	}

	async episode(orm: Orm, o: ORMEpisode, episodeArgs: IncludesEpisodeArgs, episodeParentArgs: IncludesEpisodeParentArgs, podcastArgs: IncludesPodcastArgs, user: User): Promise<Episode> {
		return {
			...(await this.Episode.episodeBase(orm, o, episodeArgs, user)),
			podcast: episodeParentArgs.episodeIncParent ? await this.Podcast.podcastBase(orm, await o.podcast.getOrFail(), podcastArgs, user) : undefined
		};
	}

	async folder(orm: Orm, o: ORMFolder, folderArgs: IncludesFolderArgs, folderChildrenArgs: IncludesFolderChildrenArgs, trackArgs: IncludesTrackArgs, artworkArgs: IncludesArtworkArgs, user: User): Promise<Folder> {
		return {
			...(await this.Folder.folderBase(orm, o, folderArgs, user)),
			tracks: folderChildrenArgs.folderIncChildren || folderChildrenArgs.folderIncTracks ?
				await this.Track.trackBases(orm, await o.tracks.getItems(), trackArgs, user) :
				undefined,
			folders: folderChildrenArgs.folderIncChildren || folderChildrenArgs.folderIncFolders ?
				await this.Folder.folderChildren(orm, o, folderChildrenArgs, user)
				: undefined,
			artworks: folderChildrenArgs.folderIncArtworks ?
				await this.Artwork.artworkBases(orm, await o.artworks.getItems(), artworkArgs, user) :
				undefined
		};
	}

	async playlist(orm: Orm, o: ORMPlaylist, playlistArgs: IncludesPlaylistArgs, trackArgs: IncludesTrackArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<Playlist> {
		const entries = playlistArgs.playlistIncEntriesIDs || playlistArgs.playlistIncEntries ? await o.entries.getItems() : [];
		return {
			...(await this.Playlist.playlistBase(orm, o, playlistArgs, user)),
			entries: playlistArgs.playlistIncEntries ? await Promise.all(entries.map(t => this.playlistEntry(orm, t, trackArgs, episodeArgs, user))) : undefined
		};
	}

	async playlistEntry(orm: Orm, o: ORMPlaylistEntry, trackArgs: IncludesTrackArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<MediaBase> {
		if (o.track.id()) {
			return await this.Track.trackBase(orm, await o.track.getOrFail(), trackArgs, user);
		}
		if (o.episode.id()) {
			return await this.Episode.episodeBase(orm, await o.episode.getOrFail(), episodeArgs, user);
		}
		throw new Error('Internal: Invalid Playlist Entry');
	}

	async playQueue(orm: Orm, o: ORMPlayQueue, playQueueArgs: IncludesPlayQueueArgs, trackArgs: IncludesTrackArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<PlayQueue> {
		return {
			...(await this.PlayQueue.playQueueBase(orm, o, playQueueArgs, user)),
			entries: playQueueArgs.playQueueEntries ? await Promise.all((await o.entries.getItems()).map(t => this.playQueueEntry(orm, t, trackArgs, episodeArgs, user))) : undefined
		};
	}

	async playQueueEntry(orm: Orm, o: ORMPlayQueueEntry, trackArgs: IncludesTrackArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<MediaBase> {
		if (o.track.id()) {
			return await this.Track.trackBase(orm, await o.track.getOrFail(), trackArgs, user);
		}
		if (o.episode.id()) {
			return await this.Episode.episodeBase(orm, await o.episode.getOrFail(), episodeArgs, user);
		}
		throw new Error('Internal: Invalid PlayQueue Entry');
	}

	async podcast(orm: Orm, o: ORMPodcast, podcastArgs: IncludesPodcastArgs, podcastChildrenArgs: IncludesPodcastChildrenArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<Podcast> {
		return {
			...(await this.Podcast.podcastBase(orm, o, podcastArgs, user)),
			episodes: podcastChildrenArgs.podcastIncEpisodes ? await Promise.all((await o.episodes.getItems()).map(t => this.Episode.episodeBase(orm, t, episodeArgs, user))) : undefined,
		};
	}

	async nowPlaying(orm: Orm, o: ORMNowPlaying, nowPlayingArgs: IncludesNowPlayingArgs, trackArgs: IncludesTrackArgs, episodeArgs: IncludesEpisodeArgs, user: User): Promise<NowPlaying> {
		return {
			userName: o.user.name,
			userID: o.user.id,
			minutesAgo: Math.round(moment.duration(moment().diff(moment(o.time))).asMinutes()),
			trackID: nowPlayingArgs.nowPlayingIncTrackIDs ? o.track?.id : undefined,
			track: nowPlayingArgs.nowPlayingIncTracks && o.track ? (await this.Track.trackBase(orm, o.track, trackArgs, user)) : undefined,
			episodeID: nowPlayingArgs.nowPlayingIncEpisodeIDs ? o.episode?.id : undefined,
			episode: nowPlayingArgs.nowPlayingIncEpisodes && o.episode ? (await this.Episode.episodeBase(orm, o.episode, episodeArgs, user)) : undefined
		};
	}

	async series(orm: Orm, o: ORMSeries, seriesArgs: IncludesSeriesArgs, seriesChildrenArgs: IncludesSeriesChildrenArgs, albumArgs: IncludesAlbumArgs, trackArgs: IncludesTrackArgs, user: User): Promise<Series> {
		return {
			...(await this.Series.seriesBase(orm, o, seriesArgs, user)),
			tracks: seriesChildrenArgs.seriesIncTracks ? await this.Track.trackBases(orm, await o.tracks.getItems(), trackArgs, user) : undefined,
			albums: seriesChildrenArgs.seriesIncAlbums ? await this.Album.albumBases(orm, await o.albums.getItems(), albumArgs, user) : undefined
		};
	}

	async track(orm: Orm, o: ORMTrack, trackArgs: IncludesTrackArgs, user: User): Promise<Track> {
		return this.Track.trackBase(orm, o, trackArgs, user);
	}

}
