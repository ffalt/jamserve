"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerCommandsArtwork = void 0;
class WorkerCommandsArtwork {
    constructor(owner) {
        this.owner = owner;
    }
    async rename(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        await this.owner.artworkWorker.rename(orm, parameters.artworkID, parameters.newName, changes);
        return this.owner.changes.finish(orm, changes, root);
    }
    async create(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        await this.owner.artworkWorker.create(orm, parameters.folderID, parameters.artworkFilename, parameters.types, changes);
        return this.owner.changes.finish(orm, changes, root);
    }
    async move(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        await this.owner.artworkWorker.move(orm, parameters.artworkIDs, parameters.newParentID, changes);
        return this.owner.changes.finish(orm, changes, root);
    }
    async replace(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        await this.owner.artworkWorker.replace(orm, parameters.artworkID, parameters.artworkFilename, changes);
        return this.owner.changes.finish(orm, changes, root);
    }
    async download(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        await this.owner.artworkWorker.download(orm, parameters.folderID, parameters.artworkURL, parameters.types, changes);
        return this.owner.changes.finish(orm, changes, root);
    }
    async remove(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        await this.owner.artworkWorker.remove(orm, root, parameters.artworkID, changes);
        return this.owner.changes.finish(orm, changes, root);
    }
}
exports.WorkerCommandsArtwork = WorkerCommandsArtwork;
//# sourceMappingURL=worker.commands.artwork.js.map