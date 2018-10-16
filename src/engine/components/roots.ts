import {Store} from '../../store/store';
import {JamServe} from '../../model/jamserve';
import {IO} from '../../io/io';

export class Roots {
	store: Store;
	io: IO;

	constructor(store: Store, io: IO) {
		this.store = store;
		this.io = io;
	}

	async createRoot(root: JamServe.Root): Promise<string> {
		const roots = await this.store.root.search({});
		const invalid = roots.find(r => {
			return root.path.indexOf(r.path) >= 0 || r.path.indexOf(root.path) >= 0;
		});
		if (invalid) {
			return Promise.reject(Error('Root path already used'));
		}
		return this.store.root.add(root);
	}

	async removeRoot(root: JamServe.Root): Promise<void> {
		await this.store.root.remove(root.id);
		await this.io.cleanStore();
	}

	async updateRoot(root: JamServe.Root): Promise<void> {
		const roots = await this.store.root.search({});
		const invalid = roots.find(r => {
			return r.id !== root.id && (root.path.indexOf(r.path) >= 0 || r.path.indexOf(root.path) >= 0);
		});
		if (invalid) {
			return Promise.reject(Error('Root path already used'));
		}
		await this.store.root.replace(root);
	}
}
