import {Engine} from '../../engine/engine';
import {Jam} from '../../model/jam-rest-data';
import {EpisodeController} from '../../objects/episode/episode.controller';
import {PodcastController} from '../../objects/podcast/podcast.controller';
import {AlbumController} from '../../objects/album/album.controller';
import {ArtistController} from '../../objects/artist/artist.controller';
import {PlaylistController} from '../../objects/playlist/playlist.controller';
import {TrackController} from '../../objects/track/track.controller';
import {FolderController} from '../../objects/folder/folder.controller';
import {RootController} from '../../objects/root/root.controller';
import {UserController} from '../../objects/user/user.controller';
import {ChatController} from '../../engine/chat/chat.controller';
import {MetadataController} from '../../objects/metadata/metadata.controller';
import {StreamController} from '../../engine/stream/stream.controller';
import {formatSessionUser} from '../../objects/user/user.format';
import {GenreController} from '../../engine/genre/genre.controller';
import {NowPlayingController} from '../../engine/nowplaying/nowplaying.controller';
import {ImageController} from '../../engine/image/image.controller';
import {DownloadController} from '../../engine/download/download.controller';
import {User} from '../../objects/user/user.model';
import {WaveformController} from '../../engine/waveform/waveform.controller';
import {AutocompleteController} from '../../engine/autocomplete/autocomplete.controller';
import {BookmarkController} from '../../objects/bookmark/bookmark.controller';
import {PlayQueueController} from '../../objects/playqueue/playqueue.controller';
import {RadioController} from '../../objects/radio/radio.controller';
import {JAMAPI_VERSION} from '../../version';
import {StatsController} from '../../engine/stats/stats.controller';
import {SettingsController} from '../../objects/settings/settings.controller';

export interface JamRequest<T> {
	query: T;
	user: User;
	client?: string;
	file?: string;
}

export class JamController {
	albumController: AlbumController;
	artistController: ArtistController;
	autocompleteController: AutocompleteController;
	bookmarkController: BookmarkController;
	chatController: ChatController;
	downloadController: DownloadController;
	episodeController: EpisodeController;
	folderController: FolderController;
	genreController: GenreController;
	imageController: ImageController;
	metadataController: MetadataController;
	nowPlayingController: NowPlayingController;
	playlistController: PlaylistController;
	playqueueController: PlayQueueController;
	podcastController: PodcastController;
	radioController: RadioController;
	settingsController: SettingsController;
	rootController: RootController;
	streamController: StreamController;
	trackController: TrackController;
	userController: UserController;
	waveformController: WaveformController;
	statsController: StatsController;

	constructor(private engine: Engine) {
		this.settingsController = new SettingsController(this.engine.settingsService);
		this.streamController = new StreamController(this.engine.streamService, this.engine.nowPlayingService, this.engine.store);
		this.chatController = new ChatController(this.engine.chatService);
		this.genreController = new GenreController(engine.genreService);
		this.statsController = new StatsController(engine.statsService);
		this.nowPlayingController = new NowPlayingController(engine.nowPlayingService);
		this.imageController = new ImageController(this.engine.store, this.engine.imageService);
		this.downloadController = new DownloadController(this.engine.store, this.engine.downloadService);
		this.waveformController = new WaveformController(this.engine.store, this.engine.waveformService);
		this.autocompleteController = new AutocompleteController(this.engine.store);
		this.radioController = new RadioController(this.engine.radioService,
			this.engine.stateService, this.engine.imageService, this.engine.downloadService);
		this.rootController = new RootController(this.engine.rootService, this.engine.ioService,
			this.engine.stateService, this.engine.imageService, this.engine.downloadService);
		this.trackController = new TrackController(this.engine.trackService, this.engine.folderService, this.engine.audioModule, this.engine.bookmarkService, this.engine.metaDataService, this.streamController, this.engine.ioService, this.engine.rootService,
			this.engine.stateService, this.engine.imageService, this.engine.downloadService);
		this.episodeController = new EpisodeController(this.engine.episodeService, this.streamController,
			this.engine.stateService, this.engine.imageService, this.engine.downloadService);
		this.podcastController = new PodcastController(this.engine.podcastService, this.episodeController,
			this.engine.stateService, this.engine.imageService, this.engine.downloadService);
		this.albumController = new AlbumController(this.engine.albumService, this.trackController, this.engine.metaDataService,
			this.engine.stateService, this.engine.imageService, this.engine.downloadService);
		this.artistController = new ArtistController(this.engine.artistService, this.trackController, this.albumController, this.engine.metaDataService, this.engine.indexService,
			this.engine.stateService, this.engine.imageService, this.engine.downloadService);
		this.folderController = new FolderController(this.engine.folderService, this.trackController, this.engine.metaDataService, this.engine.indexService,
			this.engine.rootService, this.engine.stateService, this.engine.imageService, this.engine.downloadService, this.engine.ioService);
		this.userController = new UserController(this.engine.userService,
			this.engine.stateService, this.engine.imageService, this.engine.downloadService);
		this.playlistController = new PlaylistController(this.engine.playlistService, this.trackController,
			this.engine.stateService, this.engine.imageService, this.engine.downloadService);
		this.bookmarkController = new BookmarkController(this.engine.bookmarkService, this.trackController);
		this.playqueueController = new PlayQueueController(this.engine.playQueueService, this.trackController);
		this.metadataController = new MetadataController(this.engine.metaDataService, this.trackController);
	}

	async ping(req: JamRequest<{}>): Promise<Jam.Ping> {
		return {version: JAMAPI_VERSION};
	}

	async session(req: JamRequest<{}>): Promise<Jam.Session> {
		return {version: JAMAPI_VERSION, allowedCookieDomains: this.engine.config.server.session.allowedCookieDomains, user: req.user ? formatSessionUser(req.user) : undefined};
	}


}
