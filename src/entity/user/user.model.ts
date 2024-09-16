import {ObjField, ResultType} from '../../modules/rest/index.js';
import {Base, Page} from '../base/base.model.js';

@ResultType()
export class UserRoles {
	@ObjField({description: 'User is Administrator'})
	admin?: boolean;
	@ObjField({description: 'User has API Access'})
	stream?: boolean;
	@ObjField({description: 'User can upload files'})
	upload?: boolean;
	@ObjField({description: 'User can manage podcasts'})
	podcast?: boolean;
}

@ResultType()
export class User extends Base {
	@ObjField({description: 'User Email', example: 'user@example.com', nullable: true})
	email?: string;
	@ObjField(() => UserRoles, {description: 'User Roles'})
	roles!: UserRoles;
}

@ResultType({description: 'Users Page'})
export class UserPage extends Page {
	@ObjField(() => User, {description: 'List of Users'})
	items!: Array<User>;
}
