import {Store} from '../store';
import {IoService} from '../io/io.service';
import {dirExist, dirRename, replaceFileSystemChars} from '../../utils/fs-utils';
import path from 'path';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {IndexService} from '../index/index.service';
import {GenreService} from '../genre/genre.service';
import {Folder} from '../folder/folder.model';
import {Root, RootStatus} from './root.model';
import {Track} from '../track/track.model';

export class RootService {

	constructor(private store: Store, private io: IoService, private indexService: IndexService, private genreService: GenreService) {
	}

	async collectFolderPath(folderId: string | undefined): Promise<Array<Folder>> {
		const result: Array<Folder> = [];
		const store = this.store.folderStore;

		async function collect(id?: string): Promise<void> {
			if (!id) {
				return;
			}
			const folder = await store.byId(id);
			if (folder) {
				result.unshift(folder);
				await collect(folder.parentID);
			}
		}

		await collect(folderId);
		return result;
	}

	async getFolderParents(folder: Folder): Promise<Array<Jam.FolderParent>> {
		const result = await this.collectFolderPath(folder.parentID);
		return result.map(parent => {
			return {
				id: parent.id,
				name: path.basename(parent.path)
			};
		});
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

	async renameFolder(folder: Folder, name: string): Promise<void> {
		name = replaceFileSystemChars(name, '').trim();
		if (name.length === 0) {
			return Promise.reject(Error('Invalid Name'));
		}
		const p = path.dirname(folder.path);
		const dest = path.join(p, name);
		const exists = await dirExist(dest);
		if (exists) {
			return Promise.reject(Error('Directory already exists'));
		}
		await dirRename(folder.path, dest);
		await this.io.applyFolderMove(folder, dest);
	}

	async createRoot(root: Root): Promise<string> {
		const roots = await this.store.rootStore.search({});
		const invalid = roots.find(r => {
			return root.path.indexOf(r.path) >= 0 || r.path.indexOf(root.path) >= 0;
		});
		if (invalid) {
			return Promise.reject(Error('Root path already used'));
		}
		return this.store.rootStore.add(root);
	}

	async removeRoot(root: Root): Promise<void> {
		await this.store.rootStore.remove(root.id);
		await this.io.cleanStore();
	}

	getRootStatus(id: string): RootStatus {
		return this.io.getRootStatus(id);
	}

	async updateRoot(root: Root): Promise<void> {
		const roots = await this.store.rootStore.search({});
		const invalid = roots.find(r => {
			return r.id !== root.id && (root.path.indexOf(r.path) >= 0 || r.path.indexOf(root.path) >= 0);
		});
		if (invalid) {
			return Promise.reject(Error('Root path already used'));
		}
		await this.store.rootStore.replace(root);
	}
}
