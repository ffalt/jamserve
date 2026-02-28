import { Op, FindOptions, Includeable, WhereOptions, WhereAttributeHashValue } from 'sequelize';

/**
 * Escape special SQL LIKE pattern characters (`%`, `_`, `\`) in a user-supplied
 * value so they are matched literally instead of acting as wildcards.
 */
function escapeLikeValue(value: string): string {
	return value.replaceAll(/[%_\\]/g, String.raw`\$&`);
}

export const QHelper = {
	eq<T>(value?: T): T | undefined {
		return value ?? undefined;
	},

	like(value?: string, dialect?: string): WhereAttributeHashValue<string> | undefined {
		if (!value) {
			return undefined;
		}
		const escaped = escapeLikeValue(value);
		if (dialect === 'postgres') {
			return { [Op.iLike]: `%${escaped}%` };
		}
		return { [Op.like]: `%${escaped}%` };
	},

	/**
	 * Build a LIKE clause without escaping wildcards.
	 * Only use this for trusted/internal values (e.g. folder paths), never for user input.
	 */
	likeRaw(value?: string, dialect?: string): WhereAttributeHashValue<string> | undefined {
		if (!value) {
			return undefined;
		}
		if (dialect === 'postgres') {
			return { [Op.iLike]: `%${value}%` };
		}
		return { [Op.like]: `%${value}%` };
	},

	gte(value?: number): WhereAttributeHashValue<number> | undefined {
		return (value === undefined) ? undefined : { [Op.gte]: value };
	},

	lte(value?: number): WhereAttributeHashValue<number> | undefined {
		return (value === undefined) ? undefined : { [Op.lte]: value };
	},

	inStringArray<Entity>(propertyName: keyof Entity, list?: Array<string>): Array<WhereOptions<Entity>> {
		if (!list || list.length === 0) {
			return [];
		}
		const expressions = list.map(entry => {
			return { [propertyName]: { [Op.like]: `%|${escapeLikeValue(entry)}|%` } } as WhereOptions<Entity>;
		});
		if (expressions.length === 1) {
			return expressions;
		}
		return [{ [Op.or]: expressions }];
	},

	neq(value?: string): WhereAttributeHashValue<string> | undefined {
		return (value === undefined) ? undefined : { [Op.ne]: value };
	},

	or<T>(list: Array<WhereOptions<T>>): WhereAttributeHashValue<T> {
		return { [Op.or]: QHelper.cleanList<T>(list) };
	},

	inOrEqual<T>(list?: Array<T>): WhereAttributeHashValue<any> {
		if (!list || list.length === 0) {
			return;
		}
		return list.length > 1 ? { [Op.in]: list } as WhereAttributeHashValue<T> : list.at(0);
	},

	cleanList<Entity>(list: Array<WhereOptions<Entity> | Record<string, undefined> | undefined>): Array<any> | undefined {
		const result = list.filter(q => {
			if (!q) {
				return false;
			}
			const key = Object.keys(q).at(0);
			return (key !== undefined) && (q as any)[key] !== undefined;
		});
		return result.length > 0 ? result : undefined;
	},

	includeQueries(list: Array<Record<string, Array<Record<string, any>>> | undefined>): Array<Includeable> {
		return list.map(q => {
			if (!q) {
				return false;
			}
			const key = Object.keys(q).at(0);
			if (!key) {
				return false;
			}
			const array = (q as any)[key];
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			const result = this.cleanList(array) ?? [];
			if (result.length === 0) {
				return false;
			}
			let attributes: Array<string> = [];
			for (const o of result) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				attributes = [...attributes, ...Object.keys(o)];
			}
			return {
				association: `${key}ORM`,
				attributes,
				where: result.length === 1 ? result.at(0) : { [Op.and]: result }
			};
		}).filter(q => !!q) as Array<Includeable>;
	},

	buildQuery<Entity>(list?: Array<WhereOptions<Entity>>): FindOptions<Entity> {
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
