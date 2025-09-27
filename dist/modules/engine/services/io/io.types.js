import { errorStringCode } from '../../../../utils/error.js';
export var WorkerRequestMode;
(function (WorkerRequestMode) {
    WorkerRequestMode[WorkerRequestMode["refreshRoot"] = 0] = "refreshRoot";
    WorkerRequestMode[WorkerRequestMode["removeRoot"] = 1] = "removeRoot";
    WorkerRequestMode[WorkerRequestMode["updateRoot"] = 2] = "updateRoot";
    WorkerRequestMode[WorkerRequestMode["createRoot"] = 3] = "createRoot";
    WorkerRequestMode[WorkerRequestMode["refreshRootMeta"] = 4] = "refreshRootMeta";
    WorkerRequestMode[WorkerRequestMode["fixTrack"] = 5] = "fixTrack";
    WorkerRequestMode[WorkerRequestMode["moveTracks"] = 6] = "moveTracks";
    WorkerRequestMode[WorkerRequestMode["removeTracks"] = 7] = "removeTracks";
    WorkerRequestMode[WorkerRequestMode["renameTrack"] = 8] = "renameTrack";
    WorkerRequestMode[WorkerRequestMode["writeTrackTags"] = 9] = "writeTrackTags";
    WorkerRequestMode[WorkerRequestMode["createFolder"] = 10] = "createFolder";
    WorkerRequestMode[WorkerRequestMode["deleteFolders"] = 11] = "deleteFolders";
    WorkerRequestMode[WorkerRequestMode["moveFolders"] = 12] = "moveFolders";
    WorkerRequestMode[WorkerRequestMode["renameFolder"] = 13] = "renameFolder";
    WorkerRequestMode[WorkerRequestMode["deleteArtwork"] = 14] = "deleteArtwork";
    WorkerRequestMode[WorkerRequestMode["downloadArtwork"] = 15] = "downloadArtwork";
    WorkerRequestMode[WorkerRequestMode["replaceArtwork"] = 16] = "replaceArtwork";
    WorkerRequestMode[WorkerRequestMode["createArtwork"] = 17] = "createArtwork";
    WorkerRequestMode[WorkerRequestMode["renameArtwork"] = 18] = "renameArtwork";
})(WorkerRequestMode || (WorkerRequestMode = {}));
export class IoRequest {
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
        catch (error) {
            console.error(error);
            const code = errorStringCode(error);
            if (code && ['EACCES', 'ENOENT'].includes(code)) {
                return Promise.reject(new Error('Directory not found/no access/error in filesystem'));
            }
            return Promise.reject(error);
        }
    }
}
//# sourceMappingURL=io.types.js.map