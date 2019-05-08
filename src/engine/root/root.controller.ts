import {JamRequest} from '../../api/jam/api';
import {DBObjectType} from '../../db/db.types';
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

	defaultSort(items: Array<Root>): Array<Root> {
		return items.sort((a, b) => a.name.localeCompare(b.name));
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

	async create(req: JamRequest<JamParameters.RootNew>): Promise<Jam.Root> {
		const root: Root = {
			id: '',
			created: Date.now(),
			type: DBObjectType.root,
			name: req.query.name,
			path: req.query.path,
			strategy: req.query.strategy as RootScanStrategy
		};
		root.id = await this.rootService.create(root);
		return this.prepare(root, {}, req.user);
	}

	async update(req: JamRequest<JamParameters.RootUpdate>): Promise<Jam.Root> {
		const root = await this.byID(req.query.id);
		root.name = req.query.name;
		root.path = req.query.path;
		const forceRefreshMeta = root.strategy !== req.query.strategy;
		root.strategy = req.query.strategy as RootScanStrategy;
		await this.rootService.update(root);
		this.ioService.refreshRoot(root.id, forceRefreshMeta);
		return this.prepare(root, {}, req.user);
	}

	async delete(req: JamRequest<JamParameters.ID>): Promise<void> {
		const root = await this.byID(req.query.id);
		await this.ioService.removeRoot(root.id);
	}

	async scanAll(req: JamRequest<{}>): Promise<Array<Jam.AdminChangeQueueInfo>> {
		return this.ioService.refresh();
	}

	async scan(req: JamRequest<JamParameters.ID>): Promise<Jam.AdminChangeQueueInfo> {
		const root = await this.byID(req.query.id);
		return this.ioService.refreshRoot(root.id, false);
	}

	async status(req: JamRequest<JamParameters.ID>): Promise<Jam.RootStatus> {
		const root = await this.byID(req.query.id);
		return this.ioService.getRootStatus(root.id);
	}

	async queueId(req: JamRequest<JamParameters.ID>): Promise<Jam.AdminChangeQueueInfo> {
		return this.ioService.getScanActionStatus(req.query.id);
	}

}
