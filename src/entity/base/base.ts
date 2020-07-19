import {ClassType, Field, ID, Int, ObjectType} from 'type-graphql';
import {v4} from 'uuid';
import {PrimaryKey, Property} from 'mikro-orm';
import {QBFilterQuery} from 'mikro-orm/dist/typings';

@ObjectType()
export abstract class Base {
	@Field(() => ID)
	@PrimaryKey()
	id: string = v4();

	@Field(() => Date)
	@Property()
	createdAt: Date = new Date();

	@Field(() => Date)
	@Property({onUpdate: () => new Date()})
	updatedAt: Date = new Date();
}

export interface IndexResultGroup<Entity> {
	items: Entity[];
	name: string;
}

export interface IndexResult<EntityGroup> {
	groups: EntityGroup[];
}

export function IndexGroup<Entity, EntityQL>(EntityClass: ClassType<Entity>, EntityQLClass: ClassType<EntityQL>): any {
	// `isAbstract` decorator option is mandatory to prevent registering in schema
	@ObjectType({isAbstract: true})
	abstract class IndexResultResponseClass implements IndexResultGroup<Entity> {
		@Field(() => [EntityQLClass])
		items!: Entity[];
		@Field(() => String)
		name!: string;
	}

	return IndexResultResponseClass;
}

export function Index<EntityQL>(EntityQLClass: ClassType<EntityQL>): any {
	// `isAbstract` decorator option is mandatory to prevent registering in schema
	@ObjectType({isAbstract: true})
	abstract class IndexResponseClass implements IndexResult<EntityQL> {
		@Field(() => [EntityQLClass])
		groups!: EntityQL[];
	}

	return IndexResponseClass;
}

export function PaginatedResponse<Entity, EntityQL>(EntityClass: ClassType<Entity>, EntityQLClass: ClassType<EntityQL>) {
	// `isAbstract` decorator option is mandatory to prevent registering in schema
	@ObjectType({isAbstract: true})
	abstract class PaginatedResponseClass {
		// here we use the runtime argument
		@Field(() => [EntityQLClass])
			// and here the generic type
		items!: Entity[];

		@Field(() => Int)
		total!: number;

		@Field(() => Int, {nullable: true})
		take?: number;

		@Field(() => Int, {nullable: true})
		skip?: number;
	}

	return PaginatedResponseClass;
}

export interface PageResult<T> {
	skip?: number;
	take?: number;
	total: number;
	items: Array<T>;
}

export class QHelper {

	static eq<T, Entity>(value?: T): QBFilterQuery<Entity> | undefined {
		return (value !== undefined) ? {$eq: value} : undefined;
	}

	static like<Entity>(value?: string): QBFilterQuery<Entity> | undefined {
		return (value) ? {$like: `%${value}%`} : undefined;
	}

	static gte<Entity>(value?: number): QBFilterQuery<Entity> | undefined {
		return (value !== undefined) ? {$gte: value} : undefined;
	}

	static lte<Entity>(value?: number): QBFilterQuery<Entity> | undefined {
		return (value !== undefined) ? {$lte: value} : undefined;
	}

	static inStringArray<Entity>(propertyName: keyof Entity, list?: Array<string>): Array<QBFilterQuery<Entity>> {
		if (!list || list.length === 0) {
			return [];
		}
		const expressions = list.map(entry => {
			const o: any = {};
			o[propertyName] = {$like: `%|${entry.replace(/%/g, '')}|%`}
			return o;
		})
		if (expressions.length === 1) {
			return expressions
		}
		return [{$or: expressions}];
	}

	static packageForeignQuery<Entity, T>(field: keyof T, query?: QBFilterQuery<T>): QBFilterQuery<T> | undefined {
		if (!query) {
			return;
		}
		const o: any = {};
		o[field] = query;
		return o;
	}

	static foreignGTE<Entity, T>(field: keyof T, value?: number): QBFilterQuery<Entity> | undefined {
		return QHelper.packageForeignQuery(field, QHelper.gte(value));
	}

	static foreignLTE<Entity, T>(field: keyof T, value?: number): QBFilterQuery<Entity> | undefined {
		return QHelper.packageForeignQuery(field, QHelper.lte(value));
	}

	static foreignEQ<Entity, T, V>(field: keyof T, value?: V): QBFilterQuery<Entity> | undefined {
		return QHelper.packageForeignQuery(field, QHelper.eq(value));
	}

	static foreignLike<Entity, T>(field: keyof T, value?: string): QBFilterQuery<Entity> | undefined {
		return QHelper.packageForeignQuery(field, QHelper.like(value));
	}

	static foreignStringArray<Entity, T>(property: keyof Entity, field: keyof T, list?: Array<string>): Array<QBFilterQuery<Entity>> {
		if (!list || list.length === 0) {
			return [];
		}
		const result = QHelper.inStringArray<T>(field, list).map(r => QHelper.packageForeignQuery(property, r));
		return result.filter(r => !!r) as Array<QBFilterQuery<Entity>>;
	}

	static inOrEqual<T, Entity>(list?: Array<T>): QBFilterQuery<Entity> | undefined {
		if (!list || list.length === 0) {
			return;
		}
		return list.length > 1 ? {$in: list} : {$eq: list[0]}
	}

	static foreignKeys<Entity>(list?: Array<string>): QBFilterQuery<Entity> | undefined {
		if (!list || list.length === 0) {
			return;
		}
		return {id: QHelper.inOrEqual(list)};
	}

	static foreignKey<Entity>(list?: Array<string>): QBFilterQuery<Entity> | string | undefined {
		if (!list || list.length === 0) {
			return;
		}
		return {id: QHelper.inOrEqual(list)};
	}

	static foreignValue<Entity>(field: string, list?: Array<string>): QBFilterQuery<Entity> | string | undefined {
		if (!list || list.length === 0) {
			return;
		}
		const o: any = {};
		o[field] = QHelper.inOrEqual(list);
		return o;
	}

	static buildBool<Entity>(list: Array<QBFilterQuery<Entity>>): Array<QBFilterQuery<Entity>> | undefined {
		const result = list.filter(q => q[Object.keys(q)[0]]);
		return result.length > 0 ? result : undefined;
	}

	static buildQuery<Entity>(list?: Array<QBFilterQuery<Entity>>): QBFilterQuery<Entity> {
		if (!list || list.length === 0) {
			return {};
		}
		const result = list.filter(q => q[Object.keys(q)[0]]);
		return result.length > 0 ? {$and: result} : {};
	}
}
