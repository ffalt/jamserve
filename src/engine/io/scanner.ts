import {AlbumType, DBObjectType, FileTyp, FolderType} from '../../model/jam-types';
import fse from 'fs-extra';
import {ensureTrailingPathSeparator} from '../../utils/fs-utils';
import path from 'path';
import {getFileType} from '../../utils/filetype';
import {Store} from '../store/store';
import {Folder, FolderTag} from '../../objects/folder/folder.model';
import {Track} from '../../objects/track/track.model';
import {AudioModule} from '../../modules/audio/audio.module';
import {deepCompare} from '../../utils/deep-compare';
import {Artist} from '../../objects/artist/artist.model';
import {Album} from '../../objects/album/album.model';
import moment from 'moment';
import Logger from '../../utils/logger';

const log = Logger('Scanner');

export interface ScanDir {
	name: string;
	rootID: string;
	stat: {
		ctime: number,
		mtime: number,
	};
	directories: Array<ScanDir>;
	files: Array<ScanFile>;
}

export interface ScanFile {
	name: string;
	type: FileTyp;
	stat: {
		ctime: number,
		mtime: number,
		size: number
	};
}

export interface MatchDir extends ScanDir {
	level: number;
	rootID: string;
	tag?: FolderTag;
	parent?: MatchDir;
	folder?: Folder;
	files: Array<MatchFile>;
	directories: Array<MatchDir>;
	removedTracks: Array<Track>;
	removedFolders: Array<Folder>;
	metaStat?: MetaStat;
}

export interface MatchFile extends ScanFile {
	rootID: string;
	track?: Track;
}

export interface MergeTrackInfo {
	track: Track;
	dir: MatchDir;
}

export interface MergeChanges {
	newArtists: Array<Artist>;
	updateArtists: Array<Artist>;
	removedArtists: Array<Artist>;

	newAlbums: Array<Album>;
	updateAlbums: Array<Album>;
	removedAlbums: Array<Album>;

	newTracks: Array<MergeTrackInfo>;
	updateTracks: Array<MergeTrackInfo>;
	removedTracks: Array<Track>;

	newFolders: Array<Folder>;
	updateFolders: Array<Folder>;
	removedFolders: Array<Folder>;

	start: number;
	end: number;
}

function printTree(match: MatchDir, level: number = 0) {
	const prefix = ' '.repeat(level);
	if (match.folder) {
		console.log(prefix + '📁 ' + path.basename(match.name), '[' + match.folder.tag.type + ']'); // , FolderTypesAlbum.indexOf(match.folder.tag.type) >= 0 ? '[' + match.folder.tag.albumType + ']' : '');
	} else {
		console.log(prefix + '📁 ' + path.basename(match.name), '[new]');
	}
	for (const sub of match.directories) {
		printTree(sub, level + 1);
	}
	// for (const f of match.files) {
	// 	console.log(prefix + ' 🎧 ' + path.basename(f.name), f.track ? '' : '[new]');
	// }
}

function logChange(name: string, amount: number) {
	if (amount > 0) {
		console.log(name, amount);
	}
}

function logChanges(changes: MergeChanges) {
	const v = moment.utc(changes.end - changes.start).format('HH:mm:ss');
	console.log('Duration:', v);
	logChange('Added Tracks', changes.newTracks.length);
	logChange('Updated Tracks', changes.updateTracks.length);
	logChange('Removed Tracks', changes.removedTracks.length);
	logChange('Added Folders', changes.newFolders.length);
	logChange('Updated Folders', changes.updateFolders.length);
	logChange('Removed Folders', changes.removedFolders.length);
	logChange('Added Artists', changes.newArtists.length);
	logChange('Updated Artists', changes.updateArtists.length);
	logChange('Removed Artists', changes.removedArtists.length);
	logChange('Added Albums', changes.newAlbums.length);
	logChange('Updated Albums', changes.updateAlbums.length);
	logChange('Removed Albums', changes.removedAlbums.length);
}

export const cVariousArtist = '[Various Artists]';
export const cUnknownArtist = '[Unknown Artist]';
export const cUnknownAlbum = '[Unknown Album]';

interface MetaStatValue<T> {
	count: number;
	val: T;
}

interface MetaStatString extends MetaStatValue<string> {
}

