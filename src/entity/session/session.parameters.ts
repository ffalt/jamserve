import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { OrderByParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { SessionMode, SessionOrderFields } from '../../types/enums.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@InputType()
@ObjectParametersType()
export class SessionFilterParameters {
	@Field(() => [ID], { nullable: true })
	ids?: Array<string>;

	@ObjectField({ nullable: true, description: 'filter by session timestamp', min: 0, example: examples.timestamp })
	@Field(() => Int, { nullable: true })
	since?: number;

	@ObjectField(() => String, { nullable: true, description: 'filter by client name', example: 'Jamberry' })
	@Field(() => String, { nullable: true })
	client?: string;

	@ObjectField(() => String, { nullable: true, description: 'filter by client name', example: 'Amiga' })
	@Field(() => String, { nullable: true })
	agent?: string;

	@ObjectField({ nullable: true, description: 'filter by since expiry date', min: 0, example: examples.timestamp })
	@Field(() => Int, { nullable: true })
	expiresFrom?: number;

	@ObjectField({ nullable: true, description: 'filter by to expiry date', min: 0, example: examples.timestamp })
	@Field(() => Int, { nullable: true })
	expiresTo?: number;

	@ObjectField(() => SessionMode, { nullable: true, description: 'filter by session mode', example: SessionMode.browser })
	@Field(() => SessionMode, { nullable: true })
	mode?: SessionMode;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by User Ids', isID: true })
	userIDs?: Array<string>;
}

@InputType()
export class SessionFilterParametersQL extends SessionFilterParameters {
}

@InputType()
@ObjectParametersType()
export class SessionOrderParameters extends OrderByParameters {
	@Field(() => SessionOrderFields, { nullable: true })
	@ObjectField(() => SessionOrderFields, { nullable: true, description: 'order by field' })
	orderBy?: SessionOrderFields;
}

@InputType()
export class SessionOrderParametersQL extends SessionOrderParameters {
}

@ArgsType()
export class SessionsPageParametersQL extends PaginatedFilterParameters(SessionFilterParametersQL, SessionOrderParametersQL) {
}

@ArgsType()
export class SessionsParameters extends SessionsPageParametersQL {
}
