import { InRequestScope } from 'typescript-ioc';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { User, User as ORMUser } from './user.js';
import { IncludesUserParameters } from './user.parameters.js';
import { User as RESTUser } from './user.model.js';

@InRequestScope
export class UserTransformService {
	async user(_orm: Orm, o: ORMUser, _parameters: IncludesUserParameters, currentUser?: User): Promise<RESTUser> {
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			email: (currentUser?.id === o.id || currentUser?.roleAdmin) ? o.email : undefined,
			roles: {
				admin: o.roleAdmin,
				podcast: o.rolePodcast,
				stream: o.roleStream,
				upload: o.roleUpload
			}
		};
	}
}
