import {Inject, InRequestScope} from 'typescript-ioc';
import {Orm} from '../../modules/engine/services/orm.service';
import {BaseTransformService} from '../base/base.transform';
import {User} from '../user/user';
import {Root as ORMRoot} from './root';
import {IncludesRootArgs} from './root.args';
import {Root, RootUpdateStatus} from './root.model';
import {IoService} from '../../modules/engine/services/io.service';

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
