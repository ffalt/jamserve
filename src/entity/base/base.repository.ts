import {DBObjectType, DefaultOrderFields, ListType} from '../../types/enums';
import {InvalidParamError, NotFoundError} from '../../modules/rest/builder';
import {IndexResult, IndexResultGroup, OrderHelper, PageResult} from './base';
import {StateHelper} from '../state/state.helper';
import {EntityRepository, FindOptions, IDEntity, Op, Order, OrderItem, WhereOptions} from '../../modules/orm';
import {User} from '../user/user';
import {DefaultOrderArgs, PageArgs} from './base.args';
import {paginate} from './base.utils';
import {Includeable} from 'sequelize';
import shuffleSeed from 'shuffle-seed';

export abstract class BaseRepository<Entity extends IDEntity, Filter, OrderBy extends { orderDesc?: boolean }> extends EntityRepository<Entity> {
	objType!: DBObjectType;
	indexProperty!: string;

	abstract buildOrder(order?: OrderBy): Array<OrderItem>;

	abstract async buildFilter(filter?: Filter, user?: User): Promise<FindOptions<Entity>>;

	buildDefaultOrder(order?: DefaultOrderArgs): Array<OrderItem> {
		const direction = OrderHelper.direction(order);
		switch (order?.orderBy) {
			case DefaultOrderFields.created:
				return [['createdAt', direction]];
			case DefaultOrderFields.updated:
				return [['updatedAt', direction]];
			case DefaultOrderFields.name:
			case DefaultOrderFields.default:
				return [['name', direction]];
		}
		return [];
	}

	buildOrderByFindOptions(order?: Array<{ orderBy: any; orderDesc?: boolean }>): FindOptions<Entity> | undefined {
		const options = {order: this.buildOrderBy(order as Array<any>)};
		this.ensureOrderIncludes(options);
		return options;
	}

	buildOrderBy(order?: Array<OrderBy>): Order | undefined {
		if (!order) {
			return;
		}
		let result: Array<OrderItem> = [];
		order.forEach(o => result = result.concat(this.buildOrder(o)));
		return result.length > 0 ? result : undefined;
	}

	ensureOrderIncludes(options: FindOptions<Entity>): void {
		let hasOrder = false;
		if (options.order) {
			(options.order as OrderItem[]).forEach(o => {
				const array = (o as Array<any>);
				hasOrder = true;
				if (array.length === 3) {
					const key = array[0];
					const list: Includeable[] = (options.include as Includeable[]) || [];
					const includeEntry: any = list.find((i: any) => i.association === key);
					if (!includeEntry) {
						list.push({association: key, attributes: [array[1]]});
						options.include = list;
					} else {
						includeEntry.attributes.push(array[1]);
					}
				}
			});
		}
		if (hasOrder && options.include && ((options.include as Array<any>).length > 0)) {
			if ((options.include as Array<any>).find(o => !!o.where)) {
				// workaround for:
				// https://github.com/sequelize/sequelize/issues/12348
				// https://github.com/sequelize/sequelize/issues/7778
				// TODO: check if workaround is still needed
				options.subQuery = false;
			}
		}
	}

	async buildFindOptions(filter?: Filter, order?: Array<OrderBy>, user?: User, page?: PageArgs): Promise<FindOptions<Entity>> {
		const options = filter ? await this.buildFilter(filter, user) : {};
		options.limit = page?.take;
		options.offset = page?.skip;
		options.order = this.buildOrderBy(order);
		this.ensureOrderIncludes(options);
		return options;
	}

	async all(): Promise<Array<Entity>> {
		return this.find({order: [['createdAt', 'ASC']]});
	}

	async oneOrFailByID(id: string): Promise<Entity> {
		try {
			return await super.findOneOrFailByID(id);
		} catch (e) {
			throw NotFoundError();
		}
	}

