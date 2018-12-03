import {Folder} from './folder.model';
import {FolderStore} from './folder.store';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import path from 'path';
import {replaceFileSystemChars} from '../../utils/fs-utils';
import fse from 'fs-extra';
import {IoService} from '../../engine/io/io.service';

export class FolderService {

	constructor(private folderStore: FolderStore, private io: IoService) {

	}

	async renameFolder(folder: Folder, name: string): Promise<void> {
		name = replaceFileSystemChars(name, '').trim();
		if (name.length === 0) {
			return Promise.reject(Error('Invalid Name'));
		}
		const p = path.dirname(folder.path);
		const dest = path.join(p, name);
		const exists = await fse.pathExists(dest);
		if (exists) {
			return Promise.reject(Error('Directory already exists'));
		}
		await fse.rename(folder.path, dest);
		await this.io.applyFolderMove(folder, dest);
	}

	async collectFolderPath(folderId: string | undefined): Promise<Array<Folder>> {
		const result: Array<Folder> = [];
		const store = this.folderStore;

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

}
