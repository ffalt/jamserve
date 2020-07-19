import {EntityRepository, FilterQuery, FindOptions, QueryOrder} from 'mikro-orm';
import {QBFilterQuery, Query} from 'mikro-orm/dist/typings';
import {DBObjectType, DefaultOrderFields, ListType} from '../../types/enums';
import {randomItems} from '../../utils/random';
import {InvalidParamError, NotFoundError} from '../../modules/rest/builder';
import {IndexResult, IndexResultGroup, PageResult} from './base';
import {StateHelper} from '../state/state.helper';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {User} from '../user/user';
import {PageArgs} from './base.args';
import {paginate} from './base.utils';

export abstract class BaseRepository<Entity, Filter, Order extends { orderDesc?: boolean }> extends EntityRepository<Entity> {
	objType!: DBObjectType;
	indexProperty!: string;

	abstract applyOrderByEntry(orderBy: QueryOrderMap, direction: QueryOrder, order?: Order): void;

	abstract async buildFilter(filter?: Filter, user?: User): Promise<QBFilterQuery<Entity>>

	applyDefaultOrderByEntry(result: QueryOrderMap, direction: QueryOrder, orderBy?: DefaultOrderFields): void {
		switch (orderBy) {
			case DefaultOrderFields.created:
				result.createdAt = direction;
				break;
			case DefaultOrderFields.updated:
				result.updatedAt = direction;
				break;
			case DefaultOrderFields.name:
				result.name = direction;
				break;
			case DefaultOrderFields.default:
				result.name = direction;
				break;
		}
	}

	buildOrderBy(order?: Array<Order>): QueryOrderMap | undefined {
		if (!order) {
			return;
		}
		// order of setting properties matches sort query. important!
		const result: QueryOrderMap = {};
		for (const o of order) {
			this.applyOrderByEntry(result, o?.orderDesc ? QueryOrder.DESC : QueryOrder.ASC, o);
		}
		if (Object.keys(result).length > 0) {
			return result;
		}
	}

	async all(): Promise<Array<Entity>> {
		return this.find({});
	}

	async oneOrFail(where: FilterQuery<Entity>, populate?: string[] | boolean, orderBy?: QueryOrderMap): Promise<Entity> {
		try {
			return await super.findOneOrFail(where, populate, orderBy);
		} catch (e) {
			throw NotFoundError();
		}
	}

	async oneOrFailFilter(filter?: Filter, user?: User): Promise<Entity> {
		try {
			return await super.findOneOrFail(await this.buildFilter(filter, user));
		} catch (e) {
			throw NotFoundError();
		}
	}

	async findOneFilter(filter?: Filter, user?: User): Promise<Entity | undefined> {
		const result = await this.findOne(await this.buildFilter(filter, user));
		if (result !== null) {
			return result;
		}
	}

	async search(filter: QBFilterQuery<Entity>, orderBy: QueryOrderMap | undefined, page?: PageArgs): Promise<PageResult<Entity>> {
		const [items, total] = await this.findAndCount(filter, [], orderBy, page?.take, page?.skip);
		return {...(page || {}), total, items};
	}

	async searchTransform<T>(
		filter: QBFilterQuery<Entity>,
		order: QueryOrderMap | undefined,
		page: PageArgs | undefined,
		transform: (item: Entity) => Promise<T>
	): Promise<PageResult<T>> {
		const [result, total] = await this.findAndCount(filter, [], order, page?.take, page?.skip);
		const items = await Promise.all(result.map(o => transform(o)));
		return {...(page || {}), total, items};
	}

	async findIDsAndCount(where: QBFilterQuery<Entity>, page?: PageArgs): Promise<[string[], number]> {
		// TODO: how to count all in limited createQueryBuilder
		const builder = this.createQueryBuilder('o')
			.addSelect('id')
			.where(where);
		let result = await builder.execute('all', false);
		const count = result.length;
		if (page?.skip) {
			result = result.slice(page.skip);
		}
		if (page?.take) {
			result = result.slice(0, page.take);
		}
		return [result.map((o: { id: string }) => o.id), count];
	}

