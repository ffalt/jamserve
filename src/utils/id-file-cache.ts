import fse from 'fs-extra';
import path from 'path';
import { DebouncePromises } from './debounce-promises.js';

export interface IDCacheResult {
	file: {
		filename: string;
		name: string;
	};
}

export class IDFolderCache<T> {
	private readonly cacheDebounce = new DebouncePromises<IDCacheResult>();

	constructor(
		public dataPath: string,
		public filePrefix: string,
		private readonly resolveParams: (params: T) => string
	) {
	}

	prefixCacheFilename(id: string): string {
		return `${this.filePrefix}-${id}`;
	}

	cacheFilename(id: string, params: T): string {
		return `${this.prefixCacheFilename(id)}${this.resolveParams(params)}`;
	}

	async removeByIDs(ids: Array<string>): Promise<void> {
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

	async getExisting(id: string, params: T): Promise<IDCacheResult | undefined> {
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

	async get(id: string, params: T, build: (cacheFilename: string) => Promise<void>): Promise<IDCacheResult> {
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
			const result: IDCacheResult = { file: { filename: cachefile, name: cacheID } };
			this.cacheDebounce.resolve(cacheID, result);
			return result;
		} catch (e) {
			this.cacheDebounce.reject(cacheID, e as Error);
			return Promise.reject(e as Error);
		}
	}
}
