import fse from 'fs-extra';
import path from 'node:path';
import { basenameStripExtension, ensureTrailingPathSeparator, fileDeleteIfExists, fileSuffix } from '../../../../utils/fs-utils.js';
import { Changes } from '../changes.js';
import { Artwork } from '../../../../entity/artwork/artwork.js';
import { artWorkImageNameToType } from '../../../../utils/artwork-type.js';
import { ArtworkImageType } from '../../../../types/enums.js';
import { BaseWorker } from './base.js';
import { Root } from '../../../../entity/root/root.js';
import { Folder } from '../../../../entity/folder/folder.js';
import { InRequestScope } from 'typescript-ioc';
import { Orm } from '../../services/orm.service.js';

export const FolderTypeImageName: Record<string, string> = {
	unknown: 'folder',
	artist: 'artist',
	collection: 'folder',
	album: 'cover',
	multialbum: 'cover',
	extras: 'folder'
};

@InRequestScope
export class ArtworkWorker extends BaseWorker {
	private async updateArtworkImageFile(artwork: Artwork): Promise<void> {
		const destinationFile = path.join(artwork.path, artwork.name);
		const stat = await fse.stat(destinationFile);
		const info = await this.imageModule.getImageInfo(destinationFile);
		artwork.types = artWorkImageNameToType(artwork.name);
		artwork.statCreated = stat.ctime;
		artwork.statModified = stat.mtime;
		artwork.fileSize = stat.size;
		artwork.format = info.format;
		artwork.height = info.height;
		artwork.width = info.width;
	}

	async rename(orm: Orm, artworkID: string, newName: string, changes: Changes): Promise<void> {
		const artwork = await orm.Artwork.findOneByID(artworkID);
		if (!artwork) {
			return Promise.reject(new Error('Artwork not found'));
		}
		artwork.name = await this.renameFile(artwork.path, artwork.name, newName);
		await this.updateArtworkImageFile(artwork);
		orm.Artwork.persistLater(artwork);
		changes.artworks.updated.add(artwork);
		changes.folders.updated.add(await artwork.folder.get());
	}

	private static getArtworkName(folder: Folder, types: Array<ArtworkImageType>): string {
		let name = types.sort((a, b) => a.localeCompare(b)).join('-');
		if (!name) {
			name = FolderTypeImageName[folder.folderType];
		}
		return name;
	}

	async getArtworkFilenameUnique(folder: Folder, importFilename: string, types: Array<ArtworkImageType>): Promise<string> {
		const name = ArtworkWorker.getArtworkName(folder, types);
		let suffix = fileSuffix(importFilename);
		if (suffix.length === 0) {
			const info = await this.imageModule.getImageInfo(importFilename);
			suffix = info.format;
		}
		if (suffix.length === 0 || suffix === 'invalid') {
			return Promise.reject(new Error('Image Format invalid/not known'));
		}
		let destination = `${name}.${suffix}`;
		let nr = 2;
		while (await fse.pathExists(path.join(folder.path, destination))) {
			destination = `${name}-${nr}.${suffix}`;
			nr++;
		}
		return destination;
	}

	async create(orm: Orm, folderID: string, artworkFilename: string, types: Array<ArtworkImageType>, changes: Changes): Promise<void> {
		if (!artworkFilename || !(await fse.pathExists(artworkFilename))) {
			return Promise.reject(new Error('Invalid Artwork File Name'));
		}
		const folder = await orm.Folder.findOneByID(folderID);
		if (!folder) {
			return Promise.reject(new Error('Folder not found'));
		}
		const destination = await this.getArtworkFilenameUnique(folder, artworkFilename, types);
		const destinationFile = path.join(folder.path, destination);
		try {
			await fse.copy(artworkFilename, destinationFile);
		} catch {
			return Promise.reject(new Error('Importing artwork failed'));
		}
		const artwork = orm.Artwork.create({
			name: destination,
			path: folder.path,
			types
		});
		await artwork.folder.set(folder);
		changes.folders.updated.add(folder);
		changes.artworks.added.add(artwork);
		await this.updateArtworkImageFile(artwork);
		orm.Artwork.persistLater(artwork);
	}

	async replace(orm: Orm, artworkID: string, artworkFilename: string, changes: Changes): Promise<void> {
		if (!artworkFilename || !(await fse.pathExists(artworkFilename))) {
			return Promise.reject(new Error('Invalid Artwork File Name'));
		}
		const artwork = await orm.Artwork.findOneByID(artworkID);
		if (!artwork) {
			return Promise.reject(new Error('Artwork not found'));
		}
		const name = basenameStripExtension(artwork.name);
		const info = await this.imageModule.getImageInfo(artworkFilename);
		const suffix = info.format;
		if (suffix.length === 0 || suffix === 'invalid') {
			return Promise.reject(new Error('Image Format invalid/not known'));
		}
		await fileDeleteIfExists(path.join(artwork.path, artwork.name));
		artwork.name = `${name}.${suffix}`;
		try {
			await fse.copy(artworkFilename, path.join(artwork.path, artwork.name));
		} catch {
			return Promise.reject(new Error('Importing artwork failed'));
		}
		await this.updateArtworkImageFile(artwork);
		changes.artworks.updated.add(artwork);
		orm.Artwork.persistLater(artwork);
	}

	async download(orm: Orm, folderID: string, artworkURL: string, types: Array<ArtworkImageType>, changes: Changes): Promise<void> {
		const folder = await orm.Folder.findOneOrFailByID(folderID);
		const name = types.sort((a, b) => a.localeCompare(b)).join('-');
		const filename = await this.imageModule.storeImage(folder.path, name, artworkURL);
		const artwork = orm.Artwork.create({ name: filename, path: folder.path });
		await artwork.folder.set(folder);
		changes.folders.updated.add(folder);
		changes.artworks.added.add(artwork);
		await this.updateArtworkImageFile(artwork);
		orm.Artwork.persistLater(artwork);
	}

	async remove(orm: Orm, root: Root, artworkID: string, changes: Changes): Promise<void> {
		const artwork = await orm.Artwork.findOneByID(artworkID);
		if (!artwork) {
			return Promise.reject(new Error('Artwork not found'));
		}
		await this.moveToTrash(root, artwork.path, artwork.name);
		changes.artworks.removed.add(artwork);
		changes.folders.updated.add(await artwork.folder.get());
	}

	async move(orm: Orm, artworkIDs: Array<string>, newParentID: string, changes: Changes): Promise<void> {
		const artworks = await orm.Artwork.findByIDs(artworkIDs);
		if (artworks.length !== artworkIDs.length) {
			return Promise.reject(new Error('Artwork not found'));
		}
		const newParent = await orm.Folder.findOneByID(newParentID);
		if (!newParent) {
			return Promise.reject(new Error('Destination Folder not found'));
		}
		for (const artwork of artworks) {
			if (await fse.pathExists(path.join(newParent.path, artwork.name))) {
				return Promise.reject(new Error('File name is already used in folder'));
			}
		}
		changes.folders.updated.add(newParent);
		for (const artwork of artworks) {
			changes.artworks.updated.add(artwork);
			const oldParent = await artwork.folder.get();
			if (oldParent?.id !== newParentID) {
				changes.folders.updated.add(oldParent);
				await fse.move(path.join(artwork.path, artwork.name), path.join(newParent.path, artwork.name));
				artwork.path = ensureTrailingPathSeparator(newParent.path);
				await artwork.folder.set(newParent);
				orm.Artwork.persistLater(artwork);
			}
		}
	}
}
