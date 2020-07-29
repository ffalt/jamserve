"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const enums_1 = require("../../types/enums");
const random_1 = require("../../utils/random");
const builder_1 = require("../../modules/rest/builder");
const base_1 = require("./base");
const state_helper_1 = require("../state/state.helper");
const orm_1 = require("../../modules/orm");
const base_utils_1 = require("./base.utils");
class BaseRepository extends orm_1.EntityRepository {
    buildDefaultOrder(order) {
        const direction = base_1.OrderHelper.direction(order);
        switch (order === null || order === void 0 ? void 0 : order.orderBy) {
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
    buildOrderBy(order) {
        if (!order) {
            return;
        }
        let result = [];
        order.forEach(o => result = result.concat(this.buildOrder(o)));
        return result.length > 0 ? result : undefined;
    }
    async buildFindOptions(filter, order, user, page) {
        const options = filter ? await this.buildFilter(filter, user) : {};
        options.limit = page === null || page === void 0 ? void 0 : page.take;
        options.offset = page === null || page === void 0 ? void 0 : page.skip;
        options.order = this.buildOrderBy(order);
        if (options.order) {
            options.order.map(o => {
                if (o.length === 3) {
                    const key = o[0];
                    const list = options.include || [];
                    if (!list.find((i) => i.association === key)) {
                        list.push({ association: key });
                        options.include = list;
                    }
                }
            });
        }
        return options;
    }
    async all() {
        return this.find({});
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
            console.log(e);
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
    async index(property, options) {
        const items = await this.find(options);
        const map = new Map();
        for (const item of items) {
            const value = (item[property] || '');
            const c = value[0];
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
        return { groups };
    }
    async findOneIDorFail(options) {
        const result = await this.findOneID(options);
        if (!result) {
            throw builder_1.NotFoundError();
        }
        return result;
    }
    async findList(list, options, userID) {
        const result = await this.getListIDs(list, options, userID);
        return {
            ...result,
            items: await this.findByIDs(result.items)
        };
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
    async findListFilter(list, filter, order, page, user) {
        return await this.findList(list, await this.buildFindOptions(filter, order, user, page), user.id);
    }
    async findListTransformFilter(list, filter, order, page, user, transform) {
        return await this.findListTransform(list, await this.buildFindOptions(filter, order, user, page), user.id, transform);
    }
    async searchFilter(filter, order, page, user) {
        return await this.search(await this.buildFindOptions(filter, order, user, page));
    }
    async searchTransformFilter(filter, order, page, user, transform) {
        return await this.searchTransform(await this.buildFindOptions(filter, order, user, page), transform);
    }
    async findListTransform(list, options, userID, transform) {
        const result = await this.findList(list, options, userID);
        return {
            ...result,
            items: await Promise.all(result.items.map(o => transform(o)))
        };
    }
    async indexFilter(filter, user) {
        return await this.index(this.indexProperty, await this.buildFilter(filter, user));
    }
    async getListIDs(list, options, userID) {
        let ids = [];
        let total;
        const opts = { options, limit: undefined, offset: undefined };
        const page = { skip: options.offset, take: options.limit };
        switch (list) {
            case enums_1.ListType.random:
                ids = await this.findIDs(opts);
                page.take = page.take || 20;
                total = ids.length;
                ids = random_1.randomItems(ids, page.take);
                break;
            case enums_1.ListType.highest:
                ids = await this.getHighestRatedIDs(opts, userID);
                total = ids.length;
                ids = base_utils_1.paginate(ids, page).items;
                break;
            case enums_1.ListType.avghighest:
                ids = await this.getAvgHighestIDs(opts);
                total = ids.length;
                ids = base_utils_1.paginate(ids, page).items;
                break;
            case enums_1.ListType.frequent:
                ids = await this.getFrequentlyPlayedIDs(opts, userID);
                total = ids.length;
                ids = base_utils_1.paginate(ids, page).items;
                break;
            case enums_1.ListType.faved:
                ids = await this.getFavedIDs(opts, userID);
                total = ids.length;
                ids = base_utils_1.paginate(ids, page).items;
                break;
            case enums_1.ListType.recent:
                ids = await this.getRecentlyPlayedIDs(opts, userID);
                total = ids.length;
                ids = base_utils_1.paginate(ids, page).items;
                break;
            default:
                return Promise.reject(builder_1.InvalidParamError('Unknown List Type'));
        }
        return { total, ...page, items: ids };
    }
    async getFilteredIDs(ids, options) {
        let where = { id: { [orm_1.Op.in]: ids } };
        if (options.where && Object.keys(options.where).length > 0) {
            where = { [orm_1.Op.and]: [where, options.where] };
        }
        const list = await this.findIDs({ ...options, where });
        return list.sort((a, b) => {
            return ids.indexOf(a) - ids.indexOf(b);
        });
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