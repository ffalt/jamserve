import {ArgsType, Field, Float, ID, InputType} from 'type-graphql';
import {DefaultOrderArgs, PaginatedArgs} from '../base/base.args';
import {SessionMode} from '../../types/enums';
import {ObjField, ObjParamsType} from '../../modules/rest/decorators';
import {examples} from '../../modules/engine/rest/example.consts';

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
}

@InputType()
export class SessionFilterArgsQL extends SessionFilterArgs {
}

@InputType()
@ObjParamsType()
export class SessionOrderArgs extends DefaultOrderArgs {
}

@InputType()
export class SessionOrderArgsQL extends SessionOrderArgs {
}

@ArgsType()
export class SessionsArgs extends PaginatedArgs(SessionFilterArgsQL, SessionOrderArgsQL) {
}
