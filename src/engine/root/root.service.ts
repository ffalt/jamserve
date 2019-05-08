import {BaseStoreService} from '../base/base.service';
import {Root} from './root.model';
import {RootStore, SearchQueryRoot} from './root.store';

export class RootService extends BaseStoreService<Root, SearchQueryRoot> {

	constructor(public rootStore: RootStore) {
		super(rootStore);
	}

	private async checkUsedPath(dir: string, roots: Array<Root>): Promise<void> {
		for (const r of roots) {
			if (dir.indexOf(r.path) === 0 || r.path.indexOf(dir) === 0) {
				return Promise.reject(Error('Root path already used'));
			}
		}
	}

	async create(root: Root): Promise<string> {
		const roots = await this.rootStore.all();
		await this.checkUsedPath(root.path, roots);
		return this.rootStore.add(root);
	}

	async update(root: Root): Promise<void> {
		const roots = await this.rootStore.all();
		await this.checkUsedPath(root.path, roots.filter(r => r.id !== root.id));
		await this.rootStore.replace(root);
	}

	async remove(root: Root): Promise<void> {
		await this.rootStore.remove(root.id);
	}
}
