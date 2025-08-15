import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { GenreOrderFields, ListType } from '../../types/enums.js';
import { FilterParameters, OrderByParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class IncludesGenreParameters {
	@ObjectField({ nullable: true, description: 'include state (fav,rate) on genre(s)', defaultValue: false, example: false })
	genreState?: boolean;
}

@InputType()
@ObjectParametersType()
export class GenreFilterParameters {
	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Search Query', example: 'pink' })
	query?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Genre Name', example: 'Pop' })
	name?: string;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true })
	ids?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true })
	trackIDs?: Array<string>;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp })
	since?: number;
}

@InputType()
export class GenreFilterParametersQL extends GenreFilterParameters {
}

@InputType()
@ObjectParametersType()
export class GenreOrderParameters extends OrderByParameters {
	@Field(() => GenreOrderFields, { nullable: true })
	@ObjectField(() => GenreOrderFields, { nullable: true, description: 'order by field' })
	orderBy?: GenreOrderFields;
}

@InputType()
export class GenreOrderParametersQL extends GenreOrderParameters {
}

@ArgsType()
export class GenreIndexParametersQL extends FilterParameters(GenreFilterParametersQL) {
}

@ArgsType()
export class GenrePageParametersQL extends PaginatedFilterParameters(GenreFilterParametersQL, GenreOrderParametersQL) {
}

@ArgsType()
export class GenresParametersQL extends GenrePageParametersQL {
	@Field(() => ListType, { nullable: true })
	list?: ListType;

	@Field(() => String, { nullable: true })
	seed?: string;
}
