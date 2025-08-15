import { ClassType, Field, ID, Int, ObjectType } from 'type-graphql';
import { Entity, PrimaryKey } from '../../modules/orm/index.js';
import { OrderByParameters } from './base.parameters.js';

@ObjectType()
@Entity({ isAbstract: true })
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
	items: Array<Entity>;
	name: string;
}

export interface IndexResult<EntityGroup> {
	groups: Array<EntityGroup>;
}

export function IndexGroup<Entity extends object, EntityQL extends object>(_EntityClass: ClassType<Entity>, EntityQLClass: ClassType<EntityQL>): any {
	@ObjectType()
	abstract class IndexResultResponseClass implements IndexResultGroup<Entity> {
		@Field(() => [EntityQLClass])
		items!: Array<Entity>;

		@Field(() => String)
		name!: string;
	}

	return IndexResultResponseClass;
}

export function Index<EntityQL extends object>(EntityQLClass: ClassType<EntityQL>): any {
	@ObjectType()
	abstract class IndexResponseClass implements IndexResult<EntityQL> {
		@Field(() => [EntityQLClass])
		groups!: Array<EntityQL>;
	}

	return IndexResponseClass;
}

export function PaginatedResponse<Entity extends object, EntityQL extends object>(_EntityClass: ClassType<Entity>, EntityQLClass: ClassType<EntityQL>) {
	@ObjectType()
	abstract class PaginatedResponseClass {
		// here we use the runtime argument
		@Field(() => [EntityQLClass])
		// and here the generic type
		items!: Array<Entity>;

		@Field(() => Int)
		total!: number;

		@Field(() => Int, { nullable: true })
		take?: number;

		@Field(() => Int, { nullable: true })
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

export const OrderHelper = {
	direction(parameters?: OrderByParameters): string {
		return parameters?.orderDesc ? 'DESC' : 'ASC';
	},

	inverse(order: string): string {
		return order === 'ASC' ? 'DESC' : 'ASC';
	}
};
