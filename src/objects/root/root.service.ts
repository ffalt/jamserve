import {IoService} from '../../engine/io/io.service';
import {IndexService} from '../../engine/index/index.service';
import {GenreService} from '../../engine/genre/genre.service';
import {Root, RootStatus} from './root.model';
import {Track} from '../track/track.model';
import {RootStore} from './root.store';

export class RootService {

	constructor(private rootStore: RootStore) {
	}

	async createRoot(root: Root): Promise<string> {
		const roots = await this.rootStore.search({});
		const invalid = roots.find(r => {
			return root.path.indexOf(r.path) >= 0 || r.path.indexOf(root.path) >= 0;
		});
		if (invalid) {
			return Promise.reject(Error('Root path already used'));
		}
		return this.rootStore.add(root);
	}

	async updateRoot(root: Root): Promise<void> {
		const roots = await this.rootStore.search({});
		const invalid = roots.find(r => {
			return r.id !== root.id && (root.path.indexOf(r.path) >= 0 || r.path.indexOf(root.path) >= 0);
		});
		if (invalid) {
			return Promise.reject(Error('Root path already used'));
		}
		await this.rootStore.replace(root);
	}

	async removeRoot(root: Root): Promise<void> {
		await this.rootStore.remove(root.id);
	}
}
