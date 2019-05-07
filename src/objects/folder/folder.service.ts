import fse from 'fs-extra';
import path from 'path';
import {DBObjectType} from '../../db/db.types';
import {generateArtworkId} from '../../engine/scan/scan.utils';
import {ArtworkImageType, FolderType, FolderTypeImageName} from '../../model/jam-types';
import {ImageModule} from '../../modules/image/image.module';
import {ApiBinaryResult} from '../../typings';
import {containsFolderSystemChars, ensureTrailingPathSeparator, fileDeleteIfExists, replaceFolderSystemChars} from '../../utils/fs-utils';
import Logger from '../../utils/logger';
import {BaseListService} from '../base/base.list.service';
import {StateService} from '../state/state.service';
import {TrackStore} from '../track/track.store';
import {artWorkImageNameToType} from './folder.format';
import {Artwork, Folder} from './folder.model';
import {FolderStore, SearchQueryFolder} from './folder.store';

const log = Logger('FolderService');

export class FolderService extends BaseListService<Folder, SearchQueryFolder> {

	constructor(public folderStore: FolderStore, private trackStore: TrackStore, stateService: StateService, public imageModule: ImageModule) {
		super(folderStore, stateService);
	}

	async collectFolderPath(folderId: string | undefined, cachedFolders?: Array<Folder>): Promise<Array<Folder>> {
		const result: Array<Folder> = [];
		const store = this.folderStore;

		async function collect(id?: string): Promise<void> {
			if (!id) {
				return;
			}
			let folder: Folder | undefined;
			if (cachedFolders) {
				folder = cachedFolders.find(f => f.id === id);
			}
			if (!folder) {
				folder = await store.byId(id);
				if (cachedFolders && folder) {
					cachedFolders.push(folder);
				}
			}
			if (folder) {
				result.unshift(folder);
				await collect(folder.parentID);
			}
		}

		await collect(folderId);
		return result;
	}

	async getFolderImage(folder: Folder, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		if (!folder.tag.image) {
			return;
		}
		return this.imageModule.get(folder.id, path.join(folder.path, folder.tag.image), size, format);
	}

	async setFolderImage(folder: Folder, filename: string): Promise<void> {
		// TODO: move this ioService=>scanService
		const destFileName = FolderTypeImageName[folder.tag.type] + path.extname(filename);
		const destName = path.join(folder.path, destFileName);
		await fileDeleteIfExists(destName);
		await fse.copy(filename, destName);
		folder.tag.image = destFileName;
		await this.folderStore.replace(folder);
	}

	async getArtworkImage(folder: Folder, artwork: Artwork, size?: number, format?: string): Promise<ApiBinaryResult> {
		return this.imageModule.get(artwork.id, path.join(folder.path, artwork.name), size, format);
	}

	async setCurrentArtworkImage(folder: Folder): Promise<void> {
		if (folder.tag.image) {
			return;
		}
		if (folder.tag.artworks) {
			let artwork: Artwork | undefined;
			if (folder.tag.type === FolderType.artist) {
				artwork = folder.tag.artworks.find(a => a.types.indexOf(ArtworkImageType.artist) >= 0);
			}
			if (!artwork) {
				artwork = folder.tag.artworks.find(a => a.types.indexOf(ArtworkImageType.front) >= 0);
			}
			if (artwork) {
				folder.tag.image = artwork.name;
				await this.folderStore.replace(folder);
			}
		}
	}

	async updateArtworkImage(folder: Folder, artwork: Artwork, name: string): Promise<Artwork> {
		// TODO: move this ioService=>scanService
		if (containsFolderSystemChars(name)) {
			return Promise.reject(Error('Invalid Image File Name'));
		}
		name = replaceFolderSystemChars(name, '').trim();
		if (name.length === 0) {
			return Promise.reject(Error('Invalid Image File Name'));
		}
		const ext = path.extname(artwork.name).toLowerCase();
		const newName = name + ext;
		await fse.rename(path.join(folder.path, artwork.name), path.join(folder.path, newName));
		await this.imageModule.clearImageCacheByIDs([artwork.id]);
		if (folder.tag.image === artwork.name) {
			folder.tag.image = newName;
		}
		const stat = await fse.stat(path.join(folder.path, newName));
		folder.tag.artworks = (folder.tag.artworks || []).filter(a => a.id !== artwork.id);
		folder.tag.artworks.push({
			id: generateArtworkId(folder.id, newName),
			name: newName,
			types: artWorkImageNameToType(name),
			stat: {
				created: stat.ctime.valueOf(),
				modified: stat.mtime.valueOf(),
				size: stat.size
			}
		});
		await this.folderStore.replace(folder);
		await this.setCurrentArtworkImage(folder);
		return artwork;
	}

	async removeArtworkImage(folder: Folder, artwork: Artwork): Promise<void> {
		// TODO: move this ioService=>scanService
		if (!folder.tag.artworks) {
			return;
		}
		folder.tag.artworks = (folder.tag.artworks || []).filter(art => art.id !== artwork.id);
		const clearID = [];
		if (folder.tag.image === artwork.name) {
			folder.tag.image = undefined;
			clearID.push(folder.id);
		}
		clearID.push(artwork.id);
		await this.folderStore.replace(folder);
		const destName = path.join(folder.path, artwork.name);
		await fileDeleteIfExists(destName);
		await this.imageModule.clearImageCacheByIDs(clearID);
		await this.setCurrentArtworkImage(folder);
	}

	async downloadFolderArtwork(folder: Folder, imageUrl: string, types: Array<ArtworkImageType>): Promise<Artwork> {
		// TODO: move this ioService=>scanService
		const name = types.sort((a, b) => a.localeCompare(b)).join('-');
		const filename = await this.imageModule.storeImage(folder.path, name, imageUrl);
		const stat = await fse.stat(path.join(folder.path, filename));
		const artwork: Artwork = {
			id: generateArtworkId(folder.id, filename),
			name: filename,
			types,
			stat: {
				created: stat.ctime.valueOf(),
				modified: stat.mtime.valueOf(),
				size: stat.size
			}
		};
		folder.tag.artworks = folder.tag.artworks || [];
		folder.tag.artworks.push(artwork);
		await this.folderStore.replace(folder);
		await this.setCurrentArtworkImage(folder);
		return artwork;
	}

	async newFolder(folder: Folder, name: string): Promise<Folder> {
		if (containsFolderSystemChars(name)) {
			return Promise.reject(Error('Invalid Directory Name'));
		}
		name = replaceFolderSystemChars(name, '').trim();
		if (name.length === 0 || ['.', '..'].indexOf(name) >= 0) {
			return Promise.reject(Error('Invalid Directory Name'));
		}
		const destination = path.join(folder.path, name);
		const exists = await fse.pathExists(destination);
		if (exists) {
			return Promise.reject(Error('Directory already exists'));
		}
		await fse.mkdir(destination);
		const stat = await fse.stat(destination);
		const result: Folder = {
			id: '',
			type: DBObjectType.folder,
			rootID: folder.rootID,
			path: ensureTrailingPathSeparator(destination),
			parentID: folder.id,
			stat: {
				created: stat.ctime.valueOf(),
				modified: stat.mtime.valueOf()
			},
			tag: {
				level: folder.tag.level + 1,
				trackCount: 0,
				folderCount: 0,
				type: FolderType.extras
			}
		};
		result.id = await this.store.add(result);
		return result;
	}
}
