var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { OrmService } from '../../engine/services/orm.service.js';
import { EngineService } from '../../engine/services/engine.service.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { ArgumentValidationError, buildSchema, registerEnumType } from 'type-graphql';
import { AlbumOrderFields, AlbumType, ArtistOrderFields, ArtworkImageType, AudioFormatType, BookmarkOrderFields, DefaultOrderFields, EpisodeOrderFields, FolderOrderFields, FolderType, GenreOrderFields, ListType, PlaylistEntryOrderFields, PlayQueueEntryOrderFields, PodcastOrderFields, PodcastStatus, RootScanStrategy, SessionMode, SessionOrderFields, TagFormatType, TrackOrderFields, UserRole } from '../../../types/enums.js';
import { UserFavoritesResolver, UserResolver } from '../../../entity/user/user.resolver.js';
import { AlbumResolver } from '../../../entity/album/album.resolver.js';
import { ArtistResolver } from '../../../entity/artist/artist.resolver.js';
import { ArtworkResolver } from '../../../entity/artwork/artwork.resolver.js';
import { BookmarkResolver } from '../../../entity/bookmark/bookmark.resolver.js';
import { ChatResolver } from '../../../entity/chat/chat.resolver.js';
import { EpisodeResolver } from '../../../entity/episode/episode.resolver.js';
import { FolderResolver } from '../../../entity/folder/folder.resolver.js';
import { WaveformResolver } from '../../../entity/waveform/waveform.resolver.js';
import { GenreResolver } from '../../../entity/genre/genre.resolver.js';
import { PlaylistResolver } from '../../../entity/playlist/playlist.resolver.js';
import { PlaylistEntryResolver } from '../../../entity/playlistentry/playlist-entry.resolver.js';
import { PlayQueueResolver } from '../../../entity/playqueue/playqueue.resolver.js';
import { PodcastResolver } from '../../../entity/podcast/podcast.resolver.js';
import { RadioResolver } from '../../../entity/radio/radio.resolver.js';
import { RootResolver, RootStatusResolver } from '../../../entity/root/root.resolver.js';
import { SeriesResolver } from '../../../entity/series/series.resolver.js';
import { SessionResolver } from '../../../entity/session/session.resolver.js';
import { TrackResolver } from '../../../entity/track/track.resolver.js';
import { GraphQLError, printSchema } from 'graphql';
import { StatsResolver } from '../../../entity/stats/stats.resolver.js';
import { StateResolver } from '../../../entity/state/state.resolver.js';
import { NowPlayingResolver } from '../../../entity/nowplaying/nowplaying.resolver.js';
import { AdminResolver } from '../../../entity/admin/admin.resolver.js';
import { MetadataResolver } from '../../../entity/metadata/metadata.resolver.js';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { expressMiddleware } from '@apollo/server/express4';
import { unwrapResolverError } from '@apollo/server/errors';
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
export const customAuthChecker = ({ context }, roles) => {
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
            PlaylistResolver, PlaylistEntryResolver, PlayQueueResolver, PodcastResolver, RadioResolver,
            RootResolver, RootStatusResolver, SeriesResolver, UserFavoritesResolver, MetadataResolver,
            SessionResolver, StateResolver, StatsResolver, TrackResolver, AdminResolver
        ],
        validate: { forbidUnknownValues: false },
        authChecker: customAuthChecker
    });
}
function formatValidationErrors(validationError) {
    return {
        property: validationError.property,
        ...(validationError.value && { value: validationError.value }),
        ...(validationError.constraints && {
            constraints: validationError.constraints
        }),
        ...(validationError.children &&
            validationError.children.length !== 0 && { children: validationError.children.map(child => formatValidationErrors(child)) })
    };
}
export class ValidationError extends GraphQLError {
    constructor(validationErrors) {
        super('Validation Error', {
            extensions: {
                code: 'BAD_USER_INPUT',
                validationErrors: validationErrors.map(validationError => formatValidationErrors(validationError))
            }
        });
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
function formatGraphQLFormatError(formattedError, error) {
    const originalError = unwrapResolverError(error);
    if (originalError instanceof ArgumentValidationError) {
        return new ValidationError(originalError.extensions.validationErrors);
    }
    return formattedError;
}
let ApolloMiddleware = class ApolloMiddleware {
    async middleware() {
        this.schema = await buildGraphQlSchema();
        const apollo = new ApolloServer({
            schema: this.schema,
            plugins: [
                {
                    async requestDidStart() {
                        return {
                            async willSendResponse(requestContext) {
                                const { errors } = requestContext;
                                if (errors) {
                                    errors.forEach((err) => {
                                        console.error(err);
                                    });
                                }
                            }
                        };
                    }
                },
                ApolloServerPluginLandingPageDisabled()
            ],
            introspection: true,
            formatError: formatGraphQLFormatError
        });
        await apollo.start();
        return expressMiddleware(apollo, {
            context: async ({ req, res }) => {
                if (!req.user)
                    throw new Error('you must be logged in');
                return {
                    req, res,
                    orm: this.orm.fork(),
                    engine: this.engine,
                    sessionID: req.session?.id,
                    user: req.user
                };
            }
        });
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