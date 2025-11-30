import { DBObjectType, DefaultOrderFields, ListType } from '../../types/enums.js';
import { IndexResult, IndexResultGroup, OrderHelper, PageResult } from './base.js';
import { StateHelper } from '../state/state.helper.js';
import { EntityRepository, IDEntity } from '../../modules/orm/index.js';
import { FindOptions, OrderItem, Includeable, WhereOptions, Op, Order } from 'sequelize';
import { User } from '../user/user.js';
import { DefaultOrderParameters, PageParameters } from './base.parameters.js';
import { paginate } from './base.utils.js';
import shuffleSeed from 'shuffle-seed';
import { invalidParameterError, notFoundError } from '../../modules/deco/express/express-error.js';

export abstract class BaseRepository<Entity extends IDEntity, Filter, OrderBy extends { orderDesc?: boolean }> extends EntityRepository<Entity> {
	objType!: DBObjectType;
	indexProperty!: string;

	abstract buildOrder(order?: OrderBy): Array<OrderItem>;

	abstract buildFilter(filter?: Filter, user?: User): Promise<FindOptions<Entity>>;

	buildDefaultOrder(order?: DefaultOrderParameters): Array<OrderItem> {
		const direction = OrderHelper.direction(order);
		switch (order?.orderBy) {
			case DefaultOrderFields.created: {
				return [['createdAt', direction]];
			}
			case DefaultOrderFields.updated: {
				return [['updatedAt', direction]];
			}
			case DefaultOrderFields.name:
			case DefaultOrderFields.default: {
				return [['name', direction]];
			}
		}
		return [];
	}

	buildOrderByFindOptions(order?: Array<{ orderBy: any; orderDesc?: boolean }>): FindOptions<Entity> | undefined {
		const options = { order: this.buildOrderBy(order as Array<any>) };
		this.ensureOrderIncludes(options);
		return options;
	}

	buildOrderBy(order?: Array<OrderBy>): Order | undefined {
		if (!order) {
			return;
		}
		let result: Array<OrderItem> = [];
		for (const o of order) {
			result = [...result, ...this.buildOrder(o)];
		}
		return result.length > 0 ? result : undefined;
	}

	ensureOrderIncludes(options: FindOptions<Entity>): void {
		let hasOrder = false;
		if (options.order) {
			for (const o of (options.order as Array<OrderItem>)) {
				const array = o as Array<any>;
				hasOrder = true;
				if (array.length === 3) {
					const key = array.at(0);
					const list: Array<Includeable> = (options.include as Array<Includeable> | undefined) ?? [];
					const includeEntry: any = list.find((entry: any) => entry.association === key);
					if (includeEntry) {
						(includeEntry.attributes as Array<any>).push(array.at(1));
					} else {
						list.push({ association: key, attributes: [array.at(1)] });
						options.include = list;
					}
				}
			}
		}
		if (hasOrder && options.include && ((options.include as Array<any>).length > 0) && (options.include as Array<any>).some(o => !!o.where)) {
			// workaround for:
			// https://github.com/sequelize/sequelize/issues/12348
			// https://github.com/sequelize/sequelize/issues/7778
			// TODO: check if workaround is still needed
			options.subQuery = false;
		}
	}

	async buildFindOptions(filter?: Filter, order?: Array<OrderBy>, user?: User, page?: PageParameters): Promise<FindOptions<Entity>> {
		const options = filter ? await this.buildFilter(filter, user) : {};
		options.limit = page?.take;
		options.offset = page?.skip;
		options.order = this.buildOrderBy(order);
		this.ensureOrderIncludes(options);
		return options;
	}

	async all(): Promise<Array<Entity>> {
		return this.find({ order: [['createdAt', 'ASC']] });
	}

	async oneOrFailByID(id: string): Promise<Entity> {
		try {
			return await super.findOneOrFailByID(id);
		} catch {
			throw notFoundError();
		}
	}

	async oneOrFail(options: FindOptions<Entity>): Promise<Entity> {
		try {
			return await super.findOneOrFail(options);
		} catch {
			throw notFoundError();
		}
	}

	async oneOrFailFilter(filter?: Filter, user?: User): Promise<Entity> {
		try {
			return await super.findOneOrFail(await this.buildFilter(filter, user));
		} catch {
			throw notFoundError();
		}
	}

	async findOneFilter(filter?: Filter, user?: User): Promise<Entity | undefined> {
		return await this.findOne(await this.buildFilter(filter, user));
	}

	async search(options: FindOptions<Entity>): Promise<PageResult<Entity>> {
		const { entities, count } = await this.findAndCount(options);
		return { skip: options.offset, take: options.limit, total: count, items: entities };
	}

