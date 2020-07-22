import {AlbumRepository} from '../../../entity/album/album.repository';
import {ArtistRepository} from '../../../entity/artist/artist.repository';
import {ArtworkRepository} from '../../../entity/artwork/artwork.repository';
import {BookmarkRepository} from '../../../entity/bookmark/bookmark.repository';
import {EpisodeRepository} from '../../../entity/episode/episode.repository';
import {FolderRepository} from '../../../entity/folder/folder.repository';
import {PlaylistRepository} from '../../../entity/playlist/playlist.repository';
import {PodcastRepository} from '../../../entity/podcast/podcast.repository';
import {SeriesRepository} from '../../../entity/series/series.repository';
import {SessionRepository} from '../../../entity/session/session.repository';
import {RadioRepository} from '../../../entity/radio/radio.repository';
import {TrackRepository} from '../../../entity/track/track.repository';
import {UserRepository} from '../../../entity/user/user.repository';
import {TagRepository} from '../../../entity/tag/tag.repository';
import {StateRepository} from '../../../entity/state/state.repository';
import {RootRepository} from '../../../entity/root/root.repository';
import {PlaylistEntryRepository} from '../../../entity/playlistentry/playlist-entry.repository';
import {PlayQueueRepository} from '../../../entity/playqueue/playqueue.repository';
import {PlayQueueEntryRepository} from '../../../entity/playqueueentry/playqueue-entry.repository';
import {SettingsRepository} from '../../../entity/settings/settings.repository';
import {MetaDataRepository} from '../../../entity/metadata/metadata.repository';
import {ORMConfigRepositories} from '../../orm/definitions/config';

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
	MetaData: MetaDataRepository
};
