import {DBObjectType} from '../../types/enums';
import {Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot} from 'type-graphql';
import {State, StateQL} from '../state/state';
import {Series, SeriesIndexQL, SeriesPageQL, SeriesQL} from './series';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {SeriesArgsQL, SeriesIndexArgsQL} from './series.args';

@Resolver(SeriesQL)
export class SeriesResolver {
	@Query(() => SeriesQL, {description: 'Get a Series by Id'})
	async series(@Arg('id', () => ID!) id: string, @Ctx() {orm}: Context): Promise<Series> {
		return await orm.Series.oneOrFail(id)
	}

	@Query(() => SeriesPageQL, {description: 'Search Series'})
	async serieses(@Args() {page, filter, order, list}: SeriesArgsQL, @Ctx() {orm, user}: Context): Promise<SeriesPageQL> {
		if (list) {
			return await orm.Series.findListFilter(list, filter, order, page, user);
		}
		return await orm.Series.searchFilter(filter, order, page, user);
	}

	@Query(() => SeriesIndexQL, {description: 'Get the Navigation Index for Series'})
	async seriesIndex(@Args() {filter}: SeriesIndexArgsQL, @Ctx() {orm, user}: Context): Promise<SeriesIndexQL> {
		return await orm.Series.indexFilter(filter, user);
	}

	@FieldResolver(() => Int)
	async rootsCount(@GQLRoot() series: Series, @Ctx() {orm}: Context): Promise<number> {
		await orm.Series.populate(series, 'roots');
		return series.roots.length;
	}

	@FieldResolver(() => Int)
	async foldersCount(@GQLRoot() series: Series, @Ctx() {orm}: Context): Promise<number> {
		await orm.Series.populate(series, 'folders');
		return series.folders.length;
	}

	@FieldResolver(() => Int)
	async tracksCount(@GQLRoot() series: Series, @Ctx() {orm}: Context): Promise<number> {
		await orm.Series.populate(series, 'tracks');
		return series.tracks.length;
	}

	@FieldResolver(() => Int)
	async albumsCount(@GQLRoot() series: Series, @Ctx() {orm}: Context): Promise<number> {
		await orm.Series.populate(series, 'albums');
		return series.albums.length;
	}

	@FieldResolver(() => StateQL)
	async state(@GQLRoot() series: Series, @Ctx() {orm, user}: Context): Promise<State> {
		return await orm.State.findOrCreate(series.id, DBObjectType.series, user.id);
	}
}
