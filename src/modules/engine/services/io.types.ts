import {Changes} from '../worker/changes';
import {WorkerRequestParameters} from './worker.types';

export interface RootStatus {
	lastScan: number;
	scanning?: boolean;
	error?: string;
}

export interface AdminChangeQueueInfo {
	id: string;
	pos?: number;
	error?: string;
	done?: number;
}

export enum WorkerRequestMode {
	refreshRoot,
	removeRoot,
	updateRoot,
	createRoot,
	refreshRootMeta,

	fixTrack,
	moveTracks,
	removeTracks,
	renameTrack,
	writeTrackTags,

	createFolder,
	deleteFolders,
	moveFolders,
	renameFolder,

	deleteArtwork,
	downloadArtwork,
	replaceArtwork,
	createArtwork,
	renameArtwork
}

export class IoRequest<T extends WorkerRequestParameters> {

	constructor(
		public id: string, public mode: WorkerRequestMode,
		public execute: (parameters: T) => Promise<Changes>, public parameters: T
	) {
	}

	async run(): Promise<Changes> {
		try {
			return await this.execute(this.parameters);
		} catch (e) {
			console.error(e.stack);
			// log.error('Scanning Error', this.rootID, e.toString());
			if (['EACCES', 'ENOENT'].includes(e.code)) {
				return Promise.reject(Error('Directory not found/no access/error in filesystem'));
			}
			return Promise.reject(e);
		}
	}
}
