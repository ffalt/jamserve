import fse from 'fs-extra';
import path from 'path';

import {DBObjectType} from '../../db/db.types';
import {Jam} from '../../model/jam-rest-data';
import {ArtworkImageType, FolderType, FolderTypeImageName, RootScanStrategy, TrackHealthID} from '../../model/jam-types';
import {AudioModule} from '../../modules/audio/audio.module';
import {ImageModule} from '../../modules/image/image.module';
import {containsFolderSystemChars, ensureTrailingPathSeparator, fileDeleteIfExists, fileExt, replaceFileSystemChars, replaceFolderSystemChars} from '../../utils/fs-utils';
import Logger from '../../utils/logger';
import {artWorkImageNameToType} from '../folder/folder.format';
import {Artwork, Folder} from '../folder/folder.model';
import {Root} from '../root/root.model';
import {Store} from '../store/store';
import {WaveformService} from '../waveform/waveform.service';
import {getImageInfo} from './scan.artwork';
import {emptyChanges, MergeChanges} from './scan.changes';
import {ScanCleaner} from './scan.clean';
import {MatchDir} from './scan.match-dir';
import {DBMatcher} from './scan.match-dir-db';
import {ScanMatcher} from './scan.match-dir-scan';
import {ScanMerger} from './scan.merge';
import {ScanMetaMerger} from './scan.merge-meta';
import {DirScanner, ScanDir} from './scan.scan-dir';
import {ScanStorer} from './scan.store';
import {generateArtworkId} from './scan.utils';

const log = Logger('IO.Service');

export class ScanService {
	private settings: Jam.AdminSettingsLibrary = {
		scanAtStart: true
	};

	constructor(private store: Store, private audioModule: AudioModule, private imageModule: ImageModule, private waveformService: WaveformService) {
	}

	public setSettings(settings: Jam.AdminSettingsLibrary): void {
		this.settings = settings;
	}

	private async start(rootID: string): Promise<{ changes: MergeChanges, root: Root }> {
		const root = await this.store.rootStore.byId(rootID);
		if (!root) {
			return Promise.reject(Error(`Root ${rootID} not found`));
		}
		return {root, changes: emptyChanges()};
	}

	private async finish(changes: MergeChanges, rootID: string, forceMetaRefresh: boolean): Promise<MergeChanges> {
		const metaMerger = new ScanMetaMerger(this.store);
		await metaMerger.mergeMeta(forceMetaRefresh, rootID, changes);

		const scanStorer = new ScanStorer(this.store);
		await scanStorer.storeChanges(changes);

		const scanCleaner = new ScanCleaner(this.store, this.imageModule, this.waveformService);
		await scanCleaner.clean(changes);

		changes.end = Date.now();
		return changes;
	}

	async scanRoot(rootID: string, forceMetaRefresh: boolean): Promise<MergeChanges> {
		const {root, changes} = await this.start(rootID);

		const dirScanner = new DirScanner();
		const scan: ScanDir = await dirScanner.scan(root.path, rootID);

		const scanMatcher = new ScanMatcher(this.store);
		const matchRoot: MatchDir = await scanMatcher.match(scan, changes);

		const scanMerger = new ScanMerger(this.audioModule, this.store, this.settings, root.strategy || RootScanStrategy.auto);
		await scanMerger.merge(matchRoot, rootID, () => true, changes);

		return this.finish(changes, rootID, forceMetaRefresh);
	}

	async removeRoot(rootID: string): Promise<MergeChanges> {
		const {root, changes} = await this.start(rootID);

		log.info('Removing Root', root.path);
		changes.removedTracks = (await this.store.trackStore.search({rootID})).items;
		changes.removedFolders = (await this.store.folderStore.search({rootID})).items;

		return this.finish(changes, rootID, false);
	}

	async refreshTracks(rootID: string, trackIDs: Array<string>): Promise<MergeChanges> {
		const {root, changes} = await this.start(rootID);

		log.info('Refresh Tracks in Root', root.path);
		const tracks = await this.store.trackStore.byIds(trackIDs);
		const folderIDs: Array<string> = [];
		for (const track of tracks) {
			if (!folderIDs.includes(track.parentID)) {
				folderIDs.push(track.parentID);
			}
		}
		const dbMatcher = new DBMatcher(this.store);
		const {rootMatch, changedDirs} = await dbMatcher.match(folderIDs, trackIDs);

		const scanMerger = new ScanMerger(this.audioModule, this.store, this.settings, root.strategy || RootScanStrategy.auto);
		await scanMerger.merge(rootMatch, rootID, dir => changedDirs.includes(dir), changes);

		return this.finish(changes, rootID, false);
	}

