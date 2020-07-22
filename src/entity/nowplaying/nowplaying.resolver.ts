import {Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root as GQLRoot} from 'type-graphql';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {NowPlaying, NowPlayingQL} from './nowplaying';

@Resolver(NowPlayingQL)
export class NowPlayingResolver {

	@Query(() => [NowPlayingQL], {description: 'Get a List of media [Track, Episode] played currently by Users'})
	async nowPlaying(@Ctx() {engine}: Context): Promise<Array<NowPlaying>> {
		return engine.nowPlayingService.getNowPlaying();
	}

	@FieldResolver(() => ID)
	async userID(@GQLRoot() nowPlaying: NowPlaying): Promise<string> {
		return nowPlaying.user.id;
	}

	@FieldResolver(() => String)
	async userName(@GQLRoot() nowPlaying: NowPlaying): Promise<string> {
		return nowPlaying.user.name;
	}

	@Mutation(() => NowPlayingQL)
	async scrobble(@Arg('id', () => ID!) id: string, @Ctx() {engine, orm, user}: Context): Promise<NowPlaying> {
		return await engine.nowPlayingService.scrobble(orm, id, user);
	}
}

