import {Folder} from './folder.model';
import {FolderStore} from './folder.store';
import {cleanFolderSystemChars} from '../../utils/fs-utils';
import {TrackStore} from '../track/track.store';
import path from 'path';
import fse from 'fs-extra';
import Logger from '../../utils/logger';

const log = Logger('FolderService');

export class FolderService {

	constructor(public folderStore: FolderStore, private trackStore: TrackStore) {

	}

	async renameFolder(folder: Folder, name: string): Promise<void> {
		name = cleanFolderSystemChars(name, '').trim();
		if (name.length === 0) {
			return Promise.reject(Error('Invalid Name'));
		}
		const p = path.dirname(folder.path);
		const newPath = path.join(p, name);
		const exists = await fse.pathExists(newPath);
		if (exists) {
			return Promise.reject(Error('Directory already exists'));
		}
		await fse.rename(folder.path, newPath);
		const folders = await this.folderStore.search({inPath: folder.path});
		for (const f of folders) {
			const rest = f.path.slice(folder.path.length - 1);
			if (rest.length > 0 && rest[0] !== path.sep) {
				log.error('WRONG inPath MATCH', rest, folder.path, f.path);
			} else {
				f.path = newPath + rest;
				await this.folderStore.replace(f);
			}
		}
		const tracks = await this.trackStore.search({inPath: folder.path});
		for (const t of tracks) {
			t.path = t.path.replace(folder.path, newPath);
			await this.trackStore.replace(t);
		}
		folder.path = newPath;
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


}
