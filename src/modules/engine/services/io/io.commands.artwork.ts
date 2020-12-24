import {IoService} from '../io.service';
import {AdminChangeQueueInfo, WorkerRequestMode} from './io.types';
import {WorkerRequestCreateArtwork, WorkerRequestDownloadArtwork, WorkerRequestRemoveArtwork, WorkerRequestRenameArtwork, WorkerRequestReplaceArtwork} from '../worker/worker.types';
import {ArtworkImageType} from '../../../../types/enums';

export class IoCommandsArtwork {
	constructor(private owner: IoService) {
	}

	async rename(artworkID: string, newName: string, rootID: string): Promise<AdminChangeQueueInfo> {
		return this.owner.newRequest<WorkerRequestRenameArtwork>(
			WorkerRequestMode.renameArtwork, p => this.owner.workerService.artwork.rename(p), {rootID, artworkID, newName}
		);
	}

	async replace(artworkID: string, artworkFilename: string, rootID: string): Promise<AdminChangeQueueInfo> {
		return this.owner.newRequest<WorkerRequestReplaceArtwork>(
			WorkerRequestMode.replaceArtwork, p => this.owner.workerService.artwork.replace(p), {rootID, artworkID, artworkFilename}
		);
	}

	async create(folderID: string, artworkFilename: string, types: Array<ArtworkImageType>, rootID: string): Promise<AdminChangeQueueInfo> {
		return this.owner.newRequest<WorkerRequestCreateArtwork>(
			WorkerRequestMode.createArtwork, p => this.owner.workerService.artwork.create(p), {rootID, folderID, artworkFilename, types}
		);
	}

	async download(folderID: string, artworkURL: string, types: Array<ArtworkImageType>, rootID: string): Promise<AdminChangeQueueInfo> {
		return this.owner.newRequest<WorkerRequestDownloadArtwork>(
			WorkerRequestMode.downloadArtwork, p => this.owner.workerService.artwork.download(p), {rootID, folderID, artworkURL, types}
		);
	}

	async delete(artworkID: string, rootID: string): Promise<AdminChangeQueueInfo> {
		return this.owner.newRequest<WorkerRequestRemoveArtwork>(
			WorkerRequestMode.deleteArtwork, p => this.owner.workerService.artwork.remove(p), {rootID, artworkID}
		);
	}

}
