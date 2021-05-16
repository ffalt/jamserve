"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const enums_1 = require("../../types/enums");
const builder_1 = require("../../modules/rest/builder");
const base_1 = require("./base");
const state_helper_1 = require("../state/state.helper");
const orm_1 = require("../../modules/orm");
const base_utils_1 = require("./base.utils");
const shuffle_seed_1 = __importDefault(require("shuffle-seed"));
class BaseRepository extends orm_1.EntityRepository {
    buildDefaultOrder(order) {
        const direction = base_1.OrderHelper.direction(order);
        switch (order?.orderBy) {
            case enums_1.DefaultOrderFields.created:
                return [['createdAt', direction]];
            case enums_1.DefaultOrderFields.updated:
                return [['updatedAt', direction]];
            case enums_1.DefaultOrderFields.name:
            case enums_1.DefaultOrderFields.default:
                return [['name', direction]];
        }
        return [];
    }
    buildOrderByFindOptions(order) {
        const options = { order: this.buildOrderBy(order) };
        this.ensureOrderIncludes(options);
        return options;
    }
    buildOrderBy(order) {
        if (!order) {
            return;
        }
        let result = [];
        order.forEach(o => result = result.concat(this.buildOrder(o)));
        return result.length > 0 ? result : undefined;
    }
    ensureOrderIncludes(options) {
        let hasOrder = false;
        if (options.order) {
            options.order.forEach(o => {
                const array = o;
                hasOrder = true;
                if (array.length === 3) {
                    const key = array[0];
                    const list = options.include || [];
                    const includeEntry = list.find((i) => i.association === key);
                    if (!includeEntry) {
                        list.push({ association: key, attributes: [array[1]] });
                        options.include = list;
                    }
                    else {
                        includeEntry.attributes.push(array[1]);
                    }
                }
            });
        }
        if (hasOrder && options.include && (options.include.length > 0)) {
            if (options.include.find(o => !!o.where)) {
                options.subQuery = false;
            }
        }
    }
    async buildFindOptions(filter, order, user, page) {
        const options = filter ? await this.buildFilter(filter, user) : {};
        options.limit = page?.take;
        options.offset = page?.skip;
        options.order = this.buildOrderBy(order);
        this.ensureOrderIncludes(options);
        return options;
    }
    async all() {
        return this.find({ order: [['createdAt', 'ASC']] });
    }
    async oneOrFailByID(id) {
        try {
            return await super.findOneOrFailByID(id);
        }
        catch (e) {
            throw builder_1.NotFoundError();
        }
    }
    async oneOrFail(options) {
        try {
            return await super.findOneOrFail(options);
        }
        catch (e) {
            throw builder_1.NotFoundError();
        }
    }
    async oneOrFailFilter(filter, user) {
        try {
            return await super.findOneOrFail(await this.buildFilter(filter, user));
        }
        catch (e) {
            throw builder_1.NotFoundError();
        }
    }
    async findOneFilter(filter, user) {
        const result = await this.findOne(await this.buildFilter(filter, user));
        if (result !== null) {
            return result;
        }
        return;
    }
    async search(options) {
        const { entities, count } = await this.findAndCount(options);
        return { skip: options.offset, take: options.limit, total: count, items: entities };
    }
    async searchTransform(options, transform) {
        const { count, entities } = await this.findAndCount(options);
        const items = await Promise.all(entities.map(o => transform(o)));
        return { skip: options.offset, take: options.limit, total: count, items };
    }
    static getIndexChar(name) {
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
    static removeArticles(ignore, name) {
        const matches = new RegExp(`^(?:(?:${ignore})\\s+)?(.*)`, 'gi').exec(name);
        return matches ? matches[1] : name;
    }
    async index(property, options, ignoreArticles) {
        const ignore = ignoreArticles ? ignoreArticles.join('|') : undefined;
        const items = await this.find(options);
        const map = new Map();
        for (const item of items) {
            const value = (item[property] || '');
            const c = BaseRepository.getIndexChar(ignore ? BaseRepository.removeArticles(ignore, value) : value);
            const list = map.get(c) || [];
            list.push(item);
            map.set(c, list);
        }
        const groups = [];
        for (const [group, value] of map) {
            groups.push({
                name: group,
                items: value
            });
        }
        groups.sort((a, b) => a.name.localeCompare(b.name));
        groups.forEach(g => {
            g.items.sort((a, b) => {
                const av = (a[property] || '');
                const bv = (b[property] || '');
                return av.localeCompare(bv);
            });
        });
        return { groups };
    }
    async findOneIDorFail(options) {
        const result = await this.findOneID(options);
        if (!result) {
            throw builder_1.NotFoundError();
        }
        return result;
    }
    async findList(list, seed, options, userID) {
        const result = await this.getListIDs(list, seed, options, userID);
        return {
            ...result,
            items: (await this.findByIDs(result.items)).sort((a, b) => result.items.indexOf(a.id) - result.items.indexOf(b.id))
        };
    }
    async countList(list, options, userID) {
        const result = await this.getListIDs(list, undefined, { ...options, limit: 0 }, userID);
        return result.total;
    }
    async countListFilter(list, filter, user) {
        const options = await this.buildFilter(filter, user);
        const result = await this.getListIDs(list, undefined, { ...options, limit: 0 }, user.id);
        return result.total;
    }
    async countFilter(filter, user) {
        return await this.count(await this.buildFilter(filter, user));
    }
    async findFilter(filter, order, page, user) {
        return await this.find(await this.buildFindOptions(filter, order, user, page));
    }
    async findIDsFilter(filter, user) {
        return await this.findIDs(await this.buildFilter(filter, user));
    }
    async findListFilter(list, seed, filter, order, page, user) {
        return await this.findList(list, seed, await this.buildFindOptions(filter, order, user, page), user.id);
    }
    async findListTransformFilter(list, seed, filter, order, page, user, transform) {
        return await this.findListTransform(list, seed, await this.buildFindOptions(filter, order, user, page), user.id, transform);
    }
    async searchFilter(filter, order, page, user) {
        return await this.search(await this.buildFindOptions(filter, order, user, page));
    }
    async searchTransformFilter(filter, order, page, user, transform) {
        return await this.searchTransform(await this.buildFindOptions(filter, order, user, page), transform);
    }
    async findListTransform(list, seed, options, userID, transform) {
        const result = await this.findList(list, seed, options, userID);
        return {
            ...result,
            items: await Promise.all(result.items.map(o => transform(o)))
        };
    }
    async indexFilter(filter, user, ignoreArticles) {
        return await this.index(this.indexProperty, await this.buildFilter(filter, user), ignoreArticles);
    }
    async getListIDs(list, seed, options, userID) {
        let ids = [];
        const opts = { ...options, limit: undefined, offset: undefined };
        const page = { skip: options.offset, take: options.limit };
        switch (list) {
            case enums_1.ListType.random: {
                ids = await this.findIDs(opts);
                let s = seed;
                if (!s) {
                    s = `${userID}_${new Date().toISOString().split('T')[0]}`;
                }
                ids.sort();
                ids = shuffle_seed_1.default.shuffle(ids, s);
                break;
            }
            case enums_1.ListType.highest:
                ids = await this.getHighestRatedIDs(opts, userID);
                break;
            case enums_1.ListType.avghighest:
                ids = await this.getAvgHighestIDs(opts);
                break;
            case enums_1.ListType.frequent:
                ids = await this.getFrequentlyPlayedIDs(opts, userID);
                break;
            case enums_1.ListType.faved:
                ids = await this.getFavedIDs(opts, userID);
                break;
            case enums_1.ListType.recent:
                ids = await this.getRecentlyPlayedIDs(opts, userID);
                break;
            default:
                return Promise.reject(builder_1.InvalidParamError('Unknown List Type'));
        }
        const total = ids.length;
        ids = base_utils_1.paginate(ids, page).items;
        return { total, ...page, items: ids };
    }
    async getFilteredIDs(ids, options) {
        if (!options.where) {
            return ids;
        }
        let where = { id: { [orm_1.Op.in]: ids } };
        if (options.where &&
            (Object.keys(options.where).length > 0 ||
                Object.getOwnPropertySymbols(options.where).length > 0)) {
            where = { [orm_1.Op.and]: [where, options.where] };
        }
        const list = await this.findIDs({ ...options, where });
        return list.sort((a, b) => ids.indexOf(a) - ids.indexOf(b));
    }
    async getHighestRatedIDs(options, userID) {
        const helper = new state_helper_1.StateHelper(this.em);
        const ids = await helper.getHighestRatedDestIDs(this.objType, userID);
        return this.getFilteredIDs(ids, options);
    }
    async getAvgHighestIDs(options) {
        const helper = new state_helper_1.StateHelper(this.em);
        const ids = await helper.getAvgHighestDestIDs(this.objType);
        return this.getFilteredIDs(ids, options);
    }
    async getFrequentlyPlayedIDs(options, userID) {
        const helper = new state_helper_1.StateHelper(this.em);
        const ids = await helper.getFrequentlyPlayedDestIDs(this.objType, userID);
        return this.getFilteredIDs(ids, options);
    }
    async getFavedIDs(options, userID) {
        const helper = new state_helper_1.StateHelper(this.em);
        const ids = await helper.getFavedDestIDs(this.objType, userID);
        return this.getFilteredIDs(ids, options);
    }
    async getRecentlyPlayedIDs(options, userID) {
        const helper = new state_helper_1.StateHelper(this.em);
        const ids = await helper.getRecentlyPlayedDestIDs(this.objType, userID);
        return this.getFilteredIDs(ids, options);
    }
    async removeLaterByIDs(ids) {
        if (ids && ids.length > 0) {
            const items = await this.findByIDs(ids);
            for (const item of items) {
                this.removeLater(item);
            }
        }
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map