"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QHelper = void 0;
const sequelize_1 = require("sequelize");
class QHelper {
    static eq(value) {
        return (value !== undefined && value !== null) ? value : undefined;
    }
    static like(value, dialect) {
        if (dialect === 'postgres') {
            return (value) ? { [sequelize_1.Op.iLike]: `%${value}%` } : undefined;
        }
        else {
            return (value) ? { [sequelize_1.Op.like]: `%${value}%` } : undefined;
        }
    }
    static gte(value) {
        return (value !== undefined) ? { [sequelize_1.Op.gte]: value } : undefined;
    }
    static lte(value) {
        return (value !== undefined) ? { [sequelize_1.Op.lte]: value } : undefined;
    }
    static inStringArray(propertyName, list) {
        if (!list || list.length === 0) {
            return [];
        }
        const expressions = list.map(entry => {
            const o = {};
            o[propertyName] = { [sequelize_1.Op.like]: `%|${entry.replace(/%/g, '')}|%` };
            return o;
        });
        if (expressions.length === 1) {
            return expressions;
        }
        return [{ [sequelize_1.Op.or]: expressions }];
    }
    static neq(value) {
        return (value !== undefined && value !== null) ? { [sequelize_1.Op.ne]: value } : undefined;
    }
    static inOrEqual(list) {
        if (!list || list.length === 0) {
            return;
        }
        return list.length > 1 ? { [sequelize_1.Op.in]: list } : list[0];
    }
    static cleanList(list) {
        const result = list.filter(q => {
            if (!q) {
                return false;
            }
            const key = Object.keys(q)[0];
            return q[key] !== undefined;
        });
        return result.length > 0 ? result : undefined;
    }
    static includeQueries(list) {
        return list.map(q => {
            if (!q) {
                return false;
            }
            const key = Object.keys(q)[0];
            const array = q[key];
            const result = this.cleanList(array) || [];
            if (result.length === 0) {
                return false;
            }
            let attributes = [];
            result.forEach(o => attributes = attributes.concat(Object.keys(o)));
            return {
                association: `${key}ORM`,
                attributes,
                where: result.length === 1 ? result[0] : { [sequelize_1.Op.and]: result }
            };
        }).filter(q => !!q);
    }
    static buildQuery(list) {
        if (!list || list.length === 0) {
            return {};
        }
        const result = this.cleanList(list) || [];
        if (result.length < 1) {
            return {};
        }
        if (result.length === 1) {
            return { where: result[0] };
        }
        return { where: { [sequelize_1.Op.and]: result } };
    }
    static or(list) {
        return {
            [sequelize_1.Op.or]: QHelper.cleanList(list)
        };
    }
}
exports.QHelper = QHelper;
//# sourceMappingURL=query.js.map