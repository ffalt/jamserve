"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestControllers = void 0;
const auth_controller_1 = require("../../../entity/auth/auth.controller");
const album_controller_1 = require("../../../entity/album/album.controller");
const artist_controller_1 = require("../../../entity/artist/artist.controller");
const bookmark_controller_1 = require("../../../entity/bookmark/bookmark.controller");
const root_controller_1 = require("../../../entity/root/root.controller");
const episode_controller_1 = require("../../../entity/episode/episode.controller");
const folder_controller_1 = require("../../../entity/folder/folder.controller");
const podcast_controller_1 = require("../../../entity/podcast/podcast.controller");
const radio_controller_1 = require("../../../entity/radio/radio.controller");
const series_controller_1 = require("../../../entity/series/series.controller");
const track_controller_1 = require("../../../entity/track/track.controller");
const session_controller_1 = require("../../../entity/session/session.controller");
const ping_controller_1 = require("../../../entity/ping/ping.controller");
const chat_controller_1 = require("../../../entity/chat/chat.controller");
const user_controller_1 = require("../../../entity/user/user.controller");
const playqueue_controller_1 = require("../../../entity/playqueue/playqueue.controller");
const playlist_controller_1 = require("../../../entity/playlist/playlist.controller");
const stats_controller_1 = require("../../../entity/stats/stats.controller");
const genre_controller_1 = require("../../../entity/genre/genre.controller");
const autocomplete_controller_1 = require("../../../entity/autocomplete/autocomplete.controller");
const image_controller_1 = require("../../../entity/image/image.controller");
const download_controller_1 = require("../../../entity/download/download.controller");
const state_controller_1 = require("../../../entity/state/state.controller");
const waveform_controller_1 = require("../../../entity/waveform/waveform.controller");
const stream_controller_1 = require("../../../entity/stream/stream.controller");
const artwork_controller_1 = require("../../../entity/artwork/artwork.controller");
const metadata_controller_1 = require("../../../entity/metadata/metadata.controller");
const admin_controller_1 = require("../../../entity/admin/admin.controller");
const nowplaying_controller_1 = require("../../../entity/nowplaying/nowplaying.controller");
function RestControllers() {
    return [
        admin_controller_1.AdminController,
        album_controller_1.AlbumController,
        artist_controller_1.ArtistController,
        artwork_controller_1.ArtworkController,
        auth_controller_1.AuthController,
        autocomplete_controller_1.AutocompleteController,
        bookmark_controller_1.BookmarkController,
        chat_controller_1.ChatController,
        download_controller_1.DownloadController,
        episode_controller_1.EpisodeController,
        folder_controller_1.FolderController,
        genre_controller_1.GenreController,
        image_controller_1.ImageController,
        root_controller_1.RootController,
        metadata_controller_1.MetaDataController,
        nowplaying_controller_1.NowPlayingController,
        ping_controller_1.PingController,
        playlist_controller_1.PlaylistController,
        playqueue_controller_1.PlayQueueController,
        podcast_controller_1.PodcastController,
        radio_controller_1.RadioController,
        series_controller_1.SeriesController,
        session_controller_1.SessionController,
        state_controller_1.StateController,
        stats_controller_1.StatsController,
        stream_controller_1.StreamController,
        track_controller_1.TrackController,
        user_controller_1.UserController,
        waveform_controller_1.WaveformController
    ];
}
exports.RestControllers = RestControllers;
//# sourceMappingURL=controllers.js.map