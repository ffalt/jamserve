import { UserRoles } from '../user/user.model.js';
import { ResultType } from '../../modules/rest/decorators/ResultType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';

@ResultType()
export class SessionUser {
	@ObjField({ description: 'User ID', isID: true })
	id!: string;

	@ObjField({ description: 'User Name', example: 'admin' })
	name!: string;

	@ObjField(() => UserRoles, { description: 'User Roles' })
	roles!: UserRoles;
}
