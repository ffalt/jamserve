import { ObjField, ObjParamsType } from '../../modules/rest/index.js';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { ListType } from '../../types/enums.js';
import { DefaultOrderArgs, FilterArgs, PaginatedFilterArgs } from '../base/base.args.js';
import { examples } from '../../modules/engine/rest/example.consts.js';

@ObjParamsType()
export class IncludesRadioArgs {
	@ObjField({ nullable: true, description: 'include state (fav,rate) on radio(s)', defaultValue: false, example: false })
	radioState?: boolean;
}

@ObjParamsType()
export class RadioMutateArgs {
	@ObjField({ description: 'Radio Name' })
	name!: string;

	@ObjField({ description: 'URL', example: 'https://radio.example.com/stream.m3u' })
	url!: string;

	@ObjField({ nullable: true, description: 'Homepage', example: 'https://radio.example.com' })
	homepage?: string;

	@ObjField({ nullable: true, description: 'Disabled', example: false })
	disabled?: boolean;
}

@InputType()
@ObjParamsType()
export class RadioFilterArgs {
	@Field(() => String, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Search Query', example: 'awesome' })
	query?: string;

	@Field(() => String, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Name', example: 'Awesome Radio' })
	name?: string;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Radio Ids', isID: true })
	ids?: Array<string>;

	@Field(() => String, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by URL', example: 'https://radio.example.com/stream.m3u' })
	url?: string;

	@Field(() => String, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Homepage URL', example: 'https://radio.example.com' })
	homepage?: string;

	@Field(() => Int, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp })
	since?: number;

	@Field(() => Boolean, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Disabled Flag', example: true })
	disabled?: boolean;
}

@InputType()
export class RadioFilterArgsQL extends RadioFilterArgs {
}

@InputType()
@ObjParamsType()
export class RadioOrderArgs extends DefaultOrderArgs {
}

@InputType()
export class RadioOrderArgsQL extends RadioOrderArgs {
}

@ArgsType()
export class RadioIndexArgs extends FilterArgs(RadioFilterArgsQL) {
}

@ArgsType()
export class RadiosArgs extends PaginatedFilterArgs(RadioFilterArgsQL, RadioOrderArgsQL) {
	@Field(() => ListType, { nullable: true })
	list?: ListType;

	@Field(() => String, { nullable: true })
	seed?: string;
}
