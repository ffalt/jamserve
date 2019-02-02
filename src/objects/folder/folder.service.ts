import {Artwork, Folder} from './folder.model';
import {FolderStore, SearchQueryFolder} from './folder.store';
import {containsFolderSystemChars, ensureTrailingPathSeparator, fileDeleteIfExists, replaceFolderSystemChars} from '../../utils/fs-utils';
import {TrackStore} from '../track/track.store';
import path from 'path';
import fse from 'fs-extra';
import Logger from '../../utils/logger';
import {IApiBinaryResult} from '../../typings';
import {ArtworkImageType, FolderTypeImageName} from '../../model/jam-types';
import {ImageModule} from '../../modules/image/image.module';
import {BaseListService} from '../base/base.list.service';
import {StateService} from '../state/state.service';
import {generateArtworkId} from '../../engine/scan/scan.service';

const log = Logger('FolderService');

export class FolderService extends BaseListService<Folder, SearchQueryFolder> {

	constructor(public folderStore: FolderStore, private trackStore: TrackStore, stateService: StateService, public imageModule: ImageModule) {
		super(folderStore, stateService);
	}

	async renameFolder(folder: Folder, name: string): Promise<void> {
		if (containsFolderSystemChars(name)) {
			return Promise.reject(Error('Invalid Folder Name'));
		}
		name = replaceFolderSystemChars(name, '').trim();
		if (name.length === 0 || ['.', '..'].indexOf(name) >= 0) {
			return Promise.reject(Error('Invalid Folder Name'));
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
				f.path = newPath + ensureTrailingPathSeparator(rest);
				await this.folderStore.replace(f);
			}
		}
		const tracks = await this.trackStore.search({inPath: folder.path});
		for (const t of tracks) {
			t.path = t.path.replace(folder.path, ensureTrailingPathSeparator(newPath));
			await this.trackStore.replace(t);
		}
		folder.path = ensureTrailingPathSeparator(newPath);
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
			if (!folder.tag.image) {
				return;
			}
		}
		return await this.imageModule.get(folder.id, path.join(folder.path, folder.tag.image), size, format);
	}

	async downloadFolderArtwork(folder: Folder, imageUrl: string, types: Array<ArtworkImageType>): Promise<Artwork> {
		const name = types.sort((a, b) => a.localeCompare(b)).join('-');
		const filename = await this.imageModule.storeImage(folder.path, name, imageUrl);
		const stat = await fse.stat(path.join(folder.path, filename));
		const artwork = {
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
		if (!folder.tag.image && types.indexOf(ArtworkImageType.front) >= 0) {
			folder.tag.image = artwork.name;
		}
		await this.folderStore.replace(folder);
		return artwork;
	}

	async setFolderImage(folder: Folder, filename: string): Promise<void> {
		const destFileName = FolderTypeImageName[folder.tag.type] + path.extname(filename);
		const destName = path.join(folder.path, destFileName);
		await fileDeleteIfExists(destName);
		await fse.copy(filename, destName);
		folder.tag.image = destFileName;
		await this.folderStore.replace(folder);
	}

	async getArtworkImage(folder: Folder, artwork: Artwork, size?: number, format?: string): Promise<IApiBinaryResult> {
		return await this.imageModule.get(artwork.id, path.join(folder.path, artwork.name), size, format);
	}

	async removeArtworkImage(folder: Folder, artwork: Artwork): Promise<void> {
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
	}
}
