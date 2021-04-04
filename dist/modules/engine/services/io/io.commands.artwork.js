"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoCommandsArtwork = void 0;
const io_types_1 = require("./io.types");
class IoCommandsArtwork {
    constructor(owner) {
        this.owner = owner;
    }
    async rename(artworkID, newName, rootID) {
        return this.owner.newRequest(io_types_1.WorkerRequestMode.renameArtwork, p => this.owner.workerService.artwork.rename(p), { rootID, artworkID, newName });
    }
    async replace(artworkID, artworkFilename, rootID) {
        return this.owner.newRequest(io_types_1.WorkerRequestMode.replaceArtwork, p => this.owner.workerService.artwork.replace(p), { rootID, artworkID, artworkFilename });
    }
    async create(folderID, artworkFilename, types, rootID) {
        return this.owner.newRequest(io_types_1.WorkerRequestMode.createArtwork, p => this.owner.workerService.artwork.create(p), { rootID, folderID, artworkFilename, types });
    }
    async download(folderID, artworkURL, types, rootID) {
        return this.owner.newRequest(io_types_1.WorkerRequestMode.downloadArtwork, p => this.owner.workerService.artwork.download(p), { rootID, folderID, artworkURL, types });
    }
    async delete(artworkID, rootID) {
        return this.owner.newRequest(io_types_1.WorkerRequestMode.deleteArtwork, p => this.owner.workerService.artwork.remove(p), { rootID, artworkID });
    }
}
exports.IoCommandsArtwork = IoCommandsArtwork;
//# sourceMappingURL=io.commands.artwork.js.map