import { ArgsType, Field, Float, ID, InputType } from 'type-graphql';
import { DefaultOrderArgs, FilterArgs, PaginatedFilterArgs } from '../base/base.args.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { UserRole } from '../../types/enums.js';
import { ObjParamsType } from '../../modules/rest/decorators/ObjParamsType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';

@ObjParamsType()
export class IncludesUserArgs {
}

@ObjParamsType()
export class UserMutateArgs {
	@ObjField({ description: 'Password of calling admin user is required to create an user. this is NOT the user password!' })
	password!: string;

	@ObjField({ description: 'User Name' })
	name!: string;

	@ObjField({ description: 'User Email' })
	email?: string;

	@ObjField({ description: 'User has admin rights?', defaultValue: false, example: false })
	roleAdmin?: boolean;

	@ObjField({ description: 'User has podcast admin rights?', defaultValue: false, example: false })
	rolePodcast?: boolean;

	@ObjField({ description: 'User has api rights?', defaultValue: true, example: true })
	roleStream?: boolean;

	@ObjField({ description: 'User has upload rights?', defaultValue: false, example: false })
	roleUpload?: boolean;
}

@ObjParamsType()
export class UserPasswordUpdateArgs {
	@ObjField({ description: 'Password of calling user (or admin) is required to change the password' })
	password!: string;

	@ObjField({ description: 'New Password' })
	newPassword!: string;
}

@ObjParamsType()
export class UserEmailUpdateArgs {
	@ObjField({ description: 'Password of calling user (or admin) is required to change the email' })
	password!: string;

	@ObjField({ description: 'New email' })
	email!: string;
}

@ObjParamsType()
export class UserGenerateImageArgs {
	@ObjField({ nullable: true, description: 'Random Seed String' })
	seed?: string;
}

@InputType()
@ObjParamsType()
export class UserFilterArgs {
	@Field(() => String, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Search Query', example: 'admin' })
	query?: string;

	@Field(() => String, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by User name', example: 'user' })
	name?: string;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by User Ids', isID: true })
	ids?: Array<string>;

	@Field(() => Float, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp })
	since?: number;

	@Field(() => String, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by User email', example: 'user@example.com' })
	email?: string;

	@Field(() => [UserRole], { nullable: true })
	@ObjField(() => [UserRole], { nullable: true, description: 'filter by User roles', example: [UserRole.admin] })
	roles?: Array<UserRole>;
}

@InputType()
export class UserFilterArgsQL extends UserFilterArgs {
}

@InputType()
@ObjParamsType()
export class UserOrderArgs extends DefaultOrderArgs {
}

@InputType()
export class UserOrderArgsQL extends UserOrderArgs {
}

@ArgsType()
export class UserIndexArgs extends FilterArgs(UserFilterArgsQL) {
}

@ArgsType()
export class UsersArgs extends PaginatedFilterArgs(UserFilterArgsQL, UserOrderArgsQL) {
}