	async searchTransform<T>(
		options: FindOptions<Entity>,
		transform: (item: Entity) => Promise<T>
	): Promise<PageResult<T>> {
		const { count, entities } = await this.findAndCount(options);
		const items = await Promise.all(entities.map(o => transform(o)));
		return { skip: options.offset, take: options.limit, total: count, items };
	}

	private static getIndexChar(name: string): string {
		const s = name.replaceAll(/[¿…¡?[\]{}<>‘`“'&_~=:./;@#«!%$*()+\-\\|]/g, '').trim();
		const c = (s.at(0) ?? '#').toUpperCase();
		if (!Number.isNaN(Number(c))) {
			return '#';
		}
		return c;
	}

	private static removeArticles(ignore: string, name: string): string {
		// /^(?:(?:the|los|les)\s+)?(.*)/gi
		const matches = new RegExp(String.raw`^(?:(?:${ignore})\s+)?(.*)`, 'gi').exec(name);
		return matches?.at(1) ?? name;
	}

	async index(property: keyof Entity, options: FindOptions<Entity>, ignoreArticles?: Array<string>): Promise<IndexResult<IndexResultGroup<Entity>>> {
		const ignore = ignoreArticles ? ignoreArticles.join('|') : undefined;
		const items = await this.find(options);
		const map = new Map<string, Array<Entity>>();
		for (const item of items) {
			const value = (item[property] || '') as string;
			const c = BaseRepository.getIndexChar(ignore ? BaseRepository.removeArticles(ignore, value) : value);
			const list = map.get(c) ?? [];
			list.push(item);
			map.set(c, list);
		}
		const groups: Array<IndexResultGroup<Entity>> = [];
		for (const [group, value] of map) {
			groups.push({
				name: group,
				items: value
			});
		}
		groups.sort((a, b) => a.name.localeCompare(b.name));
		for (const g of groups) {
			g.items.sort((a, b) => {
				const av = (a[property] || '') as string;
				const bv = (b[property] || '') as string;
				return av.localeCompare(bv);
			});
		}
		return { groups };
	}

	async findList(list: ListType, seed: string | undefined, options: FindOptions<Entity>, userID: string): Promise<PageResult<Entity>> {
		const result = await this.getListIDs(list, seed, options, userID);
		const items = await this.findByIDs(result.items);
		return {
			...result,
			items: items.sort((a, b) => result.items.indexOf(a.id) - result.items.indexOf(b.id))
		};
	}

	async countList(list: ListType, options: FindOptions<Entity>, userID: string): Promise<number> {
		const result = await this.getListIDs(list, undefined, { ...options, limit: 0 }, userID);
		return result.total;
	}

	async countListFilter(list: ListType, filter: Filter | undefined, user: User): Promise<number> {
		const options = await this.buildFilter(filter, user);
		const result = await this.getListIDs(list, undefined, { ...options, limit: 0 }, user.id);
		return result.total;
	}

	async countFilter(filter: Filter | undefined, user?: User): Promise<number> {
		return await this.count(await this.buildFilter(filter, user));
	}

	async findFilter(filter?: Filter, order?: Array<OrderBy>, page?: PageParameters, user?: User): Promise<Array<Entity>> {
		return await this.find(await this.buildFindOptions(filter, order, user, page));
	}

	async findIDsFilter(filter: Filter | undefined, user?: User): Promise<Array<string>> {
		return await this.findIDs(await this.buildFilter(filter, user));
	}

	async findListFilter(list: ListType, seed: string | undefined, filter: Filter | undefined, order: Array<OrderBy> | undefined, page: PageParameters | undefined, user: User): Promise<PageResult<Entity>> {
		return await this.findList(list, seed, await this.buildFindOptions(filter, order, user, page), user.id);
	}

	async findListTransformFilter<T>(list: ListType, seed: string | undefined, filter: Filter, order: Array<OrderBy> | undefined, page: PageParameters, user: User, transform: (item: Entity) => Promise<T>): Promise<PageResult<T>> {
		return await this.findListTransform<T>(list, seed, await this.buildFindOptions(filter, order, user, page), user.id, transform);
	}

	async searchFilter(filter: Filter | undefined, order: Array<OrderBy> | undefined, page: PageParameters | undefined, user: User): Promise<PageResult<Entity>> {
		return await this.search(await this.buildFindOptions(filter, order, user, page));
	}

	async searchTransformFilter<T>(
		filter: Filter | undefined,
		order: Array<OrderBy>,
		page: PageParameters,
		user: User,
		transform: (item: Entity) => Promise<T>
	): Promise<PageResult<T>> {
		return await this.searchTransform<T>(await this.buildFindOptions(filter, order, user, page), transform);
	}

	async findListTransform<T>(
		list: ListType,
		seed: string | undefined,
		options: FindOptions<Entity>,
		userID: string,
		transform: (item: Entity) => Promise<T>
	): Promise<PageResult<T>> {
		const result = await this.findList(list, seed, options, userID);
		return {
			...result,
			items: await Promise.all(result.items.map(o => transform(o)))
		};
	}

	async indexFilter(filter?: Filter, user?: User, ignoreArticles?: Array<string>): Promise<IndexResult<IndexResultGroup<Entity>>> {
		return await this.index(this.indexProperty as keyof Entity, await this.buildFilter(filter, user), ignoreArticles);
	}

	private async getListIDs(list: ListType, seed: string | undefined, findOptions: FindOptions<Entity>, userID: string): Promise<PageResult<string>> {
		let ids: Array<string> = [];
		const options = { ...findOptions, limit: undefined, offset: undefined };
		const page = { skip: findOptions.offset, take: findOptions.limit };
		switch (list) {
			case ListType.random: {
				ids = await this.findIDs(options);
				let s = seed;
				// to avoid duplicate entries, shuffle MUST be seeded
				// if the api caller does not specify a seed, the random list will be "random" only per day for a user
				// (dups can still occur on day change between two requests)
				s ??= `${userID}_${new Date().toISOString().split('T').at(0)}`;
				ids.sort((a, b) => a.localeCompare(b));
				ids = shuffleSeed.shuffle(ids, s);
				break;
			}
			case ListType.highest: {
				ids = await this.getHighestRatedIDs(options, userID);
				break;
			}
			case ListType.avghighest: {
				ids = await this.getAvgHighestIDs(options);
				break;
			}
			case ListType.frequent: {
				ids = await this.getFrequentlyPlayedIDs(options, userID);
				break;
			}
			case ListType.faved: {
				ids = await this.getFavedIDs(options, userID);
				break;
			}
			case ListType.recent: {
				ids = await this.getRecentlyPlayedIDs(options, userID);
				break;
			}
			default: {
				return Promise.reject(invalidParameterError('Unknown List Type'));
			}
		}
		const total = ids.length;
		ids = paginate(ids, page).items;
		return { total, ...page, items: ids };
	}

	private async getFilteredIDs(ids: Array<string>, options: FindOptions<Entity>): Promise<Array<string>> {
		if (!options.where) {
			return ids;
		}
		let where: WhereOptions = { id: { [Op.in]: ids } };
		if (Object.keys(options.where).length > 0 ||
			Object.getOwnPropertySymbols(options.where).length > 0) {
			where = { [Op.and]: [where, options.where] };
		}
		const list = await this.findIDs({ ...options, where });
		return list.sort((a, b) => ids.indexOf(a) - ids.indexOf(b));
	}

	private async getHighestRatedIDs(options: FindOptions<Entity>, userID: string): Promise<Array<string>> {
		const helper = new StateHelper(this.em);
		const ids = await helper.getHighestRatedDestIDs(this.objType, userID);
		return this.getFilteredIDs(ids, options);
	}

	private async getAvgHighestIDs(options: FindOptions<Entity>): Promise<Array<string>> {
		const helper = new StateHelper(this.em);
		const ids = await helper.getAvgHighestDestIDs(this.objType);
		return this.getFilteredIDs(ids, options);
	}

	private async getFrequentlyPlayedIDs(options: FindOptions<Entity>, userID: string): Promise<Array<string>> {
		const helper = new StateHelper(this.em);
		const ids = await helper.getFrequentlyPlayedDestIDs(this.objType, userID);
		return this.getFilteredIDs(ids, options);
	}

	private async getFavedIDs(options: FindOptions<Entity>, userID: string): Promise<Array<string>> {
		const helper = new StateHelper(this.em);
		const ids = await helper.getFavedDestIDs(this.objType, userID);
		return this.getFilteredIDs(ids, options);
	}

	private async getRecentlyPlayedIDs(options: FindOptions<Entity>, userID: string): Promise<Array<string>> {
		const helper = new StateHelper(this.em);
		const ids = await helper.getRecentlyPlayedDestIDs(this.objType, userID);
		return this.getFilteredIDs(ids, options);
	}

	async removeLaterByIDs(ids: Array<string>): Promise<void> {
		if (ids.length > 0) {
			const items = await this.findByIDs(ids);
			for (const item of items) {
				this.removeLater(item);
			}
		}
	}
}
