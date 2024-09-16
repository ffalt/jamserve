import {Inject, InRequestScope} from 'typescript-ioc';
import {Orm} from '../../modules/engine/services/orm.service.js';
import {BaseTransformService} from '../base/base.transform.js';
import {User} from '../user/user.js';
import {Root as ORMRoot} from './root.js';
import {IncludesRootArgs} from './root.args.js';
import {Root, RootUpdateStatus} from './root.model.js';
import {IoService} from '../../modules/engine/services/io.service.js';

@InRequestScope
export class RootTransformService extends BaseTransformService {
	@Inject
	private ioService!: IoService;

	async root(orm: Orm, o: ORMRoot, rootArgs: IncludesRootArgs, user: User): Promise<Root> {
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			path: user.roleAdmin ? o.path : undefined,
			status: this.ioService.getRootStatus(o.id),
			strategy: o.strategy
		};
	}

	rootStatus(root: ORMRoot): RootUpdateStatus {
		return this.ioService.getRootStatus(root.id);
	}

}
