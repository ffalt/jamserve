import {AuthController} from '../../../entity/auth/auth.controller';
import {AlbumController} from '../../../entity/album/album.controller';
import {ArtistController} from '../../../entity/artist/artist.controller';
import {BookmarkController} from '../../../entity/bookmark/bookmark.controller';
import {RootController} from '../../../entity/root/root.controller';
import {EpisodeController} from '../../../entity/episode/episode.controller';
import {FolderController} from '../../../entity/folder/folder.controller';
import {PodcastController} from '../../../entity/podcast/podcast.controller';
import {RadioController} from '../../../entity/radio/radio.controller';
import {SeriesController} from '../../../entity/series/series.controller';
import {TrackController} from '../../../entity/track/track.controller';
import {SessionController} from '../../../entity/session/session.controller';
import {PingController} from '../../../entity/ping/ping.controller';
import {ChatController} from '../../../entity/chat/chat.controller';
import {UserController} from '../../../entity/user/user.controller';
import {PlayQueueController} from '../../../entity/playqueue/playqueue.controller';
import {BaseController} from '../../../entity/base/base.controller';
import {PlaylistController} from '../../../entity/playlist/playlist.controller';
import {StatsController} from '../../../entity/stats/stats.controller';
import {GenreController} from '../../../entity/genre/genre.controller';
import {AutocompleteController} from '../../../entity/autocomplete/autocomplete.controller';
import {ImageController} from '../../../entity/image/image.controller';
import {DownloadController} from '../../../entity/download/download.controller';
import {StateController} from '../../../entity/state/state.controller';
import {WaveformController} from '../../../entity/waveform/waveform.controller';
import {StreamController} from '../../../entity/stream/stream.controller';
import {ArtworkController} from '../../../entity/artwork/artwork.controller';
import {MetaDataController} from '../../../entity/metadata/metadata.controller';
import {AdminController} from '../../../entity/admin/admin.controller';
import {NowPlayingController} from '../../../entity/nowplaying/nowplaying.controller';

export function RestControllers(): Array<any> {
	return [
		AdminController,
		AlbumController,
		ArtistController,
		ArtworkController,
		AuthController,
		AutocompleteController,
		BaseController,
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
