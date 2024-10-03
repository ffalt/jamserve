import { AuthController } from '../../../entity/auth/auth.controller.js';
import { AlbumController } from '../../../entity/album/album.controller.js';
import { ArtistController } from '../../../entity/artist/artist.controller.js';
import { BookmarkController } from '../../../entity/bookmark/bookmark.controller.js';
import { RootController } from '../../../entity/root/root.controller.js';
import { EpisodeController } from '../../../entity/episode/episode.controller.js';
import { FolderController } from '../../../entity/folder/folder.controller.js';
import { PodcastController } from '../../../entity/podcast/podcast.controller.js';
import { RadioController } from '../../../entity/radio/radio.controller.js';
import { SeriesController } from '../../../entity/series/series.controller.js';
import { TrackController } from '../../../entity/track/track.controller.js';
import { SessionController } from '../../../entity/session/session.controller.js';
import { PingController } from '../../../entity/ping/ping.controller.js';
import { ChatController } from '../../../entity/chat/chat.controller.js';
import { UserController } from '../../../entity/user/user.controller.js';
import { PlayQueueController } from '../../../entity/playqueue/playqueue.controller.js';
import { PlaylistController } from '../../../entity/playlist/playlist.controller.js';
import { StatsController } from '../../../entity/stats/stats.controller.js';
import { GenreController } from '../../../entity/genre/genre.controller.js';
import { AutocompleteController } from '../../../entity/autocomplete/autocomplete.controller.js';
import { ImageController } from '../../../entity/image/image.controller.js';
import { DownloadController } from '../../../entity/download/download.controller.js';
import { StateController } from '../../../entity/state/state.controller.js';
import { WaveformController } from '../../../entity/waveform/waveform.controller.js';
import { StreamController } from '../../../entity/stream/stream.controller.js';
import { ArtworkController } from '../../../entity/artwork/artwork.controller.js';
import { MetaDataController } from '../../../entity/metadata/metadata.controller.js';
import { AdminController } from '../../../entity/admin/admin.controller.js';
import { NowPlayingController } from '../../../entity/nowplaying/nowplaying.controller.js';

export function RestControllers(): Array<any> {
	return [
		AdminController,
		AlbumController,
		ArtistController,
		ArtworkController,
		AuthController,
		AutocompleteController,
		BookmarkController,
		ChatController,
		DownloadController,
		EpisodeController,
		FolderController,
		GenreController,
		ImageController,
		RootController,
		MetaDataController,
		NowPlayingController,
		PingController,
		PlaylistController,
		PlayQueueController,
		PodcastController,
		RadioController,
		SeriesController,
		SessionController,
		StateController,
		StatsController,
		StreamController,
		TrackController,
		UserController,
		WaveformController
	];
}
