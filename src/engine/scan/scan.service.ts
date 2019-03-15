import {Store} from '../store/store';
import {AudioModule} from '../../modules/audio/audio.module';
import Logger from '../../utils/logger';
import {WaveformService} from '../waveform/waveform.service';
import {Track, TrackTag} from '../../objects/track/track.model';
import {ImageModule} from '../../modules/image/image.module';
import {deepCompare} from '../../utils/deep-compare';
import {AlbumType, ArtworkImageType, FileTyp, FolderType, FolderTypesAlbum, MusicBrainz_VARIOUS_ARTISTS_ID, MusicBrainz_VARIOUS_ARTISTS_NAME, RootScanStrategy, TrackTagFormatType} from '../../model/jam-types';
import path from 'path';
import fse from 'fs-extra';
import {ensureTrailingPathSeparator} from '../../utils/fs-utils';
import {getFileType} from '../../utils/filetype';
import {Artwork, Folder, FolderTag} from '../../objects/folder/folder.model';
import {Artist} from '../../objects/artist/artist.model';
import {Album} from '../../objects/album/album.model';
import {updatePlayListTracks} from '../../objects/playlist/playlist.service';
import moment from 'moment';
import {md5string} from '../../utils/md5';
import {DBObjectType} from '../../db/db.types';
import {Jam} from '../../model/jam-rest-data';
import {wait} from '../../utils/wait';

const log = Logger('IO');

/**
 * Handles file system reading / db syncing
 */

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
	name: string;
	rootID: string;
	stat: {
		ctime: number,
		mtime: number,
	};
	directories: Array<MatchDir>;
	files: Array<MatchFile>;
	level: number;
	tag?: FolderTag;
	parent?: MatchDir;
	folder?: Folder;
	metaStat?: MetaStat;
}

export interface MatchFile extends ScanFile {
	name: string;
	type: FileTyp;
	stat: {
		ctime: number,
		mtime: number,
		size: number
	};
	rootID: string;
	track?: Track;
}

export interface MergeTrackInfo {
	track: Track;
	dir: MatchDir;
}

export interface UpdateMergeTrackInfo extends MergeTrackInfo {
	oldTrack: Track;
}

export interface MergeChanges {
	newArtists: Array<Artist>;
	updateArtists: Array<Artist>;
	removedArtists: Array<Artist>;

	newAlbums: Array<Album>;
	updateAlbums: Array<Album>;
	removedAlbums: Array<Album>;

	newTracks: Array<MergeTrackInfo>;
	updateTracks: Array<UpdateMergeTrackInfo>;
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
		console.log(prefix + '📁 ' + path.basename(match.name), '[' + match.folder.tag.type + ']', FolderTypesAlbum.indexOf(match.folder.tag.type) >= 0 ? '[' + match.folder.tag.albumType + ']' : '');
	} else {
		console.log(prefix + '📁 ' + path.basename(match.name), '[new]');
	}
	// console.log(prefix + JSON.stringify(match.tag));
	for (const sub of match.directories) {
		printTree(sub, level + 1);
	}
	// if (wFiles) {
	// 	for (const f of match.files) {
	// 		if (f.type === FileTyp.AUDIO) {
	// 			console.log(prefix + ' 🎧 ' + path.basename(f.name), f.track ? '' : '[new]');
	// 		}
	// 	}
	// }
}

function logChange(name: string, list: Array<any>) {
	if (list.length > 0) {
		log.info(name, list.length);
	}
}

export function logChanges(changes: MergeChanges) {
	const v = moment.utc(changes.end - changes.start).format('HH:mm:ss.SSS');
	log.info('Duration:', v);
	logChange('Added Tracks', changes.newTracks);
	logChange('Updated Tracks', changes.updateTracks);
	logChange('Removed Tracks', changes.removedTracks);
	logChange('Added Folders', changes.newFolders);
	logChange('Updated Folders', changes.updateFolders);
	logChange('Removed Folders', changes.removedFolders);
	logChange('Added Artists', changes.newArtists);
	logChange('Updated Artists', changes.updateArtists);
	logChange('Removed Artists', changes.removedArtists);
	logChange('Added Albums', changes.newAlbums);
	logChange('Updated Albums', changes.updateAlbums);
	logChange('Removed Albums', changes.removedAlbums);
}

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
	mbReleaseGroupID?: string;
	mbAlbumType?: string;
	year?: number;
	hasMultipleArtists: boolean;
	hasMultipleAlbums: boolean;
	albumTrackCount?: number;
	trackCount: number;
	albumType: AlbumType;
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
	list = list.sort((a, b) => b.count - a.count);
	if (list[0].count - list[1].count > 4) {
		return list[0].val;
	}
	if (list.length > 3 && multi !== undefined) {
		return multi;
	}
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

