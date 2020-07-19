import fse from 'fs-extra';
import path from 'path';
import {basenameStripExt, ensureTrailingPathSeparator, fileDeleteIfExists, fileSuffix} from '../../../../utils/fs-utils';
import {Changes} from '../changes';
import {Artwork} from '../../../../entity/artwork/artwork';
import {artWorkImageNameToType} from '../../../../utils/artwork-type';
import {ArtworkImageType} from '../../../../types/enums';
import {BaseWorker} from './base';
import {Root} from '../../../../entity/root/root';
import {Folder} from '../../../../entity/folder/folder';

export const FolderTypeImageName: { [foldertype: string]: string } = {
	unknown: 'folder',
	artist: 'artist',
	collection: 'folder',
	album: 'cover',
	multialbum: 'cover',
	extras: 'folder'
};

export class ArtworkWorker extends BaseWorker {

	private async updateArtworkImageFile(artwork: Artwork): Promise<void> {
		const destFile = path.join(artwork.path, artwork.name);
		const stat = await fse.stat(destFile);
		const info = await this.imageModule.getImageInfo(destFile);
		artwork.types = artWorkImageNameToType(artwork.name);
		artwork.statCreated = stat.ctime.valueOf();
		artwork.statModified = stat.mtime.valueOf();
		artwork.fileSize = stat.size;
		artwork.format = info?.format;
		artwork.height = info?.height;
		artwork.width = info?.width;
	}

	async rename(artworkID: string, newName: string, changes: Changes): Promise<void> {
		const artwork = await this.orm.Artwork.findOne(artworkID);
		if (!artwork) {
			return Promise.reject(Error(`Artwork not found`));
		}
		artwork.name = await this.renameFile(artwork.path, artwork.name, newName);
		await this.updateArtworkImageFile(artwork);
		this.orm.orm.em.persistLater(artwork);
		changes.artworks.updated.add(artwork);
		changes.folders.updated.add(artwork.folder);
	}

	private getArtworkName(folder: Folder, types: Array<ArtworkImageType>): string {
		let name = types.sort((a, b) => a.localeCompare(b)).join('-');
		if (!name) {
			name = FolderTypeImageName[folder.folderType];
		}
		return name;
	}

	async getArtworkFilenameUnique(folder: Folder, importFilename: string, types: Array<ArtworkImageType>): Promise<string> {
		const name = this.getArtworkName(folder, types);
		let suffix = fileSuffix(importFilename);
		if (suffix.length === 0) {
			const info = await this.imageModule.getImageInfo(importFilename);
			suffix = info.format;
		}
		if (!suffix || suffix.length === 0 || suffix === 'invalid') {
			return Promise.reject(Error('Image Format invalid/not known'));
		}
		let dest = `${name}.${suffix}`;
		let nr = 2;
		while (await fse.pathExists(path.join(folder.path, dest))) {
			dest = `${name}-${nr}.${suffix}`;
			nr++;
		}
		return dest;
	}

	async create(folderID: string, artworkFilename: string, types: Array<ArtworkImageType>, changes: Changes): Promise<void> {
		if (!artworkFilename || !(await fse.pathExists(artworkFilename))) {
			return Promise.reject(Error('Invalid Artwork File Name'));
		}
		const folder = await this.orm.Folder.findOne(folderID);
		if (!folder) {
			return Promise.reject(Error(`Folder not found`));
		}
		const dest = await this.getArtworkFilenameUnique(folder, artworkFilename, types);
		const destFile = path.join(folder.path, dest);
		try {
			await fse.copy(artworkFilename, destFile);
		} catch (e) {
			return Promise.reject(Error(`Importing artwork failed`));
		}
		const artwork = this.orm.Artwork.create({
			name: dest,
			path: folder.path,
			types,
			folder
		});
		changes.folders.updated.add(folder);
		changes.artworks.added.add(artwork);
		await this.updateArtworkImageFile(artwork);
		this.orm.orm.em.persistLater(artwork);
	}

	async replace(artworkID: string, artworkFilename: string, changes: Changes): Promise<void> {
		if (!artworkFilename || !(await fse.pathExists(artworkFilename))) {
			return Promise.reject(Error('Invalid Artwork File Name'));
		}
		const artwork = await this.orm.Artwork.findOne(artworkID);
		if (!artwork) {
			return Promise.reject(Error(`Artwork not found`));
		}
		const name = basenameStripExt(artwork.name);
		const info = await this.imageModule.getImageInfo(artworkFilename);
		const suffix = info.format;
		if (!suffix || suffix.length === 0 || suffix === 'invalid') {
			return Promise.reject(Error('Image Format invalid/not known'));
		}
		// TODO: backup old file in case copy fails
		await fileDeleteIfExists(path.join(artwork.path, artwork.name));
		artwork.name = `${name}.${suffix}`
		try {
			await fse.copy(artworkFilename, path.join(artwork.path, artwork.name));
		} catch (e) {
			return Promise.reject(Error(`Importing artwork failed`));
		}
		await this.updateArtworkImageFile(artwork);
		changes.artworks.updated.add(artwork);
		this.orm.orm.em.persistLater(artwork);
	}

	async download(folderID: string, artworkURL: string, types: Array<ArtworkImageType>, changes: Changes): Promise<void> {
		const folder = await this.orm.Folder.findOne(folderID);
		if (!folder) {
			return Promise.reject(Error(`Folder not found`));
		}
		const name = types.sort((a, b) => a.localeCompare(b)).join('-');
		const filename = await this.imageModule.storeImage(folder.path, name, artworkURL);
		const artwork = this.orm.Artwork.create({name: filename, path: folder.path, folder});
		changes.folders.updated.add(folder);
		changes.artworks.added.add(artwork);
		await this.updateArtworkImageFile(artwork);
		this.orm.orm.em.persistLater(artwork);
	}

	async remove(root: Root, artworkID: string, changes: Changes): Promise<void> {
		const artwork = await this.orm.Artwork.findOne(artworkID);
		if (!artwork) {
			return Promise.reject(Error(`Artwork not found`));
		}
		await this.moveToTrash(root, artwork.path, artwork.name);
		changes.artworks.removed.add(artwork);
		changes.folders.updated.add(artwork.folder);
	}

	async move(artworkIDs: Array<string>, newParentID: string, changes: Changes) {
		const artworks = await this.orm.Artwork.find(artworkIDs);
		if (artworks.length !== artworkIDs.length) {
			return Promise.reject(Error('Artwork not found'));
		}
		const newParent = await this.orm.Folder.findOne(newParentID);
		if (!newParent) {
			return Promise.reject(Error('Destination Folder not found'));
		}
		for (const artwork of artworks) {
			if (await fse.pathExists(path.join(newParent.path, artwork.name))) {
				return Promise.reject(Error('File name is already used in folder'));
			}
		}
		changes.folders.updated.add(newParent);
		for (const artwork of artworks) {
			changes.artworks.updated.add(artwork);
			const oldParent = artwork.folder;
			if (oldParent.id !== newParentID) {
				changes.folders.updated.add(oldParent);
				await fse.move(path.join(artwork.path, artwork.name), path.join(newParent.path, artwork.name));
				artwork.path = ensureTrailingPathSeparator(newParent.path);
				artwork.folder = newParent;
				this.orm.orm.em.persistLater(artwork);
			}
		}
	}
}
