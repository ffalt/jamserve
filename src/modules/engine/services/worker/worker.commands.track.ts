import { WorkerService } from '../worker.service.js';
import { WorkerRequestFixTrack, WorkerRequestMoveTracks, WorkerRequestRefreshTracks, WorkerRequestRemoveTracks, WorkerRequestRenameTrack, WorkerRequestWriteTrackTags } from './worker.types.js';
import { Changes } from '../../worker/changes.js';

export class WorkerCommandsTrack {
	constructor(private readonly owner: WorkerService) {
	}

	async refresh(parameters: WorkerRequestRefreshTracks): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.trackWorker.refresh(orm, parameters.trackIDs, changes);
		return this.owner.changes.finish(orm, changes, root);
	}

	async remove(parameters: WorkerRequestRemoveTracks): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.trackWorker.remove(orm, root, parameters.trackIDs, changes);
		return this.owner.changes.finish(orm, changes, root);
	}

	async move(parameters: WorkerRequestMoveTracks): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.trackWorker.move(orm, parameters.trackIDs, parameters.newParentID, changes);
		return this.owner.changes.finish(orm, changes, root);
	}

	async rename(parameters: WorkerRequestRenameTrack): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.trackWorker.rename(orm, parameters.trackID, parameters.newName, changes);
		return this.owner.changes.finish(orm, changes, root);
	}

	async fix(parameters: WorkerRequestFixTrack): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.trackWorker.fix(orm, parameters.fixes, changes);
		return this.owner.changes.finish(orm, changes, root);
	}

	async writeTags(parameters: WorkerRequestWriteTrackTags): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.trackWorker.writeTags(orm, parameters.tags, changes);
		await this.owner.rootWorker.mergeChanges(orm, root, changes);
		return this.owner.changes.finish(orm, changes, root);
	}
}
