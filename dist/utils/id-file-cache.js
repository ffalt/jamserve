import fse from 'fs-extra';
import path from 'node:path';
import { DebouncePromises } from './debounce-promises.js';
export class IDFolderCache {
    constructor(dataPath, filePrefix, resolveParameters) {
        this.dataPath = dataPath;
        this.filePrefix = filePrefix;
        this.resolveParameters = resolveParameters;
        this.cacheDebounce = new DebouncePromises();
    }
    prefixCacheFilename(id) {
        return `${this.filePrefix}-${id}`;
    }
    cacheFilename(id, parameters) {
        return `${this.prefixCacheFilename(id)}${this.resolveParameters(parameters)}`;
    }
    async removeByIDs(ids) {
        const searches = ids.filter(id => id.length > 0).map(id => this.prefixCacheFilename(id));
        if (searches.length > 0) {
            let list = await fse.readdir(this.dataPath);
            list = list.filter(name => searches.some(s => name.startsWith(s)));
            for (const filename of list) {
                await fse.unlink(path.resolve(this.dataPath, filename));
            }
        }
    }
    async getExisting(id, parameters) {
        const cacheID = this.cacheFilename(id, parameters);
        if (this.cacheDebounce.isPending(cacheID)) {
            return this.cacheDebounce.append(cacheID);
        }
        const cachefile = path.join(this.dataPath, cacheID);
        const exists = await fse.pathExists(cachefile);
        if (exists) {
            return { file: { filename: cachefile, name: cacheID } };
        }
        return;
    }
    async get(id, parameters, build) {
        const cacheID = this.cacheFilename(id, parameters);
        if (this.cacheDebounce.isPending(cacheID)) {
            return this.cacheDebounce.append(cacheID);
        }
        this.cacheDebounce.setPending(cacheID);
        try {
            const cachefile = path.join(this.dataPath, cacheID);
            const exists = await fse.pathExists(cachefile);
            if (!exists) {
                await build(cachefile);
            }
            const result = { file: { filename: cachefile, name: cacheID } };
            this.cacheDebounce.resolve(cacheID, result);
            return result;
        }
        catch (error) {
            this.cacheDebounce.reject(cacheID, error);
            return Promise.reject(error);
        }
    }
}
//# sourceMappingURL=id-file-cache.js.map