"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoRequest = exports.WorkerRequestMode = void 0;
var WorkerRequestMode;
(function (WorkerRequestMode) {
    WorkerRequestMode[WorkerRequestMode["refreshRoot"] = 0] = "refreshRoot";
    WorkerRequestMode[WorkerRequestMode["removeRoot"] = 1] = "removeRoot";
    WorkerRequestMode[WorkerRequestMode["updateRoot"] = 2] = "updateRoot";
    WorkerRequestMode[WorkerRequestMode["createRoot"] = 3] = "createRoot";
    WorkerRequestMode[WorkerRequestMode["fixTrack"] = 4] = "fixTrack";
    WorkerRequestMode[WorkerRequestMode["moveTracks"] = 5] = "moveTracks";
    WorkerRequestMode[WorkerRequestMode["removeTracks"] = 6] = "removeTracks";
    WorkerRequestMode[WorkerRequestMode["renameTrack"] = 7] = "renameTrack";
    WorkerRequestMode[WorkerRequestMode["writeTrackTags"] = 8] = "writeTrackTags";
    WorkerRequestMode[WorkerRequestMode["createFolder"] = 9] = "createFolder";
    WorkerRequestMode[WorkerRequestMode["deleteFolders"] = 10] = "deleteFolders";
    WorkerRequestMode[WorkerRequestMode["moveFolders"] = 11] = "moveFolders";
    WorkerRequestMode[WorkerRequestMode["renameFolder"] = 12] = "renameFolder";
    WorkerRequestMode[WorkerRequestMode["deleteArtwork"] = 13] = "deleteArtwork";
    WorkerRequestMode[WorkerRequestMode["downloadArtwork"] = 14] = "downloadArtwork";
    WorkerRequestMode[WorkerRequestMode["replaceArtwork"] = 15] = "replaceArtwork";
    WorkerRequestMode[WorkerRequestMode["createArtwork"] = 16] = "createArtwork";
    WorkerRequestMode[WorkerRequestMode["renameArtwork"] = 17] = "renameArtwork";
})(WorkerRequestMode = exports.WorkerRequestMode || (exports.WorkerRequestMode = {}));
class IoRequest {
    constructor(id, mode, execute, parameters) {
        this.id = id;
        this.mode = mode;
        this.execute = execute;
        this.parameters = parameters;
    }
    async run() {
        try {
            return await this.execute(this.parameters);
        }
        catch (e) {
            console.error(e.stack);
            if (['EACCES', 'ENOENT'].includes(e.code)) {
                return Promise.reject(Error('Directory not found/no access/error in filesystem'));
            }
            return Promise.reject(e);
        }
    }
}
exports.IoRequest = IoRequest;
//# sourceMappingURL=io.types.js.map