import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { DefaultOrderParameters, FilterParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { UserRole } from '../../types/enums.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class IncludesUserParameters {
}

@ObjectParametersType()
export class UserMutateParameters {
	@ObjectField({ description: 'Password of calling admin user is required to create an user. this is NOT the user password!' })
	password!: string;

	@ObjectField({ description: 'User Name' })
	name!: string;

	@ObjectField({ description: 'User Email' })
	email?: string;

	@ObjectField({ description: 'User has admin rights?', defaultValue: false, example: false })
	roleAdmin?: boolean;

	@ObjectField({ description: 'User has podcast admin rights?', defaultValue: false, example: false })
	rolePodcast?: boolean;

	@ObjectField({ description: 'User has api rights?', defaultValue: true, example: true })
	roleStream?: boolean;

	@ObjectField({ description: 'User has upload rights?', defaultValue: false, example: false })
	roleUpload?: boolean;
}

@ObjectParametersType()
export class UserPasswordUpdateParameters {
	@ObjectField({ description: 'Password of calling user (or admin) is required to change the password' })
	password!: string;

	@ObjectField({ description: 'New Password' })
	newPassword!: string;
}

@ObjectParametersType()
export class UserSubsonicTokenGenerateParameters {
	@ObjectField({ description: 'Password of calling user (or admin) is required to generate/update the Subsonic token' })
	password!: string;
}

@ObjectParametersType()
export class UserEmailUpdateParameters {
	@ObjectField({ description: 'Password of calling user (or admin) is required to change the email' })
	password!: string;

	@ObjectField({ description: 'New email' })
	email!: string;
}

@ObjectParametersType()
export class UserGenerateImageParameters {
	@ObjectField({ nullable: true, description: 'Random Seed String' })
	seed?: string;
}

@InputType()
@ObjectParametersType()
export class UserFilterParameters {
	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Search Query', example: 'admin' })
	query?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by User name', example: 'user' })
	name?: string;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by User Ids', isID: true })
	ids?: Array<string>;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp })
	since?: number;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by User email', example: 'user@example.com' })
	email?: string;

	@Field(() => [UserRole], { nullable: true })
	@ObjectField(() => [UserRole], { nullable: true, description: 'filter by User roles', example: [UserRole.admin] })
	roles?: Array<UserRole>;
}

@InputType()
export class UserFilterParametersQL extends UserFilterParameters {
}

@InputType()
@ObjectParametersType()
export class UserOrderParameters extends DefaultOrderParameters {
}

@InputType()
export class UserOrderParametersQL extends UserOrderParameters {
}

@ArgsType()
export class UserIndexParameters extends FilterParameters(UserFilterParametersQL) {
}

@ArgsType()
export class UsersParameters extends PaginatedFilterParameters(UserFilterParametersQL, UserOrderParametersQL) {
}
