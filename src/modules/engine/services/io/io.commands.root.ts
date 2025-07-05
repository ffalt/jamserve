import { IoService } from '../io.service.js';
import { RootScanStrategy } from '../../../../types/enums.js';
import { AdminChangeQueueInfo, WorkerRequestMode } from './io.types.js';
import { WorkerRequestCreateRoot, WorkerRequestRefreshRoot, WorkerRequestRefreshRootMeta, WorkerRequestRemoveRoot, WorkerRequestUpdateRoot } from '../worker/worker.types.js';
import { Orm } from '../orm.service.js';

export class IoCommandsRoot {
	constructor(private readonly owner: IoService) {
	}

	async update(rootID: string, name: string, path: string, strategy: RootScanStrategy): Promise<AdminChangeQueueInfo> {
		return this.owner.newRequest<WorkerRequestUpdateRoot>(
			WorkerRequestMode.updateRoot, p => this.owner.workerService.root.update(p), { rootID, name, path, strategy }
		);
	}

	async create(name: string, path: string, strategy: RootScanStrategy): Promise<AdminChangeQueueInfo> {
		return this.owner.newRequest<WorkerRequestCreateRoot>(
			WorkerRequestMode.createRoot, p => this.owner.workerService.root.create(p), { rootID: '', name, path, strategy }
		);
	}

	async delete(rootID: string): Promise<AdminChangeQueueInfo> {
		const oldRequest = this.owner.findRequest(rootID, WorkerRequestMode.removeRoot);
		if (oldRequest) {
			return this.owner.getRequestInfo(oldRequest);
		}
		return this.owner.newRequest<WorkerRequestRemoveRoot>(
			WorkerRequestMode.removeRoot, p => this.owner.workerService.root.remove(p), { rootID }
		);
	}

	async refresh(rootID: string): Promise<AdminChangeQueueInfo> {
		const oldRequest = this.owner.findRequest(rootID, WorkerRequestMode.refreshRoot);
		if (oldRequest) {
			return this.owner.getRequestInfo(oldRequest);
		}
		return this.owner.newRequest<WorkerRequestRefreshRoot>(
			WorkerRequestMode.refreshRoot, p => this.owner.workerService.root.refresh(p), { rootID }
		);
	}

	async refreshMeta(rootID: string): Promise<AdminChangeQueueInfo> {
		const oldRequest = this.owner.findRequest(rootID, WorkerRequestMode.refreshRootMeta);
		if (oldRequest) {
			return this.owner.getRequestInfo(oldRequest);
		}
		return this.owner.newRequest<WorkerRequestRefreshRootMeta>(
			WorkerRequestMode.refreshRootMeta, p => this.owner.workerService.root.refreshMeta(p), { rootID }
		);
	}

	async refreshAllMeta(orm: Orm): Promise<Array<AdminChangeQueueInfo>> {
		const roots = await orm.Root.all();
		const result: Array<AdminChangeQueueInfo> = [];
		for (const root of roots) {
			result.push(await this.refreshMeta(root.id));
		}
		return result;
	}

	async refreshAll(orm: Orm): Promise<Array<AdminChangeQueueInfo>> {
		const roots = await orm.Root.all();
		const result: Array<AdminChangeQueueInfo> = [];
		for (const root of roots) {
			result.push(await this.refresh(root.id));
		}
		return result;
	}

	async startUpRefresh(orm: Orm, forceRescan: boolean): Promise<void> {
		if (!forceRescan) {
			await this.refreshAll(orm);
		} else {
			await this.refreshAllMeta(orm);
		}
	}
}
