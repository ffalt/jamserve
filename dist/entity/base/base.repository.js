"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const mikro_orm_1 = require("mikro-orm");
const enums_1 = require("../../types/enums");
const random_1 = require("../../utils/random");
const builder_1 = require("../../modules/rest/builder");
const state_helper_1 = require("../state/state.helper");
const base_utils_1 = require("./base.utils");
class BaseRepository extends mikro_orm_1.EntityRepository {
    applyDefaultOrderByEntry(result, direction, orderBy) {
        switch (orderBy) {
            case enums_1.DefaultOrderFields.created:
                result.createdAt = direction;
                break;
            case enums_1.DefaultOrderFields.updated:
                result.updatedAt = direction;
                break;
            case enums_1.DefaultOrderFields.name:
                result.name = direction;
                break;
            case enums_1.DefaultOrderFields.default:
                result.name = direction;
                break;
        }
    }
    buildOrderBy(order) {
        if (!order) {
            return;
        }
        const result = {};
        for (const o of order) {
            this.applyOrderByEntry(result, (o === null || o === void 0 ? void 0 : o.orderDesc) ? mikro_orm_1.QueryOrder.DESC : mikro_orm_1.QueryOrder.ASC, o);
        }
        if (Object.keys(result).length > 0) {
            return result;
        }
    }
    async all() {
        return this.find({});
    }
    async oneOrFail(where, populate, orderBy) {
        try {
            return await super.findOneOrFail(where, populate, orderBy);
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
    }
    async search(filter, orderBy, page) {
        const [items, total] = await this.findAndCount(filter, [], orderBy, page === null || page === void 0 ? void 0 : page.take, page === null || page === void 0 ? void 0 : page.skip);
        return { ...(page || {}), total, items };
    }
    async searchTransform(filter, order, page, transform) {
        const [result, total] = await this.findAndCount(filter, [], order, page === null || page === void 0 ? void 0 : page.take, page === null || page === void 0 ? void 0 : page.skip);
        const items = await Promise.all(result.map(o => transform(o)));
        return { ...(page || {}), total, items };
    }
    async findIDsAndCount(where, page) {
        const builder = this.createQueryBuilder('o')
            .addSelect('id')
            .where(where);
        let result = await builder.execute('all', false);
        const count = result.length;
        if (page === null || page === void 0 ? void 0 : page.skip) {
            result = result.slice(page.skip);
        }
        if (page === null || page === void 0 ? void 0 : page.take) {
            result = result.slice(0, page.take);
        }
        return [result.map((o) => o.id), count];
    }
    async index(property, filter) {
        const builder = this.createQueryBuilder('o');
        const groupSQL = `upper(substr(o.${property},1,1))`;
        builder
            .select('id')
            .addSelect(`${groupSQL} as g`)
            .where(filter)
            .groupBy(groupSQL);
        const map = new Map();
        const result = await builder.execute('all');
        for (const entry of result) {
            const list = map.get(entry.g) || [];
            list.push(entry.id);
            map.set(entry.g, list);
        }
        const groups = [];
        for (const [group, value] of map) {
            groups.push({
                name: group,
                items: await this.find({ id: { $in: value } })
            });
        }
        return { groups };
    }
    async findOneIDorFail(where) {
        const result = await this.findOneID(where);
        if (!result) {
            throw builder_1.NotFoundError();
        }
        return result;
    }
    async findOneID(where) {
        const builder = this.createQueryBuilder('o')
            .addSelect('id')
            .where(where);
        const result = await builder.execute('get');
        return result === null || result === void 0 ? void 0 : result.id;
    }
    async findIDs(where) {
        const builder = this.createQueryBuilder('o')
            .addSelect('id')
            .where(where);
        const result = await builder.execute('all');
        return result.map((o) => o.id);
    }
    async findList(list, where, orderBy, page, userID) {
        const result = await this.getListIDs(list, where, orderBy, page, userID);
        return {
            ...result,
            items: await this.find({ id: { $in: result.items } })
        };
    }
    async countFilter(filter, user) {
        return await this.count(await this.buildFilter(filter, user));
    }
    async findFilter(filter, options, user) {
        return await this.find(await this.buildFilter(filter, user), options);
    }
    async findIDsFilter(filter, user) {
        return await this.findIDs(await this.buildFilter(filter, user));
    }
    async findListFilter(list, filter, order, page, user) {
        return await this.findList(list, await this.buildFilter(filter, user), this.buildOrderBy(order), page, user.id);
    }
    async findListTransformFilter(list, filter, order, page, user, transform) {
        return await this.findListTransform(list, await this.buildFilter(filter, user), this.buildOrderBy(order), page, user.id, transform);
    }
    async searchFilter(filter, order, page, user) {
        return await this.search(await this.buildFilter(filter, user), this.buildOrderBy(order), page);
    }
    async searchTransformFilter(filter, order, page, user, transform) {
        return await this.searchTransform(await this.buildFilter(filter, user), this.buildOrderBy(order), page, transform);
    }
    async findListTransform(list, where, orderBy, page, userID, transform) {
        const result = await this.findList(list, where, orderBy, page, userID);
        return {
            ...result,
            items: await Promise.all(result.items.map(o => transform(o)))
        };
    }
    async indexFilter(filter, user) {
        return await this.index(this.indexProperty, await this.buildFilter(filter, user));
    }
    async getListIDs(list, where, orderBy, page, userID) {
        let ids = [];
        let total;
        if (!page) {
            page = {};
        }
        switch (list) {
            case enums_1.ListType.random:
                ids = await this.findIDs(where);
                page.take = page.take || 20;
                total = ids.length;
                ids = random_1.randomItems(ids, page.take);
                break;
            case enums_1.ListType.highest:
                ids = await this.getHighestRatedIDs(where, userID);
                total = ids.length;
                ids = base_utils_1.paginate(ids, page).items;
                break;
            case enums_1.ListType.avghighest:
                ids = await this.getAvgHighestIDs(where);
                total = ids.length;
                ids = base_utils_1.paginate(ids, page).items;
                break;
            case enums_1.ListType.frequent:
                ids = await this.getFrequentlyPlayedIDs(where, userID);
                total = ids.length;
                ids = base_utils_1.paginate(ids, page).items;
                break;
            case enums_1.ListType.faved:
                ids = await this.getFavedIDs(where, userID);
                total = ids.length;
                ids = base_utils_1.paginate(ids, page).items;
                break;
            case enums_1.ListType.recent:
                ids = await this.getRecentlyPlayedIDs(where, userID);
                total = ids.length;
                ids = base_utils_1.paginate(ids, page).items;
                break;
            default:
                return Promise.reject(builder_1.InvalidParamError('Unknown List Type'));
        }
        return { total, ...page, items: ids };
    }
    async getFilteredIDs(ids, where) {
        const list = await this.findIDs({ $and: [{ id: { $in: ids } }, where] });
        return list.sort((a, b) => {
            return ids.indexOf(a) - ids.indexOf(b);
        });
    }
    async getHighestRatedIDs(where, userID) {
        const helper = new state_helper_1.StateHelper(this.em);
        const ids = await helper.getHighestRatedDestIDs(this.objType, userID);
        return this.getFilteredIDs(ids, where);
    }
    async getAvgHighestIDs(where) {
        const helper = new state_helper_1.StateHelper(this.em);
        const ids = await helper.getAvgHighestDestIDs(this.objType);
        return this.getFilteredIDs(ids, where);
    }
    async getFrequentlyPlayedIDs(where, userID) {
        const helper = new state_helper_1.StateHelper(this.em);
        const ids = await helper.getFrequentlyPlayedDestIDs(this.objType, userID);
        return this.getFilteredIDs(ids, where);
    }
    async getFavedIDs(where, userID) {
        const helper = new state_helper_1.StateHelper(this.em);
        const ids = await helper.getFavedDestIDs(this.objType, userID);
        return this.getFilteredIDs(ids, where);
    }
    async getRecentlyPlayedIDs(where, userID) {
        const helper = new state_helper_1.StateHelper(this.em);
        const ids = await helper.getRecentlyPlayedDestIDs(this.objType, userID);
        return this.getFilteredIDs(ids, where);
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map