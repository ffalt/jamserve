import moment from 'moment';
import { Track as ORMTrack } from '../../../entity/track/track.js';
import { Track } from '../../../entity/track/track.model.js';
import { Podcast as ORMPodcast } from '../../../entity/podcast/podcast.js';
import { Artwork as ORMArtwork } from '../../../entity/artwork/artwork.js';
import { PlaylistEntry as ORMPlaylistEntry } from '../../../entity/playlistentry/playlist-entry.js';
import { Episode as ORMEpisode } from '../../../entity/episode/episode.js';
import { PlayQueue as ORMPlayQueue } from '../../../entity/playqueue/playqueue.js';
import { PlayQueueEntry as ORMPlayQueueEntry } from '../../../entity/playqueueentry/playqueue-entry.js';
import { Folder as ORMFolder } from '../../../entity/folder/folder.js';
import { Artist as ORMArtist } from '../../../entity/artist/artist.js';
import { User } from '../../../entity/user/user.js';
import { Series as ORMSeries } from '../../../entity/series/series.js';
import { Bookmark as ORMBookmark } from '../../../entity/bookmark/bookmark.js';
import { Playlist as ORMPlaylist } from '../../../entity/playlist/playlist.js';
import { Series } from '../../../entity/series/series.model.js';
import { Artist } from '../../../entity/artist/artist.model.js';
import { Album as ORMAlbum } from '../../../entity/album/album.js';
import { Album } from '../../../entity/album/album.model.js';
import { Orm } from './orm.service.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { MediaBase } from '../../../entity/tag/tag.model.js';
import { Folder } from '../../../entity/folder/folder.model.js';
import { Artwork } from '../../../entity/artwork/artwork.model.js';
import { Episode, EpisodeBase } from '../../../entity/episode/episode.model.js';
import { Podcast } from '../../../entity/podcast/podcast.model.js';
import { Bookmark } from '../../../entity/bookmark/bookmark.model.js';
import { Playlist } from '../../../entity/playlist/playlist.model.js';
import { PlayQueue } from '../../../entity/playqueue/playqueue.model.js';
import { NowPlaying as ORMNowPlaying } from '../../../entity/nowplaying/nowplaying.js';
import { NowPlaying } from '../../../entity/nowplaying/nowplaying.model.js';
import { IncludesAlbumParameters, IncludesAlbumChildrenParameters } from '../../../entity/album/album.parameters.js';
import { IncludesSeriesParameters, IncludesSeriesChildrenParameters } from '../../../entity/series/series.parameters.js';
import { IncludesNowPlayingParameters } from '../../../entity/nowplaying/nowplaying.parameters.js';
import { IncludesTrackParameters } from '../../../entity/track/track.parameters.js';
import { IncludesArtistParameters, IncludesArtistChildrenParameters } from '../../../entity/artist/artist.parameters.js';
import { IncludesBookmarkChildrenParameters } from '../../../entity/bookmark/bookmark.parameters.js';
import { IncludesPlayQueueParameters } from '../../../entity/playqueue/playqueue.parameters.js';
import { IncludesPlaylistParameters } from '../../../entity/playlist/playlist.parameters.js';
import { IncludesFolderParameters, IncludesFolderChildrenParameters } from '../../../entity/folder/folder.parameters.js';
import { IncludesPodcastParameters, IncludesPodcastChildrenParameters } from '../../../entity/podcast/podcast.parameters.js';
import { IncludesEpisodeParameters, IncludesEpisodeParentParameters } from '../../../entity/episode/episode.parameters.js';
import { IncludesArtworkParameters, IncludesArtworkChildrenParameters } from '../../../entity/artwork/artwork.parameters.js';
import { ChatTransformService } from '../../../entity/chat/chat.transform.js';
import { GenreTransformService } from '../../../entity/genre/genre.transform.js';
import { RadioTransformService } from '../../../entity/radio/radio.transform.js';
import { RootTransformService } from '../../../entity/root/root.transform.js';
import { PodcastTransformService } from '../../../entity/podcast/podcast.transform.js';
import { EpisodeTransformService } from '../../../entity/episode/episode.transform.js';
import { FolderTransformService } from '../../../entity/folder/folder.transform.js';
import { TrackTransformService } from '../../../entity/track/track.transform.js';
import { SeriesTransformService } from '../../../entity/series/series.transform.js';
import { ArtistTransformService } from '../../../entity/artist/artist.transform.js';
import { AlbumTransformService } from '../../../entity/album/album.transform.js';
import { ArtworkTransformService } from '../../../entity/artwork/artwork.transform.js';
import { PlaylistTransformService } from '../../../entity/playlist/playlist.transform.js';
import { BookmarkTransformService } from '../../../entity/bookmark/bookmark.transform.js';
import { PlayQueueTransformService } from '../../../entity/playqueue/playqueue.transform.js';
import { BaseTransformService } from '../../../entity/base/base.transform.js';
import { SessionTransformService } from '../../../entity/session/session.transform.js';
import { UserTransformService } from '../../../entity/user/user.transform.js';