	async index(property: string, filter: QBFilterQuery<Entity>): Promise<IndexResult<IndexResultGroup<Entity>>> {
		const builder = this.createQueryBuilder('o');
		const groupSQL = `upper(substr(o.${property},1,1))`;
		builder
			.select('id')
			.addSelect(`${groupSQL} as g`)
			.where(filter)
			.groupBy(groupSQL)
		const map = new Map<string, Array<string>>();
		const result = await builder.execute('all');
		for (const entry of result) {
			const list = map.get(entry.g) || [];
			list.push(entry.id);
			map.set(entry.g, list);
		}
		const groups: Array<IndexResultGroup<Entity>> = [];
		for (const [group, value] of map) {
			groups.push({
				name: group,
				items: await this.find({id: {$in: value}} as Query<Entity>)
			})
		}
		return {groups};
	}

	async findOneIDorFail(where: QBFilterQuery<Entity>): Promise<string> {
		const result = await this.findOneID(where);
		if (!result) {
			throw NotFoundError();
		}
		return result;
	}

	async findOneID(where: QBFilterQuery<Entity>): Promise<string | undefined> {
		const builder = this.createQueryBuilder('o')
			.addSelect('id')
			.where(where);
		const result = await builder.execute('get');
		return result?.id;
	}

	async findIDs(where: QBFilterQuery<Entity>): Promise<string[]> {
		const builder = this.createQueryBuilder('o')
			.addSelect('id')
			.where(where);
		const result = await builder.execute('all');
		return result.map((o: { id: string }) => o.id);
	}

	async findList(list: ListType, where: QBFilterQuery<Entity>, orderBy: QueryOrderMap | undefined, page: PageArgs | undefined, userID: string): Promise<PageResult<Entity>> {
		const result = await this.getListIDs(list, where, orderBy, page, userID);
		return {
			...result,
			items: await this.find({id: {$in: result.items}} as FilterQuery<Entity>)
		};
	}

	async countFilter(filter: Filter | undefined, user?: User): Promise<number> {
		return await this.count(await this.buildFilter(filter, user));
	}

	async findFilter(filter: Filter | undefined, options?: FindOptions, user?: User): Promise<Array<Entity>> {
		return await this.find(await this.buildFilter(filter, user), options);
	}

	async findIDsFilter(filter: Filter | undefined, user?: User): Promise<Array<string>> {
		return await this.findIDs(await this.buildFilter(filter, user));
	}

	async findListFilter(list: ListType, filter: Filter | undefined, order: Array<Order> | undefined, page: PageArgs | undefined, user: User): Promise<PageResult<Entity>> {
		return await this.findList(list, await this.buildFilter(filter, user), this.buildOrderBy(order), page, user.id);
	}

	async findListTransformFilter<T>(list: ListType, filter: Filter, order: Array<Order> | undefined, page: PageArgs, user: User, transform: (item: Entity) => Promise<T>): Promise<PageResult<T>> {
		return await this.findListTransform<T>(list, await this.buildFilter(filter, user), this.buildOrderBy(order), page, user.id, transform);
	}

	async searchFilter(filter: Filter | undefined, order: Array<Order> | undefined, page: PageArgs | undefined, user: User): Promise<PageResult<Entity>> {
		return await this.search(await this.buildFilter(filter, user), this.buildOrderBy(order), page);
	}

	async searchTransformFilter<T>(filter: Filter | undefined, order: Array<Order>, page: PageArgs, user: User, transform: (item: Entity) => Promise<T>): Promise<PageResult<T>> {
		return await this.searchTransform<T>(
			await this.buildFilter(filter, user),
			this.buildOrderBy(order),
			page,
			transform
		);
	}