interface MetaStatNumber extends MetaStatValue<number> {
}

interface MetaStat {
	artist?: string;
	artistSort?: string;
	album?: string;
	genre?: string;
	mbArtistID?: string;
	mbAlbumID?: string;
	year?: number;
	images: Array<string>;
	image?: string;
	multiArtists: Array<string>;
	isMultiArtist: boolean;
	isMultiAlbum: boolean;
	trackCount: number;
}

function convert2Numlist(o: { [key: string]: { count: number, val: string }; }): Array<MetaStatNumber> {
	return Object.keys(o).map(key => {
		return {count: o[key].count, val: Number(o[key].val)};
	}).sort((a, b) => {
		return a.count - b.count;
	});
}

function convert2list(o: { [key: string]: { count: number, val: string }; }): Array<MetaStatString> {
	return Object.keys(o).map(key => {
		return o[key];
	}).sort((a, b) => {
		return a.count - b.count;
	});
}

function getMostUsedTagValue<T>(list: Array<MetaStatValue<T>>, multi?: T): T | undefined {
	if (list.length === 0) {
		return undefined;
	}
	if (list.length === 1) {
		return list[0].val;
	}
	list = list.sort((a, b) => a.count - b.count);
	const cleaned = list.filter((o) => {
		return o.count > 1;
	});
	if (cleaned.length > 1 && multi !== undefined) {
		return multi;
	}
	if (cleaned.length > 0) {
		return cleaned[0].val;
	}
	if (multi !== undefined) {
		return multi;
	}
	return list[0].val;
}

export function splitDirectoryName(name: string): { title: string; year?: number; } {
	const result: { title: string; year?: number; } = {title: path.basename(name).trim()};
	// year title | year - title | (year) title | [year] title
	const parts = result.title.split(' ');
	const s = parts[0].replace(/[^\w\s]/gi, '');
	if (s.length === 4) {
		const y = parseInt(s, 10);
		if (!isNaN(y)) {
			result.year = y;
			parts.shift();
			if (parts[0] === '-') {
				parts.shift();
			}
			result.title = parts.join(' ');
		}
	}
	return result;
}

export class Scanner {
	private artistCache: Array<Artist> = [];
	private albumCache: Array<Album> = [];

	constructor(private store: Store, private audioModule: AudioModule) {

	}

	private static folderHasChanged(dir: MatchDir): boolean {
		return (!dir.folder) ||
			(dir.stat.mtime !== dir.folder.stat.modified) ||
			(dir.stat.ctime !== dir.folder.stat.created) ||
			(!deepCompare(dir.folder.tag, dir.tag));
	}

	private static trackHasChanged(file: MatchFile): boolean {
		return (!file.track) ||
			(file.stat.mtime !== file.track.stat.modified) ||
			(file.stat.ctime !== file.track.stat.created) ||
			(file.stat.size !== file.track.stat.size);
	}

	private static getArtistMBArtistID(trackInfo: MergeTrackInfo): string | undefined {
		if (trackInfo.dir.folder && trackInfo.dir.folder.tag.albumType === AlbumType.compilation) {
			return;
		} else {
			return trackInfo.track.tag.mbAlbumArtistID || trackInfo.track.tag.mbArtistID;
		}
	}

	private static getArtistNameSort(trackInfo: MergeTrackInfo): string | undefined {
		if (trackInfo.dir.folder && trackInfo.dir.folder.tag.albumType === AlbumType.compilation) {
			return;
		} else {
			return trackInfo.track.tag.artistSort;
		}
	}

	private static getArtistName(trackInfo: MergeTrackInfo): string {
		// if (trackInfo.dir.folder && trackInfo.dir.folder.tag.albumType === AlbumType.compilation) {
		// 	return trackInfo.dir.folder.tag.artist || cUnknownArtist;
		// } else {
		return trackInfo.track.tag.albumArtist || trackInfo.track.tag.artist || cUnknownArtist;
		// }
	}

	private static slugify(s: string): string {
		return s.replace(/[\[\]\. -]/g, '').toLowerCase();
	}

	private static getArtistSlug(trackInfo: MergeTrackInfo): string {
		return this.slugify(this.getArtistName(trackInfo));
	}

