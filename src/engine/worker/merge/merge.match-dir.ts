import path from 'path';
import {DBObjectType} from '../../../db/db.types';
import {Jam} from '../../../model/jam-rest-data';
import {FileTyp, FolderType, RootScanStrategy, TrackTagFormatType} from '../../../model/jam-types';
import {AudioModule} from '../../../modules/audio/audio.module';
import {ImageModule} from '../../../modules/image/image.module';
import {generateArtworkId} from '../../../utils/artwork-id';
import {deepCompare} from '../../../utils/deep-compare';
import {basenameStripExt, ensureTrailingPathSeparator} from '../../../utils/fs-utils';
import {artWorkImageNameToType} from '../../folder/folder.format';
import {Artwork, Folder, FolderTag} from '../../folder/folder.model';
import {Store} from '../../store/store';
import {Track, TrackTag} from '../../track/track.model';
import {Changes} from '../changes/changes';
import {MatchDirMetaStats, MetaStat} from '../match-dir/match-dir.meta-stats';
import {MatchDir, MatchFile} from '../match-dir/match-dir.types';

export class MatchDirMerge {

	constructor(
		private audioModule: AudioModule, private imageModule: ImageModule,
		private store: Store, private settings: Jam.AdminSettingsLibrary, private strategy: RootScanStrategy
	) {
	}

	private static findMultiAlbumFolderType(dir: MatchDir): FolderType {
		const a = dir.directories.find(d => {
			return (!!d.tag && d.tag.type === FolderType.artist);
		});
		return a ? FolderType.collection : FolderType.multialbum;
	}

	private static isExtraFolder(dir: MatchDir): boolean {
		// TODO: generalise extra folder detection (an admin setting?)
		const name = path.basename(dir.name).toLowerCase();
		return !!name.match(/(\[(extra|various)]|^(extra|various)$)/);
	}