	async findListTransform<T>(
		list: ListType,
		where: QBFilterQuery<Entity>,
		orderBy: QueryOrderMap | undefined,
		page: PageArgs | undefined,
		userID: string,
		transform: (item: Entity) => Promise<T>
	): Promise<PageResult<T>> {
		const result = await this.findList(list, where, orderBy, page, userID);
		return {
			...result,
			items: await Promise.all(result.items.map(o => transform(o)))
		};
	}

	async indexFilter(filter?: Filter, user?: User): Promise<IndexResult<IndexResultGroup<Entity>>> {
		return await this.index(this.indexProperty, await this.buildFilter(filter, user));
	}

	private async getListIDs(list: ListType, where: QBFilterQuery<Entity>, orderBy: QueryOrderMap | undefined, page: PageArgs | undefined, userID: string): Promise<PageResult<string>> {
		let ids: Array<string> = [];
		let total: number | undefined;
		if (!page) {
			page = {};
		}
		switch (list) {
			case ListType.random:
				// TODO: cache ids to avoid duplicates in random items pagination?
				ids = await this.findIDs(where);
				page.take = page.take || 20;
				total = ids.length;
				ids = randomItems<string>(ids, page.take);
				break;
			case ListType.highest:
				ids = await this.getHighestRatedIDs(where, userID);
				total = ids.length;
				ids = paginate(ids, page).items;
				break;
			case ListType.avghighest:
				ids = await this.getAvgHighestIDs(where);
				total = ids.length;
				ids = paginate(ids, page).items;
				break;
			case ListType.frequent:
				ids = await this.getFrequentlyPlayedIDs(where, userID);
				total = ids.length;
				ids = paginate(ids, page).items;
				break;
			case ListType.faved:
				ids = await this.getFavedIDs(where, userID);
				total = ids.length;
				ids = paginate(ids, page).items;
				break;
			case ListType.recent:
				ids = await this.getRecentlyPlayedIDs(where, userID);
				total = ids.length;
				ids = paginate(ids, page).items;
				break;
			default:
				return Promise.reject(InvalidParamError('Unknown List Type'));
		}
		return {total, ...page, items: ids};
	}

	private async getFilteredIDs(ids: Array<string>, where: QBFilterQuery<Entity>): Promise<Array<string>> {
		const list = await this.findIDs({$and: [{id: {$in: ids}}, where]});
		return list.sort((a, b) => {
			return ids.indexOf(a) - ids.indexOf(b);
		});
	}

	private async getHighestRatedIDs(where: QBFilterQuery<Entity>, userID: string): Promise<Array<string>> {
		const helper = new StateHelper(this.em);
		const ids = await helper.getHighestRatedDestIDs(this.objType, userID);
		return this.getFilteredIDs(ids, where);
	}

	private async getAvgHighestIDs(where: QBFilterQuery<Entity>): Promise<Array<string>> {
		const helper = new StateHelper(this.em);
		const ids = await helper.getAvgHighestDestIDs(this.objType);
		return this.getFilteredIDs(ids, where);
	}

	private async getFrequentlyPlayedIDs(where: QBFilterQuery<Entity>, userID: string): Promise<Array<string>> {
		const helper = new StateHelper(this.em);
		const ids = await helper.getFrequentlyPlayedDestIDs(this.objType, userID);
		return this.getFilteredIDs(ids, where);
	}

	private async getFavedIDs(where: QBFilterQuery<Entity>, userID: string): Promise<Array<string>> {
		const helper = new StateHelper(this.em);
		const ids = await helper.getFavedDestIDs(this.objType, userID);
		return this.getFilteredIDs(ids, where);
	}

	private async getRecentlyPlayedIDs(where: QBFilterQuery<Entity>, userID: string): Promise<Array<string>> {
		const helper = new StateHelper(this.em);
		const ids = await helper.getRecentlyPlayedDestIDs(this.objType, userID);
		return this.getFilteredIDs(ids, where);
	}

}
