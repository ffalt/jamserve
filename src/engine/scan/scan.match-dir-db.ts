import fse from 'fs-extra';
import path from 'path';
import {FileTyp} from '../../model/jam-types';
import {Folder} from '../folder/folder.model';
import {Store} from '../store/store';
import {Track} from '../track/track.model';
import {MatchDir, MatchFile} from './scan.match-dir';

export class DBMatcher {

	constructor(public store: Store) {
	}

	private async buildMatchFileFromDB(track: Track): Promise<MatchFile> {
		const match: MatchFile = {
			rootID: track.rootID,
			track,
			name: path.join(track.path, track.name),
			type: FileTyp.AUDIO,
			stat: {
				ctime: track.stat.created,
				mtime: track.stat.modified,
				size: track.stat.size
			}
		};
		return match;
	}

	private async buildMatchDirDBData(folder: Folder): Promise<MatchDir> {
		const match: MatchDir = {
			name: folder.path,
			level: folder.tag.level,
			rootID: folder.rootID,
			tag: folder.tag,
			stat: {ctime: folder.stat.created, mtime: folder.stat.modified},
			parent: undefined,
			folder,
			files: [],
			directories: [],
			metaStat: undefined
		};
		const tracks = await this.store.trackStore.search({parentID: folder.id});
		for (const track of tracks.items) {
			match.files.push(await this.buildMatchFileFromDB(track));
		}
		if (folder.tag.artworks) {
			for (const art of folder.tag.artworks) {
				const matchFile: MatchFile = {
					rootID: folder.rootID,
					name: path.join(folder.path, art.name),
					type: FileTyp.IMAGE,
					stat: {
						ctime: art.stat.created,
						mtime: art.stat.modified,
						size: art.stat.size
					}
				};
				match.files.push(matchFile);
			}
		}
		return match;
	}

	private async buildMatchDirParentsFromDBData(match: MatchDir, loadedMatches: Array<MatchDir>): Promise<MatchDir | undefined> {
		const folder = match.folder;
		if (!folder || !folder.parentID) {
			return undefined;
		}
		let parentMatch = loadedMatches.find(m => !!m.folder && m.folder.id === folder.parentID);
		if (parentMatch) {
			if (!parentMatch.directories.includes(match)) {
				parentMatch.directories.push(match);
			}
			match.parent = parentMatch;
			return parentMatch;
		}
		const parent = await this.store.folderStore.byId(folder.parentID);
		if (!parent) {
			return undefined;
		}
		parentMatch = await this.buildMatchDirDBData(parent);
		parentMatch.directories.push(match);
		if (match.level > 1) {
			const folders = await this.store.folderStore.search({parentID: parent.id});
			for (const f of folders.items) {
				if (f.id !== folder.id) {
					let c = loadedMatches.find(m => !!m.folder && m.folder.id === f.id);
					if (!c) {
						c = await this.buildMatchDirDBData(f);
						loadedMatches.push(c);
					}
					c.parent = parentMatch;
					parentMatch.directories.push(c);
				}
			}
		}
		loadedMatches.push(parentMatch);
		parentMatch.parent = await this.buildMatchDirParentsFromDBData(parentMatch, loadedMatches);
		return parentMatch;
	}

	private async loadChildsFromDBData(match: MatchDir, loadedMatches: Array<MatchDir>): Promise<void> {
		const folder = match.folder;
		if (!folder) {
			return;
		}
		if (!match.directories || match.directories.length === 0) {
			const folders = await this.store.folderStore.search({parentID: folder.id});
			for (const f of folders.items) {
				const c = await this.buildMatchDirDBData(f);
				c.parent = match;
				loadedMatches.push(match);
				match.directories.push(c);
				await this.loadChildsFromDBData(c, loadedMatches);
			}
		}
	}

	async match(folderIDs: Array<string>, changedTrackIDs: Array<string>): Promise<{ rootMatch: MatchDir; changedDirs: Array<MatchDir> }> {
		const folders = await this.store.folderStore.byIds(folderIDs);
		const loadedMatches: Array<MatchDir> = [];
		const changedDirs: Array<MatchDir> = [];
		const changedFiles: Array<MatchFile> = [];
		for (const folder of folders) {
			let match = loadedMatches.find(m => !!m.folder && m.folder.id === folder.id);
			if (!match) {
				match = await this.buildMatchDirDBData(folder);
				loadedMatches.push(match);
			}
			match.parent = await this.buildMatchDirParentsFromDBData(match, loadedMatches);
			await this.loadChildsFromDBData(match, loadedMatches);
			for (const file of match.files) {
				if (file.track && changedTrackIDs.includes(file.track.id)) {
					changedFiles.push(file);
				}
			}
			loadedMatches.push(match);
			if (!changedDirs.includes(match)) {
				changedDirs.push(match);
			}
			let p = match.parent;
			while (p) {
				if (p.level > 0 && !changedDirs.includes(p)) {
					changedDirs.push(p);
				}
				p = p.parent;
			}
		}
		for (const file of changedFiles) {
			const stat = await fse.stat(file.name);
			file.stat = {
				ctime: stat.ctime.valueOf(),
				mtime: stat.mtime.valueOf(),
				size: stat.size
			};
		}
		for (const dir of changedDirs) {
			const stat = await fse.stat(dir.name);
			dir.stat = {
				ctime: stat.ctime.valueOf(),
				mtime: stat.mtime.valueOf()
			};
		}
		const rootMatch = loadedMatches.find(m => m.level === 0);
		if (!rootMatch) {
			return Promise.reject(Error(`Root Match not found`));
		}
		return {rootMatch, changedDirs};
	}
}
