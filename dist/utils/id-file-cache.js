import fse from 'fs-extra';
import path from 'path';
import { DebouncePromises } from './debounce-promises';
export class IDFolderCache {
    constructor(dataPath, filePrefix, resolveParams) {
        this.dataPath = dataPath;
        this.filePrefix = filePrefix;
        this.resolveParams = resolveParams;
        this.cacheDebounce = new DebouncePromises();
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
            let list = await fse.readdir(this.dataPath);
            list = list.filter(name => {
                return searches.findIndex(s => name.startsWith(s)) >= 0;
            });
            for (const filename of list) {
                await fse.unlink(path.resolve(this.dataPath, filename));
            }
        }
    }
    async getExisting(id, params) {
        const cacheID = this.cacheFilename(id, params);
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
    async get(id, params, build) {
        const cacheID = this.cacheFilename(id, params);
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
        catch (e) {
            this.cacheDebounce.reject(cacheID, e);
            return Promise.reject(e);
        }
    }
}
//# sourceMappingURL=id-file-cache.js.map