@InRequestScope
export class TransformService {
	@Inject readonly Base!: BaseTransformService;
	@Inject readonly Chat!: ChatTransformService;
	@Inject readonly Genre!: GenreTransformService;
	@Inject readonly Radio!: RadioTransformService;
	@Inject readonly Root!: RootTransformService;
	@Inject readonly Podcast!: PodcastTransformService;
	@Inject readonly Episode!: EpisodeTransformService;
	@Inject readonly Folder!: FolderTransformService;
	@Inject readonly Track!: TrackTransformService;
	@Inject readonly Series!: SeriesTransformService;
	@Inject readonly Artist!: ArtistTransformService;
	@Inject readonly Album!: AlbumTransformService;
	@Inject readonly Artwork!: ArtworkTransformService;
	@Inject readonly Playlist!: PlaylistTransformService;
	@Inject readonly Bookmark!: BookmarkTransformService;
	@Inject readonly PlayQueue!: PlayQueueTransformService;
	@Inject readonly Session!: SessionTransformService;
	@Inject readonly User!: UserTransformService;

	async album(orm: Orm, o: ORMAlbum, albumParameters: IncludesAlbumParameters, albumChildrenParameters: IncludesAlbumChildrenParameters, trackParameters: IncludesTrackParameters, artistIncludes: IncludesArtistParameters, user: User): Promise<Album> {
		return {
			...(await this.Album.albumBase(orm, o, albumParameters, user)),
			tracks: albumChildrenParameters.albumIncTracks ? await this.Track.trackBases(orm, await o.tracks.getItems(), trackParameters, user) : undefined,
			artist: albumChildrenParameters.albumIncArtist ? await this.Artist.artistBase(orm, await o.artist.getOrFail(), artistIncludes, user) : undefined
		};
	}

	async artist(orm: Orm, o: ORMArtist, artistParameters: IncludesArtistParameters, artistChildrenParameters: IncludesArtistChildrenParameters, trackParameters: IncludesTrackParameters, albumParameters: IncludesAlbumParameters, seriesParameters: IncludesSeriesParameters, user: User): Promise<Artist> {
		return {
			...(await this.Artist.artistBase(orm, o, artistParameters, user)),
			tracks: artistChildrenParameters.artistIncTracks ? await this.Track.trackBases(orm, await o.tracks.getItems(), trackParameters, user) : undefined,
			albums: artistChildrenParameters.artistIncAlbums ? await this.Album.albumBases(orm, await o.albums.getItems(), albumParameters, user) : undefined,
			series: artistChildrenParameters.artistIncSeries ? await this.Series.seriesBases(orm, await o.series.getItems(), seriesParameters, user) : undefined
		};
	}

