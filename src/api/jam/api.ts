import {Engine} from '../../engine/engine';
import {Jam} from '../../model/jam-rest-data-0.1.0';
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
import {MetadataController} from '../../engine/metadata/metadata.controller';
import {StreamController} from '../../engine/stream/stream.controller';
import {formatUser} from '../../objects/user/user.format';
import {GenreController} from '../../engine/genre/genre.controller';
import {NowPlayingController} from '../../engine/nowplaying/nowplaying.controller';
import {ImageController} from '../../engine/image/image.controller';
import {DownloadController} from '../../engine/download/download.controller';
import {User} from '../../objects/user/user.model';
import {WaveformController} from '../../engine/waveform/waveform.controller';
import {AutocompleteController} from '../../engine/autocomplete/autocomplete.controller';

export const APIVERSION = '0.1.0';

export interface JamRequest<T> {
	query: T;
	user: User;
	client?: string;
	file?: string;
}

export class JamController {
	podcastController: PodcastController;
	episodeController: EpisodeController;
	albumController: AlbumController;
	trackController: TrackController;
	artistController: ArtistController;
	folderController: FolderController;
	rootController: RootController;
	userController: UserController;
	chatController: ChatController;
	playlistController: PlaylistController;
	metadataController: MetadataController;
	streamController: StreamController;
	genreController: GenreController;
	nowPlayingController: NowPlayingController;
	imageController: ImageController;
	waveformController: WaveformController;
	downloadController: DownloadController;
	autocompleteController: AutocompleteController;

	constructor(private engine: Engine) {
		this.rootController = new RootController(this.engine.store.rootStore, this.engine.rootService, this.engine.stateService, this.engine.imageService, this.engine.downloadService);
		this.streamController = new StreamController(this.engine.streamService, this.engine.store);
		this.trackController = new TrackController(this.engine.store.trackStore, this.engine.audioService, this.engine.bookmarkService, this.engine.metaDataService, this.engine.streamService, this.engine.rootService, this.engine.stateService, this.engine.imageService, this.engine.downloadService, this.engine.listService);
		this.episodeController = new EpisodeController(this.engine.store.episodeStore, this.engine.podcastService, this.engine.streamService, this.engine.stateService, this.engine.imageService, this.engine.downloadService);
		this.podcastController = new PodcastController(this.engine.store.podcastStore, this.engine.podcastService, this.episodeController, this.engine.stateService, this.engine.imageService, this.engine.downloadService);
		this.albumController = new AlbumController(this.engine.store.albumStore, this.trackController, this.engine.metaDataService, this.engine.stateService, this.engine.imageService, this.engine.downloadService, this.engine.listService);
		this.artistController = new ArtistController(this.engine.store.artistStore, this.trackController, this.albumController, this.engine.metaDataService, this.engine.indexService, this.engine.stateService, this.engine.imageService, this.engine.downloadService, this.engine.listService);
		this.folderController = new FolderController(this.engine.store.folderStore, this.trackController, this.engine.metaDataService, this.engine.indexService, this.engine.rootService, this.engine.stateService, this.engine.imageService, this.engine.downloadService, this.engine.listService);
		this.userController = new UserController(this.engine.store.userStore, this.engine.userService, this.trackController, this.engine.playqueueService, this.engine.stateService, this.engine.imageService, this.engine.downloadService);
		this.playlistController = new PlaylistController(this.engine.store.playlistStore, this.engine.playlistService, this.trackController, this.engine.stateService, this.engine.imageService, this.engine.downloadService);
		this.metadataController = new MetadataController(this.trackController, this.engine.audioService);
		this.chatController = new ChatController(this.engine.chatService);
		this.genreController = new GenreController(engine.genreService);
		this.nowPlayingController = new NowPlayingController(engine.nowPlaylingService);
		this.imageController = new ImageController(this.engine.store, this.engine.imageService);
		this.downloadController = new DownloadController(this.engine.store, this.engine.downloadService);
		this.waveformController = new WaveformController(this.engine.store, this.engine.waveformService);
		this.autocompleteController = new AutocompleteController(this.engine.store);
	}

	async ping(req: JamRequest<{}>): Promise<Jam.Ping> {
		return {version: APIVERSION};
	}

	async session(req: JamRequest<{}>): Promise<Jam.Session> {
		if (req.user) {
			return {version: APIVERSION, allowedCookieDomains: this.engine.config.server.session.allowedCookieDomains, user: formatUser(req.user)};
		} else {
			return {version: APIVERSION, allowedCookieDomains: this.engine.config.server.session.allowedCookieDomains};
		}
	}


}