	private static splitDirectoryName(name: string): { title: string; year?: number; } {
		const result: { title: string; year?: number; } = {title: path.basename(name).trim()};
		// year title | year - title | (year) title | [year] title
		const parts = result.title.split(' ');
		const s = parts[0].replace(/[^\w\s]/gi, '');
		if (s.length === 4) {
			const y = Number(s);
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

	private static buildDefaultTag(dir: MatchDir): FolderTag {
		return {
			level: dir.level,
			type: FolderType.unknown,
			trackCount: dir.files.filter(t => t.type === FileTyp.AUDIO).length,
			folderCount: dir.directories.length
		};
	}

	private static buildFolder(dir: MatchDir): Folder {
		return {
			id: '',
			rootID: dir.rootID,
			path: ensureTrailingPathSeparator(dir.name),
			parentID: (dir.parent && dir.parent.folder ? dir.parent.folder.id : undefined),
			stat: {
				created: dir.stat.ctime,
				modified: dir.stat.mtime
			},
			tag: dir.tag || MatchDirMerge.buildDefaultTag(dir),
			type: DBObjectType.folder
		};
	}

	private static trackHasChanged(file: MatchFile): boolean {
		return (!file.track) ||
			(file.stat.mtime !== file.track.stat.modified) ||
			(file.stat.ctime !== file.track.stat.created) ||
			(file.stat.size !== file.track.stat.size);
	}

	private static folderHasChanged(dir: MatchDir): boolean {
		return (!dir.folder) ||
			(dir.stat.mtime !== dir.folder.stat.modified) ||
			(dir.stat.ctime !== dir.folder.stat.created) ||
			(!deepCompare(dir.folder.tag, dir.tag));
	}

	private static async mergeRecursive(dir: MatchDir, changes: Changes): Promise<void> {
		if (dir.folder) {
			if (MatchDirMerge.folderHasChanged(dir)) {
				const folder = MatchDirMerge.buildFolder(dir);
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
				await MatchDirMerge.mergeRecursive(d, changes);
			}
		} else {
			return Promise.reject(Error(`db entry must exists to compare ${dir.name}`));
		}
	}

	private static markMultiAlbumChildDirs(dir: MatchDir): void {
		if (dir.tag && dir.tag.type !== FolderType.extras) {
			MatchDirMerge.setTagType(dir.tag, FolderType.multialbum);
		}
		dir.directories.forEach(d => {
			if (dir.tag && d.tag && d.tag.type !== FolderType.extras) {
				// parent multialbum gets same album type as child multialbum folder
				dir.tag.albumType = d.tag.albumType;
			}
			MatchDirMerge.markMultiAlbumChildDirs(d);
		});
	}

	private static setTagType(tag: FolderTag, type: FolderType): void {
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
				break;
			case FolderType.artist:
				tag.albumType = undefined;
				tag.genre = undefined;
				tag.mbAlbumID = undefined;
				tag.mbAlbumType = undefined;
				tag.mbReleaseGroupID = undefined;
				tag.album = undefined;
				tag.year = undefined;
				break;
			default:
		}
	}

	private static markArtistChildDirs(dir: MatchDir): void {
		if (dir.tag && dir.tag.type === FolderType.artist) {
			MatchDirMerge.setTagType(dir.tag, FolderType.collection);
		}
		dir.directories.forEach(d => {
			MatchDirMerge.markArtistChildDirs(d);
		});
	}

	private static findFolderType(dir: MatchDir, metaStat: MetaStat, strategy: RootScanStrategy): FolderType {
		if (dir.level === 0) {
			return FolderType.collection;
		}
		if (MatchDirMerge.isExtraFolder(dir)) {
			return FolderType.extras;
		}
		if (metaStat.trackCount > 0) {
			const dirCount = dir.directories.filter(d => !!d.tag && d.tag.type !== FolderType.extras).length;
			return (dirCount === 0) ? FolderType.album : MatchDirMerge.findMultiAlbumFolderType(dir);
		}
		if (dir.directories.length === 0) {
			return (dir.files.filter(f => f.type === FileTyp.AUDIO).length === 0) ? FolderType.extras : FolderType.album;
		}
		if (metaStat.hasMultipleAlbums) {
			return (metaStat.hasMultipleArtists || strategy === RootScanStrategy.compilation) ? FolderType.collection : FolderType.artist;
		}
		if (dir.directories.length === 1) {
			return (strategy === RootScanStrategy.compilation) ? FolderType.collection : FolderType.artist;
		}
		if (!metaStat.hasMultipleArtists && dir.directories.filter(d => d.tag && d.tag.type === FolderType.artist).length > 0) {
			return FolderType.artist;
		}
		return MatchDirMerge.findMultiAlbumFolderType(dir);
	}

	private static applyFolderTagType(dir: MatchDir, strategy: RootScanStrategy): void {
		if (!dir.tag || !dir.metaStat) {
			return;
		}
		const result = MatchDirMerge.findFolderType(dir, dir.metaStat, strategy);
		MatchDirMerge.setTagType(dir.tag, result);
		if (result === FolderType.multialbum) {
			MatchDirMerge.markMultiAlbumChildDirs(dir);
		} else if (result === FolderType.artist) {
			for (const sub of dir.directories) {
				MatchDirMerge.markArtistChildDirs(sub);
			}
		}
	}

	private async buildTrack(file: MatchFile, parent: Folder): Promise<Track> {
		const data = await this.audioModule.read(file.name);
		const tag: TrackTag = data.tag || {format: TrackTagFormatType.none};
		tag.title = tag.title || basenameStripExt(file.name);
		return {
			id: '',
			rootID: file.rootID,
			albumID: '',
			artistID: '',
			albumArtistID: '',
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

	private async buildFolderTag(dir: MatchDir): Promise<FolderTag> {
		const metaStat = dir.metaStat;
		if (!metaStat) {
			throw Error('internal error, metastat must exist');
		}
		const nameSplit = MatchDirMerge.splitDirectoryName(dir.name);
		return {
			trackCount: metaStat.trackCount,
			folderCount: dir.directories.length,
			level: dir.level,
			type: FolderType.unknown,
			album: metaStat.album,
			albumType: metaStat.albumType,
			albumTrackCount: (metaStat.subFolderTrackCount || 0) + metaStat.trackCount,
			artist: metaStat.artist,
			artistSort: metaStat.artistSort,
			title: nameSplit.title,
			artworks: await this.buildFolderArtworks(dir),
			genre: metaStat.genre,
			mbAlbumID: metaStat.mbAlbumID,
			mbReleaseGroupID: metaStat.mbReleaseGroupID,
			mbAlbumType: metaStat.mbAlbumType,
			mbArtistID: metaStat.mbArtistID,
			year: (nameSplit.year !== undefined && nameSplit.year > 0) ? nameSplit.year : metaStat.year
		};
	}

	private async buildFolderArtwork(file: MatchFile, folderID: string): Promise<Artwork> {
		const name = path.basename(file.name);
		return {
			id: generateArtworkId(folderID, name, file.stat.size),
			name,
			types: artWorkImageNameToType(name),
			image: await this.imageModule.getImageInfo(file.name),
			stat: {created: file.stat.ctime, modified: file.stat.mtime, size: file.stat.size}
		};
	}

	private async buildFolderArtworks(dir: MatchDir): Promise<Array<Artwork>> {
		if (!dir.folder) {
			return [];
		}
		const files = dir.files.filter(file => file.type === FileTyp.IMAGE);
		const result: Array<Artwork> = [];
		const oldArtworks = dir.folder && dir.folder.tag && dir.folder.tag.artworks ? dir.folder.tag.artworks : [];
		for (const file of files) {
			const name = path.basename(file.name);
			const oldArtwork = oldArtworks.find(o => o.name === name);
			if (oldArtwork && oldArtwork.stat.modified === file.stat.mtime) {
				result.push(oldArtwork);
			} else {
				result.push(await this.buildFolderArtwork(file, dir.folder.id));
			}
		}
		return result;
	}

	private async buildMergeTrack(file: MatchFile, folder: Folder, changes: Changes): Promise<void> {
		if (!file.track) {
			file.track = await this.buildTrack(file, folder);
			file.track.id = await this.store.trackStore.getNewId();
			changes.newTracks.push(file.track);
		} else if (MatchDirMerge.trackHasChanged(file)) {
			const oldTrack = file.track;
			file.track = await this.buildTrack(file, folder);
			file.track.id = oldTrack.id;
			changes.updateTracks.push({track: file.track, oldTrack});
		}
	}

	private async buildMerge(dir: MatchDir, changes: Changes): Promise<void> {
		if (!dir.folder) {
			dir.folder = MatchDirMerge.buildFolder(dir);
			dir.folder.id = await this.store.trackStore.getNewId();
			changes.newFolders.push(dir.folder);
		}
		for (const sub of dir.directories) {
			await this.buildMerge(sub, changes);
		}
		for (const file of dir.files) {
			if (file.type === FileTyp.AUDIO && dir.folder) {
				await this.buildMergeTrack(file, dir.folder, changes);
			}
		}
	}

	private async buildMergeTags(dir: MatchDir, rebuildTag: (dir: MatchDir) => boolean): Promise<void> {
		for (const sub of dir.directories) {
			await this.buildMergeTags(sub, rebuildTag);
		}
		if (dir.folder && rebuildTag(dir)) {
			dir.metaStat = MatchDirMetaStats.buildMetaStat(dir, this.settings, this.strategy);
			dir.tag = await this.buildFolderTag(dir);
		}
		MatchDirMerge.applyFolderTagType(dir, this.strategy);
	}

	async merge(dir: MatchDir, rootID: string, rebuildTag: (dir: MatchDir) => boolean, changes: Changes): Promise<void> {
		await this.buildMerge(dir, changes);
		await this.buildMergeTags(dir, rebuildTag);
		await MatchDirMerge.mergeRecursive(dir, changes);
	}

}
