import fse from 'fs-extra';
import path from 'path';
import {DBObjectType} from '../../../db/db.types';
import {FolderType} from '../../../model/jam-types';
import {AudioModule} from '../../../modules/audio/audio.module';
import {ImageModule} from '../../../modules/image/image.module';
import {containsFolderSystemChars, ensureTrailingPathSeparator, replaceFolderSystemChars} from '../../../utils/fs-utils';
import {Folder} from '../../folder/folder.model';
import {Root} from '../../root/root.model';
import {Store} from '../../store/store';
import {Track} from '../../track/track.model';

export class FolderWorker {

	constructor(private store: Store, private imageModule: ImageModule, private audioModule: AudioModule) {

	}

	private async validateFolderName(newName: string): Promise<string> {
		if (containsFolderSystemChars(newName)) {
			return Promise.reject(Error('Invalid Directory Name'));
		}
		const name = replaceFolderSystemChars(newName, '').trim();
		if (name.length === 0 || ['.', '..'].includes(name)) {
			return Promise.reject(Error('Invalid Directory Name'));
		}
		return name;
	}

	private async validateMove(sourceDir: string, destPath: string, destName: string): Promise<void> {
		if (!await fse.pathExists(sourceDir)) {
			return Promise.reject(Error('Directory does not exists'));
		}
		const newPath = path.join(destPath, destName);
		const exists = await fse.pathExists(newPath);
		if (exists) {
			return Promise.reject(Error('Folder name already used in Destination'));
		}
	}

	private async updatePaths(oldPath: string, newPath: string, rootID: string): Promise<{ changedFolderIDs: Set<string>, changedTrackIDs: Set<string> }> {
		newPath = ensureTrailingPathSeparator(newPath);
		oldPath = ensureTrailingPathSeparator(oldPath);
		const folders = (await this.store.folderStore.search({inPath: oldPath})).items;
		for (const f of folders) {
			const rest = f.path.slice(oldPath.length - 1);
			if (!(rest.length > 0 && rest[0] !== path.sep)) {
				f.path = newPath + ensureTrailingPathSeparator(rest);
				f.rootID = rootID;
			}
		}
		await this.store.folderStore.replaceMany(folders);
		const tracks = (await this.store.trackStore.search({inPath: oldPath})).items;
		for (const t of tracks) {
			t.path = t.path.replace(oldPath, ensureTrailingPathSeparator(newPath));
			t.rootID = rootID;
		}
		await this.store.trackStore.replaceMany(tracks);
		return {changedFolderIDs: new Set<string>(folders.map(f => f.id)), changedTrackIDs: new Set<string>(tracks.map(t => t.id))};
	}

	public async rename(folderID: string, newName: string): Promise<{ changedFolderIDs: Array<string>, changedTrackIDs: Array<string> }> {
		const folder = await this.store.folderStore.byId(folderID);
		if (!folder) {
			return Promise.reject(Error('Folder not found'));
		}
		const name = await this.validateFolderName(newName);
		const p = path.dirname(folder.path);
		const newPath = path.join(p, name);
		await this.validateMove(folder.path, p, name);
		try {
			await fse.rename(folder.path, newPath);
		} catch (e) {
			return Promise.reject(Error('Folder renaming failed'));
		}
		await this.updatePaths(folder.path, newPath, folder.rootID);
		folder.path = ensureTrailingPathSeparator(newPath);
		return {changedFolderIDs: [], changedTrackIDs: []};
	}

	private async moveFolder(folder: Folder, newParent: Folder): Promise<{ changedFolderIDs: Set<string>, changedTrackIDs: Set<string> }> {
		if (folder.parentID === newParent.id) {
			return Promise.reject(Error('Folder name already used in Destination'));
		}
		const p = newParent.path;
		const name = path.basename(folder.path);
		const oldpath = folder.path;
		const newPath = path.join(p, name);
		await this.validateMove(oldpath, p, name);
		try {
			await fse.move(folder.path, newPath);
		} catch (e) {
			return Promise.reject(Error('Folder moving failed'));
		}
		folder.path = ensureTrailingPathSeparator(newPath);
		folder.rootID = newParent.rootID;
		folder.parentID = newParent.id;
		await this.store.folderStore.replace(folder);
		return this.updatePaths(oldpath, newPath, newParent.rootID);
	}

