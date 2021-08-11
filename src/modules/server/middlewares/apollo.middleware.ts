import {ApolloServer, AuthenticationError} from 'apollo-server-express';
import {ApolloServerPluginLandingPageDisabled} from 'apollo-server-core';
import {OrmService} from '../../engine/services/orm.service';
import {EngineService} from '../../engine/services/engine.service';
import {Inject, InRequestScope} from 'typescript-ioc';
import {Context} from './apollo.context';
import express from 'express';
import {AuthChecker, buildSchema, registerEnumType} from 'type-graphql';
import {
	AlbumOrderFields,
	AlbumType,
	ArtistOrderFields,
	ArtworkImageType,
	AudioFormatType,
	BookmarkOrderFields,
	DefaultOrderFields,
	EpisodeOrderFields,
	FolderOrderFields,
	FolderType,
	GenreOrderFields,
	ListType,
	PlaylistEntryOrderFields,
	PlayQueueEntryOrderFields,
	PodcastOrderFields,
	PodcastStatus,
	RootScanStrategy,
	SessionMode,
	SessionOrderFields,
	TagFormatType,
	TrackOrderFields,
	UserRole
} from '../../../types/enums';
import {UserFavoritesResolver, UserResolver} from '../../../entity/user/user.resolver';
import {AlbumResolver} from '../../../entity/album/album.resolver';
import {ArtistResolver} from '../../../entity/artist/artist.resolver';
import {ArtworkResolver} from '../../../entity/artwork/artwork.resolver';
import {BookmarkResolver} from '../../../entity/bookmark/bookmark.resolver';
import {ChatResolver} from '../../../entity/chat/chat.resolver';
import {EpisodeResolver} from '../../../entity/episode/episode.resolver';
import {FolderResolver} from '../../../entity/folder/folder.resolver';
import {WaveformResolver} from '../../../entity/waveform/waveform.resolver';
import {GenreResolver} from '../../../entity/genre/genre.resolver';
import {PlaylistResolver} from '../../../entity/playlist/playlist.resolver';
import {PlayQueueResolver} from '../../../entity/playqueue/playqueue.resolver';
import {PodcastResolver} from '../../../entity/podcast/podcast.resolver';
import {RadioResolver} from '../../../entity/radio/radio.resolver';
import {RootResolver, RootStatusResolver} from '../../../entity/root/root.resolver';
import {SeriesResolver} from '../../../entity/series/series.resolver';
import {SessionResolver} from '../../../entity/session/session.resolver';
import {TrackResolver} from '../../../entity/track/track.resolver';
import {GraphQLSchema, printSchema} from 'graphql';
import {StatsResolver} from '../../../entity/stats/stats.resolver';
import {StateResolver} from '../../../entity/state/state.resolver';
import {NowPlayingResolver} from '../../../entity/nowplaying/nowplaying.resolver';
import {AdminResolver} from '../../../entity/admin/admin.resolver';
import path from 'path';
import {ApolloServerPlugin} from 'apollo-server-plugin-base';
import {GraphQLRequestListener} from 'apollo-server-plugin-base/src/index';
import {GraphQLRequestContext, GraphQLRequestContextWillSendResponse} from 'apollo-server-types';
import {MetadataResolver} from '../../../entity/metadata/metadata.resolver';

