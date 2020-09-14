import {DBObjectType, PodcastStatus} from '../../types/enums';
import {Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot} from 'type-graphql';
import {State, StateQL} from '../state/state';
import {Podcast, PodcastIndexQL, PodcastPageQL, PodcastQL} from './podcast';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {PodcastIndexArgsQL, PodcastsArgsQL} from './podcast.args';
import {Episode, EpisodeQL} from '../episode/episode';

@Resolver(PodcastQL)
export class PodcastResolver {
	@Query(() => PodcastQL, {description: 'Get a Podcast by Id'})
	async podcast(@Arg('id', () => ID!) id: string, @Ctx() {orm}: Context): Promise<Podcast> {
		return await orm.Podcast.oneOrFailByID(id);
	}

	@Query(() => PodcastPageQL, {description: 'Search Podcasts'})
	async podcasts(@Args() {page, filter, order, list, seed}: PodcastsArgsQL, @Ctx() {orm, user}: Context): Promise<PodcastPageQL> {
		if (list) {
			return await orm.Podcast.findListFilter(list, seed, filter, order, page, user);
		}
		return await orm.Podcast.searchFilter(filter, order, page, user);
	}

	@Query(() => PodcastIndexQL, {description: 'Get the Navigation Index for Podcasts'})
	async podcastIndex(@Args() {filter}: PodcastIndexArgsQL, @Ctx() {orm, user}: Context): Promise<PodcastIndexQL> {
		return await orm.Podcast.indexFilter(filter, user);
	}

	@FieldResolver(() => StateQL)
	async state(@GQLRoot() podcast: Podcast, @Ctx() {orm, user}: Context): Promise<State> {
		return await orm.State.findOrCreate(podcast.id, DBObjectType.podcast, user.id);
	}

	@FieldResolver(() => PodcastStatus)
	status(@GQLRoot() podcast: Podcast, @Ctx() {engine}: Context): PodcastStatus {
		return engine.podcast.isDownloading(podcast.id) ? PodcastStatus.downloading : podcast.status;
	}

	@FieldResolver(() => [EpisodeQL])
	async episodes(@GQLRoot() podcast: Podcast): Promise<Array<Episode>> {
		return podcast.episodes.getItems();
	}

	@FieldResolver(() => Int)
	async episodesCount(@GQLRoot() podcast: Podcast): Promise<number> {
		return podcast.episodes.count();
	}

	@FieldResolver(() => Date)
	async lastCheck(@GQLRoot() timestamp: number): Promise<Date> {
		return new Date(timestamp);
	}
}
