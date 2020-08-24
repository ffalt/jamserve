import {ClassType, Field, ID, Int, ObjectType} from 'type-graphql';
import {Entity, PrimaryKey} from '../../modules/orm';
import {OrderByArgs} from './base.args';

@ObjectType()
@Entity({isAbstract: true})
export abstract class Base {
	@Field(() => ID)
	@PrimaryKey()
	id!: string;

	// @Property() added by default Sequelize
	@Field(() => Date)
	createdAt!: Date;

	// @Property() added and managed by default Sequelize
	// @Property({onUpdate: () => new Date()})
	@Field(() => Date)
	updatedAt!: Date;
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

export class OrderHelper {

	static direction(args?: OrderByArgs): string {
		return args?.orderDesc ? 'DESC' : 'ASC';
	}

	static inverse(order: string): string {
		return order === 'ASC' ? 'DESC' : 'ASC';
	}
}

export function dateOrUndefined(timestamp?: number): Date | undefined {
	if (timestamp === undefined || timestamp === null || timestamp === 0) {
		return undefined;
	}
	return new Date(timestamp);
}