	private static getAlbumName(trackInfo: MergeTrackInfo): string {
		if (trackInfo.dir.folder && trackInfo.dir.folder.tag.albumType === AlbumType.compilation) {
			return trackInfo.dir.folder.tag.album || cUnknownAlbum;
		} else {
			return trackInfo.track.tag.album || cUnknownAlbum;
		}
	}

	private static getAlbumSlug(trackInfo: MergeTrackInfo): string {
		return this.slugify(this.getAlbumName(trackInfo));
	}

	private getMetaStat(dir: MatchDir): MetaStat {
		// combine meta frames from child tracks and folders
		const stats: {
			artist: { [key: string]: { count: number, val: string }; };
			artistSort: { [key: string]: { count: number, val: string }; };
			album: { [key: string]: { count: number, val: string }; };
			genre: { [key: string]: { count: number, val: string }; };
			mbArtistID: { [key: string]: { count: number, val: string }; };
			mbAlbumID: { [key: string]: { count: number, val: string }; };
			year: { [key: string]: { count: number, val: string }; };
		} = {
			artist: {},
			artistSort: {},
			album: {},
			genre: {},
			year: {},
			mbArtistID: {},
			mbAlbumID: {},
		};
		const images: Array<string> = [];
		let trackCount = 0;
		dir.files.forEach((file) => {
			if (file.type === FileTyp.AUDIO) {
				trackCount++;
			}
			if (file.track && file.track.tag) {
				const tracktag = file.track.tag;
				if (tracktag.artist) {
					const slug = Scanner.slugify(tracktag.artist);
					stats.artist[slug] = stats.artist[slug] || {count: 0, val: tracktag.artist};
					stats.artist[slug].count += 1;
				}
				if (tracktag.artistSort) {
					const slug = Scanner.slugify(tracktag.artistSort);
					stats.artistSort[slug] = stats.artistSort[slug] || {count: 0, val: tracktag.artistSort};
					stats.artistSort[slug].count += 1;
				}
				if (tracktag.album) {
					const slug = Scanner.slugify(tracktag.album);
					stats.album[slug] = stats.album[slug] || {count: 0, val: tracktag.album};
					stats.album[slug].count += 1;
				}
				if (tracktag.genre) {
					const slug = Scanner.slugify(tracktag.genre);
					stats.genre[slug] = stats.genre[slug] || {count: 0, val: tracktag.genre};
					stats.genre[slug].count += 1;
				}
				if (tracktag.year !== undefined) {
					const slug = tracktag.year.toString();
					stats.year[slug] = stats.year[slug] || {count: 0, val: tracktag.year};
					stats.year[slug].count += 1;
				}
				if (tracktag.mbArtistID) {
					const slug = tracktag.mbArtistID.split(' ')[0];
					stats.mbArtistID[slug] = stats.mbArtistID[slug] || {count: 0, val: slug};
					stats.mbArtistID[slug].count += 1;
				}
				if (tracktag.mbAlbumID) {
					const slug = tracktag.mbAlbumID.split(' ')[0];
					stats.mbAlbumID[slug] = stats.mbAlbumID[slug] || {count: 0, val: slug};
					stats.mbAlbumID[slug].count += 1;
				}
			} else if (file.type === FileTyp.IMAGE) {
				images.push(file.name);
			}
		});
		dir.directories.forEach((sub) => {
			if (sub.folder && sub.tag) {
				const subtag = sub.tag;
				if (subtag.artist) {
					const slug = Scanner.slugify(subtag.artist);
					stats.artist[slug] = stats.artist[slug] || {count: 0, val: subtag.artist};
					stats.artist[slug].count += 1;
				}
				if (subtag.artistSort) {
					const slug = Scanner.slugify(subtag.artistSort);
					stats.artistSort[slug] = stats.artistSort[slug] || {count: 0, val: subtag.artistSort};
					stats.artistSort[slug].count += 1;
				}
				if (subtag.album) {
					const slug = Scanner.slugify(subtag.album);
					stats.album[slug] = stats.album[slug] || {count: 0, val: subtag.album};
					stats.album[slug].count += 1;
				}
				if (subtag.genre) {
					const slug = Scanner.slugify(subtag.genre);
					stats.genre[slug] = stats.genre[slug] || {count: 0, val: subtag.genre};
					stats.genre[slug].count += 1;
				}
				if (subtag.year) {
					const slug = subtag.year.toString();
					stats.year[slug] = stats.year[slug] || {count: 0, val: subtag.year};
					stats.year[slug].count += 1;
				}
				if (subtag.mbArtistID) {
					const slug = subtag.mbArtistID.split(' ')[0];
					stats.mbArtistID[slug] = stats.mbArtistID[slug] || {count: 0, val: slug};
					stats.mbArtistID[slug].count += 1;
				}
				if (subtag.mbAlbumID) {
					const slug = subtag.mbAlbumID.split(' ')[0];
					stats.mbAlbumID[slug] = stats.mbAlbumID[slug] || {count: 0, val: slug};
					stats.mbAlbumID[slug].count += 1;
				}
			}
		});
		const artists = convert2list(stats.artist);
		const artistSorts = convert2list(stats.artistSort);
		const albums = convert2list(stats.album);
		const genres = convert2list(stats.genre);
		const years = convert2Numlist(stats.year);
		const mbArtistIDs = convert2list(stats.mbArtistID);
		const mbAlbumIDs = convert2list(stats.mbAlbumID);
		const album = getMostUsedTagValue<string>(albums, path.basename(dir.name));
		const artist = getMostUsedTagValue<string>(artists, cVariousArtist);
		const artistSort = getMostUsedTagValue<string>(artistSorts);
		const genre = getMostUsedTagValue<string>(genres);
		const mbAlbumID = getMostUsedTagValue<string>(mbAlbumIDs);
		const mbArtistID = getMostUsedTagValue<string>(mbArtistIDs);
		const year = getMostUsedTagValue<number>(years);
		const isMultiArtist = artist === cVariousArtist;
		const isMultiAlbum = albums.length > 0;
		let image: string | undefined;
		// check folder image
		if (images.length > 0) {
			if (images.length === 1) {
				image = path.basename(images[0]);
			} else {
				images.forEach((img) => {
					const typ = path.basename(img, path.extname(img)).toLowerCase();
					if (['folder', 'cover', 'front'].indexOf(typ) >= 0) {
						image = path.basename(img);
					}
				});
				if (image === undefined) {
					image = path.basename(images[0]);
				}
			}
		}
		return {
			trackCount,
			images,
			image,
			multiArtists: artists.map(a => a.val),
			isMultiArtist,
			isMultiAlbum,
			album,
			artist,
			artistSort,
			genre,
			mbAlbumID,
			mbArtistID,
			year
		};
	}

