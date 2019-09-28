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

	public async rename(folderID: string, newName: string): Promise<{ changedFolderIDs: Array<string>, changedTrackIDs: Array<string> }> {
		if (containsFolderSystemChars(newName)) {
			return Promise.reject(Error('Invalid Directory Name'));
		}
		const folder = await this.store.folderStore.byId(folderID);
		if (!folder) {
			return Promise.reject(Error('Folder not found'));
		}
		const name = replaceFolderSystemChars(newName, '').trim();
		if (name.length === 0 || ['.', '..'].includes(name)) {
			return Promise.reject(Error('Invalid Directory Name'));
		}
		const p = path.dirname(folder.path);
		const newPath = path.join(p, name);
		const exists = await fse.pathExists(newPath);
		if (exists) {
			return Promise.reject(Error('Directory already exists'));
		}
		if (!await fse.pathExists(folder.path)) {
			return Promise.reject(Error('Directory does not exists'));
		}
		await fse.rename(folder.path, newPath);
		const folders = (await this.store.folderStore.search({inPath: folder.path})).items;
		for (const f of folders) {
			const rest = f.path.slice(folder.path.length - 1);
			if (rest.length > 0 && rest[0] !== path.sep) {
				// log.error('WRONG inPath MATCH', rest, folder.path, f.path);
			} else {
				f.path = newPath + ensureTrailingPathSeparator(rest);
			}
		}
		await this.store.folderStore.replaceMany(folders);
		const tracks = (await this.store.trackStore.search({inPath: folder.path})).items;
		for (const t of tracks) {
			t.path = t.path.replace(folder.path, ensureTrailingPathSeparator(newPath));
		}
		await this.store.trackStore.replaceMany(tracks);
		folder.path = ensureTrailingPathSeparator(newPath);
		return {changedFolderIDs: [folderID], changedTrackIDs: []};
	}

	public async move(newParentID: string, moveFolderIDs: Array<string>): Promise<{ changedFolderIDs: Array<string>, changedTrackIDs: Array<string> }> {
		if (moveFolderIDs.includes(newParentID)) {
			return Promise.reject(Error('Folder cannot be moved to itself'));
		}
		const newParent = await this.store.folderStore.byId(newParentID);
		if (!newParent) {
			return Promise.reject(Error('Destination Folder not found'));
		}
		const folders = await this.store.folderStore.byIds(moveFolderIDs);
		const changedFolderIDs = moveFolderIDs.slice(0);
		const changedTrackIDs: Array<string> = [];
		if (!changedFolderIDs.includes(newParent.id)) {
			changedFolderIDs.push(newParent.id);
		}
		const usedPathAfterMove: Array<string> = [];
		for (const folder of folders) {
			if (folder.parentID === newParentID) {
				return Promise.reject(Error('Folder is already in Destination'));
			}
			const dest = path.join(newParent.path, path.basename(folder.path));
			const exists = await fse.pathExists(dest);
			if (exists) {
				return Promise.reject(Error('Folder name already used in Destination'));
			}
			if (usedPathAfterMove.includes(dest)) {
				return Promise.reject(Error('Folder name will be already used in Destination after previous folder is moved'));
			}
			usedPathAfterMove.push(dest);
		}
		for (const folder of folders) {
			const dest = ensureTrailingPathSeparator(path.join(newParent.path, path.basename(folder.path)));
			try {
				await fse.move(folder.path, dest);
			} catch (e) {
				// debug.error(e);
				return Promise.reject(Error('Folder moving failed'));
			}
			if (!changedFolderIDs.includes(folder.id)) {
				changedFolderIDs.push(folder.id);
			}
			if (folder.parentID && !changedFolderIDs.includes(folder.parentID)) {
				changedFolderIDs.push(folder.parentID);
			}
			const tracks = (await this.store.trackStore.search({inPath: folder.path})).items;
			for (const track of tracks) {
				track.path = track.path.replace(folder.path, dest);
				track.rootID = newParent.rootID;
				if (!changedTrackIDs.includes(track.id)) {
					changedTrackIDs.push(track.id);
				}
			}
			await this.store.trackStore.replaceMany(tracks);
			let subfolders = (await this.store.folderStore.search({inPath: folder.path})).items;
			subfolders = subfolders.filter(sub => sub.id !== folder.id);
			for (const sub of subfolders) {
				sub.path = sub.path.replace(folder.path, dest);
				sub.rootID = newParent.rootID;
				if (!changedFolderIDs.includes(sub.id)) {
					changedFolderIDs.push(sub.id);
				}
			}
			folder.path = ensureTrailingPathSeparator(dest);
			folder.rootID = newParent.rootID;
			folder.parentID = newParent.id;
			subfolders.push(folder);
			await this.store.folderStore.replaceMany(subfolders);
		}
		return {changedFolderIDs, changedTrackIDs};
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
