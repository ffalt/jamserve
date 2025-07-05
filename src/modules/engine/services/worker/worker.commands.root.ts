import { WorkerService } from '../worker.service.js';
import { WorkerRequestCreateRoot, WorkerRequestRefreshRoot, WorkerRequestRefreshRootMeta, WorkerRequestRemoveRoot, WorkerRequestUpdateRoot } from './worker.types.js';
import { Changes } from '../../worker/changes.js';

export class WorkerCommandsRoot {
	constructor(private readonly owner: WorkerService) {
	}

	async refresh(parameters: WorkerRequestRefreshRoot): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.rootWorker.scan(orm, root, changes);
		return this.owner.changes.finish(orm, changes, root);
	}

	async refreshMeta(parameters: WorkerRequestRefreshRootMeta): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.rootWorker.refreshMeta(orm, root, changes);
		return this.owner.changes.finish(orm, changes, root);
	}

	async update(parameters: WorkerRequestUpdateRoot): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.rootWorker.update(orm, root, parameters.name, parameters.path, parameters.strategy);
		await this.owner.rootWorker.scan(orm, root, changes);
		return this.owner.changes.finish(orm, changes, root);
	}

	async create(parameters: WorkerRequestCreateRoot): Promise<Changes> {
		const root = await this.owner.rootWorker.create(this.owner.changes.ormService.fork(true), parameters.name, parameters.path, parameters.strategy);
		const { orm, changes } = await this.owner.changes.start(root.id);
		return this.owner.changes.finish(orm, changes, root);
	}

	async remove(parameters: WorkerRequestRemoveRoot): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.rootWorker.remove(orm, root, changes);
		return this.owner.changes.finish(orm, changes, root);
	}
}