	private async match(dir: ScanDir, changes: MergeChanges): Promise<MatchDir> {
		const result: MatchDir = this.cloneScanDir(dir, undefined, 0);
		result.folder = await this.store.folderStore.searchOne({path: dir.name});
		await this.matchDirR(result);
		return result;
	}

	private cloneScanDir(dir: ScanDir, parent: MatchDir | undefined, level: number): MatchDir {
		const result: MatchDir = {
			rootID: dir.rootID,
			parent,
			level,
			name: dir.name,
			stat: dir.stat,
			folder: undefined,
			files: dir.files.map(file => {
				return {name: file.name, type: file.type, stat: file.stat, rootID: dir.rootID};
			}),
			directories: [],
			removedTracks: [],
			removedFolders: []
		};
		result.directories = dir.directories.map(sub => this.cloneScanDir(sub, result, level + 1));
		return result;
	}

	private async matchDirR(dir: MatchDir): Promise<void> {
		const tracks = await this.store.trackStore.search({path: dir.name});
		tracks.forEach(track => {
			const filename = path.join(track.path, track.name);
			const file = dir.files.find(f => f.name === filename);
			if (file) {
				file.track = track;
			} else {
				dir.removedTracks.push(track);
			}
		});
		if (dir.folder) {
			const folders = await this.store.folderStore.search({parentID: dir.folder.id});
			for (const subFolder of folders) {
				const subDir = dir.directories.find(sd => sd.name === subFolder.path);
				if (!subDir) {
					dir.removedFolders.push(subFolder);
				} else {
					subDir.folder = subFolder;
					await this.matchDirR(subDir);
				}
			}
		}
	}

