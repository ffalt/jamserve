import {Folder} from './folder.model';
import {FolderStore, SearchQueryFolder} from './folder.store';
import {cleanFolderSystemChars, fileDeleteIfExists} from '../../utils/fs-utils';
import {TrackStore} from '../track/track.store';
import path from 'path';
import fse from 'fs-extra';
import Logger from '../../utils/logger';
import {IApiBinaryResult} from '../../typings';
import {FolderTypeImageName} from '../../model/jam-types';
import {ImageModule} from '../../modules/image/image.module';
import {BaseListService} from '../base/base.list.service';
import {StateService} from '../state/state.service';

const log = Logger('FolderService');

export class FolderService extends BaseListService<Folder, SearchQueryFolder> {

	constructor(public folderStore: FolderStore, private trackStore: TrackStore, stateService: StateService, private imageModule: ImageModule) {
		super(folderStore, stateService);
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

	async getFolderImage(folder: Folder, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		if (!folder.tag.image) {
			if (folder.info && folder.info.album.image && folder.info.album.image.large) {
				await this.downloadFolderImage(folder, folder.info.album.image.large);
			} else if (folder.info && folder.info.artist.image && folder.info.artist.image.large) {
				await this.downloadFolderImage(folder, folder.info.artist.image.large);
			}
			if (!folder.tag.image) {
				return;
			}
		}
		return await this.imageModule.get(folder.id, path.join(folder.path, folder.tag.image), size, format);
	}

	async downloadFolderImage(folder: Folder, imageUrl: string): Promise<void> {
		folder.tag.image = await this.imageModule.storeImage(folder.path, FolderTypeImageName[folder.tag.type], imageUrl);
		await this.folderStore.replace(folder);
	}

	async setFolderImage(folder: Folder, filename: string): Promise<void> {
		const destFileName = FolderTypeImageName[folder.tag.type] + path.extname(filename);
		const destName = path.join(folder.path, destFileName);
		await fileDeleteIfExists(destName);
		await fse.copy(filename, destName);
		folder.tag.image = destFileName;
		await this.folderStore.replace(folder);
	}


}
