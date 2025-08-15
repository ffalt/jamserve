import { UserRoles } from '../user/user.model.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType()
export class SessionUser {
	@ObjectField({ description: 'User ID', isID: true })
	id!: string;

	@ObjectField({ description: 'User Name', example: 'admin' })
	name!: string;

	@ObjectField(() => UserRoles, { description: 'User Roles' })
	roles!: UserRoles;
}
