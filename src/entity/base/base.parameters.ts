import { DefaultOrderFields, ListType } from '../../types/enums.js';
import { ArgsType, ClassType, Field, InputType, Int } from 'type-graphql';
import { Max, Min } from 'class-validator';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class ListParameters {
	@ObjectField(() => ListType, { nullable: true, description: 'filter by special list', example: ListType.faved })
	list?: ListType;

	@ObjectField({ nullable: true, description: 'seed for random list', example: 'jksfb23jhsdf' })
	seed?: string;
}

@InputType()
@ObjectParametersType()
export class OrderByParameters {
	// @Field(() => String, {nullable: true})
	// @ObjField(() => String, {nullable: true, description: 'order by field'})
	// orderBy?: string;
	@Field(() => Boolean, { nullable: true })
	@ObjectField({ nullable: true, description: 'order direction ascending or descending', example: true })
	orderDesc?: boolean;
}

@InputType()
@ObjectParametersType()
export class DefaultOrderParameters extends OrderByParameters {
	@Field(() => DefaultOrderFields, { nullable: true })
	@ObjectField(() => DefaultOrderFields, { nullable: true, description: 'order by field' })
	orderBy?: DefaultOrderFields;
}

@InputType()
@ObjectParametersType()
@ArgsType()
export class PageParameters {
	@ObjectField({ nullable: true, description: 'return items starting from offset position', defaultValue: 0, min: 0, example: 0 })
	@Field(() => Int, { nullable: true, description: 'return items starting from offset position' })
	@Min(0)
	skip?: number = 0;

	@Field(() => Int, { nullable: true, description: 'amount of returned items' })
	@Min(0)
	@Max(100)
	@ObjectField({ nullable: true, description: 'amount of returned items', min: 1, example: 25 })
	take?: number;
}

@ArgsType()
@InputType()
export class PageParametersQL extends PageParameters {
}

export function PaginatedFilterParameters<TFilter extends object, TOrder extends object>(TFilterClass: ClassType<TFilter>, TOrderClass: ClassType<TOrder>) {
	@ArgsType()
	abstract class PaginatedParametersClass {
		@Field(() => PageParametersQL, { nullable: true })
		page?: PageParameters;

		@Field(() => TFilterClass, { nullable: true })
		filter?: TFilter;

		@Field(() => [TOrderClass], { nullable: true })
		order?: Array<TOrder>;
	}

	return PaginatedParametersClass;
}

export function FilterParameters<TFilter extends object>(TFilterClass: ClassType<TFilter>) {
	@ArgsType()
	abstract class FilterParametersClass {
		@Field(() => TFilterClass, { nullable: true })
		filter?: TFilter;
	}

	return FilterParametersClass;
}
