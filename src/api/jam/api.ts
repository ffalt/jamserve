import {AlbumController} from '../../engine/album/album.controller';
import {ArtistController} from '../../engine/artist/artist.controller';
import {AutocompleteController} from '../../engine/autocomplete/autocomplete.controller';
import {BookmarkController} from '../../engine/bookmark/bookmark.controller';
import {ChatController} from '../../engine/chat/chat.controller';
import {DownloadController} from '../../engine/download/download.controller';
import {Engine} from '../../engine/engine';
import {EpisodeController} from '../../engine/episode/episode.controller';
import {FolderController} from '../../engine/folder/folder.controller';
import {GenreController} from '../../engine/genre/genre.controller';
import {ImageController} from '../../engine/image/image.controller';
import {InfoController} from '../../engine/info/info.controller';
import {MetadataController} from '../../engine/metadata/metadata.controller';
import {NowPlayingController} from '../../engine/nowplaying/nowplaying.controller';
import {PlaylistController} from '../../engine/playlist/playlist.controller';
import {PlayQueueController} from '../../engine/playqueue/playqueue.controller';
import {PodcastController} from '../../engine/podcast/podcast.controller';
import {RadioController} from '../../engine/radio/radio.controller';
import {RootController} from '../../engine/root/root.controller';
import {SettingsController} from '../../engine/settings/settings.controller';
import {StatsController} from '../../engine/stats/stats.controller';
import {StreamController} from '../../engine/stream/stream.controller';
import {TrackController} from '../../engine/track/track.controller';
import {UserController} from '../../engine/user/user.controller';
import {User} from '../../engine/user/user.model';
import {WaveformController} from '../../engine/waveform/waveform.controller';

export interface JamRequest<T> {
	query: T;
	user: User;
	client?: string;
	file?: string;
}

export class JamApi {
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
	infoController: InfoController;

	constructor(public engine: Engine) {
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
		this.albumController = new AlbumController(this.engine.albumService, this.trackController, this.engine.metaDataService, this.engine.indexService,
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
		this.infoController = new InfoController(this.engine.config);
	}

}
