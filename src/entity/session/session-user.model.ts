import {ObjField, ResultType} from '../../modules/rest/decorators';
import {UserRoles} from '../user/user.model';

@ResultType()
export class SessionUser {
	@ObjField({description: 'User ID', isID: true})
	id!: string;
	@ObjField({description: 'User Name', example: 'admin'})
	name!: string;
	@ObjField(() => UserRoles, {description: 'User Roles'})
	roles!: UserRoles;
}
