import {JamRequest} from '../../api/jam/api';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {RootScanStrategy} from '../../model/jam-types';
import {BaseController} from '../base/dbobject.controller';
import {DownloadService} from '../download/download.service';
import {ImageService} from '../image/image.service';
import {IoService} from '../io/io.service';
import {StateService} from '../state/state.service';
import {User} from '../user/user.model';
import {formatRoot} from './root.format';
import {Root} from './root.model';
import {RootService} from './root.service';
import {SearchQueryRoot} from './root.store';

export class RootController extends BaseController<JamParameters.ID, JamParameters.IDs, {}, SearchQueryRoot, JamParameters.RootSearch, Root, Jam.Root> {

	constructor(
		public rootService: RootService,
		private ioService: IoService,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(rootService, stateService, imageService, downloadService);
	}

	async prepare(root: Root, includes: {}, user: User): Promise<Jam.Root> {
		return formatRoot(root, this.ioService.getRootStatus(root.id));
	}

	async translateQuery(query: JamParameters.RootSearch, user: User): Promise<SearchQueryRoot> {
		return {
			query: query.query,
			id: query.id,
			ids: query.ids,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async create(req: JamRequest<JamParameters.RootNew>): Promise<Jam.AdminChangeQueueInfo> {
		return this.ioService.createRoot(req.query.name, req.query.path, req.query.strategy as RootScanStrategy);
	}

	async update(req: JamRequest<JamParameters.RootUpdate>): Promise<Jam.AdminChangeQueueInfo> {
		const root = await this.byID(req.query.id);
		return this.ioService.updateRoot(root.id, req.query.name, req.query.path, req.query.strategy as RootScanStrategy);
	}

	async delete(req: JamRequest<JamParameters.ID>): Promise<Jam.AdminChangeQueueInfo> {
		const root = await this.byID(req.query.id);
		return this.ioService.removeRoot(root.id);
	}

	async refreshAll(req: JamRequest<JamParameters.RootRefreshAll>): Promise<Array<Jam.AdminChangeQueueInfo>> {
		return this.ioService.refresh(req.query.refreshMeta);
	}

	async refresh(req: JamRequest<JamParameters.RootRefresh>): Promise<Jam.AdminChangeQueueInfo> {
		const root = await this.byID(req.query.id);
		return this.ioService.refreshRoot(root.id, req.query.refreshMeta);
	}

	async status(req: JamRequest<JamParameters.ID>): Promise<Jam.RootStatus> {
		const root = await this.byID(req.query.id);
		return this.ioService.getRootStatus(root.id);
	}

	async queueId(req: JamRequest<JamParameters.ID>): Promise<Jam.AdminChangeQueueInfo> {
		return this.ioService.getAdminChangeQueueInfoStatus(req.query.id);
	}

}