	private async scanDirR(dir: string, stat: fse.Stats, rootID: string): Promise<ScanDir> {
		log.error('Scanning:', dir);
		const result: ScanDir = {
			name: ensureTrailingPathSeparator(dir),
			stat: {
				ctime: stat.ctime.valueOf(),
				mtime: stat.mtime.valueOf()
			},
			rootID,
			directories: [],
			files: []
		};
		const folders: Array<{ dir: string, stat: fse.Stats }> = [];
		const list = await fse.readdir(dir);
		for (const filename of list) {
			if (filename[0] !== '.') {
				const sub = path.join(dir, filename);
				const subStat = await fse.stat(sub);
				if (subStat.isDirectory()) {
					folders.push({dir: sub, stat: subStat});
				} else {
					const file: ScanFile = {
						name: sub,
						type: getFileType(sub),
						stat: {
							ctime: subStat.ctime.valueOf(),
							mtime: subStat.mtime.valueOf(),
							size: subStat.size
						}
					};
					result.files.push(file);
				}
			}
		}
		for (const folder of folders) {
			const sub = await this.scanDirR(folder.dir, folder.stat, rootID);
			result.directories.push(sub);
		}
		return result;
	}

	private async scan(dir: string, rootID: string): Promise<ScanDir> {
		const stat = await fse.stat(dir);
		return this.scanDirR(dir, stat, rootID);
	}

	private async buildFolder(dir: MatchDir): Promise<Folder> {
		return {
			id: '',
			rootID: dir.rootID,
			path: ensureTrailingPathSeparator(dir.name),
			parentID: (dir.parent && dir.parent.folder ? dir.parent.folder.id : undefined),
			stat: {
				created: dir.stat.ctime,
				modified: dir.stat.mtime
			},
			tag: dir.tag || {tracks: dir.files.length, level: dir.level, type: FolderType.unknown},
			type: DBObjectType.folder
		};
	}

	private async buildTrack(file: MatchFile, parent: Folder): Promise<Track> {
		// this.scanningCount++;
		// this.onProgress(this.scanningCount);
		log.error('Reading Track:', file.name);
		const data = await this.audioModule.read(file.name);
		return {
			id: '',
			rootID: file.rootID,
			albumID: '',
			artistID: '',
			parentID: (parent ? parent.id : ''),
			name: path.basename(file.name),
			path: ensureTrailingPathSeparator(path.dirname(file.name)),
			stat: {
				created: file.stat.ctime,
				modified: file.stat.mtime,
				size: file.stat.size
			},
			media: data.media || {},
			tag: data.tag || {},
			type: DBObjectType.track
		};
	}

	private async buildMerge(dir: MatchDir, changes: MergeChanges): Promise<void> {
		dir.removedFolders.forEach(folder => {
			changes.removedFolders.push(folder);
		});
		dir.removedTracks.forEach(track => {
			changes.removedTracks.push(track);
		});
		if (!dir.folder) {
			const folder = await this.buildFolder(dir);
			folder.id = await this.store.trackStore.getNewId();
			dir.folder = folder;
			changes.newFolders.push(folder);
		}
		for (const sub of dir.directories) {
			await this.buildMerge(sub, changes);
		}
		for (const file of dir.files) {
			if (file.type === FileTyp.AUDIO && dir.folder) {
				if (!file.track) {
					const track = await this.buildTrack(file, dir.folder);
					track.id = await this.store.trackStore.getNewId();
					file.track = track;
					changes.newTracks.push({track, dir});
				} else if (Scanner.trackHasChanged(file)) {
					const old = file.track;
					if (!old) {
						return;
					}
					const track = await this.buildTrack(file, dir.folder);
					track.id = old.id;
					track.info = old.info;
					file.track = track;
					changes.updateTracks.push({track, dir});
				} else {
					// changes.unchangedTracks.push({track: file.track, dir});
				}
			}
		}
	}

