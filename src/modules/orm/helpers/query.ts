import {FindOptions, Includeable, Op, OrOperator, WhereOptions, WhereValue} from 'sequelize';

export class QHelper {

	static eq<T, Entity>(value?: T): WhereValue<Entity> | undefined {
		return (value !== undefined && value !== null) ? value : undefined;
	}

	static like<Entity>(value?: string): WhereValue<Entity> | undefined {
		return (value) ? {[Op.like]: `%${value}%`} : undefined;
	}

	static gte<Entity>(value?: number): WhereValue<Entity> | undefined {
		return (value !== undefined) ? {[Op.gte]: value} : undefined;
	}

	static lte<Entity>(value?: number): WhereValue<Entity> | undefined {
		return (value !== undefined) ? {[Op.lte]: value} : undefined;
	}

	static inStringArray<Entity>(propertyName: keyof Entity, list?: Array<string>): Array<WhereOptions<Entity>> {
		if (!list || list.length === 0) {
			return [];
		}
		const expressions = list.map(entry => {
			const o: any = {};
			o[propertyName] = {[Op.like]: `%|${entry.replace(/%/g, '')}|%`};
			return o;
		});
		if (expressions.length === 1) {
			return expressions;
		}
		return [{[Op.or]: expressions}];
	}

	static neq<Entity>(value?: string): WhereValue<Entity> | undefined {
		return (value !== undefined && value !== null) ? {[Op.ne]: value} : undefined;
	}

	static inOrEqual<T, Entity>(list?: Array<T>): WhereValue<Entity> | undefined {
		if (!list || list.length === 0) {
			return;
		}
		return list.length > 1 ? {[Op.in]: list} : list[0];
	}

	static cleanList<Entity>(list: Array<WhereOptions<Entity> | { [name: string]: undefined }>): Array<WhereOptions<Entity>> | undefined {
		const result = list.filter(q => {
			if (!q) {
				return false;
			}
			const key = Object.keys(q)[0];
			return (q as any)[key] !== undefined;
		}) as Array<WhereOptions<Entity>>;
		return result.length > 0 ? result : undefined;
	}

	static includeQueries(list: Array<{ [name: string]: Array<{ [field: string]: any }> }>): Array<Includeable> {
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
			result.forEach(o => attributes = attributes.concat(Object.keys(o)));
			return {
				association: `${key}ORM`,
				attributes,
				where: result.length === 1 ? result[0] : {[Op.and]: result}
			};
		}).filter(q => !!q) as Array<Includeable>;
	}

	static buildQuery<Entity>(list?: Array<WhereOptions<Entity>>): FindOptions<Entity> {
		if (!list || list.length === 0) {
			return {};
		}
		const result = this.cleanList(list) || [];
		if (result.length < 1) {
			return {};
		}
		if (result.length === 1) {
			return {where: result[0]};
		}
		return {where: {[Op.and]: result}};
	}

	static or<Entity>(list: Array<WhereOptions<Entity> | any>): OrOperator {
		return {
			[Op.or]: QHelper.cleanList<Entity>(list)
		} as OrOperator;
	}
}
