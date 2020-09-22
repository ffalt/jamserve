"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORMRepositories = void 0;
const album_repository_1 = require("../../../entity/album/album.repository");
const artist_repository_1 = require("../../../entity/artist/artist.repository");
const artwork_repository_1 = require("../../../entity/artwork/artwork.repository");
const bookmark_repository_1 = require("../../../entity/bookmark/bookmark.repository");
const episode_repository_1 = require("../../../entity/episode/episode.repository");
const folder_repository_1 = require("../../../entity/folder/folder.repository");
const playlist_repository_1 = require("../../../entity/playlist/playlist.repository");
const podcast_repository_1 = require("../../../entity/podcast/podcast.repository");
const series_repository_1 = require("../../../entity/series/series.repository");
const session_repository_1 = require("../../../entity/session/session.repository");
const radio_repository_1 = require("../../../entity/radio/radio.repository");
const track_repository_1 = require("../../../entity/track/track.repository");
const user_repository_1 = require("../../../entity/user/user.repository");
const tag_repository_1 = require("../../../entity/tag/tag.repository");
const state_repository_1 = require("../../../entity/state/state.repository");
const root_repository_1 = require("../../../entity/root/root.repository");
const playlist_entry_repository_1 = require("../../../entity/playlistentry/playlist-entry.repository");
const playqueue_repository_1 = require("../../../entity/playqueue/playqueue.repository");
const playqueue_entry_repository_1 = require("../../../entity/playqueueentry/playqueue-entry.repository");
const settings_repository_1 = require("../../../entity/settings/settings.repository");
const metadata_repository_1 = require("../../../entity/metadata/metadata.repository");
const genre_repository_1 = require("../../../entity/genre/genre.repository");
exports.ORMRepositories = {
    Album: album_repository_1.AlbumRepository,
    Artist: artist_repository_1.ArtistRepository,
    Artwork: artwork_repository_1.ArtworkRepository,
    Bookmark: bookmark_repository_1.BookmarkRepository,
    Episode: episode_repository_1.EpisodeRepository,
    Folder: folder_repository_1.FolderRepository,
    Playlist: playlist_repository_1.PlaylistRepository,
    Podcast: podcast_repository_1.PodcastRepository,
    Series: series_repository_1.SeriesRepository,
    Session: session_repository_1.SessionRepository,
    Radio: radio_repository_1.RadioRepository,
    Track: track_repository_1.TrackRepository,
    User: user_repository_1.UserRepository,
    Tag: tag_repository_1.TagRepository,
    State: state_repository_1.StateRepository,
    Root: root_repository_1.RootRepository,
    PlaylistEntry: playlist_entry_repository_1.PlaylistEntryRepository,
    PlayQueue: playqueue_repository_1.PlayQueueRepository,
    PlayQueueEntry: playqueue_entry_repository_1.PlayQueueEntryRepository,
    Settings: settings_repository_1.SettingsRepository,
    MetaData: metadata_repository_1.MetaDataRepository,
    Genre: genre_repository_1.GenreRepository
};
//# sourceMappingURL=repositories.js.map