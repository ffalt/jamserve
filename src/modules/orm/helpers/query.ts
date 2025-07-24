import seq, { FindOptions, Includeable, WhereOptions, WhereAttributeHashValue } from 'sequelize';

export const QHelper = {
	eq<T>(value?: T): T | undefined {
		return value ?? undefined;
	},

	like(value?: string, dialect?: string): WhereAttributeHashValue<string> | undefined {
		if (dialect === 'postgres') {
			return value ? { [seq.Op.iLike]: `%${value}%` } : undefined;
		} else {
			return value ? { [seq.Op.like]: `%${value}%` } : undefined;
		}
	},

	gte(value?: number): WhereAttributeHashValue<number> | undefined {
		return (value === undefined) ? undefined : { [seq.Op.gte]: value };
	},

	lte(value?: number): WhereAttributeHashValue<number> | undefined {
		return (value === undefined) ? undefined : { [seq.Op.lte]: value };
	},

	inStringArray<Entity>(propertyName: keyof Entity, list?: Array<string>): Array<WhereOptions<Entity>> {
		if (!list || list.length === 0) {
			return [];
		}
		const expressions = list.map(entry => {
			const o: any = {};
			o[propertyName] = { [seq.Op.like]: `%|${entry.replaceAll('%', '')}|%` };
			return o;
		});
		if (expressions.length === 1) {
			return expressions;
		}
		return [{ [seq.Op.or]: expressions }];
	},

	neq(value?: string): WhereAttributeHashValue<string> | undefined {
		return (value === undefined) ? undefined : { [seq.Op.ne]: value };
	},

	or<T>(list: Array<WhereOptions<T>>): WhereAttributeHashValue<T> {
		return { [seq.Op.or]: QHelper.cleanList<T>(list) };
	},

	inOrEqual<T>(list?: Array<T>): WhereAttributeHashValue<any> | T | undefined {
		if (!list || list.length === 0) {
			return;
		}
		return list.length > 1 ? { [seq.Op.in]: list } as WhereAttributeHashValue<T> : list[0];
	},

	cleanList<Entity>(list: Array<WhereOptions<Entity> | Record<string, undefined>>): Array<any> | undefined {
		const result = list.filter(q => {
			if (!q) {
				return false;
			}
			const key = Object.keys(q)[0];
			return (q as any)[key] !== undefined;
		});
		return result.length > 0 ? result : undefined;
	},

	includeQueries(list: Array<Record<string, Array<Record<string, any>>>>): Array<Includeable> {
		return list.map(q => {
			if (!q) {
				return false;
			}
			const key = Object.keys(q)[0];
			const array = (q as any)[key];
			const result = this.cleanList(array) || [];
			if (result.length === 0) {
				return false;
			}
			let attributes: Array<string> = [];
			for (const o of result) {
				attributes = [...attributes, ...Object.keys(o)];
			}
			return {
				association: `${key}ORM`,
				attributes,
				where: result.length === 1 ? result[0] : { [seq.Op.and]: result }
			};
		}).filter(q => !!q) as Array<Includeable>;
	},

	buildQuery<Entity>(list?: Array<WhereOptions<Entity>>): FindOptions<Entity> {
		if (!list || list.length === 0) {
			return {};
		}
		const result = this.cleanList(list) || [];
		if (result.length === 0) {
			return {};
		}
		if (result.length === 1) {
			return { where: result[0] };
		}
		return { where: { [seq.Op.and]: result } };
	}
};