	async deleteTracks(rootID: string, trackIDs: Array<string>): Promise<MergeChanges> {
		const {root, changes} = await this.start(rootID);

		changes.removedTracks = await this.store.trackStore.byIds(trackIDs);
		const trashPath = path.join(root.path, '.trash');
		for (const track of changes.removedTracks) {
			await fse.move(path.join(track.path, track.name), path.join(trashPath, `${Date.now()}_${track.name}`));
		}

		const folderIDs: Array<string> = [];
		for (const track of changes.removedTracks) {
			if (!folderIDs.includes(track.parentID)) {
				folderIDs.push(track.parentID);
			}
		}

		const dbMatcher = new DBMatcher(this.store);
		const {rootMatch, changedDirs} = await dbMatcher.match(folderIDs, []);

		const scanMerger = new ScanMerger(this.audioModule, this.store, this.settings, root.strategy || RootScanStrategy.auto);
		await scanMerger.merge(rootMatch, rootID, dir => changedDirs.includes(dir), changes);

		return this.finish(changes, rootID, false);
	}

	async deleteFolders(rootID: string, folderIDs: Array<string>): Promise<MergeChanges> {
		const {root, changes} = await this.start(rootID);
		const folders = await this.store.folderStore.byIds(folderIDs);
		for (const folder of folders) {
			if (folder.tag.level === 0) {
				return Promise.reject(Error('Root folder can not be deleted'));
			}
		}
		const inPaths = folders.map(f => f.path);
		changes.removedFolders = (await this.store.folderStore.search({inPaths})).items;
		const trashPath = path.join(root.path, '.trash');
		for (const folder of folders) {
			await fse.move(folder.path, path.join(trashPath, `${Date.now()}_${path.basename(folder.path)}`));
		}
		changes.removedTracks = (await this.store.trackStore.search({inPaths})).items;
		const parentIDs: Array<string> = [];
		for (const folder of folders) {
			if (folder.parentID && !parentIDs.includes(folder.parentID)) {
				parentIDs.push(folder.parentID);
			}
		}
		const dbMatcher = new DBMatcher(this.store);
		const {rootMatch, changedDirs} = await dbMatcher.match(parentIDs, []);

		const scanMerger = new ScanMerger(this.audioModule, this.store, this.settings, root.strategy || RootScanStrategy.auto);
		await scanMerger.merge(rootMatch, rootID, dir => changedDirs.includes(dir), changes);

		return this.finish(changes, rootID, false);
	}

	async refreshFolders(rootID: string, folderIDs: Array<string>): Promise<MergeChanges> {
		const {root, changes} = await this.start(rootID);

		const dbMatcher = new DBMatcher(this.store);
		const {rootMatch, changedDirs} = await dbMatcher.match(folderIDs, []);

		const scanMerger = new ScanMerger(this.audioModule, this.store, this.settings, root.strategy || RootScanStrategy.auto);
		await scanMerger.merge(rootMatch, rootID, dir => changedDirs.includes(dir), changes);

		return this.finish(changes, rootID, false);
	}

	async newFolder(rootID: string, parentID: string, name: string): Promise<MergeChanges> {
		const {root, changes} = await this.start(rootID);
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
		this.store.folderStore.replace(newParent);
		// TODO: add to change log
		return this.finish(changes, rootID, false);
	}

	async moveFolders(rootID: string, newParentID: any, folderIDs: any): Promise<MergeChanges> {
		const {root, changes} = await this.start(rootID);
		if (folderIDs.includes(newParentID)) {
			return Promise.reject(Error('Folder cannot be moved to itself'));
		}
		const newParent = await this.store.folderStore.byId(newParentID);
		if (!newParent) {
			return Promise.reject(Error('Destination Folder not found'));
		}
		const folders = await this.store.folderStore.byIds(folderIDs);
		const updateFolderIDs = folderIDs.slice(0);
		const updateTrackIDs: Array<string> = [];
		if (!updateFolderIDs.includes(newParent.id)) {
			updateFolderIDs.push(newParent.id);
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
			if (!updateFolderIDs.includes(folder.id)) {
				updateFolderIDs.push(folder.id);
			}
			if (!updateFolderIDs.includes(folder.parentID)) {
				updateFolderIDs.push(folder.parentID);
			}
			const tracks = (await this.store.trackStore.search({inPath: folder.path})).items;
			for (const track of tracks) {
				track.path = track.path.replace(folder.path, dest);
				track.rootID = newParent.rootID;
				if (!updateTrackIDs.includes(track.id)) {
					updateTrackIDs.push(track.id);
				}
			}
			await this.store.trackStore.replaceMany(tracks);
			let subfolders = (await this.store.folderStore.search({inPath: folder.path})).items;
			subfolders = subfolders.filter(sub => sub.id !== folder.id);
			for (const sub of subfolders) {
				sub.path = sub.path.replace(folder.path, dest);
				sub.rootID = newParent.rootID;
				if (!updateFolderIDs.includes(sub.id)) {
					updateFolderIDs.push(sub.id);
				}
			}
			folder.path = ensureTrailingPathSeparator(dest);
			folder.rootID = rootID;
			folder.parentID = newParent.id;
			subfolders.push(folder);
			await this.store.folderStore.replaceMany(subfolders);
		}

		const dbMatcher = new DBMatcher(this.store);
		const {rootMatch, changedDirs} = await dbMatcher.match(updateFolderIDs, updateTrackIDs);

		const scanMerger = new ScanMerger(this.audioModule, this.store, this.settings, root.strategy || RootScanStrategy.auto);
		await scanMerger.merge(rootMatch, rootID, dir => changedDirs.includes(dir), changes);

		return this.finish(changes, rootID, false);
	}

