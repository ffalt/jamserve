import fse from 'fs-extra';
import path from 'path';
import {Folder} from '../../../../entity/folder/folder';
import {ensureTrailingPathSeparator} from '../../../../utils/fs-utils';
import {FolderType} from '../../../../types/enums';
import {Root} from '../../../../entity/root/root';
import {Changes} from '../changes';
import {splitDirectoryName, validateFolderName} from '../../../../utils/dir-name';
import {BaseWorker} from './base';
import {InRequestScope} from 'typescript-ioc';
import {Orm} from '../../services/orm.service';

@InRequestScope
export class FolderWorker extends BaseWorker {

	private static async validateFolderTask(destPath: string, destName: string): Promise<void> {
		const newPath = path.join(destPath, destName);
		const exists = await fse.pathExists(newPath);
		if (exists) {
			return Promise.reject(Error('Folder name already used in Destination'));
		}
	}

	private async moveFolder(orm: Orm, folder: Folder, newParent: Folder, changes: Changes): Promise<void> {
		const oldParent = await folder.parent.get();
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
		} catch {
			return Promise.reject(Error('Folder moving failed'));
		}
		await FolderWorker.updateFolder(orm, folder, newParent, newPath, changes);
	}

	private static async updateFolder(orm: Orm, folder: Folder, newParent: Folder, newPath: string, changes: Changes): Promise<void> {
		const source = ensureTrailingPathSeparator(folder.path);
		const folders = await orm.Folder.findAllDescendants(folder);
		await folder.parent.set(newParent);
		await folder.root.set(await newParent.root.getOrFail());
		orm.Folder.persistLater(folder);
		const dest = ensureTrailingPathSeparator(newPath);
		for (const sub of folders) {
			sub.path = sub.path.replace(source, dest);
			sub.root = newParent.root;
			changes.folders.updated.add(sub);
			orm.Folder.persistLater(sub);
			const tracks = await sub.tracks.getItems();
			for (const track of tracks) {
				track.path = track.path.replace(source, dest);
				track.root = newParent.root;
				changes.tracks.updated.add(track);
				orm.Track.persistLater(track);
			}
			const artworks = await sub.artworks.getItems();
			for (const artwork of artworks) {
				artwork.path = artwork.path.replace(source, dest);
				changes.artworks.updated.add(artwork);
				orm.Artwork.persistLater(artwork);
			}
		}
	}

	async create(orm: Orm, parentID: string, name: string, root: Root, changes: Changes): Promise<void> {
		const parent = await orm.Folder.findOneByID(parentID);
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
		const folder = orm.Folder.create({
			name,
			path: destination,
			folderType: FolderType.extras,
			level: parent.level + 1,
			title: name !== title ? title : undefined,
			year,
			statCreated: stat.ctime,
			statModified: stat.mtime
		});
		await folder.parent.set(parent);
		await folder.root.set(root);
		orm.Folder.persistLater(folder);
		changes.folders.added.add(folder);
		changes.folders.updated.add(parent);
	}

	async delete(orm: Orm, root: Root, folderIDs: Array<string>, changes: Changes): Promise<void> {
		const folders = await orm.Folder.findByIDs(folderIDs);
		const trashPath = path.join(root.path, '.trash');
		for (const folder of folders) {
			if (folder.level === 0) {
				return Promise.reject(Error('Root folder can not be deleted'));
			}
			try {
				await fse.move(folder.path, path.join(trashPath, `${Date.now()}_${path.basename(folder.path)}`));
			} catch {
				return Promise.reject(Error('Folder removing failed'));
			}
			const folders = await orm.Folder.findAllDescendants(folder);
			changes.folders.removed.append(folders);
			const tracks = await orm.Track.findFilter({childOfID: folder.id});
			changes.tracks.removed.append(tracks);
			const artworks = await orm.Artwork.findFilter({childOfID: folder.id});
			changes.artworks.removed.append(artworks);
			const parent = await folder.parent.get();
			if (parent) {
				changes.folders.updated.add(parent);
			}
			changes.folders.removed.add(folder);
		}
	}

	async rename(orm: Orm, folderID: string, newName: string, changes: Changes): Promise<void> {
		const folder = await orm.Folder.findOneByID(folderID);
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
		} catch {
			return Promise.reject(Error('Folder renaming failed'));
		}
		const folders = await orm.Folder.findAllDescendants(folder);
		const dest = ensureTrailingPathSeparator(newPath);
		for (const item of folders) {
			item.path = item.path.replace(oldPath, dest);
			changes.folders.updated.add(item);
			orm.Folder.persistLater(item);
			const tracks = await item.tracks.getItems();
			for (const track of tracks) {
				track.path = track.path.replace(oldPath, dest);
				changes.tracks.updated.add(track);
				orm.Track.persistLater(track);
			}
			const artworks = await item.artworks.getItems();
			for (const artwork of artworks) {
				artwork.path = artwork.path.replace(oldPath, dest);
				changes.artworks.updated.add(artwork);
				orm.Artwork.persistLater(artwork);
			}
		}
	}

	async move(orm: Orm, newParentID: string, moveFolderIDs: Array<string>, changes: Changes): Promise<void> {
		const newParent = await orm.Folder.findOneByID(newParentID);
		if (!newParent) {
			return Promise.reject(Error('Destination Folder not found'));
		}
		if (moveFolderIDs.includes(newParentID)) {
			return Promise.reject(Error('Folder cannot be moved to itself'));
		}
		changes.folders.updated.add(newParent);
		for (const id of moveFolderIDs) {
			const folder = await orm.Folder.findOneOrFailByID(id);
			const parent = await folder.parent.get();
			if (parent) {
				changes.folders.updated.add(parent);
			}
			await this.moveFolder(orm, folder, newParent, changes);
		}
	}

	async refresh(orm: Orm, folderIDs: Array<string>, changes: Changes): Promise<void> {
		for (const id of folderIDs) {
			const folder = await orm.Folder.findOneOrFailByID(id);
			changes.folders.updated.add(folder);
		}
	}
}
