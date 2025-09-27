import { Op } from 'sequelize';
export const QHelper = {
    eq(value) {
        return value ?? undefined;
    },
    like(value, dialect) {
        if (dialect === 'postgres') {
            return value ? { [Op.iLike]: `%${value}%` } : undefined;
        }
        return value ? { [Op.like]: `%${value}%` } : undefined;
    },
    gte(value) {
        return (value === undefined) ? undefined : { [Op.gte]: value };
    },
    lte(value) {
        return (value === undefined) ? undefined : { [Op.lte]: value };
    },
    inStringArray(propertyName, list) {
        if (!list || list.length === 0) {
            return [];
        }
        const expressions = list.map(entry => {
            return { [propertyName]: { [Op.like]: `%|${entry.replaceAll('%', '')}|%` } };
        });
        if (expressions.length === 1) {
            return expressions;
        }
        return [{ [Op.or]: expressions }];
    },
    neq(value) {
        return (value === undefined) ? undefined : { [Op.ne]: value };
    },
    or(list) {
        return { [Op.or]: QHelper.cleanList(list) };
    },
    inOrEqual(list) {
        if (!list || list.length === 0) {
            return;
        }
        return list.length > 1 ? { [Op.in]: list } : list.at(0);
    },
    cleanList(list) {
        const result = list.filter(q => {
            if (!q) {
                return false;
            }
            const key = Object.keys(q).at(0);
            return (key !== undefined) && q[key] !== undefined;
        });
        return result.length > 0 ? result : undefined;
    },
    includeQueries(list) {
        return list.map(q => {
            if (!q) {
                return false;
            }
            const key = Object.keys(q).at(0);
            if (!key) {
                return false;
            }
            const array = q[key];
            const result = this.cleanList(array) ?? [];
            if (result.length === 0) {
                return false;
            }
            let attributes = [];
            for (const o of result) {
                attributes = [...attributes, ...Object.keys(o)];
            }
            return {
                association: `${key}ORM`,
                attributes,
                where: result.length === 1 ? result.at(0) : { [Op.and]: result }
            };
        }).filter(q => !!q);
    },
    buildQuery(list) {
        if (!list || list.length === 0) {
            return {};
        }
        const result = this.cleanList(list) ?? [];
        if (result.length === 0) {
            return {};
        }
        if (result.length === 1) {
            return { where: result.at(0) };
        }
        return { where: { [Op.and]: result } };
    }
};
//# sourceMappingURL=query.js.map