	private async mergeR(dir: MatchDir, changes: MergeChanges): Promise<void> {
		if (dir.folder) {
			if (Scanner.folderHasChanged(dir)) {
				const folder: Folder = {
					id: dir.folder.id,
					rootID: dir.folder.rootID,
					path: ensureTrailingPathSeparator(dir.name),
					parentID: (dir.parent && dir.parent.folder ? dir.parent.folder.id : undefined),
					stat: {
						created: dir.stat.ctime,
						modified: dir.stat.mtime
					},
					tag: dir.tag || {tracks: dir.files.length, level: dir.level, type: FolderType.unknown},
					type: DBObjectType.folder,
					info: dir.folder.info
				};
				dir.folder = folder;
				const newFolder = changes.newFolders.find(f => f.id === folder.id);
				if (!newFolder) {
					changes.updateFolders.push(folder);
				} else {
					changes.newFolders = changes.newFolders.filter(f => f.id !== folder.id);
					changes.newFolders.push(folder);
				}
			} else {
				// changes.unchangedFolders.push(dir.folder);
			}
			for (const d of dir.directories) {
				await this.mergeR(d, changes);
			}
		} else {
			return Promise.reject(Error('db entry must exists to compare ' + dir.name));
		}
	}

	private async merge(dir: MatchDir, changes: MergeChanges): Promise<void> {
		await this.buildMerge(dir, changes);
		await this.buildMergeTags(dir);
		await this.mergeR(dir, changes);
		await this.mergeMeta(changes);
	}

	private createFolderTag(dir: MatchDir): FolderTag {
		const metaStat = dir.metaStat;
		if (!metaStat) {
			throw Error('internal error, metastat must exists');
		}
		const nameSplit = splitDirectoryName(dir.name);
		const tag: FolderTag = {
			tracks: dir.files.filter(f => f.type === FileTyp.AUDIO).length,
			level: dir.level,
			type: FolderType.unknown,
			album: metaStat.album,
			albumType: metaStat.isMultiArtist ? AlbumType.compilation : AlbumType.album,
			artist: metaStat.artist,
			artistSort: metaStat.artistSort,
			title: nameSplit.title,
			image: metaStat.image,
			genre: metaStat.genre,
			mbAlbumID: metaStat.mbAlbumID,
			mbArtistID: metaStat.mbArtistID,
			year: (nameSplit.year !== undefined) ? nameSplit.year : metaStat.year
		};
		return tag;
	}

	private markMultiAlbumChilds(dir: MatchDir) {
		if (dir.tag) {
			dir.tag.type = FolderType.multialbum;
		}
		dir.directories.forEach(d => {
			this.markMultiAlbumChilds(d);
		});
	}

	private applyFolderTagType(dir: MatchDir) {
		if (!dir.tag || !dir.metaStat) {
			return;
		}
		const metaStat = dir.metaStat; // this.getMetaStat(dir);
		const name = path.basename(dir.name).toLowerCase();
		let result: FolderType = FolderType.unknown;
		if (dir.level === 0) {
			result = FolderType.multiartist;
		} else if (name.match(/\[(extra|various)\]/) || name.match(/^(extra|various)$/)) {
			result = FolderType.extras;
		} else if (metaStat.trackCount > 0) {
			const dirCount = dir.directories.filter(d => !!d.tag && d.tag.type !== FolderType.extras).length;
			if (dirCount === 0) {
				result = FolderType.album;
			} else {
				result = FolderType.multialbum;
			}
		} else {
			if (metaStat.isMultiArtist) {
				result = FolderType.multialbum;
			} else {
				result = FolderType.artist;
				dir.directories.forEach(d => {
					if (d.tag && d.tag.type === FolderType.artist) {
						this.markMultiAlbumChilds(d);
					}
				});
			}
		}
		if (result === FolderType.multialbum) {
			const a = dir.directories.find(d => {
				return (!!d.tag && d.tag.type === FolderType.artist);
			});
			if (a) {
				result = FolderType.multiartist;
			}
		}
		dir.tag.type = result;
		if (result === FolderType.multialbum) {
			this.markMultiAlbumChilds(dir);
		}
	}

	private async buildMergeTags(dir: MatchDir): Promise<void> {
		for (const sub of dir.directories) {
			await this.buildMergeTags(sub);
		}
		if (dir.folder) {
			dir.metaStat = this.getMetaStat(dir);
			dir.tag = this.createFolderTag(dir);
		}
		this.applyFolderTagType(dir);
	}