	async oneOrFail(options: FindOptions<Entity>): Promise<Entity> {
		try {
			return await super.findOneOrFail(options);
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
		return;
	}

	async search(options: FindOptions<Entity>): Promise<PageResult<Entity>> {
		const {entities, count} = await this.findAndCount(options);
		return {skip: options.offset, take: options.limit, total: count, items: entities};
	}

	async searchTransform<T>(
		options: FindOptions<Entity>,
		transform: (item: Entity) => Promise<T>
	): Promise<PageResult<T>> {
		const {count, entities} = await this.findAndCount(options);
		const items = await Promise.all(entities.map(o => transform(o)));
		return {skip: options.offset, take: options.limit, total: count, items};
	}

	private static getIndexChar(name: string): string {
		const s = name.replace(/[¿…¡?[\]{}<>‘`“'&_~=:./;@#«!%$*()+\-\\|]/g, '').trim();
		if (s.length === 0) {
			return '#';
		}
		const c = s.charAt(0).toUpperCase();
		if (!isNaN(Number(c))) {
			return '#';
		}
		return c;
	}

	private static removeArticles(ignore: string, name: string): string {
		// /^(?:(?:the|los|les)\s+)?(.*)/gi
		const matches = new RegExp(`^(?:(?:${ignore})\\s+)?(.*)`, 'gi').exec(name);
		return matches ? matches[1] : name;
	}

	async index(property: keyof Entity, options: FindOptions<Entity>, ignoreArticles?: Array<string>): Promise<IndexResult<IndexResultGroup<Entity>>> {
		const ignore = ignoreArticles ? ignoreArticles.join('|') : undefined;
		const items = await this.find(options);
		const map = new Map<string, Array<Entity>>();
		for (const item of items) {
			const value = (item[property] || '') as string;
			const c = BaseRepository.getIndexChar(ignore ? BaseRepository.removeArticles(ignore, value) : value);
			const list = map.get(c) || [];
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
		groups.forEach(g => {
			g.items.sort((a, b) => {
				const av = (a[property] || '') as string;
				const bv = (b[property] || '') as string;
				return av.localeCompare(bv);
			});
		});
		return {groups};
	}

	async findOneIDorFail(options: FindOptions<Entity>): Promise<string> {
		const result = await this.findOneID(options);
		if (!result) {
			throw NotFoundError();
		}
		return result;
	}

	async findList(list: ListType, seed: string | undefined, options: FindOptions<Entity>, userID: string): Promise<PageResult<Entity>> {
		const result = await this.getListIDs(list, seed, options, userID);
		return {
			...result,
			items: await this.findByIDs(result.items)
		};
	}

	async countList(list: ListType, options: FindOptions<Entity>, userID: string): Promise<number> {
		const result = await this.getListIDs(list, undefined, {...options, limit: 0}, userID);
		return result.total;
	}

	async countListFilter(list: ListType, filter: Filter | undefined, user: User): Promise<number> {
		const options = await this.buildFilter(filter, user);
		const result = await this.getListIDs(list, undefined, {...options, limit: 0}, user.id);
		return result.total;
	}

	async countFilter(filter: Filter | undefined, user?: User): Promise<number> {
		return await this.count(await this.buildFilter(filter, user));
	}

	async findFilter(filter?: Filter | undefined, order?: Array<OrderBy> | undefined, page?: PageArgs | undefined, user?: User | undefined): Promise<Array<Entity>> {
		return await this.find(await this.buildFindOptions(filter, order, user, page));
	}

	async findIDsFilter(filter: Filter | undefined, user?: User): Promise<Array<string>> {
		return await this.findIDs(await this.buildFilter(filter, user));
	}

	async findListFilter(list: ListType, seed: string | undefined, filter: Filter | undefined, order: Array<OrderBy> | undefined, page: PageArgs | undefined, user: User): Promise<PageResult<Entity>> {
		return await this.findList(list, seed, await this.buildFindOptions(filter, order, user, page), user.id);
	}

	async findListTransformFilter<T>(list: ListType, seed: string | undefined, filter: Filter, order: Array<OrderBy> | undefined, page: PageArgs, user: User, transform: (item: Entity) => Promise<T>): Promise<PageResult<T>> {
		return await this.findListTransform<T>(list, seed, await this.buildFindOptions(filter, order, user, page), user.id, transform);
	}

	async searchFilter(filter: Filter | undefined, order: Array<OrderBy> | undefined, page: PageArgs | undefined, user: User): Promise<PageResult<Entity>> {
		return await this.search(await this.buildFindOptions(filter, order, user, page));
	}

	async searchTransformFilter<T>(
		filter: Filter | undefined,
		order: Array<OrderBy>,
		page: PageArgs,
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

	private async getListIDs(list: ListType, seed: string | undefined, options: FindOptions<Entity>, userID: string): Promise<PageResult<string>> {
		let ids: Array<string> = [];
		const opts = {...options, limit: undefined, offset: undefined};
		const page = {skip: options.offset, take: options.limit};
		switch (list) {
			case ListType.random: {
				ids = await this.findIDs(opts);
				let s = seed;
				// to avoid duplicate entries, shuffle MUST be seeded
				if (!s) {
					// if the api caller does not specify a seed, the random list will be "random" only per day for a user
					// (dups can still occure on day change between two requests)
					s = `${userID}_${new Date().toISOString().split('T')[0]}`;
				}
				ids = shuffleSeed.shuffle(ids, s);
				break;
			}
			case ListType.highest:
				ids = await this.getHighestRatedIDs(opts, userID);
				break;
			case ListType.avghighest:
				ids = await this.getAvgHighestIDs(opts);
				break;
			case ListType.frequent:
				ids = await this.getFrequentlyPlayedIDs(opts, userID);
				break;
			case ListType.faved:
				ids = await this.getFavedIDs(opts, userID);
				break;
			case ListType.recent:
				ids = await this.getRecentlyPlayedIDs(opts, userID);
				break;
			default:
				return Promise.reject(InvalidParamError('Unknown List Type'));
		}
		ids = paginate(ids, page).items;
		const total = ids.length;
		return {total, ...page, items: ids};
	}

	private async getFilteredIDs(ids: Array<string>, options: FindOptions<Entity>): Promise<Array<string>> {
		let where: WhereOptions<Entity> = {id: {[Op.in]: ids}};
		if (options.where &&
			(Object.keys(options.where).length > 0 ||
				Object.getOwnPropertySymbols(options.where).length > 0)
		) {
			where = {[Op.and]: [where, options.where]};
		}
		const list = await this.findIDs({...options, where});
		return list.sort((a, b) => {
			return ids.indexOf(a) - ids.indexOf(b);
		});
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
		if (ids && ids.length > 0) {
			const items = await this.findByIDs(ids);
			for (const item of items) {
				this.removeLater(item);
			}
		}
	}

}
