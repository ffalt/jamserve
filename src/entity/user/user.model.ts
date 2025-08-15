import { Base, Page } from '../base/base.model.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType()
export class UserRoles {
	@ObjectField({ description: 'User is Administrator' })
	admin?: boolean;

	@ObjectField({ description: 'User has API Access' })
	stream?: boolean;

	@ObjectField({ description: 'User can upload files' })
	upload?: boolean;

	@ObjectField({ description: 'User can manage podcasts' })
	podcast?: boolean;
}

@ResultType()
export class User extends Base {
	@ObjectField({ description: 'User Email', example: 'user@example.com', nullable: true })
	email?: string;

	@ObjectField(() => UserRoles, { description: 'User Roles' })
	roles!: UserRoles;
}

@ResultType()
export class SubsonicToken {
	@ObjectField({ description: 'Generated Subsonic Token', example: 'kshfis6few68fwefh' })
	token?: string;
}

@ResultType({ description: 'Users Page' })
export class UserPage extends Page {
	@ObjectField(() => User, { description: 'List of Users' })
	items!: Array<User>;
}
