"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApolloMiddleware = exports.buildGraphQlSchema = exports.customAuthChecker = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const orm_service_1 = require("../../engine/services/orm.service");
const engine_service_1 = require("../../engine/services/engine.service");
const typescript_ioc_1 = require("typescript-ioc");
const express_1 = __importDefault(require("express"));
const type_graphql_1 = require("type-graphql");
const enums_1 = require("../../../types/enums");
const user_resolver_1 = require("../../../entity/user/user.resolver");
const album_resolver_1 = require("../../../entity/album/album.resolver");
const artist_resolver_1 = require("../../../entity/artist/artist.resolver");
const artwork_resolver_1 = require("../../../entity/artwork/artwork.resolver");
const bookmark_resolver_1 = require("../../../entity/bookmark/bookmark.resolver");
const chat_resolver_1 = require("../../../entity/chat/chat.resolver");
const episode_resolver_1 = require("../../../entity/episode/episode.resolver");
const folder_resolver_1 = require("../../../entity/folder/folder.resolver");
const waveform_resolver_1 = require("../../../entity/waveform/waveform.resolver");
const genre_resolver_1 = require("../../../entity/genre/genre.resolver");
const playlist_resolver_1 = require("../../../entity/playlist/playlist.resolver");
const playqueue_resolver_1 = require("../../../entity/playqueue/playqueue.resolver");
const podcast_resolver_1 = require("../../../entity/podcast/podcast.resolver");
const radio_resolver_1 = require("../../../entity/radio/radio.resolver");
const root_resolver_1 = require("../../../entity/root/root.resolver");
const series_resolver_1 = require("../../../entity/series/series.resolver");
const session_resolver_1 = require("../../../entity/session/session.resolver");
const track_resolver_1 = require("../../../entity/track/track.resolver");
const graphql_1 = require("graphql");
const stats_resolver_1 = require("../../../entity/stats/stats.resolver");
const state_resolver_1 = require("../../../entity/state/state.resolver");
const nowplaying_resolver_1 = require("../../../entity/nowplaying/nowplaying.resolver");
const admin_resolver_1 = require("../../../entity/admin/admin.resolver");
const path_1 = __importDefault(require("path"));
function registerEnums() {
    type_graphql_1.registerEnumType(enums_1.DefaultOrderFields, { name: 'DefaultOrderFields' });
    type_graphql_1.registerEnumType(enums_1.PodcastOrderFields, { name: 'PodcastOrderFields' });
    type_graphql_1.registerEnumType(enums_1.TrackOrderFields, { name: 'TrackOrderFields' });
    type_graphql_1.registerEnumType(enums_1.ArtistOrderFields, { name: 'ArtistOrderFields' });
    type_graphql_1.registerEnumType(enums_1.FolderOrderFields, { name: 'FolderOrderFields' });
    type_graphql_1.registerEnumType(enums_1.PlaylistEntryOrderFields, { name: 'PlaylistEntryOrderFields' });
    type_graphql_1.registerEnumType(enums_1.PlayQueueEntryOrderFields, { name: 'PlayQueueEntryOrderFields' });
    type_graphql_1.registerEnumType(enums_1.BookmarkOrderFields, { name: 'BookmarkOrderFields' });
    type_graphql_1.registerEnumType(enums_1.SessionOrderFields, { name: 'SessionOrderFields' });
    type_graphql_1.registerEnumType(enums_1.EpisodeOrderFields, { name: 'EpisodeOrderFields' });
    type_graphql_1.registerEnumType(enums_1.AlbumOrderFields, { name: 'AlbumOrderFields' });
    type_graphql_1.registerEnumType(enums_1.GenreOrderFields, { name: 'GenreOrderFields' });
    type_graphql_1.registerEnumType(enums_1.PodcastStatus, { name: 'PodcastStatus' });
    type_graphql_1.registerEnumType(enums_1.AudioFormatType, { name: 'AudioFormatType' });
    type_graphql_1.registerEnumType(enums_1.ArtworkImageType, { name: 'ArtworkImageType' });
    type_graphql_1.registerEnumType(enums_1.RootScanStrategy, { name: 'RootScanStrategy' });
    type_graphql_1.registerEnumType(enums_1.TagFormatType, { name: 'TagFormatType' });
    type_graphql_1.registerEnumType(enums_1.FolderType, { name: 'FolderType' });
    type_graphql_1.registerEnumType(enums_1.AlbumType, { name: 'AlbumType' });
    type_graphql_1.registerEnumType(enums_1.SessionMode, { name: 'SessionMode' });
    type_graphql_1.registerEnumType(enums_1.UserRole, { name: 'UserRole', description: 'User Roles' });
    type_graphql_1.registerEnumType(enums_1.ListType, { name: 'ListType', description: 'Type of List Request' });
}
function checkRole(role, context) {
    switch (role) {
        case enums_1.UserRole.admin:
            if (!context.user.roleAdmin)
                return false;
            break;
        case enums_1.UserRole.podcast:
            if (!context.user.rolePodcast)
                return false;
            break;
        case enums_1.UserRole.upload:
            if (!context.user.roleUpload)
                return false;
            break;
        case enums_1.UserRole.stream:
            if (!context.user.roleStream)
                return false;
            break;
        default:
            return false;
    }
    return true;
}
const customAuthChecker = ({ root, args, context, info }, roles) => {
    for (const role of roles) {
        if (!checkRole(role, context)) {
            return false;
        }
    }
    return true;
};
exports.customAuthChecker = customAuthChecker;
async function buildGraphQlSchema() {
    registerEnums();
    return await type_graphql_1.buildSchema({
        resolvers: [
            user_resolver_1.UserResolver, album_resolver_1.AlbumResolver, artist_resolver_1.ArtistResolver, artwork_resolver_1.ArtworkResolver, bookmark_resolver_1.BookmarkResolver, chat_resolver_1.ChatResolver,
            episode_resolver_1.EpisodeResolver, folder_resolver_1.FolderResolver, nowplaying_resolver_1.NowPlayingResolver, waveform_resolver_1.WaveformResolver, genre_resolver_1.GenreResolver,
            playlist_resolver_1.PlaylistResolver, playqueue_resolver_1.PlayQueueResolver, podcast_resolver_1.PodcastResolver, radio_resolver_1.RadioResolver, root_resolver_1.RootResolver,
            root_resolver_1.RootStatusResolver, series_resolver_1.SeriesResolver, user_resolver_1.UserFavoritesResolver,
            session_resolver_1.SessionResolver, state_resolver_1.StateResolver, stats_resolver_1.StatsResolver, track_resolver_1.TrackResolver, admin_resolver_1.AdminResolver
        ],
        authChecker: exports.customAuthChecker
    });
}
exports.buildGraphQlSchema = buildGraphQlSchema;
const apolloLogger = {
    willSendResponse(requestContext) {
        const { graphqlResponse } = requestContext;
        if (graphqlResponse.errors) {
            graphqlResponse.errors.forEach((err) => {
                console.error(err);
            });
        }
        return requestContext;
    }
};
let ApolloMiddleware = class ApolloMiddleware {
    async playground() {
        const api = express_1.default.Router();
        api.get('/middleware.js', express_1.default.static(path_1.default.resolve('./static/graphql/middleware.min.js')));
        api.get('/main.js', express_1.default.static(path_1.default.resolve('./static/graphql/main.js')));
        api.get('/index.css', express_1.default.static(path_1.default.resolve('./static/graphql/index.min.css')));
        api.get('/favicon.png', express_1.default.static(path_1.default.resolve('./static/graphql/favicon.png')));
        api.get('/', express_1.default.static(path_1.default.resolve('./static/graphql/index.html')));
        return api;
    }
    async middleware() {
        this.schema = await buildGraphQlSchema();
        const apollo = new apollo_server_express_1.ApolloServer({
            schema: this.schema,
            debug: true,
            plugins: [() => apolloLogger],
            playground: false,
            introspection: true,
            formatError: (err) => {
                return err;
            },
            context: async ({ req, res }) => {
                var _a;
                if (!req.user)
                    throw new apollo_server_express_1.AuthenticationError('you must be logged in');
                return {
                    req, res,
                    orm: this.orm.fork(),
                    engine: this.engine,
                    sessionID: (_a = req.session) === null || _a === void 0 ? void 0 : _a.id,
                    user: req.user
                };
            },
        });
        return apollo.getMiddleware({ path: `/`, cors: false });
    }
    printSchema() {
        return graphql_1.printSchema(this.schema);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], ApolloMiddleware.prototype, "orm", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", engine_service_1.EngineService)
], ApolloMiddleware.prototype, "engine", void 0);
ApolloMiddleware = __decorate([
    typescript_ioc_1.InRequestScope
], ApolloMiddleware);
exports.ApolloMiddleware = ApolloMiddleware;
//# sourceMappingURL=apollo.middleware.js.map