function splitDirectoryName(name: string): { title: string; year?: number; } {
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

function folderHasChanged(dir: MatchDir): boolean {
	return (!dir.folder) ||
		(dir.stat.mtime !== dir.folder.stat.modified) ||
		(dir.stat.ctime !== dir.folder.stat.created) ||
		(!deepCompare(dir.folder.tag, dir.tag));
}

function trackHasChanged(file: MatchFile): boolean {
	return (!file.track) ||
		(file.stat.mtime !== file.track.stat.modified) ||
		(file.stat.ctime !== file.track.stat.created) ||
		(file.stat.size !== file.track.stat.size);
}

function getArtistMBArtistID(trackInfo: MergeTrackInfo): string | undefined {
	if (trackInfo.dir.folder && trackInfo.dir.folder.tag.artist === MusicBrainz_VARIOUS_ARTISTS_NAME) {
		return;
	} else {
		return trackInfo.track.tag.mbAlbumArtistID || trackInfo.track.tag.mbArtistID;
	}
}

function getArtistNameSort(trackInfo: MergeTrackInfo): string | undefined {
	if (trackInfo.dir.folder && trackInfo.dir.folder.tag.artist === MusicBrainz_VARIOUS_ARTISTS_NAME) {
		return;
	} else {
		return trackInfo.track.tag.artistSort;
	}
}

function getArtistName(trackInfo: MergeTrackInfo): string {
	return trackInfo.track.tag.albumArtist || trackInfo.track.tag.artist || cUnknownArtist;
}

function slugify(s: string): string {
	return s.replace(/[\[\]\. -]/g, '').toLowerCase();
}

function getArtistSlug(trackInfo: MergeTrackInfo): string {
	return slugify(getArtistName(trackInfo));
}

function getAlbumName(trackInfo: MergeTrackInfo): string {
	if (trackInfo.dir.folder && trackInfo.dir.folder.tag.albumType === AlbumType.compilation) {
		return trackInfo.dir.folder.tag.album || cUnknownAlbum;
	} else {
		return extractAlbumName(trackInfo.track.tag.album || cUnknownAlbum);
	}
}

function getAlbumSlug(trackInfo: MergeTrackInfo): string {
	return slugify(getAlbumName(trackInfo));
}

function extractAlbumName(name: string): string {
	const result = name
		.replace(/\(((\d\d\d\d)|(\d* ?cds)|(cd ?\d*)|(disc ?\d*)|(disc ?\d*:.*)|(bonus.*)|(.*edition)|(.*retail)|(\d* of \d*)|(eps?|bootleg|deluxe|promo|single|lp|limited edition|retro|ost|uvs|demp|demos|remastered|remix|live|remixes|vinyl|collection|maxi|bonus disc))\)/gi, '')
		.replace(/\[((\d\d\d\d)|(\d* ?cds)|(cd ?\d*)|(disc ?\d*)|(disc ?\d*:.*)|(bonus.*)|(.*edition)|(.*retail)|(\d* of \d*)|(eps?|bootleg|deluxe|promo|single|lp|limited edition|retro|ost|uvs|demp|demos|remastered|remix|live|remixes|vinyl|collection|maxi|bonus disc))\]/gi, '')
		.replace(/-? cd\d*/gi, '')
		.trim();
	if (result.length === 0) {
		return name.trim();
	}
	return result;
}

export function generateArtworkId(folderID: string, filename: string): string {
	const id = folderID + '-' + md5string(filename + filename);
	return id;
}

export class ScanService {
	private artistCache: Array<Artist> = [];
	private albumCache: Array<Album> = [];
	private strategy = RootScanStrategy.auto;
	private settings: Jam.AdminSettingsLibrary = {
		scanAtStart: true,
		audioBookGenreNames: []
	};

	constructor(private store: Store, private audioModule: AudioModule, private imageModule: ImageModule, private waveformService: WaveformService) {
	}

	private buildMetaStat(dir: MatchDir): MetaStat {
		const stats: {
			[name: string]: { [key: string]: { count: number, val: string }; };
			artist: { [key: string]: { count: number, val: string }; };
			artistSort: { [key: string]: { count: number, val: string }; };
			album: { [key: string]: { count: number, val: string }; };
			genre: { [key: string]: { count: number, val: string }; };
			mbArtistID: { [key: string]: { count: number, val: string }; };
			mbAlbumID: { [key: string]: { count: number, val: string }; };
			mbReleaseGroupID: { [key: string]: { count: number, val: string }; };
			mbAlbumType: { [key: string]: { count: number, val: string }; };
			year: { [key: string]: { count: number, val: string }; };
			albumTrackCount: { [key: string]: { count: number, val: string }; };
		} = {
			artist: {},
			artistSort: {},
			album: {},
			genre: {},
			year: {},
			albumTrackCount: {},
			mbArtistID: {},
			mbReleaseGroupID: {},
			mbAlbumID: {},
			mbAlbumType: {}
		};
		let trackCount = 0;

		function statID(name: string, val?: string) {
			if (val && val.trim().length > 0) {
				const slug = val.split(' ')[0];
				stats[name][slug] = stats[name][val] || {count: 0, val: slug};
				stats[name][slug].count += 1;
			}
		}

		function statNumber(name: string, val?: number) {
			if (val !== undefined) {
				const slug = val.toString();
				stats[name][slug] = stats[name][slug] || {count: 0, val: val};
				stats[name][slug].count += 1;
			}
		}

		function statSlugValue(name: string, val?: string) {
			if (val && val.trim().length > 0) {
				const slug = slugify(val);
				stats[name][slug] = stats[name][slug] || {count: 0, val: val};
				stats[name][slug].count += 1;
			}
		}

		function statTrackCount(name: string, trackTotal?: number, disc?: number) {
			if (trackTotal !== undefined) {
				const slug = (disc !== undefined ? disc : 1).toString() + '-' + trackTotal.toString();
				stats[name][slug] = stats[name][slug] || {count: 0, val: trackTotal};
				stats[name][slug].count += 1;
			}
		}

		for (const file of dir.files) {
			if (file.type === FileTyp.AUDIO) {
				trackCount++;
				if (file.track && file.track.tag) {
					const tracktag = file.track.tag;
					statSlugValue('artist', tracktag.albumArtist || tracktag.artist);
					statSlugValue('artistSort', tracktag.albumArtistSort || tracktag.artistSort);
					statSlugValue('genre', tracktag.genre);
					statSlugValue('album', tracktag.album ? extractAlbumName(tracktag.album) : undefined);
					statNumber('year', tracktag.year);
					statTrackCount('albumTrackCount', tracktag.trackTotal, tracktag.disc);
					statSlugValue('mbAlbumType', tracktag.mbAlbumType);
					statID('mbArtistID', tracktag.mbArtistID);
					statID('mbAlbumID', tracktag.mbAlbumID);
					statID('mbReleaseGroupID', tracktag.mbReleaseGroupID);
				}
			}
		}
		let albumTrackCount = 0;
		if (stats.albumTrackCount) {
			const albumTrackCounts = convert2Numlist(stats.albumTrackCount);
			for (const atcount of albumTrackCounts) {
				albumTrackCount += atcount.val;
			}
		}
		for (const sub of dir.directories) {
			if (sub.folder && sub.tag && (sub.tag.type !== FolderType.extras)) {
				const subtag = sub.tag;
				statSlugValue('artist', subtag.artist);
				statSlugValue('artistSort', subtag.artistSort);
				statSlugValue('album', subtag.album ? extractAlbumName(subtag.album) : undefined);
				statSlugValue('genre', subtag.genre);
				statNumber('year', subtag.year);
				statSlugValue('mbAlbumType', subtag.mbAlbumType);
				statID('mbArtistID', subtag.mbArtistID);
				statID('mbAlbumID', subtag.mbAlbumID);
				statID('mbReleaseGroupID', subtag.mbReleaseGroupID);
			}
		}

		// to easy to process lists
		const artists = convert2list(stats.artist);
		const artistSorts = convert2list(stats.artistSort);
		const albums = convert2list(stats.album);
		const genres = convert2list(stats.genre);
		const years = convert2Numlist(stats.year);
		const mbArtistIDs = convert2list(stats.mbArtistID);
		const mbAlbumIDs = convert2list(stats.mbAlbumID);
		const mbReleaseGroupIDs = convert2list(stats.mbReleaseGroupID);
		const mbAlbumTypes = convert2list(stats.mbAlbumType);

		// heuristically most used values
		const album = getMostUsedTagValue<string>(albums, extractAlbumName(path.basename(dir.name)));
		const artist = getMostUsedTagValue<string>(artists, MusicBrainz_VARIOUS_ARTISTS_NAME);
		let artistSort = getMostUsedTagValue<string>(artistSorts);
		const genre = getMostUsedTagValue<string>(genres);
		const mbAlbumID = getMostUsedTagValue<string>(mbAlbumIDs, '');
		const mbReleaseGroupID = getMostUsedTagValue<string>(mbReleaseGroupIDs, '');
		const mbAlbumType = getMostUsedTagValue<string>(mbAlbumTypes, '');
		const mbArtistID = getMostUsedTagValue<string>(mbArtistIDs, '');
		const year = getMostUsedTagValue<number>(years);
		// determinate album type
		const hasMultipleArtists = artist === MusicBrainz_VARIOUS_ARTISTS_NAME;
		const hasMultipleAlbums = albums.length > 1;
		if (hasMultipleArtists) {
			artistSort = undefined;
		}
		let albumType = AlbumType.unknown;
		if (mbAlbumType) {
			const t = mbAlbumType.toLowerCase();
			if (t.indexOf('audiobook') >= 0) {
				albumType = AlbumType.audiobook;
			} else if (t.indexOf('compilation') >= 0) {
				albumType = AlbumType.compilation;
			} else if (t.indexOf('album') >= 0) {
				albumType = AlbumType.album;
			}
		}
		if (genre && albumType === AlbumType.unknown) {
			const g = genre.toLowerCase();
			const audioBook = this.settings.audioBookGenreNames.find(a => a.toLowerCase().localeCompare(g) === 0);
			if (audioBook) {
				albumType = AlbumType.audiobook;
			}
		}
		if (albumType === AlbumType.unknown) {
			if (this.strategy === RootScanStrategy.audiobook) {
				albumType = AlbumType.audiobook;
			} else if (this.strategy === RootScanStrategy.compilation) {
				albumType = AlbumType.compilation;
			} else if (this.strategy === RootScanStrategy.artistalbum) {
				albumType = AlbumType.album;
			} else {
				if (hasMultipleArtists) {
					albumType = AlbumType.compilation;
				} else {
					albumType = AlbumType.album;
				}
			}
		}

		return {
			trackCount,
			albumType,
			hasMultipleArtists,
			hasMultipleAlbums,
			album,
			artist,
			artistSort,
			genre,
			mbAlbumID,
			mbReleaseGroupID,
			mbAlbumType,
			mbArtistID,
			year,
			albumTrackCount: albumTrackCount > 0 ? albumTrackCount : undefined
		};
	}

	private async match(dir: ScanDir, changes: MergeChanges): Promise<MatchDir> {
		const result: MatchDir = this.cloneScanDir(dir, undefined, 0);
		result.folder = await this.store.folderStore.searchOne({path: dir.name});
		await this.matchDirR(result, changes);
		const removedFolders: Array<Folder> = changes.removedFolders;
		const removedTracks: Array<Track> = changes.removedTracks;
		for (const sub of changes.removedFolders) {
			const folderList = await this.store.folderStore.search({inPath: sub.path});
			for (const folder of folderList) {
				if (!removedFolders.find(f => f.id === folder.id)) {
					removedFolders.push(folder);
				}
			}
			const trackList = await this.store.trackStore.search({inPath: sub.path});
			for (const track of trackList) {
				if (!removedTracks.find(t => t.id === track.id)) {
					removedTracks.push(track);
				}
			}
		}
		changes.removedTracks = removedTracks;
		changes.removedFolders = removedFolders;
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
			directories: []
		};
		result.directories = dir.directories.map(sub => this.cloneScanDir(sub, result, level + 1));
		return result;
	}

	private async matchDirR(dir: MatchDir, changes: MergeChanges): Promise<void> {
		log.debug('Comparing:', dir.name);
		const tracks = await this.store.trackStore.search({path: dir.name});
		tracks.forEach(track => {
			const filename = path.join(track.path, track.name);
			const file = dir.files.find(f => f.name === filename);
			if (file) {
				file.track = track;
			} else {
				changes.removedTracks.push(track);
			}
		});
		if (dir.folder) {
			const folders = await this.store.folderStore.search({parentID: dir.folder.id});
			for (const subFolder of folders) {
				const subDir = dir.directories.find(sd => sd.name === subFolder.path);
				if (!subDir) {
					changes.removedFolders.push(subFolder);
				} else {
					subDir.folder = subFolder;
					await this.matchDirR(subDir, changes);
				}
			}
		}
	}

	private async scanDirR(dir: string, stat: fse.Stats, rootID: string): Promise<ScanDir> {
		log.debug('Scanning:', dir);
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

	private buildDefaultTag(dir: MatchDir): FolderTag {
		return {
			level: dir.level,
			type: FolderType.unknown,
			trackCount: dir.files.filter(t => t.type === FileTyp.AUDIO).length,
			folderCount: dir.directories.length,
		};
	}

	private buildFolder(dir: MatchDir): Folder {
		return {
			id: '',
			rootID: dir.rootID,
			path: ensureTrailingPathSeparator(dir.name),
			parentID: (dir.parent && dir.parent.folder ? dir.parent.folder.id : undefined),
			stat: {
				created: dir.stat.ctime,
				modified: dir.stat.mtime
			},
			tag: dir.tag || this.buildDefaultTag(dir),
			type: DBObjectType.folder
		};
	}

	private async buildTrack(file: MatchFile, parent: Folder): Promise<Track> {
		log.info('Reading Track:', file.name);
		const data = await this.audioModule.read(file.name);
		const tag: TrackTag = data.tag || {format: TrackTagFormatType.none};
		if (!tag.title) {
			tag.title = path.basename(file.name);
		}
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
			tag,
			type: DBObjectType.track
		};
	}

	private async buildMerge(dir: MatchDir, changes: MergeChanges): Promise<void> {
		if (!dir.folder) {
			const folder = this.buildFolder(dir);
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
				} else if (trackHasChanged(file)) {
					const old = file.track;
					if (!old) {
						return;
					}
					const track = await this.buildTrack(file, dir.folder);
					track.id = old.id;
					file.track = track;
					changes.updateTracks.push({track, dir, oldTrack: old});
				}
			}
		}
	}

	private async mergeR(dir: MatchDir, changes: MergeChanges): Promise<void> {
		if (dir.folder) {
			if (folderHasChanged(dir)) {
				const folder = this.buildFolder(dir);
				folder.id = dir.folder.id;
				dir.folder = folder;
				const newFolder = changes.newFolders.find(f => f.id === folder.id);
				if (!newFolder) {
					changes.updateFolders.push(folder);
				} else {
					changes.newFolders = changes.newFolders.filter(f => f.id !== folder.id);
					changes.newFolders.push(folder);
				}
			}
			for (const d of dir.directories) {
				await this.mergeR(d, changes);
			}
		} else {
			return Promise.reject(Error('db entry must exists to compare ' + dir.name));
		}
	}

	private async merge(dir: MatchDir, forceMetaRefresh: boolean, rootID: string, changes: MergeChanges): Promise<void> {
		await this.buildMerge(dir, changes);
		await this.buildMergeTags(dir);
		await this.mergeR(dir, changes);
		await this.mergeMeta(dir, forceMetaRefresh, rootID, changes);
	}

	private collectFolderImages(dir: MatchDir): Array<Artwork> {
		if (!dir.folder) {
			log.error('folder obj must has been created at this point');
			return [];
		}
		const folderID = dir.folder.id;
		return dir.files.filter(file => file.type === FileTyp.IMAGE).map(file => {
			const name = path.basename(file.name);
			const lname = name.toLowerCase();
			const types: Array<ArtworkImageType> = [];
			for (const t in ArtworkImageType) {
				if (!Number(t)) {
					if (lname.indexOf(t) >= 0) {
						types.push(<ArtworkImageType>t);
					}
				}
			}
			if ((types.indexOf(ArtworkImageType.front) < 0) && (lname.indexOf('cover') >= 0 || lname.indexOf('folder') >= 0)) {
				types.push(ArtworkImageType.front);
			}
			if (types.length === 0) {
				types.push(ArtworkImageType.other);
			}
			types.sort((a, b) => a.localeCompare(b));
			const id = generateArtworkId(folderID, name);
			return {id, name, types, stat: {created: file.stat.ctime, modified: file.stat.mtime, size: file.stat.size}};
		});
	}

	private buildFolderTag(dir: MatchDir): FolderTag {
		const metaStat = dir.metaStat;
		if (!metaStat) {
			throw Error('internal error, metastat must exists');
		}
		const nameSplit = splitDirectoryName(dir.name);
		const images = this.collectFolderImages(dir);
		let imageName: string | undefined;
		let image = images.find(i => i.types.length === 1 && (i.types.indexOf(ArtworkImageType.front) >= 0));
		if (!image) {
			image = images.find(i => i.types.length === 1 && (i.types.indexOf(ArtworkImageType.artist) >= 0));
		}
		if (image) {
			imageName = image.name;
		}
		return {
			trackCount: metaStat.trackCount,
			folderCount: dir.directories.length,
			level: dir.level,
			type: FolderType.unknown,
			album: metaStat.album,
			albumType: metaStat.albumType,
			albumTrackCount: metaStat.albumTrackCount,
			artist: metaStat.artist,
			artistSort: metaStat.artistSort,
			title: nameSplit.title,
			image: imageName,
			artworks: images,
			genre: metaStat.genre,
			mbAlbumID: metaStat.mbAlbumID,
			mbReleaseGroupID: metaStat.mbReleaseGroupID,
			mbAlbumType: metaStat.mbAlbumType,
			mbArtistID: metaStat.mbArtistID,
			year: (nameSplit.year !== undefined) ? nameSplit.year : metaStat.year
		};
	}

	private markMultiAlbumChilds(dir: MatchDir) {
		if (dir.tag && dir.tag.type !== FolderType.extras) {
			this.setTagType(dir.tag, FolderType.multialbum);
		}
		dir.directories.forEach(d => {
			if (dir.tag && d.tag && d.tag.type !== FolderType.extras) {
				// parent multialbum gets same album type as child multialbum folder
				dir.tag.albumType = d.tag.albumType;
			}
			this.markMultiAlbumChilds(d);
		});
	}

	private markArtistChilds(dir: MatchDir) {
		if (dir.tag && dir.tag.type === FolderType.artist) {
			this.setTagType(dir.tag, FolderType.collection);
		}
		dir.directories.forEach(d => {
			this.markArtistChilds(d);
		});
	}

	private applyFolderTagType(dir: MatchDir) {
		if (!dir.tag || !dir.metaStat) {
			return;
		}
		const metaStat = dir.metaStat;
		const name = path.basename(dir.name).toLowerCase();
		let result: FolderType = FolderType.unknown;
		if (dir.level === 0) {
			result = FolderType.collection;
		} else if (name.match(/\[(extra|various)\]/) || name.match(/^(extra|various)$/)) {
			// TODO: generalise extra folder detection
			result = FolderType.extras;
		} else if (metaStat.trackCount > 0) {
			const dirCount = dir.directories.filter(d => !!d.tag && d.tag.type !== FolderType.extras).length;
			if (dirCount === 0) {
				result = FolderType.album;
			} else {
				result = FolderType.multialbum;
			}
		} else if (dir.directories.length > 0) {
			if (metaStat.hasMultipleAlbums) {
				if (metaStat.hasMultipleArtists) {
					result = FolderType.collection;
				} else {
					result = FolderType.artist;
				}
			} else if (dir.directories.length === 1) {
				result = FolderType.artist;
			} else {
				result = FolderType.multialbum;
			}
		} else if (dir.directories.length === 0 && dir.files.filter(f => f.type === FileTyp.AUDIO).length === 0) {
			result = FolderType.extras;
		} else {
			result = FolderType.album;
		}
		if (result === FolderType.multialbum) {
			const a = dir.directories.find(d => {
				return (!!d.tag && d.tag.type === FolderType.artist);
			});
			if (a) {
				result = FolderType.collection;
			}
		}
		this.setTagType(dir.tag, result);
		if (result === FolderType.multialbum) {
			this.markMultiAlbumChilds(dir);
		} else if (result === FolderType.artist) {
			for (const sub of dir.directories) {
				this.markArtistChilds(sub);
			}
		}
	}

	private setTagType(tag: FolderTag, type: FolderType) {
		tag.type = type;
		switch (type) {
			case FolderType.collection:
				tag.albumType = undefined;
				tag.genre = undefined;
				tag.mbArtistID = undefined;
				tag.mbAlbumID = undefined;
				tag.mbAlbumType = undefined;
				tag.mbReleaseGroupID = undefined;
				tag.artist = undefined;
				tag.artistSort = undefined;
				tag.album = undefined;
				tag.year = undefined;
				return;
			case FolderType.artist:
				tag.albumType = undefined;
				tag.genre = undefined;
				tag.mbAlbumID = undefined;
				tag.mbAlbumType = undefined;
				tag.mbReleaseGroupID = undefined;
				tag.album = undefined;
				tag.year = undefined;
				return;
		}
	}

	private async buildMergeTags(dir: MatchDir): Promise<void> {
		for (const sub of dir.directories) {
			await this.buildMergeTags(sub);
		}
		if (dir.folder) {
			dir.metaStat = this.buildMetaStat(dir);
			dir.tag = this.buildFolderTag(dir);
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
		return this.store.artistStore.searchOne({slug: getArtistSlug(trackInfo)});
	}

	private async findArtistInCache(trackInfo: MergeTrackInfo): Promise<Artist | undefined> {
		const mbArtistID = trackInfo.track.tag.mbAlbumArtistID || trackInfo.track.tag.mbArtistID;
		if (mbArtistID) {
			const artist = this.artistCache.find(a => a.mbArtistID === mbArtistID);
			if (artist) {
				return artist;
			}
		}
		const slug = getArtistSlug(trackInfo);
		return this.artistCache.find(a => a.slug === slug);
	}

	private updateArtist(artist: Artist, trackInfo: MergeTrackInfo) {
		if (artist.name !== MusicBrainz_VARIOUS_ARTISTS_NAME) {
			artist.slug = getArtistSlug(trackInfo);
			artist.name = getArtistName(trackInfo);
			artist.nameSort = getArtistNameSort(trackInfo);
			artist.mbArtistID = getArtistMBArtistID(trackInfo);
		}
	}

	private async buildArtist(trackInfo: MergeTrackInfo): Promise<Artist> {
		return {
			id: await this.store.artistStore.getNewId(),
			type: DBObjectType.artist,
			rootIDs: [],
			slug: getArtistSlug(trackInfo),
			name: getArtistName(trackInfo),
			nameSort: getArtistNameSort(trackInfo),
			mbArtistID: getArtistMBArtistID(trackInfo),
			albumTypes: [],
			albumIDs: [],
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
			this.updateArtist(artist, trackInfo);
			changes.updateArtists.push(artist);
		}
		this.artistCache.push(artist);
		return artist;
	}

	private async findCompilationArtist(changes: MergeChanges): Promise<Artist | undefined> {
		const slug = slugify(MusicBrainz_VARIOUS_ARTISTS_NAME);
		let artist = await this.artistCache.find(a => a.slug === slug);
		if (artist) {
			return artist;
		}
		artist = await this.store.artistStore.searchOne({slug});
		if (artist) {
			this.artistCache.push(artist);
		}
		return artist;
	}

	private async findOrCreateCompilationArtist(changes: MergeChanges): Promise<Artist> {
		let artist = await this.findCompilationArtist(changes);
		if (!artist) {
			artist = {
				id: await this.store.artistStore.getNewId(),
				type: DBObjectType.artist,
				rootIDs: [],
				slug: slugify(MusicBrainz_VARIOUS_ARTISTS_NAME),
				name: MusicBrainz_VARIOUS_ARTISTS_NAME,
				mbArtistID: MusicBrainz_VARIOUS_ARTISTS_ID,
				albumTypes: [AlbumType.compilation],
				albumIDs: [],
				trackIDs: [],
				created: Date.now()
			};
			changes.newArtists.push(artist);
			this.artistCache.push(artist);
			return artist;
		}
		return artist;
	}

	private async findAlbumInDB(trackInfo: MergeTrackInfo, artistID: string): Promise<Album | undefined> {
		if (trackInfo.track.tag.mbAlbumID) {
			const album = await this.store.albumStore.searchOne({mbAlbumID: trackInfo.track.tag.mbAlbumID});
			if (album) {
				return album;
			}
		}
		return this.store.albumStore.searchOne({slug: getAlbumSlug(trackInfo), artistID});
	}

	private async findAlbumInCache(trackInfo: MergeTrackInfo, artistID: string): Promise<Album | undefined> {
		if (trackInfo.track.tag.mbAlbumID) {
			const album = await this.albumCache.find(a => a.mbAlbumID === trackInfo.track.tag.mbAlbumID);
			if (album) {
				return album;
			}
		}
		const name = getAlbumName(trackInfo);
		return this.albumCache.find(a => (a.name === name) && (a.artistID === artistID));
	}

	private updateAlbum(album: Album, trackInfo: MergeTrackInfo) {
		album.albumType = trackInfo.dir.folder && trackInfo.dir.folder.tag && trackInfo.dir.folder.tag.albumType !== undefined ? trackInfo.dir.folder.tag.albumType : AlbumType.unknown;
		album.name = getAlbumName(trackInfo);
		album.artist = getArtistName(trackInfo);
		album.mbArtistID = getArtistMBArtistID(trackInfo);
		album.mbAlbumID = trackInfo.track.tag.mbAlbumID;
		album.genre = trackInfo.track.tag.genre;
		album.year = trackInfo.track.tag.year;
	}

	private async buildAlbum(trackInfo: MergeTrackInfo, artistID: string): Promise<Album> {
		return {
			id: await this.store.albumStore.getNewId(),
			type: DBObjectType.album,
			slug: getAlbumSlug(trackInfo),
			name: getAlbumName(trackInfo),
			albumType: trackInfo.dir.folder && trackInfo.dir.folder.tag && trackInfo.dir.folder.tag.albumType !== undefined ? trackInfo.dir.folder.tag.albumType : AlbumType.unknown,
			artist: getArtistName(trackInfo),
			artistID: artistID,
			mbArtistID: getArtistMBArtistID(trackInfo),
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
			this.updateAlbum(album, trackInfo);
			changes.updateAlbums.push(album);
		}
		this.albumCache.push(album);
		return album;
	}

	private async getAlbumByID(id: string, changes?: MergeChanges): Promise<Album | undefined> {
		let album = this.albumCache.find(a => a.id === id);
		if (album) {
			return album;
		}
		album = await this.store.albumStore.byId(id);
		if (album) {
			this.albumCache.push(album);
			if (changes) {
				changes.updateAlbums.push(album);
			}
		}
		return album;
	}

	private async getArtistByID(id: string, changes: MergeChanges): Promise<Artist | undefined> {
		let artist = this.artistCache.find(a => a.id === id);
		if (artist) {
			return artist;
		}
		artist = await this.store.artistStore.byId(id);
		if (artist) {
			this.artistCache.push(artist);
			changes.updateArtists.push(artist);
		}
		return artist;
	}

	private async getTrackByID(id: string, changes: MergeChanges): Promise<Track | undefined> {
		const trackInfo = changes.newTracks.find(a => a.track.id === id);
		if (trackInfo) {
			return trackInfo.track;
		}
		return await this.store.trackStore.byId(id);
	}

	private async getTracksByID(ids: Array<string>, changes: MergeChanges): Promise<Array<Track>> {
		const result: Array<Track> = [];
		for (const id of ids) {
			const track = await this.getTrackByID(id, changes);
			if (track) {
				result.push(track);
			}
		}
		return result;
	}

	private async getAlbumById(id: string, changes: MergeChanges): Promise<Album | undefined> {
		let album = changes.newAlbums.find(a => a.id === id);
		if (album) {
			return album;
		}
		album = changes.updateAlbums.find(a => a.id === id);
		if (album) {
			return album;
		}
		return await this.store.albumStore.byId(id);
	}

	private async getAlbumsById(ids: Array<string>, changes?: MergeChanges): Promise<Array<Album>> {
		const result: Array<Album> = [];
		for (const id of ids) {
			const track = await this.getAlbumByID(id, changes);
			if (track) {
				result.push(track);
			}
		}
		return result;
	}

	private async addMeta(trackInfo: MergeTrackInfo, changes: MergeChanges): Promise<void> {
		if (trackInfo.dir.folder) {
			const artist = await this.findOrCreateArtist(trackInfo, changes);
			artist.trackIDs.push(trackInfo.track.id);
			if (artist.rootIDs.indexOf(trackInfo.dir.rootID) < 0) {
				artist.rootIDs.push(trackInfo.dir.rootID);
			}
			trackInfo.track.artistID = artist.id;
			let album: Album;
			if (trackInfo.dir.folder.tag.artist === MusicBrainz_VARIOUS_ARTISTS_NAME) {
				const compilationArtist = await this.findOrCreateCompilationArtist(changes);
				if (compilationArtist !== artist) {
					compilationArtist.trackIDs.push(trackInfo.track.id);
					if (compilationArtist.rootIDs.indexOf(trackInfo.dir.rootID) < 0) {
						compilationArtist.rootIDs.push(trackInfo.dir.rootID);
					}
					if (changes.newArtists.indexOf(compilationArtist) < 0 && changes.updateArtists.indexOf(compilationArtist) < 0) {
						changes.updateArtists.push(compilationArtist);
					}
				}
				album = await this.findOrCreateAlbum(trackInfo, compilationArtist.id, changes);
				album.artist = compilationArtist.name;
				album.albumType = AlbumType.compilation;
				if (compilationArtist.albumIDs.indexOf(album.id) < 0) {
					compilationArtist.albumIDs.push(album.id);
				}
			} else {
				album = await this.findOrCreateAlbum(trackInfo, artist.id, changes);
				album.albumType = (trackInfo.dir.folder.tag.albumType === undefined) ? AlbumType.unknown : trackInfo.dir.folder.tag.albumType;
			}
			album.trackIDs.push(trackInfo.track.id);
			trackInfo.track.albumID = album.id;
			album.duration += (trackInfo.track.media.duration || 0);
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

	private async removeMeta(track: Track, compilationArtist: Artist | undefined, changes: MergeChanges): Promise<void> {
		const album = await this.getAlbumByID(track.albumID, changes);
		if (album) {
			album.trackIDs = album.trackIDs.filter(id => id !== track.id);
		}
		const artist = await this.getArtistByID(track.artistID, changes);
		if (artist) {
			artist.trackIDs = artist.trackIDs.filter(id => id !== track.id);
		}
		if (compilationArtist && compilationArtist.trackIDs.indexOf(track.id) >= 0) {
			compilationArtist.trackIDs = compilationArtist.trackIDs.filter(id => id !== track.id);
			if (changes.newArtists.indexOf(compilationArtist) < 0 && changes.updateArtists.indexOf(compilationArtist) < 0) {
				changes.updateArtists.push(compilationArtist);
			}
		}
	}

	private collectMergeTracks(dir: MatchDir): Array<MergeTrackInfo> {
		let result = dir.files.filter(file => !!file.track).map(p => {
			return {
				track: <Track>p.track,
				dir
			};
		});
		for (const sub of dir.directories) {
			result = result.concat(this.collectMergeTracks(sub));
		}
		return result;
	}

	private async mergeMeta(dir: MatchDir, forceMetaRefresh: boolean, rootID: string, changes: MergeChanges): Promise<void> {
		// merge new
		log.debug('merge meta tracks new', changes.newTracks.length);
		for (const trackInfo of changes.newTracks) {
			await this.addMeta(trackInfo, changes);
		}
		const compilationArtist = await this.findCompilationArtist(changes);
		// remove missing
		log.debug('merge meta tracks remove', changes.removedTracks.length);
		for (const track of changes.removedTracks) {
			await this.removeMeta(track, compilationArtist, changes);
		}
		// update updated
		log.debug('merge meta tracks update', changes.updateTracks.length);
		for (const trackInfo of changes.updateTracks) {
			await this.removeMeta(trackInfo.oldTrack, compilationArtist, changes);
			await this.addMeta(trackInfo, changes);
		}

		if (forceMetaRefresh) {
			const allArtistIDs = await this.store.artistStore.searchIDs({rootID});
			for (const id of allArtistIDs) {
				await this.getArtistByID(id, changes);
			}
			const allAlbumIDs = await this.store.albumStore.searchIDs({rootID});
			for (const id of allAlbumIDs) {
				await this.getAlbumByID(id, changes);
			}
		}

		changes.removedArtists = changes.updateArtists.filter(a => a.trackIDs.length === 0 || a.rootIDs.length === 0);
		changes.updateArtists = changes.updateArtists.filter(a => changes.removedArtists.indexOf(a) < 0 && changes.newArtists.indexOf(a) < 0);
		changes.removedAlbums = changes.updateAlbums.filter(a => a.trackIDs.length === 0);
		changes.updateAlbums = changes.updateAlbums.filter(a => changes.removedAlbums.indexOf(a) < 0 && changes.newAlbums.indexOf(a) < 0);
		log.debug('refresh albums', changes.updateAlbums.length);
		const flatTracks = this.collectMergeTracks(dir);
		for (const album of changes.updateAlbums) {
			const rootIDs: Array<string> = [];
			let duration = 0;
			const trackInfos = flatTracks.filter(t => t.track && album.trackIDs.indexOf(t.track.id) >= 0);
			const trackIDsFromOtherRoots = album.trackIDs.filter(id => !trackInfos.find(t => t.track.id === id));
			const tracksFromOtherRoots = await this.store.trackStore.byIds(trackIDsFromOtherRoots);
			if (trackInfos.length + tracksFromOtherRoots.length !== album.trackIDs.length) {
				log.warn('Not all album tracks are scanned', album.name);
			}
			for (const track of tracksFromOtherRoots) {
				if (rootIDs.indexOf(track.rootID) < 0) {
					rootIDs.push(track.rootID);
				}
				duration += (track.media.duration || 0);
			}
			for (const trackInfo of trackInfos) {
				if (trackInfo.track) {
					if (rootIDs.indexOf(trackInfo.track.rootID) < 0) {
						rootIDs.push(trackInfo.track.rootID);
					}
					duration += (trackInfo.track.media.duration || 0);
					this.updateAlbum(album, trackInfo);
				}
			}
			album.rootIDs = rootIDs;
			album.duration = duration;
		}
		log.debug('refresh artists', changes.updateArtists.length);
		for (const artist of changes.updateArtists) {
			const rootIDs: Array<string> = [];
			const albumTypes: Array<AlbumType> = [];
			const trackInfos = flatTracks.filter(t => t.track && artist.trackIDs.indexOf(t.track.id) >= 0);
			const trackIDsFromOtherRoots = artist.trackIDs.filter(id => !trackInfos.find(t => t.track.id === id));
			const tracksFromOtherRoots = await this.store.trackStore.byIds(trackIDsFromOtherRoots);
			if (trackInfos.length + tracksFromOtherRoots.length !== artist.trackIDs.length) {
				log.warn('Not all artist tracks are scanned', artist.name);
			}
			for (const track of tracksFromOtherRoots) {
				if (rootIDs.indexOf(track.rootID) < 0) {
					rootIDs.push(track.rootID);
				}
			}
			for (const trackInfo of trackInfos) {
				if (trackInfo.track) {
					if (rootIDs.indexOf(trackInfo.track.rootID) < 0) {
						rootIDs.push(trackInfo.track.rootID);
					}
				}
				this.updateArtist(artist, trackInfo);
			}
			const albums = await this.getAlbumsById(artist.albumIDs);
			for (const album of albums) {
				if (albumTypes.indexOf(album.albumType) < 0) {
					albumTypes.push(album.albumType);
				}
			}
			artist.albumTypes = albumTypes;
			artist.rootIDs = rootIDs;
		}
	}

	/*

	clearID3(store: Store, imageModule: ImageModule, removeTracks: Array<Track>): Promise<void> {
		if (removeTracks.length === 0) {
			return;
		}
		log.debug('Cleaning ID3');
		const trackIDs = removeTracks.map(track => track.id);
		const albums = await store.albumStore.search({trackIDs});
		albums.forEach(album => {
			let duration = 0;
			album.trackIDs = album.trackIDs.filter(id => {
				const track = removeTracks.find(t => t.id === id);
				if (track) {
					duration += (track.media.duration || 0);
					return false;
				}
				return true;
			});
			album.duration -= duration;
		});
		const removeAlbums = albums.filter(album => album.trackIDs.length === 0).map(album => album.id);
		const updateAlbums = albums.filter(album => album.trackIDs.length !== 0);
		if (removeAlbums.length > 0) {
			await store.albumStore.remove(removeAlbums);
			await store.stateStore.removeByQuery({destIDs: removeAlbums, type: DBObjectType.album});
		}
		if (updateAlbums.length > 0) {
			await store.albumStore.replaceMany(updateAlbums);
		}
		const artists = await store.artistStore.search({trackIDs});
		artists.forEach(artist => {
			artist.trackIDs = artist.trackIDs.filter(id => trackIDs.indexOf(id) < 0);
			artist.albumIDs = artist.albumIDs.filter(id => removeAlbums.indexOf(id) < 0);
		});
		const removeArtists = artists.filter(artist => artist.trackIDs.length === 0).map(artist => artist.id);
		const updateArtists = artists.filter(artist => artist.trackIDs.length !== 0);
		if (removeArtists.length > 0) {
			await store.artistStore.remove(removeArtists);
			await store.stateStore.removeByQuery({destIDs: removeArtists, type: DBObjectType.artist});
		}
		if (updateArtists.length > 0) {
			await store.artistStore.replaceMany(updateArtists);
		}
		const ids = removeAlbums.concat(removeArtists);
		await imageModule.clearImageCacheByIDs(ids);
	}

	*/

	private async clean(changes: MergeChanges): Promise<void> {
		let ids: Array<string> = [];
		if (changes.removedAlbums.length > 0) {
			log.debug('Cleaning albums', changes.removedAlbums.length);
			const albumIDs = changes.removedAlbums.map(a => a.id);
			await this.store.albumStore.remove(albumIDs);
			await this.store.stateStore.removeByQuery({destIDs: albumIDs, type: DBObjectType.album});
		}
		if (changes.removedArtists.length > 0) {
			log.debug('Cleaning artists', changes.removedArtists.length);
			const artistIDs = changes.removedArtists.map(a => a.id);
			await this.store.artistStore.remove(artistIDs);
			await this.store.stateStore.removeByQuery({destIDs: artistIDs, type: DBObjectType.artist});
		}
		if (changes.removedFolders.length > 0) {
			log.debug('Cleaning folders', changes.removedFolders.length);
			const folderIDs = changes.removedFolders.map(folder => folder.id);
			await this.store.folderStore.remove(folderIDs);
			await this.store.stateStore.removeByQuery({destIDs: folderIDs, type: DBObjectType.folder});
			ids = folderIDs;
		}
		if (changes.removedTracks.length > 0) {
			log.debug('Cleaning tracks', changes.removedTracks.length);
			const trackIDs = changes.removedTracks.map(track => track.id);
			ids = ids.concat(trackIDs);
			await this.store.trackStore.remove(trackIDs);
			await this.store.stateStore.removeByQuery({destIDs: trackIDs, type: DBObjectType.track});
			await this.store.bookmarkStore.removeByQuery({destIDs: trackIDs});
			const playlists = await this.store.playlistStore.search({trackIDs: trackIDs});
			if (playlists.length > 0) {
				for (const playlist of playlists) {
					playlist.trackIDs = playlist.trackIDs.filter(id => trackIDs.indexOf(id) < 0);
					if (playlist.trackIDs.length === 0) {
						await this.store.playlistStore.remove(playlist.id);
					} else {
						await updatePlayListTracks(this.store.trackStore, playlist);
						await this.store.playlistStore.replace(playlist);
					}
				}

			}
		}
		if (ids.length > 0) {
			await this.imageModule.clearImageCacheByIDs(ids);
			await this.waveformService.clearWaveformCacheByIDs(ids);
		}
		// await clearID3(this.store, this.imageModule, removeTracks);
		// await clearID3(this.store, this.imageModule, changes.removedTracks);
	}

	private emptyChanges(): MergeChanges {
		this.artistCache = [];
		this.albumCache = [];
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
		return changes;
	}

	private async storeChanges(changes: MergeChanges): Promise<void> {
		await this.store.trackStore.bulk(changes.newTracks.map(t => t.track));
		await this.store.trackStore.upsert(changes.updateTracks.map(t => t.track));
		await this.store.folderStore.bulk(changes.newFolders);
		await this.store.folderStore.upsert(changes.updateFolders);

		await this.store.albumStore.bulk(changes.newAlbums);
		await this.store.albumStore.upsert(changes.updateAlbums);
		await this.store.artistStore.bulk(changes.newArtists);
		await this.store.artistStore.upsert(changes.updateArtists);
	}

	async run(dir: string, rootID: string, strategy: RootScanStrategy, forceMetaRefresh: boolean): Promise<MergeChanges> {
		this.strategy = strategy || RootScanStrategy.auto;
		log.info('Start:', dir);
		/*
 	Processing:

 	* read folders and files stats into tree
 	* build new folder/files objs into tree
 	* build Album and Artist meta data
 	* store data in db
 	* clean db for removed folders and files

		 */

		const changes = this.emptyChanges();

		// first, scan the filesystem
		const scan: ScanDir = await this.scan(dir, rootID);

		// second, match db entries
		log.info('Matching:', dir);
		const match: MatchDir = await this.match(scan, changes);

		// third, merge
		log.info('Merging:', dir);
		await this.merge(match, forceMetaRefresh, rootID, changes);
		// printTree(match);

		// fourth, store
		log.info('Storing:', dir);
		await this.storeChanges(changes);

		// fifth, clean
		log.info('Cleaning:', dir);
		await this.clean(changes);

		changes.end = Date.now();
		return changes;
	}

	async removeRoot(rootID: string): Promise<MergeChanges> {
		const changes = this.emptyChanges();
		changes.removedTracks = await this.store.trackStore.search({rootID});
		changes.removedFolders = await this.store.folderStore.search({rootID});
		const trackIDs = changes.removedTracks.map(t => t.id);
		const artists = await this.store.artistStore.search({rootID});
		for (const artist of artists) {
			artist.rootIDs = artist.rootIDs.filter(r => r !== rootID);
			if (artist.rootIDs.length === 0) {
				changes.removedArtists.push(artist);
			} else {
				artist.trackIDs = artist.trackIDs.filter(trackID => trackIDs.indexOf(trackID) < 0);
				if (artist.trackIDs.length === 0) {
					changes.removedArtists.push(artist);
				} else {
					changes.updateArtists.push(artist);
				}
			}
		}
		const albums = await this.store.albumStore.search({rootID});
		for (const album of albums) {
			album.rootIDs = album.rootIDs.filter(r => r !== rootID);
			if (album.rootIDs.length === 0) {
				changes.removedAlbums.push(album);
			} else {
				album.trackIDs = album.trackIDs.filter(trackID => trackIDs.indexOf(trackID) < 0);
				if (album.trackIDs.length === 0) {
					changes.removedAlbums.push(album);
				} else {
					changes.updateAlbums.push(album);
				}
			}
		}
		await this.store.albumStore.upsert(changes.updateAlbums);
		await this.store.artistStore.upsert(changes.updateArtists);
		await this.clean(changes);
		await this.store.rootStore.remove(rootID);
		return changes;
	}

	async buildMatchFileFromDB(track: Track): Promise<MatchFile> {
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

	async buildMatchDirFromDBData(folder: Folder, data: { folders: Array<Folder>, tracks: Array<Track> }, parent?: MatchDir): Promise<MatchDir> {
		const match: MatchDir = {
			name: folder.path,
			level: folder.tag.level,
			rootID: folder.rootID,
			tag: folder.tag,
			stat: {ctime: folder.stat.created, mtime: folder.stat.modified},
			parent,
			folder: folder,
			files: [],
			directories: [],
			metaStat: undefined
		};
		const folders = data.folders.filter(f => f.parentID === folder.id);
		for (const f of folders) {
			match.directories.push(await this.buildMatchDirFromDBData(f, data, match));
		}
		const tracks = data.tracks.filter(t => t.parentID === folder.id);
		for (const t of tracks) {
			match.files.push(await this.buildMatchFileFromDB(t));
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

	async refreshTracks(rootID: string, trackIDs: Array<string>, strategy: RootScanStrategy) {
		this.strategy = strategy || RootScanStrategy.auto;
		const changes = this.emptyChanges();

		const folders = await this.store.folderStore.search({rootID});
		await wait(400);
		const tracks = await this.store.trackStore.search({rootID});
		await wait(400);

		const folder = folders.find(f => f.tag.level === 0);
		if (!folder) {
			return Promise.reject(Error('Root folder not found'));
		}

		const match: MatchDir = await this.buildMatchDirFromDBData(folder, {folders, tracks});
		await wait(400);

		const changedDirs: Array<MatchDir> = [];
		const changedFiles: Array<MatchFile> = [];

		function collectR(dir: MatchDir) {
			for (const file of dir.files) {
				if (file.track && trackIDs.indexOf(file.track.id) >= 0) {
					changedFiles.push(file);
					if (changedDirs.indexOf(dir) < 0) {
						changedDirs.push(dir);
					}
				}
			}
			for (const sub of dir.directories) {
				collectR(sub);
			}
		}

		collectR(match);

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
		await wait(400);

		await this.merge(match, false, rootID, changes);
		// printTree(match);
		await this.storeChanges(changes);
		await this.clean(changes);
		changes.end = Date.now();
		return changes;

	}

	public setSettings(settings: Jam.AdminSettingsLibrary) {
		this.settings = settings;
	}
}
