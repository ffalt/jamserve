import {ArgsType, Field, Float, ID, InputType} from 'type-graphql';
import {OrderByArgs, PaginatedFilterArgs} from '../base/base.args.js';
import {SessionMode, SessionOrderFields} from '../../types/enums.js';
import {examples} from '../../modules/engine/rest/example.consts.js';
import {ObjParamsType} from '../../modules/rest/decorators/ObjParamsType.js';
import {ObjField} from '../../modules/rest/decorators/ObjField.js';

@InputType()
@ObjParamsType()
export class SessionFilterArgs {
	@Field(() => [ID], {nullable: true})
	ids?: Array<string>;

	@ObjField(() => Number, {nullable: true, description: 'filter by session timestamp', min: 0, example: examples.timestamp})
	@Field(() => Float, {nullable: true})
	since?: number;

	@ObjField(() => String, {nullable: true, description: 'filter by client name', example: 'Jamberry'})
	@Field(() => String, {nullable: true})
	client?: string;

	@ObjField(() => String, {nullable: true, description: 'filter by client name', example: 'Amiga'})
	@Field(() => String, {nullable: true})
	agent?: string;

	@ObjField(() => Number, {nullable: true, description: 'filter by since expiry date', min: 0, example: examples.timestamp})
	@Field(() => Float, {nullable: true})
	expiresFrom?: number;

	@ObjField(() => Number, {nullable: true, description: 'filter by to expiry date', min: 0, example: examples.timestamp})
	@Field(() => Float, {nullable: true})
	expiresTo?: number;

	@ObjField(() => SessionMode, {nullable: true, description: 'filter by session mode', example: SessionMode.browser})
	@Field(() => SessionMode, {nullable: true})
	mode?: SessionMode;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by User Ids', isID: true})
	userIDs?: Array<string>;
}

@InputType()
export class SessionFilterArgsQL extends SessionFilterArgs {
}

@InputType()
@ObjParamsType()
export class SessionOrderArgs extends OrderByArgs {
	@Field(() => SessionOrderFields, {nullable: true})
	@ObjField(() => SessionOrderFields, {nullable: true, description: 'order by field'})
	orderBy?: SessionOrderFields;
}

@InputType()
export class SessionOrderArgsQL extends SessionOrderArgs {
}

@ArgsType()
export class SessionsPageArgsQL extends PaginatedFilterArgs(SessionFilterArgsQL, SessionOrderArgsQL) {
}

@ArgsType()
export class SessionsArgs extends SessionsPageArgsQL {
}

