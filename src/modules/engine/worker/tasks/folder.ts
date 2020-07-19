import fse from 'fs-extra';
import path from 'path';
import {Folder} from '../../../../entity/folder/folder';
import {ensureTrailingPathSeparator} from '../../../../utils/fs-utils';
import {FolderType} from '../../../../types/enums';
import {Root} from '../../../../entity/root/root';
import {Changes} from '../changes';
import {splitDirectoryName, validateFolderName} from '../../../../utils/dir-name';
import {BaseWorker} from './base';

export class FolderWorker extends BaseWorker {

	private static async validateFolderTask(destPath: string, destName: string): Promise<void> {
		const newPath = path.join(destPath, destName);
		const exists = await fse.pathExists(newPath);
		if (exists) {
			return Promise.reject(Error('Folder name already used in Destination'));
		}
	}

	private async moveFolder(folder: Folder, newParent: Folder, changes: Changes): Promise<void> {
		const oldParent = await folder.parent;
		if (!oldParent) {
			return Promise.reject(Error('Root folder can not be moved'));
		}
		if (oldParent.id === newParent.id) {
			return Promise.reject(Error('Folder name already used in Destination'));
		}
		const p = newParent.path;
		const name = path.basename(folder.path);
		const newPath = path.join(p, name);
		await FolderWorker.validateFolderTask(p, name);
		try {
			await fse.move(folder.path, newPath);
		} catch (e) {
			return Promise.reject(Error('Folder moving failed'));
		}
		await this.updateFolder(folder, newParent, newPath, changes);
	}

	private async updateFolder(folder: Folder, newParent: Folder, newPath: string, changes: Changes) {
		const source = ensureTrailingPathSeparator(folder.path);
		const folders = await this.orm.Folder.findAllDescendants(folder);
		folder.parent = newParent;
		folder.root = newParent.root;
		this.orm.orm.em.persistLater(folder);
		const dest = ensureTrailingPathSeparator(newPath);
		for (const sub of folders) {
			sub.path = sub.path.replace(source, dest);
			sub.root = newParent.root;
			changes.folders.updated.add(sub);
			this.orm.orm.em.persistLater(sub);
			const tracks = await sub.tracks;
			for (const track of tracks) {
				track.path = track.path.replace(source, dest);
				track.root = newParent.root;
				changes.tracks.updated.add(track);
				this.orm.orm.em.persistLater(track);
			}
			const artworks = await sub.artworks;
			for (const artwork of artworks) {
				artwork.path = artwork.path.replace(source, dest);
				changes.artworks.updated.add(artwork);
				this.orm.orm.em.persistLater(artwork);
			}
		}
	}

	public async create(parentID: string, name: string, root: Root, changes: Changes): Promise<void> {
		const parent = await this.orm.Folder.findOne(parentID);
		if (!parent) {
			return Promise.reject(Error('Destination Folder not found'));
		}
		name = await validateFolderName(name);
		const parentPath = ensureTrailingPathSeparator(parent.path);
		const destination = ensureTrailingPathSeparator(path.join(parentPath, name));
		await FolderWorker.validateFolderTask(parent.path, name);
		await fse.mkdir(destination);
		const {title, year} = splitDirectoryName(name);
		const stat = await fse.stat(destination);
		const folder = this.orm.Folder.create({
			name,
			path: destination,
			folderType: FolderType.extras,
			level: parent.level + 1,
			parent, root, title, year,
			statCreated: stat.ctime.valueOf(),
			statModified: stat.mtime.valueOf()
		});
		this.orm.Folder.persistLater(folder);
		changes.folders.added.add(folder);
		changes.folders.updated.add(parent);
	}

	public async delete(root: Root, folderIDs: Array<string>, changes: Changes): Promise<void> {
		const folders = await this.orm.Folder.find(folderIDs);
		const trashPath = path.join(root.path, '.trash');
		for (const folder of folders) {
			if (folder.level === 0) {
				return Promise.reject(Error('Root folder can not be deleted'));
			}
			try {
				await fse.move(folder.path, path.join(trashPath, `${Date.now()}_${path.basename(folder.path)}`));
			} catch (e) {
				return Promise.reject(Error('Folder removing failed'));
			}
			const folders = await this.orm.Folder.findAllDescendants(folder);
			changes.folders.removed.append(folders);
			const tracks = await this.orm.Track.findFilter({childOfID: folder.id});
			changes.tracks.removed.append(tracks);
			const artworks = await this.orm.Artwork.findFilter({childOfID: folder.id});
			changes.artworks.removed.append(artworks);
			if (folder.parent) {
				changes.folders.updated.add(folder.parent);
			}
			changes.folders.removed.add(folder);
		}
	}

	public async rename(folderID: string, newName: string, changes: Changes): Promise<void> {
		const folder = await this.orm.Folder.findOne(folderID);
		if (!folder) {
			return Promise.reject(Error('Folder not found'));
		}
		const name = await validateFolderName(newName);
		const oldPath = ensureTrailingPathSeparator(folder.path);
		const p = path.dirname(folder.path);
		const newPath = path.join(p, name);
		await FolderWorker.validateFolderTask(p, name);
		try {
			await fse.rename(oldPath, newPath);
		} catch (e) {
			return Promise.reject(Error('Folder renaming failed'));
		}

		const folders = await this.orm.Folder.findAllDescendants(folder);
		const dest = ensureTrailingPathSeparator(newPath);
		for (const child of folders) {
			child.path = child.path.replace(oldPath, dest);
			changes.folders.updated.add(child);
			this.orm.orm.em.persistLater(child);
			const tracks = child.tracks.getItems();
			for (const track of tracks) {
				track.path = track.path.replace(oldPath, dest);
				changes.tracks.updated.add(track);
				this.orm.orm.em.persistLater(track);
			}
			const artworks = child.artworks;
			for (const artwork of artworks) {
				artwork.path = artwork.path.replace(oldPath, dest);
				changes.artworks.updated.add(artwork);
				this.orm.orm.em.persistLater(artwork);
			}
		}
	}

	public async move(newParentID: string, moveFolderIDs: Array<string>, changes: Changes): Promise<void> {
		const newParent = await this.orm.Folder.findOne(newParentID);
		if (!newParent) {
			return Promise.reject(Error('Destination Folder not found'));
		}
		if (moveFolderIDs.includes(newParentID)) {
			return Promise.reject(Error('Folder cannot be moved to itself'));
		}
		changes.folders.updated.add(newParent);
		for (const id of moveFolderIDs) {
			const folder = await this.orm.Folder.findOne(id);
			if (!folder) {
				return Promise.reject(Error('Source Folder not found'));
			}
			if (folder.parent) {
				changes.folders.updated.add(folder.parent);
			}
			await this.moveFolder(folder, newParent, changes);
		}
	}

	public async refresh(folderIDs: Array<string>, changes: Changes) {
		for (const id of folderIDs) {
			const folder = await this.orm.Folder.findOne(id);
			if (!folder) {
				return Promise.reject(Error('Folder not found'));
			}
			changes.folders.updated.add(folder);
		}
	}
}
