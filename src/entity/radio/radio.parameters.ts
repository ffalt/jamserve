import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { ListType } from '../../types/enums.js';
import { DefaultOrderParameters, FilterParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class IncludesRadioParameters {
	@ObjectField({ nullable: true, description: 'include state (fav,rate) on radio(s)', defaultValue: false, example: false })
	radioState?: boolean;
}

@ObjectParametersType()
export class RadioMutateParameters {
	@ObjectField({ description: 'Radio Name' })
	name!: string;

	@ObjectField({ description: 'URL', example: 'https://radio.example.com/stream.m3u' })
	url!: string;

	@ObjectField({ nullable: true, description: 'Homepage', example: 'https://radio.example.com' })
	homepage?: string;

	@ObjectField({ nullable: true, description: 'Disabled', example: false })
	disabled?: boolean;
}

@InputType()
@ObjectParametersType()
export class RadioFilterParameters {
	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Search Query', example: 'awesome' })
	query?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Name', example: 'Awesome Radio' })
	name?: string;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Radio Ids', isID: true })
	ids?: Array<string>;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by URL', example: 'https://radio.example.com/stream.m3u' })
	url?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Homepage URL', example: 'https://radio.example.com' })
	homepage?: string;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp })
	since?: number;

	@Field(() => Boolean, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Disabled Flag', example: true })
	disabled?: boolean;
}

@InputType()
export class RadioFilterParametersQL extends RadioFilterParameters {
}

@InputType()
@ObjectParametersType()
export class RadioOrderParameters extends DefaultOrderParameters {
}

@InputType()
export class RadioOrderParametersQL extends RadioOrderParameters {
}

@ArgsType()
export class RadioIndexParameters extends FilterParameters(RadioFilterParametersQL) {
}

@ArgsType()
export class RadiosParameters extends PaginatedFilterParameters(RadioFilterParametersQL, RadioOrderParametersQL) {
	@Field(() => ListType, { nullable: true })
	list?: ListType;

	@Field(() => String, { nullable: true })
	seed?: string;
}