	private async findArtistInDB(trackInfo: MergeTrackInfo): Promise<Artist | undefined> {
		const mbArtistID = trackInfo.track.tag.mbAlbumArtistID || trackInfo.track.tag.mbArtistID;
		if (mbArtistID) {
			const artist = await this.store.artistStore.searchOne({mbArtistID});
			if (artist) {
				return artist;
			}
		}
		return this.store.artistStore.searchOne({slug: Scanner.getArtistSlug(trackInfo)});
	}

	private async findArtistInCache(trackInfo: MergeTrackInfo): Promise<Artist | undefined> {
		const mbArtistID = trackInfo.track.tag.mbAlbumArtistID || trackInfo.track.tag.mbArtistID;
		if (mbArtistID) {
			const artist = this.artistCache.find(a => a.mbArtistID === mbArtistID);
			if (artist) {
				return artist;
			}
		}
		const name = Scanner.getArtistName(trackInfo);
		return this.artistCache.find(a => a.name === name);
	}

	private async buildArtist(trackInfo: MergeTrackInfo): Promise<Artist> {
		return {
			id: await this.store.artistStore.getNewId(),
			type: DBObjectType.artist,
			rootIDs: [],
			slug: Scanner.getArtistSlug(trackInfo),
			name: Scanner.getArtistName(trackInfo),
			nameSort: Scanner.getArtistNameSort(trackInfo),
			albumTypes: [],
			albumIDs: [],
			mbArtistID: Scanner.getArtistMBArtistID(trackInfo),
			trackIDs: [],
			created: Date.now()
		};
	}

	private async findOrCreateArtist(trackInfo: MergeTrackInfo, changes: MergeChanges): Promise<Artist> {
		let artist = await this.findArtistInCache(trackInfo);
		if (artist) {
			return artist;
		}
		artist = await this.findArtistInDB(trackInfo);
		if (!artist) {
			artist = await this.buildArtist(trackInfo);
			changes.newArtists.push(artist);
		} else {
			changes.updateArtists.push(artist);
		}
		this.artistCache.push(artist);
		return artist;
	}

	private async findOrCreateCompilationArtist(changes: MergeChanges): Promise<Artist> {
		const slug = Scanner.slugify(cVariousArtist);
		let artist = await this.artistCache.find(a => a.slug === slug);
		if (artist) {
			return artist;
		}
		artist = await this.store.artistStore.searchOne({slug});
		if (!artist) {
			artist = {
				id: await this.store.artistStore.getNewId(),
				type: DBObjectType.artist,
				rootIDs: [],
				slug,
				name: cVariousArtist,
				albumTypes: [AlbumType.compilation],
				albumIDs: [],
				trackIDs: [],
				created: Date.now()
			};
			changes.newArtists.push(artist);
		} else {
			changes.updateArtists.push(artist);
		}
		this.artistCache.push(artist);
		return artist;
	}

	private async findAlbumInDB(trackInfo: MergeTrackInfo, artistID: string): Promise<Album | undefined> {
		if (trackInfo.track.tag.mbAlbumID) {
			const album = await this.store.albumStore.searchOne({mbAlbumID: trackInfo.track.tag.mbAlbumID});
			if (album) {
				return album;
			}
		}
		return this.store.albumStore.searchOne({slug: Scanner.getAlbumSlug(trackInfo), artistID});
	}

	private async findAlbumInCache(trackInfo: MergeTrackInfo, artistID: string): Promise<Album | undefined> {
		if (trackInfo.track.tag.mbAlbumID) {
			const album = await this.albumCache.find(a => a.mbAlbumID === trackInfo.track.tag.mbAlbumID);
			if (album) {
				return album;
			}
		}
		const name = Scanner.getAlbumName(trackInfo);
		return this.albumCache.find(a => a.name === name);
	}

	private async buildAlbum(trackInfo: MergeTrackInfo, artistID: string): Promise<Album> {
		return {
			id: await this.store.albumStore.getNewId(),
			type: DBObjectType.album,
			slug: Scanner.getAlbumSlug(trackInfo),
			name: Scanner.getAlbumName(trackInfo),
			albumType: trackInfo.dir.folder && trackInfo.dir.folder.tag && trackInfo.dir.folder.tag.albumType !== undefined ? trackInfo.dir.folder.tag.albumType : AlbumType.unknown,
			artist: Scanner.getArtistName(trackInfo),
			artistID: artistID,
			mbArtistID: Scanner.getArtistMBArtistID(trackInfo),
			mbAlbumID: trackInfo.track.tag.mbAlbumID,
			genre: trackInfo.track.tag.genre,
			trackIDs: [],
			rootIDs: [],
			year: trackInfo.track.tag.year,
			duration: trackInfo.track.media.duration || 0,
			created: Date.now()
		};
	}

