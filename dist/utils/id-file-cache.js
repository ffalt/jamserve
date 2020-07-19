"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDFolderCache = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const debounce_promises_1 = require("./debounce-promises");
class IDFolderCache {
    constructor(dataPath, filePrefix, resolveParams) {
        this.dataPath = dataPath;
        this.filePrefix = filePrefix;
        this.resolveParams = resolveParams;
        this.cacheDebounce = new debounce_promises_1.DebouncePromises();
    }
    prefixCacheFilename(id) {
        return `${this.filePrefix}-${id}`;
    }
    cacheFilename(id, params) {
        return `${this.prefixCacheFilename(id)}${this.resolveParams(params)}`;
    }
    async removeByIDs(ids) {
        const searches = ids.filter(id => id.length > 0).map(id => this.prefixCacheFilename(id));
        if (searches.length > 0) {
            let list = await fs_extra_1.default.readdir(this.dataPath);
            list = list.filter(name => {
                return searches.findIndex(s => name.startsWith(s)) >= 0;
            });
            for (const filename of list) {
                await fs_extra_1.default.unlink(path_1.default.resolve(this.dataPath, filename));
            }
        }
    }
    async getExisting(id, params) {
        const cacheID = this.cacheFilename(id, params);
        if (this.cacheDebounce.isPending(cacheID)) {
            return this.cacheDebounce.append(cacheID);
        }
        const cachefile = path_1.default.join(this.dataPath, cacheID);
        const exists = await fs_extra_1.default.pathExists(cachefile);
        if (exists) {
            return { file: { filename: cachefile, name: cacheID } };
        }
    }
    async get(id, params, build) {
        const cacheID = this.cacheFilename(id, params);
        if (this.cacheDebounce.isPending(cacheID)) {
            return this.cacheDebounce.append(cacheID);
        }
        this.cacheDebounce.setPending(cacheID);
        try {
            const cachefile = path_1.default.join(this.dataPath, cacheID);
            const exists = await fs_extra_1.default.pathExists(cachefile);
            if (!exists) {
                await build(cachefile);
            }
            const result = { file: { filename: cachefile, name: cacheID } };
            this.cacheDebounce.resolve(cacheID, result);
            return result;
        }
        catch (e) {
            this.cacheDebounce.reject(cacheID, e);
            return Promise.reject(e);
        }
    }
}
exports.IDFolderCache = IDFolderCache;
//# sourceMappingURL=id-file-cache.js.map