	public async move(newParentID: string, moveFolderIDs: Array<string>): Promise<{ changedFolderIDs: Array<string>, changedTrackIDs: Array<string> }> {
		const newParent = await this.store.folderStore.byId(newParentID);
		if (!newParent) {
			return Promise.reject(Error('Destination Folder not found'));
		}
		if (moveFolderIDs.includes(newParentID)) {
			return Promise.reject(Error('Folder cannot be moved to itself'));
		}
		let changedFolderIDs = new Set<string>();
		let changedTrackIDs = new Set<string>();
		changedFolderIDs.add(newParent.id);
		for (const id of moveFolderIDs) {
			changedFolderIDs.add(id);
			const folder = await this.store.folderStore.byId(id);
			if (!folder) {
				return Promise.reject(Error('Source Folder not found'));
			}
			if (folder.parentID) {
				changedFolderIDs.add(folder.parentID);
			}
			const res = await this.moveFolder(folder, newParent);
			changedFolderIDs = new Set<string>([...changedFolderIDs, ...res.changedFolderIDs]);
			changedTrackIDs = new Set<string>([...changedTrackIDs, ...res.changedTrackIDs]);
		}
		return {changedFolderIDs: [...changedFolderIDs], changedTrackIDs: [...changedTrackIDs]};
	}

	public async create(parentID: string, name: string): Promise<{ folder: Folder }> {
		const newParent = await this.store.folderStore.byId(parentID);
		if (!newParent) {
			return Promise.reject(Error('Destination Folder not found'));
		}
		if (containsFolderSystemChars(name)) {
			return Promise.reject(Error('Invalid Directory Name'));
		}
		name = replaceFolderSystemChars(name, '').trim();
		if (name.length === 0 || ['.', '..'].includes(name)) {
			return Promise.reject(Error('Invalid Directory Name'));
		}
		const destination = path.join(newParent.path, name);
		const exists = await fse.pathExists(destination);
		if (exists) {
			return Promise.reject(Error('Directory already exists'));
		}
		await fse.mkdir(destination);
		const stat = await fse.stat(destination);
		const result: Folder = {
			id: '',
			type: DBObjectType.folder,
			rootID: newParent.rootID,
			path: ensureTrailingPathSeparator(destination),
			parentID: newParent.id,
			stat: {
				created: stat.ctime.valueOf(),
				modified: stat.mtime.valueOf()
			},
			tag: {
				level: newParent.tag.level + 1,
				trackCount: 0,
				folderCount: 0,
				type: FolderType.extras
			}
		};
		result.id = await this.store.folderStore.add(result);
		newParent.tag.folderCount += newParent.tag.folderCount;
		await this.store.folderStore.replace(newParent);
		return {folder: result};
	}

	public async delete(root: Root, folderIDs: Array<string>): Promise<{ removedFolders: Array<Folder>, removedTracks: Array<Track>, changedFolderIDs: Array<string>, changedTrackIDs: Array<string> }> {
		const folders = await this.store.folderStore.byIds(folderIDs);
		for (const folder of folders) {
			if (folder.tag.level === 0) {
				return Promise.reject(Error('Root folder can not be deleted'));
			}
		}
		const inPaths = folders.map(f => f.path);
		const removedFolders = (await this.store.folderStore.search({inPaths})).items;
		const trashPath = path.join(root.path, '.trash');
		for (const folder of folders) {
			await fse.move(folder.path, path.join(trashPath, `${Date.now()}_${path.basename(folder.path)}`));
		}
		const removedTracks = (await this.store.trackStore.search({inPaths})).items;
		const changedFolderIDs: Array<string> = [];
		for (const folder of folders) {
			if (folder.parentID && !changedFolderIDs.includes(folder.parentID)) {
				changedFolderIDs.push(folder.parentID);
			}
		}
		return {removedFolders, removedTracks, changedFolderIDs, changedTrackIDs: []};
	}
}
