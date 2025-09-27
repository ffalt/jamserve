import { Base } from '../../../entity/base/base.js';
import { Album } from '../../../entity/album/album.js';
import { Artist } from '../../../entity/artist/artist.js';
import { Artwork } from '../../../entity/artwork/artwork.js';
import { Bookmark } from '../../../entity/bookmark/bookmark.js';
import { Episode } from '../../../entity/episode/episode.js';
import { Folder } from '../../../entity/folder/folder.js';
import { Root } from '../../../entity/root/root.js';
import { MetaData } from '../../../entity/metadata/metadata.js';
import { Playlist } from '../../../entity/playlist/playlist.js';
import { PlaylistEntry } from '../../../entity/playlistentry/playlist-entry.js';
import { PlayQueue } from '../../../entity/playqueue/playqueue.js';
import { PlayQueueEntry } from '../../../entity/playqueueentry/playqueue-entry.js';
import { Podcast } from '../../../entity/podcast/podcast.js';
import { Radio } from '../../../entity/radio/radio.js';
import { Series } from '../../../entity/series/series.js';
import { Session } from '../../../entity/session/session.js';
import { Settings } from '../../../entity/settings/settings.js';
import { State } from '../../../entity/state/state.js';
import { Tag } from '../../../entity/tag/tag.js';
import { Track } from '../../../entity/track/track.js';
import { User } from '../../../entity/user/user.js';
import { Genre } from '../../../entity/genre/genre.js';
export const ORMEntities = [
    Base,
    Album,
    Artist,
    Artwork,
    Bookmark,
    Episode,
    Folder,
    Genre,
    Root,
    MetaData,
    Playlist,
    PlaylistEntry,
    PlayQueue,
    PlayQueueEntry,
    Podcast,
    Radio,
    Series,
    Session,
    Settings,
    State,
    Tag,
    Track,
    User
];
if (ORMEntities.some((entry) => entry === undefined)) {
    console.error(ORMEntities);
    throw new Error('Entity missing, probably because of a circular reference');
}
//# sourceMappingURL=entities.js.map