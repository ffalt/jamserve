import {AlbumRepository} from '../../../entity/album/album.repository.js';
import {ArtistRepository} from '../../../entity/artist/artist.repository.js';
import {ArtworkRepository} from '../../../entity/artwork/artwork.repository.js';
import {BookmarkRepository} from '../../../entity/bookmark/bookmark.repository.js';
import {EpisodeRepository} from '../../../entity/episode/episode.repository.js';
import {FolderRepository} from '../../../entity/folder/folder.repository.js';
import {PlaylistRepository} from '../../../entity/playlist/playlist.repository.js';
import {PodcastRepository} from '../../../entity/podcast/podcast.repository.js';
import {SeriesRepository} from '../../../entity/series/series.repository.js';
import {SessionRepository} from '../../../entity/session/session.repository.js';
import {RadioRepository} from '../../../entity/radio/radio.repository.js';
import {TrackRepository} from '../../../entity/track/track.repository.js';
import {UserRepository} from '../../../entity/user/user.repository.js';
import {TagRepository} from '../../../entity/tag/tag.repository.js';
import {StateRepository} from '../../../entity/state/state.repository.js';
import {RootRepository} from '../../../entity/root/root.repository.js';
import {PlaylistEntryRepository} from '../../../entity/playlistentry/playlist-entry.repository.js';
import {PlayQueueRepository} from '../../../entity/playqueue/playqueue.repository.js';
import {PlayQueueEntryRepository} from '../../../entity/playqueueentry/playqueue-entry.repository.js';
import {SettingsRepository} from '../../../entity/settings/settings.repository.js';
import {MetaDataRepository} from '../../../entity/metadata/metadata.repository.js';
import {ORMConfigRepositories} from '../../orm/definitions/config.js';
import {GenreRepository} from '../../../entity/genre/genre.repository.js';

export const ORMRepositories: ORMConfigRepositories = {
	Album: AlbumRepository,
	Artist: ArtistRepository,
	Artwork: ArtworkRepository,
	Bookmark: BookmarkRepository,
	Episode: EpisodeRepository,
	Folder: FolderRepository,
	Playlist: PlaylistRepository,
	Podcast: PodcastRepository,
	Series: SeriesRepository,
	Session: SessionRepository,
	Radio: RadioRepository,
	Track: TrackRepository,
	User: UserRepository,
	Tag: TagRepository,
	State: StateRepository,
	Root: RootRepository,
	PlaylistEntry: PlaylistEntryRepository,
	PlayQueue: PlayQueueRepository,
	PlayQueueEntry: PlayQueueEntryRepository,
	Settings: SettingsRepository,
	MetaData: MetaDataRepository,
	Genre: GenreRepository
};