	async moveTracks(rootID: string, trackIDs: Array<string>, newParentID: string): Promise<MergeChanges> {
		const {root, changes} = await this.start(rootID);
		const tracks = await this.store.trackStore.byIds(trackIDs);
		const newParent = await this.store.folderStore.byId(newParentID);
		if (!newParent) {
			return Promise.reject(Error('Destination Folder not found'));
		}
		for (const track of tracks) {
			if (track.parentID === newParentID) {
				return Promise.reject(Error('File is already in folder'));
			}
			if (await fse.pathExists(path.join(newParent.path, track.name))) {
				return Promise.reject(Error('File name is already used in folder'));
			}
		}
		const updateFolderIDs: Array<string> = [newParent.id];
		const updateTrackIDs: Array<string> = [];
		for (const track of tracks) {
			updateTrackIDs.push(track.id);
			if (!updateFolderIDs.includes(track.parentID)) {
				updateFolderIDs.push(track.parentID);
			}
			await fse.move(path.join(track.path, track.name), path.join(newParent.path, track.name));
			track.path = ensureTrailingPathSeparator(newParent.path);
			track.rootID = newParent.rootID;
			track.parentID = newParent.id;
		}
		await this.store.trackStore.replaceMany(tracks);
		const dbMatcher = new DBMatcher(this.store);

		const {rootMatch, changedDirs} = await dbMatcher.match(updateFolderIDs, updateTrackIDs);

		const scanMerger = new ScanMerger(this.audioModule, this.store, this.settings, root.strategy || RootScanStrategy.auto);
		await scanMerger.merge(rootMatch, rootID, dir => changedDirs.includes(dir), changes);

		return this.finish(changes, rootID, false);
	}

	async renameTrack(rootID: string, trackID: string, newName: string): Promise<MergeChanges> {
		const {changes} = await this.start(rootID);
		const name = replaceFileSystemChars(newName, '').trim();
		if (name.length === 0) {
			return Promise.reject(Error('Invalid Name'));
		}
		const track = await this.store.trackStore.byId(trackID);
		if (!track) {
			return Promise.reject(Error('Track not found'));
		}
		const ext = fileExt(name);
		const ext2 = fileExt(track.name);
		if (ext !== ext2) {
			return Promise.reject(Error(`Changing File extension not supported ${ext}=>${ext2}`));
		}
		const newPath = path.join(track.path, name);
		const exists = await fse.pathExists(newPath);
		if (exists) {
			return Promise.reject(Error('File already exists'));
		}
		await fse.rename(path.join(track.path, track.name), path.join(track.path, name));
		track.name = name;
		await this.store.trackStore.replace(track);
		// TODO: fill real {dir:MatchDir to this log object), even if it's not used outside scanner atm
		changes.updateTracks.push({track, oldTrack: track} as any);
		return changes;
	}

	async fixTrack(rootID: string, trackID: string, fixID: TrackHealthID): Promise<MergeChanges> {
		const {root, changes} = await this.start(rootID);
		const track = await this.store.trackStore.byId(trackID);
		if (!track) {
			return Promise.reject(Error('Track not found'));
		}
		if ([TrackHealthID.mp3HeaderExists, TrackHealthID.mp3HeaderValid].includes(fixID)) {
			await this.audioModule.rewriteAudio(path.join(track.path, track.name));
		} else if ([TrackHealthID.mp3Garbage, TrackHealthID.mp3MediaValid].includes(fixID)) {
			await this.audioModule.fixMP3Audio(path.join(track.path, track.name));
		} else if ([TrackHealthID.id3v2NoId3v1].includes(fixID)) {
			await this.audioModule.removeMP3ID3v1Tag(path.join(track.path, track.name));
		} else {
			return Promise.reject(Error('Invalid TrackHealthID'));
		}
		const dbMatcher = new DBMatcher(this.store);
		const {rootMatch, changedDirs} = await dbMatcher.match([track.parentID], [track.id]);

		const scanMerger = new ScanMerger(this.audioModule, this.store, this.settings, root.strategy || RootScanStrategy.auto);
		await scanMerger.merge(rootMatch, rootID, dir => changedDirs.includes(dir), changes);

		return this.finish(changes, rootID, false);
	}