	async artwork(orm: Orm, o: ORMArtwork, artworksParameters: IncludesArtworkParameters, artworkChildrenParameters: IncludesArtworkChildrenParameters, folderParameters: IncludesFolderParameters, user: User): Promise<Artwork> {
		return {
			...(await this.Artwork.artworkBase(orm, o, artworksParameters, user)),
			folder: artworkChildrenParameters.artworkIncFolder ? await this.Folder.folderBase(orm, await o.folder.getOrFail(), folderParameters, user) : undefined
		};
	}

	async bookmark(orm: Orm, o: ORMBookmark, bookmarkParameters: IncludesBookmarkChildrenParameters, trackParameters: IncludesTrackParameters, episodeParameters: IncludesEpisodeParameters, user: User): Promise<Bookmark> {
		return {
			...(await this.Bookmark.bookmarkBase(orm, o)),
			track: bookmarkParameters.bookmarkIncTrack && o.track.id() ? await this.Track.trackBase(orm, await o.track.getOrFail(), trackParameters, user) : undefined,
			episode: bookmarkParameters.bookmarkIncTrack && o.episode.id() ? await this.Episode.episodeBase(orm, await o.episode.getOrFail(), episodeParameters, user) : undefined
		};
	}

	async episode(orm: Orm, o: ORMEpisode, episodeParameters: IncludesEpisodeParameters, episodeParentParameters: IncludesEpisodeParentParameters, podcastParameters: IncludesPodcastParameters, user: User): Promise<Episode> {
		return {
			...(await this.Episode.episodeBase(orm, o, episodeParameters, user)),
			podcast: episodeParentParameters.episodeIncParent ? await this.Podcast.podcastBase(orm, await o.podcast.getOrFail(), podcastParameters, user) : undefined
		};
	}

	async folder(orm: Orm, o: ORMFolder, folderParameters: IncludesFolderParameters, folderChildrenParameters: IncludesFolderChildrenParameters, trackParameters: IncludesTrackParameters, artworkParameters: IncludesArtworkParameters, user: User): Promise<Folder> {
		return {
			...(await this.Folder.folderBase(orm, o, folderParameters, user)),
			tracks: folderChildrenParameters.folderIncChildren || folderChildrenParameters.folderIncTracks ?
				await this.Track.trackBases(orm, await o.tracks.getItems(), trackParameters, user) :
				undefined,
			folders: folderChildrenParameters.folderIncChildren || folderChildrenParameters.folderIncFolders ?
				await this.Folder.folderChildren(orm, o, folderChildrenParameters, user) :
				undefined,
			artworks: folderChildrenParameters.folderIncArtworks ?
				await this.Artwork.artworkBases(orm, await o.artworks.getItems(), artworkParameters, user) :
				undefined
		};
	}

	async playlist(orm: Orm, o: ORMPlaylist, playlistParameters: IncludesPlaylistParameters, trackParameters: IncludesTrackParameters, episodeParameters: IncludesEpisodeParameters, user: User): Promise<Playlist> {
		const entries = playlistParameters.playlistIncEntriesIDs || playlistParameters.playlistIncEntries ? await o.entries.getItems() : [];
		return {
			...(await this.Playlist.playlistBase(orm, o, playlistParameters, user)),
			entries: playlistParameters.playlistIncEntries ? await Promise.all(entries.map(t => this.playlistEntry(orm, t, trackParameters, episodeParameters, user))) : undefined
		};
	}

	async playlistEntry(orm: Orm, o: ORMPlaylistEntry, trackParameters: IncludesTrackParameters, episodeParameters: IncludesEpisodeParameters, user: User): Promise<MediaBase> {
		if (o.track.id()) {
			return await this.Track.trackBase(orm, await o.track.getOrFail(), trackParameters, user);
		}
		if (o.episode.id()) {
			return await this.Episode.episodeBase(orm, await o.episode.getOrFail(), episodeParameters, user);
		}
		throw new Error('Internal: Invalid Playlist Entry');
	}