function registerEnums(): void {
	registerEnumType(DefaultOrderFields, {name: 'DefaultOrderFields'});
	registerEnumType(PodcastOrderFields, {name: 'PodcastOrderFields'});
	registerEnumType(TrackOrderFields, {name: 'TrackOrderFields'});
	registerEnumType(ArtistOrderFields, {name: 'ArtistOrderFields'});
	registerEnumType(FolderOrderFields, {name: 'FolderOrderFields'});
	registerEnumType(PlaylistEntryOrderFields, {name: 'PlaylistEntryOrderFields'});
	registerEnumType(PlayQueueEntryOrderFields, {name: 'PlayQueueEntryOrderFields'});
	registerEnumType(BookmarkOrderFields, {name: 'BookmarkOrderFields'});
	registerEnumType(SessionOrderFields, {name: 'SessionOrderFields'});
	registerEnumType(EpisodeOrderFields, {name: 'EpisodeOrderFields'});
	registerEnumType(AlbumOrderFields, {name: 'AlbumOrderFields'});
	registerEnumType(GenreOrderFields, {name: 'GenreOrderFields'});
	registerEnumType(PodcastStatus, {name: 'PodcastStatus'});
	registerEnumType(AudioFormatType, {name: 'AudioFormatType'});
	registerEnumType(ArtworkImageType, {name: 'ArtworkImageType'});
	registerEnumType(RootScanStrategy, {name: 'RootScanStrategy'});
	registerEnumType(TagFormatType, {name: 'TagFormatType'});
	registerEnumType(FolderType, {name: 'FolderType'});
	registerEnumType(AlbumType, {name: 'AlbumType'});
	registerEnumType(SessionMode, {name: 'SessionMode'});
	registerEnumType(UserRole, {name: 'UserRole', description: 'User Roles'});
	registerEnumType(ListType, {name: 'ListType', description: 'Type of List Request'});
}

function checkRole(role: string, context: Context): boolean {
	switch (role) {
		case UserRole.admin:
			if (!context.user.roleAdmin) return false;
			break;
		case UserRole.podcast:
			if (!context.user.rolePodcast) return false;
			break;
		case UserRole.upload:
			if (!context.user.roleUpload) return false;
			break;
		case UserRole.stream:
			if (!context.user.roleStream) return false;
			break;
		default:
			return false;
	}
	return true;
}

export const customAuthChecker: AuthChecker<Context> =
	({root, args, context, info}, roles) => {
		// here you can read user from context
		// and check his permission in db against `roles` argument
		// that comes from `@Authorized`, eg. ["ADMIN", "MODERATOR"]
		for (const role of roles) {
			if (!checkRole(role, context)) {
				return false;
			}
		}
		return true;
	};

export async function buildGraphQlSchema(): Promise<GraphQLSchema> {
	registerEnums();
	return await buildSchema({
		resolvers: [
			UserResolver, AlbumResolver, ArtistResolver, ArtworkResolver, BookmarkResolver, ChatResolver,
			EpisodeResolver, FolderResolver, NowPlayingResolver, WaveformResolver, GenreResolver,
			PlaylistResolver, PlayQueueResolver, PodcastResolver, RadioResolver, RootResolver,
			RootStatusResolver, SeriesResolver, UserFavoritesResolver, MetadataResolver,
			SessionResolver, StateResolver, StatsResolver, TrackResolver, AdminResolver
		],
		authChecker: customAuthChecker
	});
}

@InRequestScope
export class ApolloMiddleware {
	@Inject
	private orm!: OrmService;
	@Inject
	private engine!: EngineService
	private schema!: GraphQLSchema;

	async playground(): Promise<express.Router> {
		const api = express.Router();
		api.get('*', express.static(path.resolve('./static/graphql/')));
		return api;
	}

	async middleware(): Promise<express.Router> {
		this.schema = await buildGraphQlSchema();
		const apollo = new ApolloServer({
			schema: this.schema,
			debug: true,
			plugins: [
				{
					async requestDidStart(_: GraphQLRequestContext<any>): Promise<GraphQLRequestListener<any> | void> {
						return {
							async willSendResponse(requestContext: GraphQLRequestContextWillSendResponse<any>): Promise<void> {
								if (requestContext.errors) {
									requestContext.errors.forEach((err: Error) => {
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
			formatError: (err): Error => {
				// if (err.message.startsWith('Database Error: ')) {
				// 	return new Error('Internal server error');
				// }
				return err;
			},
			// {
			// cdnUrl: './graphql',
			// settings: {
			// 	'request.credentials': 'same-origin'
			// 	// 'request.credentials': 'include',
			// }
			// },
			context: async ({req, res}): Promise<Context> => {
				if (!req.user) throw new AuthenticationError('you must be logged in');
				return {
					req, res,
					orm: this.orm.fork(),
					engine: this.engine,
					sessionID: req.session?.id,
					user: req.user
				} as any;
			},
		});
		await apollo.start();
		return apollo.getMiddleware({path: `/`, cors: false});
	}

	printSchema(): string {
		return printSchema(this.schema);
	}
}
