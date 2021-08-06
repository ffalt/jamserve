var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import { ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import { OrmService } from '../../engine/services/orm.service';
import { EngineService } from '../../engine/services/engine.service';
import { Inject, InRequestScope } from 'typescript-ioc';
import express from 'express';
import { buildSchema, registerEnumType } from 'type-graphql';
import { AlbumOrderFields, AlbumType, ArtistOrderFields, ArtworkImageType, AudioFormatType, BookmarkOrderFields, DefaultOrderFields, EpisodeOrderFields, FolderOrderFields, FolderType, GenreOrderFields, ListType, PlaylistEntryOrderFields, PlayQueueEntryOrderFields, PodcastOrderFields, PodcastStatus, RootScanStrategy, SessionMode, SessionOrderFields, TagFormatType, TrackOrderFields, UserRole } from '../../../types/enums';
import { UserFavoritesResolver, UserResolver } from '../../../entity/user/user.resolver';
import { AlbumResolver } from '../../../entity/album/album.resolver';
import { ArtistResolver } from '../../../entity/artist/artist.resolver';
import { ArtworkResolver } from '../../../entity/artwork/artwork.resolver';
import { BookmarkResolver } from '../../../entity/bookmark/bookmark.resolver';
import { ChatResolver } from '../../../entity/chat/chat.resolver';
import { EpisodeResolver } from '../../../entity/episode/episode.resolver';
import { FolderResolver } from '../../../entity/folder/folder.resolver';
import { WaveformResolver } from '../../../entity/waveform/waveform.resolver';
import { GenreResolver } from '../../../entity/genre/genre.resolver';
import { PlaylistResolver } from '../../../entity/playlist/playlist.resolver';
import { PlayQueueResolver } from '../../../entity/playqueue/playqueue.resolver';
import { PodcastResolver } from '../../../entity/podcast/podcast.resolver';
import { RadioResolver } from '../../../entity/radio/radio.resolver';
import { RootResolver, RootStatusResolver } from '../../../entity/root/root.resolver';
import { SeriesResolver } from '../../../entity/series/series.resolver';
import { SessionResolver } from '../../../entity/session/session.resolver';
import { TrackResolver } from '../../../entity/track/track.resolver';
import { printSchema } from 'graphql';
import { StatsResolver } from '../../../entity/stats/stats.resolver';
import { StateResolver } from '../../../entity/state/state.resolver';
import { NowPlayingResolver } from '../../../entity/nowplaying/nowplaying.resolver';
import { AdminResolver } from '../../../entity/admin/admin.resolver';
import path from 'path';
function registerEnums() {
    registerEnumType(DefaultOrderFields, { name: 'DefaultOrderFields' });
    registerEnumType(PodcastOrderFields, { name: 'PodcastOrderFields' });
    registerEnumType(TrackOrderFields, { name: 'TrackOrderFields' });
    registerEnumType(ArtistOrderFields, { name: 'ArtistOrderFields' });
    registerEnumType(FolderOrderFields, { name: 'FolderOrderFields' });
    registerEnumType(PlaylistEntryOrderFields, { name: 'PlaylistEntryOrderFields' });
    registerEnumType(PlayQueueEntryOrderFields, { name: 'PlayQueueEntryOrderFields' });
    registerEnumType(BookmarkOrderFields, { name: 'BookmarkOrderFields' });
    registerEnumType(SessionOrderFields, { name: 'SessionOrderFields' });
    registerEnumType(EpisodeOrderFields, { name: 'EpisodeOrderFields' });
    registerEnumType(AlbumOrderFields, { name: 'AlbumOrderFields' });
    registerEnumType(GenreOrderFields, { name: 'GenreOrderFields' });
    registerEnumType(PodcastStatus, { name: 'PodcastStatus' });
    registerEnumType(AudioFormatType, { name: 'AudioFormatType' });
    registerEnumType(ArtworkImageType, { name: 'ArtworkImageType' });
    registerEnumType(RootScanStrategy, { name: 'RootScanStrategy' });
    registerEnumType(TagFormatType, { name: 'TagFormatType' });
    registerEnumType(FolderType, { name: 'FolderType' });
    registerEnumType(AlbumType, { name: 'AlbumType' });
    registerEnumType(SessionMode, { name: 'SessionMode' });
    registerEnumType(UserRole, { name: 'UserRole', description: 'User Roles' });
    registerEnumType(ListType, { name: 'ListType', description: 'Type of List Request' });
}
function checkRole(role, context) {
    switch (role) {
        case UserRole.admin:
            if (!context.user.roleAdmin)
                return false;
            break;
        case UserRole.podcast:
            if (!context.user.rolePodcast)
                return false;
            break;
        case UserRole.upload:
            if (!context.user.roleUpload)
                return false;
            break;
        case UserRole.stream:
            if (!context.user.roleStream)
                return false;
            break;
        default:
            return false;
    }
    return true;
}
export const customAuthChecker = ({ root, args, context, info }, roles) => {
    for (const role of roles) {
        if (!checkRole(role, context)) {
            return false;
        }
    }
    return true;
};
export async function buildGraphQlSchema() {
    registerEnums();
    return await buildSchema({
        resolvers: [
            UserResolver, AlbumResolver, ArtistResolver, ArtworkResolver, BookmarkResolver, ChatResolver,
            EpisodeResolver, FolderResolver, NowPlayingResolver, WaveformResolver, GenreResolver,
            PlaylistResolver, PlayQueueResolver, PodcastResolver, RadioResolver, RootResolver,
            RootStatusResolver, SeriesResolver, UserFavoritesResolver,
            SessionResolver, StateResolver, StatsResolver, TrackResolver, AdminResolver
        ],
        authChecker: customAuthChecker
    });
}
let ApolloMiddleware = class ApolloMiddleware {
    async playground() {
        const api = express.Router();
        api.get('*', express.static(path.resolve('./static/graphql/')));
        return api;
    }
    async middleware() {
        this.schema = await buildGraphQlSchema();
        const apollo = new ApolloServer({
            schema: this.schema,
            debug: true,
            plugins: [
                {
                    async requestDidStart(_) {
                        return {
                            async willSendResponse(requestContext) {
                                if (requestContext.errors) {
                                    requestContext.errors.forEach((err) => {
                                        console.error(err);
                                    });
                                }
                            }
                        };
                    }
                },
                ApolloServerPluginLandingPageDisabled
            ],
            introspection: true,
            formatError: (err) => {
                return err;
            },
            context: async ({ req, res }) => {
                if (!req.user)
                    throw new AuthenticationError('you must be logged in');
                return {
                    req, res,
                    orm: this.orm.fork(),
                    engine: this.engine,
                    sessionID: req.session?.id,
                    user: req.user
                };
            },
        });
        await apollo.start();
        return apollo.getMiddleware({ path: `/`, cors: false });
    }
    printSchema() {
        return printSchema(this.schema);
    }
};
__decorate([
    Inject,
    __metadata("design:type", OrmService)
], ApolloMiddleware.prototype, "orm", void 0);
__decorate([
    Inject,
    __metadata("design:type", EngineService)
], ApolloMiddleware.prototype, "engine", void 0);
ApolloMiddleware = __decorate([
    InRequestScope
], ApolloMiddleware);
export { ApolloMiddleware };
//# sourceMappingURL=apollo.middleware.js.map