import fse from 'fs-extra';
import path from 'path';
import {ArtworkImageType, FolderTypeImageName} from '../../../model/jam-types';
import {ImageModule} from '../../../modules/image/image.module';
import {generateArtworkId} from '../../../utils/artwork-id';
import {containsFolderSystemChars, fileDeleteIfExists, fileExt, replaceFolderSystemChars} from '../../../utils/fs-utils';
import {artWorkImageNameToType} from '../../folder/folder.format';
import {Artwork, Folder} from '../../folder/folder.model';
import {Store} from '../../store/store';
import {Changes} from '../changes/changes';

export class ArtworkWorker {

	constructor(private store: Store, private imageModule: ImageModule) {

	}

	private async buildArtworkImageFile(folder: Folder, name: string, removedID?: string): Promise<Artwork> {
		const destFile = path.join(folder.path, name);
		const stat = await fse.stat(destFile);
		const id = generateArtworkId(folder.id, name, stat.size);
		const artwork: Artwork = {
			id,
			name,
			types: artWorkImageNameToType(name),
			image: await this.imageModule.getImageInfo(destFile),
			stat: {
				created: stat.ctime.valueOf(),
				modified: stat.mtime.valueOf(),
				size: stat.size
			}
		};
		folder.tag.artworks = (folder.tag.artworks || []).filter(a => (a.id !== id) && (a.id !== removedID));
		folder.tag.artworks.push(artwork);
		await this.store.folderStore.replace(folder);
		await this.imageModule.clearImageCacheByIDs([folder.id, artwork.id].concat(removedID ? [removedID] : []));
		return artwork;
	}

	async rename(folderID: string, artworkID: string, name: string, changes: Changes): Promise<void> {
		const folder = await this.store.folderStore.byId(folderID);
		if (!folder) {
			return Promise.reject(Error(`Folder ${folderID} not found`));
		}
		const artwork = (folder.tag.artworks || []).find(a => a.id === artworkID);
		if (!artwork) {
			return Promise.reject(Error(`Artwork ${artworkID} not found`));
		}
		if (containsFolderSystemChars(name)) {
			return Promise.reject(Error('Invalid Image File Name'));
		}
		name = replaceFolderSystemChars(name, '').trim();
		if (name.length === 0) {
			return Promise.reject(Error('Invalid Image File Name'));
		}
		const ext = fileExt(artwork.name);
		const newName = name + ext;
		await fse.rename(path.join(folder.path, artwork.name), path.join(folder.path, newName));
		await this.buildArtworkImageFile(folder, newName, artworkID);
	}

	async create(folderID: string, artworkFilename: string, artworkMimeType: string, types: Array<ArtworkImageType>, changes: Changes): Promise<void> {
		const folder = await this.store.folderStore.byId(folderID);
		if (!folder) {
			return Promise.reject(Error(`Folder ${folderID} not found`));
		}
		const name = FolderTypeImageName[folder.tag.type];
		const imageext = fileExt(artworkFilename);
		if (imageext.length === 0) {
			return Promise.reject(Error('Invalid Image Filename'));
		}
		let dest = name + imageext;
		let nr = 2;
		while (await fse.pathExists(path.join(folder.path, dest))) {
			dest = `${name}-${nr}${imageext}`;
			nr++;
		}
		const destFile = path.join(folder.path, dest);
		await fse.move(artworkFilename, destFile);
		await this.buildArtworkImageFile(folder, dest);
	}

	async update(folderID: string, artworkID: string, artworkFilename: string, artworkMimeType: string, changes: Changes): Promise<void> {
		const folder = await this.store.folderStore.byId(folderID);
		if (!folder) {
			return Promise.reject(Error(`Folder ${folderID} not found`));
		}
		const artwork = (folder.tag.artworks || []).find(a => a.id === artworkID);
		if (!artwork) {
			return Promise.reject(Error(`Artwork ${artworkID} not found`));
		}
		const dest = path.join(folder.path, artwork.name);
		await fileDeleteIfExists(dest);
		await fse.move(artworkFilename, dest);
		await this.buildArtworkImageFile(folder, artwork.name, artworkID);
	}

	async download(rootID: string, folderID: string, artworkURL: string, types: Array<ArtworkImageType>, changes: Changes): Promise<void> {
		const folder = await this.store.folderStore.byId(folderID);
		if (!folder) {
			return Promise.reject(Error(`Folder ${folderID} not found`));
		}
		const name = types.sort((a, b) => a.localeCompare(b)).join('-');
		const filename = await this.imageModule.storeImage(folder.path, name, artworkURL);
		await this.buildArtworkImageFile(folder, filename);
	}

	async delete(folderID: string, artworkID: string, changes: Changes): Promise<void> {
		const folder = await this.store.folderStore.byId(folderID);
		if (!folder) {
			return Promise.reject(Error(`Folder ${folderID} not found`));
		}
		const artwork = (folder.tag.artworks || []).find(a => a.id === artworkID);
		if (!artwork) {
			return Promise.reject(Error(`Artwork ${artworkID} not found`));
		}
		folder.tag.artworks = (folder.tag.artworks || []).filter(art => art.id !== artwork.id);
		await this.store.folderStore.replace(folder);
		const destName = path.join(folder.path, artwork.name);
		await fileDeleteIfExists(destName);
		await this.imageModule.clearImageCacheByIDs([folder.id, artwork.id]);
	}
}
