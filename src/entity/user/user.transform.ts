import {InRequestScope} from 'typescript-ioc';
import {Orm} from '../../modules/engine/services/orm.service';
import {User, User as ORMUser} from './user';
import {IncludesUserArgs} from './user.args';
import {User as RESTUser} from './user.model';

@InRequestScope
export class UserTransformService {

	async user(orm: Orm, o: ORMUser, userArgs: IncludesUserArgs, currentUser: User): Promise<RESTUser> {
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
