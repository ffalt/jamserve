import { WorkerRequestMode } from './io.types';
export class IoCommandsArtwork {
    constructor(owner) {
        this.owner = owner;
    }
    async rename(artworkID, newName, rootID) {
        return this.owner.newRequest(WorkerRequestMode.renameArtwork, p => this.owner.workerService.artwork.rename(p), { rootID, artworkID, newName });
    }
    async replace(artworkID, artworkFilename, rootID) {
        return this.owner.newRequest(WorkerRequestMode.replaceArtwork, p => this.owner.workerService.artwork.replace(p), { rootID, artworkID, artworkFilename });
    }
    async create(folderID, artworkFilename, types, rootID) {
        return this.owner.newRequest(WorkerRequestMode.createArtwork, p => this.owner.workerService.artwork.create(p), { rootID, folderID, artworkFilename, types });
    }
    async download(folderID, artworkURL, types, rootID) {
        return this.owner.newRequest(WorkerRequestMode.downloadArtwork, p => this.owner.workerService.artwork.download(p), { rootID, folderID, artworkURL, types });
    }
    async delete(artworkID, rootID) {
        return this.owner.newRequest(WorkerRequestMode.deleteArtwork, p => this.owner.workerService.artwork.remove(p), { rootID, artworkID });
    }
}
//# sourceMappingURL=io.commands.artwork.js.map