import {IoService} from '../../engine/io/io.service';
import {IndexService} from '../../engine/index/index.service';
import {GenreService} from '../../engine/genre/genre.service';
import {Root, RootStatus} from './root.model';
import {Track} from '../track/track.model';
import {RootStore} from './root.store';

export class RootService {

	constructor(private rootStore: RootStore, private io: IoService, private indexService: IndexService, private genreService: GenreService) {
	}

	async refresh(): Promise<void> {
		await this.io.refresh();
		await this.afterRefresh();
	}

	async refreshRoot(root: Root): Promise<void> {
		await this.io.rescanRoot(root);
		await this.afterRefresh();
	}

	private async afterRefresh(): Promise<void> {
		await this.indexService.buildIndexes();
		await this.genreService.buildGenres();
	}

	async refreshTracks(tracks: Array<Track>): Promise<void> {
		await this.io.rescanTracks(tracks);
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

	async removeRoot(root: Root): Promise<void> {
		await this.rootStore.remove(root.id);
		await this.io.cleanStore();
	}

	getRootStatus(id: string): RootStatus {
		return this.io.getRootStatus(id);
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
}