	private async findOrCreateAlbum(trackInfo: MergeTrackInfo, artistID: string, changes: MergeChanges): Promise<Album> {
		let album = await this.findAlbumInCache(trackInfo, artistID);
		if (album) {
			return album;
		}
		album = await this.findAlbumInDB(trackInfo, artistID);
		if (!album) {
			album = await this.buildAlbum(trackInfo, artistID);
			changes.newAlbums.push(album);
		} else {
			changes.updateAlbums.push(album);
		}
		this.albumCache.push(album);
		return album;
	}

	private async mergeMeta(changes: MergeChanges): Promise<void> {
		for (const trackInfo of changes.newTracks) {
			if (trackInfo.dir.folder) {
				const artist = await this.findOrCreateArtist(trackInfo, changes);
				artist.trackIDs.push(trackInfo.track.id);
				if (artist.rootIDs.indexOf(trackInfo.dir.rootID) < 0) {
					artist.rootIDs.push(trackInfo.dir.rootID);
				}
				let album: Album;
				if (trackInfo.dir.folder.tag.albumType === AlbumType.compilation) {
					const compilationArtist = await this.findOrCreateCompilationArtist(changes);
					if (compilationArtist !== artist) {
						compilationArtist.trackIDs.push(trackInfo.track.id);
						if (compilationArtist.rootIDs.indexOf(trackInfo.dir.rootID) < 0) {
							compilationArtist.rootIDs.push(trackInfo.dir.rootID);
						}
					}
					album = await this.findOrCreateAlbum(trackInfo, compilationArtist.id, changes);
					album.albumType = AlbumType.compilation;
				} else {
					album = await this.findOrCreateAlbum(trackInfo, artist.id, changes);
					album.albumType = (trackInfo.dir.folder.tag.albumType === undefined) ? AlbumType.unknown : trackInfo.dir.folder.tag.albumType;
				}
				album.trackIDs.push(trackInfo.track.id);
				if (album.rootIDs.indexOf(trackInfo.dir.rootID) < 0) {
					album.rootIDs.push(trackInfo.dir.rootID);
				}
				if (artist.albumTypes.indexOf(album.albumType) < 0) {
					artist.albumTypes.push(album.albumType);
				}
				if (artist.albumIDs.indexOf(album.id) < 0) {
					artist.albumIDs.push(album.id);
				}
			}
		}
	}

	async run(dir: string, rootID: string): Promise<MergeChanges> {
		log.error('Start:', dir);

		const changes: MergeChanges = {
			newArtists: [],
			updateArtists: [],
			removedArtists: [],

			newAlbums: [],
			updateAlbums: [],
			removedAlbums: [],

			newTracks: [],
			updateTracks: [],
			removedTracks: [],

			newFolders: [],
			updateFolders: [],
			removedFolders: [],
			start: Date.now(),
			end: 0,
		};
		this.artistCache = [];
		this.albumCache = [];

		// first, scan the filesystem
		const scan: ScanDir = await this.scan(dir, rootID);

		log.error('Matching:', dir);
		// second, match db entries
		const match: MatchDir = await this.match(scan, changes);
		// printTree(match);

		// third, merge
		log.error('Merging:', dir);
		await this.merge(match, changes);

		log.error('Storing:', dir);
		// fourth, store
		await this.store.albumStore.bulk(changes.newAlbums);
		await this.store.albumStore.upsert(changes.updateAlbums);
		await this.store.artistStore.bulk(changes.newArtists);
		await this.store.artistStore.upsert(changes.updateArtists);
		await this.store.trackStore.bulk(changes.newTracks.map(t => t.track));
		await this.store.trackStore.upsert(changes.updateTracks.map(t => t.track));
		await this.store.folderStore.bulk(changes.newFolders);
		await this.store.folderStore.upsert(changes.updateFolders);
		changes.end = Date.now();
		// printTree(match);
		logChanges(changes);
		return changes;
	}

}
