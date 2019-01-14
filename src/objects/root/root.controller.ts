import {BaseController} from '../base/base.controller';
import {JamParameters} from '../../model/jam-rest-params';
import {Jam} from '../../model/jam-rest-data';
import {DBObjectType} from '../../model/jam-types';
import {JamRequest} from '../../api/jam/api';
import {SearchQueryRoot} from './root.store';
import {RootService} from './root.service';
import {formatRoot} from './root.format';
import {StateService} from '../state/state.service';
import {ImageService} from '../../engine/image/image.service';
import {DownloadService} from '../../engine/download/download.service';
import {Root} from './root.model';
import {User} from '../user/user.model';
import {IoService} from '../../engine/io/io.service';

export class RootController extends BaseController<JamParameters.ID, JamParameters.IDs, {}, SearchQueryRoot, JamParameters.RootSearch, Root, Jam.Root> {

	constructor(
		private rootService: RootService,
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

	translateQuery(query: JamParameters.RootSearch, user: User): SearchQueryRoot {
		return {
			query: query.query,
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
			path: req.query.path
		};
		root.id = await this.rootService.create(root);
		return this.prepare(root, {}, req.user);
	}

	async update(req: JamRequest<JamParameters.RootUpdate>): Promise<Jam.Root> {
		const root = await this.byID(req.query.id);
		root.name = req.query.name;
		root.path = req.query.path;
		await this.rootService.update(root);
		return this.prepare(root, {}, req.user);
	}

	async delete(req: JamRequest<JamParameters.ID>): Promise<void> {
		const root = await this.byID(req.query.id);
		await this.rootService.remove(root);
		await this.ioService.removeRoot(root);
	}

	async scanAll(req: JamRequest<{}>): Promise<void> {
		this.ioService.refresh(); // do not wait
	}

	async scan(req: JamRequest<JamParameters.ID>): Promise<void> {
		const root = await this.byID(req.query.id);
		this.ioService.refreshRoot(root); // do not wait
	}

	async status(req: JamRequest<JamParameters.ID>): Promise<Jam.RootStatus> {
		const root = await this.byID(req.query.id);
		return this.ioService.getRootStatus(root.id);
	}

}