	async renameFolder(rootID: string, folderID: string, newName: string): Promise<MergeChanges> {
		const {root, changes} = await this.start(rootID);

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
				log.error('WRONG inPath MATCH', rest, folder.path, f.path);
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
		// TODO: log changes?
		return this.finish(changes, rootID, false);
	}

	async writeTrackTags(rootID: string, tags: Array<{ trackID: string; tag: Jam.RawTag }>): Promise<MergeChanges> {
		const {root, changes} = await this.start(rootID);
		const trackIDs = tags.map(t => t.trackID);
		const tracks = await this.store.trackStore.byIds(trackIDs);
		const folderIDs: Array<string> = [];
		log.info('Writing Tags in Root', root.path);
		for (const track of tracks) {
			const tag = tags.find(t => t.trackID === track.id);
			if (tag) {
				const filename = path.join(track.path, track.name);
				log.info('Writing Tag', filename);
				await this.audioModule.writeRawTag(filename, tag.tag);
				if (!folderIDs.includes(track.parentID)) {
					folderIDs.push(track.parentID);
				}
			}
		}
		log.info('Refresh Tracks in Root', root.path);
		const dbMatcher = new DBMatcher(this.store);
		const {rootMatch, changedDirs} = await dbMatcher.match(folderIDs, trackIDs);
		const scanMerger = new ScanMerger(this.audioModule, this.store, this.settings, root.strategy || RootScanStrategy.auto);
		await scanMerger.merge(rootMatch, rootID, dir => changedDirs.includes(dir), changes);
		return this.finish(changes, rootID, false);
	}

	private async buildArtworkImageFile(folder: Folder, name: string, removedID?: string): Promise<Artwork> {
		const destFile = path.join(folder.path, name);
		const stat = await fse.stat(destFile);
		const id = generateArtworkId(folder.id, name);
		const artwork: Artwork = {
			id,
			name,
			types: artWorkImageNameToType(name),
			image: await getImageInfo(destFile),
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

	async renameArtwork(rootID: string, folderID: string, artworkID: string, name: string): Promise<MergeChanges> {
		const {changes} = await this.start(rootID);
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
		const ext = path.extname(artwork.name).toLowerCase();
		const newName = name + ext;
		await fse.rename(path.join(folder.path, artwork.name), path.join(folder.path, newName));
		await this.buildArtworkImageFile(folder, newName, artworkID);
		return this.finish(changes, rootID, false);
	}

	async createArtwork(rootID: string, folderID: string, artworkFilename: string, artworkMimeType: string, types: Array<ArtworkImageType>): Promise<MergeChanges> {
		const folder = await this.store.folderStore.byId(folderID);
		if (!folder) {
			return Promise.reject(Error(`Folder ${folderID} not found`));
		}
		const {changes} = await this.start(rootID);
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
		return this.finish(changes, rootID, false);
	}

	async updateArtwork(rootID: string, folderID: string, artworkID: string, artworkFilename: string, artworkMimeType: string): Promise<MergeChanges> {
		const folder = await this.store.folderStore.byId(folderID);
		if (!folder) {
			return Promise.reject(Error(`Folder ${folderID} not found`));
		}
		const artwork = (folder.tag.artworks || []).find(a => a.id === artworkID);
		if (!artwork) {
			return Promise.reject(Error(`Artwork ${artworkID} not found`));
		}
		const {changes} = await this.start(rootID);
		const dest = path.join(folder.path, artwork.name);
		await fileDeleteIfExists(dest);
		await fse.move(artworkFilename, dest);
		await this.buildArtworkImageFile(folder, artwork.name, artworkID);
		return this.finish(changes, rootID, false);
	}

	async downloadArtwork(rootID: string, folderID: string, artworkURL: string, types: Array<ArtworkImageType>): Promise<MergeChanges> {
		const {changes} = await this.start(rootID);
		const folder = await this.store.folderStore.byId(folderID);
		if (!folder) {
			return Promise.reject(Error(`Folder ${folderID} not found`));
		}
		const name = types.sort((a, b) => a.localeCompare(b)).join('-');
		const filename = await this.imageModule.storeImage(folder.path, name, artworkURL);
		await this.buildArtworkImageFile(folder, filename);
		return this.finish(changes, rootID, false);
	}

	async deleteArtwork(rootID: string, folderID: string, artworkID: string): Promise<MergeChanges> {
		const {changes} = await this.start(rootID);
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
		return this.finish(changes, rootID, false);
	}
}
