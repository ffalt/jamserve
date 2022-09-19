import seq from 'sequelize';
export class QHelper {
    static eq(value) {
        return (value !== undefined && value !== null) ? value : undefined;
    }
    static like(value, dialect) {
        if (dialect === 'postgres') {
            return (value) ? { [seq.Op.iLike]: `%${value}%` } : undefined;
        }
        else {
            return (value) ? { [seq.Op.like]: `%${value}%` } : undefined;
        }
    }
    static gte(value) {
        return (value !== undefined) ? { [seq.Op.gte]: value } : undefined;
    }
    static lte(value) {
        return (value !== undefined) ? { [seq.Op.lte]: value } : undefined;
    }
    static inStringArray(propertyName, list) {
        if (!list || list.length === 0) {
            return [];
        }
        const expressions = list.map(entry => {
            const o = {};
            o[propertyName] = { [seq.Op.like]: `%|${entry.replace(/%/g, '')}|%` };
            return o;
        });
        if (expressions.length === 1) {
            return expressions;
        }
        return [{ [seq.Op.or]: expressions }];
    }
    static neq(value) {
        return (value !== undefined && value !== null) ? { [seq.Op.ne]: value } : undefined;
    }
    static or(list) {
        return { [seq.Op.or]: QHelper.cleanList(list) };
    }
    static inOrEqual(list) {
        if (!list || list.length === 0) {
            return;
        }
        return list.length > 1 ? { [seq.Op.in]: list } : list[0];
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
                where: result.length === 1 ? result[0] : { [seq.Op.and]: result }
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
        return { where: { [seq.Op.and]: result } };
    }
}
//# sourceMappingURL=query.js.map