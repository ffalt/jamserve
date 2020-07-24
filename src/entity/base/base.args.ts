import {DefaultOrderFields, ListType} from '../../types/enums';
import {ObjField, ObjParamsType} from '../../modules/rest';
import {ArgsType, ClassType, Field, InputType, Int} from 'type-graphql';
import {Max, Min} from 'class-validator';

@ObjParamsType()
export class ListArgs {
	@ObjField(() => ListType, {nullable: true, description: 'filter by special list', example: ListType.faved})
	list?: ListType;
}

@InputType()
@ObjParamsType()
export class OrderByArgs {
	// @Field(() => String, {nullable: true})
	// @ObjField(() => String, {nullable: true, description: 'order by field'})
	// orderBy?: string;
	@Field(() => Boolean, {nullable: true})
	@ObjField({nullable: true, description: 'order direction ascending or descending', example: true})
	orderDesc?: boolean;
}

@InputType()
@ObjParamsType()
export class DefaultOrderArgs extends OrderByArgs {
	@Field(() => DefaultOrderFields, {nullable: true})
	@ObjField(() => DefaultOrderFields, {nullable: true, description: 'order by field'})
	orderBy?: DefaultOrderFields;
}

@InputType()
@ObjParamsType()
export class PageArgs {
	@ObjField({nullable: true, description: 'return items starting from offset position', defaultValue: 0, min: 0, example: 0})
	@Field(() => Int, {nullable: true, description: 'return items starting from offset position'})
	@Min(0)
	skip?: number = 0;
	@Field(() => Int, {nullable: true, description: 'amount of returned items'})
	@Min(0)
	@Max(100)
	@ObjField({nullable: true, description: 'amount of returned items', min: 1, example: 25})
	take?: number;
}

@InputType()
export class PageArgsQL extends PageArgs {}

export function PaginatedArgs<TFilter, TOrder>(TFilterClass: ClassType<TFilter>, TOrderClass: ClassType<TOrder>) {

	@ArgsType()
	abstract class PaginatedArgsClass {
		@Field(() => PageArgsQL, {nullable: true})
		page?: PageArgs;

		@Field(() => TFilterClass, {nullable: true})
		filter?: TFilter;

		@Field(() => [TOrderClass], {nullable: true})
		order?: Array<TOrder>;
	}

	return PaginatedArgsClass;
}

export function FilterArgs<TFilter>(TFilterClass: ClassType<TFilter>) {

	@ArgsType()
	abstract class FilterArgsClass {
		@Field(() => TFilterClass, {nullable: true})
		filter?: TFilter;
	}

	return FilterArgsClass;
}