	async playQueue(orm: Orm, o: ORMPlayQueue, playQueueParameters: IncludesPlayQueueParameters, trackParameters: IncludesTrackParameters, episodeParameters: IncludesEpisodeParameters, user: User): Promise<PlayQueue> {
		let entries: Array<MediaBase> | undefined;
		if (playQueueParameters.playQueueEntries) {
			const items = await o.entries.getItems();
			entries = await Promise.all(items.map(t => this.playQueueEntry(orm, t, trackParameters, episodeParameters, user)));
		}
		return {
			...(await this.PlayQueue.playQueueBase(orm, o, playQueueParameters, user)),
			entries
		};
	}

	async playQueueEntry(orm: Orm, o: ORMPlayQueueEntry, trackParameters: IncludesTrackParameters, episodeParameters: IncludesEpisodeParameters, user: User): Promise<MediaBase> {
		if (o.track.id()) {
			return await this.Track.trackBase(orm, await o.track.getOrFail(), trackParameters, user);
		}
		if (o.episode.id()) {
			return await this.Episode.episodeBase(orm, await o.episode.getOrFail(), episodeParameters, user);
		}
		throw new Error('Internal: Invalid PlayQueue Entry');
	}

	async podcast(orm: Orm, o: ORMPodcast, podcastParameters: IncludesPodcastParameters, podcastChildrenParameters: IncludesPodcastChildrenParameters, episodeParameters: IncludesEpisodeParameters, user: User): Promise<Podcast> {
		let episodes: Array<EpisodeBase> | undefined;
		if (podcastChildrenParameters.podcastIncEpisodes) {
			const items = await o.episodes.getItems();
			episodes = await Promise.all(items.map(t => this.Episode.episodeBase(orm, t, episodeParameters, user)));
		}
		return {
			...(await this.Podcast.podcastBase(orm, o, podcastParameters, user)),
			episodes
		};
	}

	async nowPlaying(orm: Orm, o: ORMNowPlaying, nowPlayingParameters: IncludesNowPlayingParameters, trackParameters: IncludesTrackParameters, episodeParameters: IncludesEpisodeParameters, user: User): Promise<NowPlaying> {
		return {
			userName: o.user.name,
			userID: o.user.id,
			minutesAgo: Math.round(moment.duration(moment().diff(moment(o.time))).asMinutes()),
			trackID: nowPlayingParameters.nowPlayingIncTrackIDs ? o.track?.id : undefined,
			track: nowPlayingParameters.nowPlayingIncTracks && o.track ? (await this.Track.trackBase(orm, o.track, trackParameters, user)) : undefined,
			episodeID: nowPlayingParameters.nowPlayingIncEpisodeIDs ? o.episode?.id : undefined,
			episode: nowPlayingParameters.nowPlayingIncEpisodes && o.episode ? (await this.Episode.episodeBase(orm, o.episode, episodeParameters, user)) : undefined
		};
	}

	async series(orm: Orm, o: ORMSeries, seriesParameters: IncludesSeriesParameters, seriesChildrenParameters: IncludesSeriesChildrenParameters, albumParameters: IncludesAlbumParameters, trackParameters: IncludesTrackParameters, user: User): Promise<Series> {
		return {
			...(await this.Series.seriesBase(orm, o, seriesParameters, user)),
			tracks: seriesChildrenParameters.seriesIncTracks ? await this.Track.trackBases(orm, await o.tracks.getItems(), trackParameters, user) : undefined,
			albums: seriesChildrenParameters.seriesIncAlbums ? await this.Album.albumBases(orm, await o.albums.getItems(), albumParameters, user) : undefined
		};
	}

	async track(orm: Orm, o: ORMTrack, trackParameters: IncludesTrackParameters, user: User): Promise<Track> {
		return this.Track.trackBase(orm, o, trackParameters, user);
	}
}
