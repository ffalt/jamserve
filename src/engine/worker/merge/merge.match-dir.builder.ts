import path from 'path';
import {DBObjectType} from '../../../db/db.types';
import {Jam} from '../../../model/jam-rest-data';
import {FileTyp, FolderType, RootScanStrategy, TrackTagFormatType} from '../../../model/jam-types';
import {AudioModule} from '../../../modules/audio/audio.module';
import {ImageModule} from '../../../modules/image/image.module';
import {generateArtworkId} from '../../../utils/artwork-id';
import {basenameStripExt, ensureTrailingPathSeparator} from '../../../utils/fs-utils';
import {artWorkImageNameToType} from '../../folder/folder.format';
import {Artwork, Folder, FolderTag} from '../../folder/folder.model';
import {Store} from '../../store/store';
import {Track, TrackTag} from '../../track/track.model';
import {Changes} from '../changes/changes';
import {MatchDirMetaStats, MetaStat} from '../match-dir/match-dir.meta-stats';
import {MatchDir, MatchFile} from '../match-dir/match-dir.types';

export interface MergeMatchDir extends MatchDir {
	folder: Folder;
	directories: Array<MergeMatchDir>;
	metaStat: MetaStat;
}

export class MatchDirMergeBuilder {

	constructor(private audioModule: AudioModule, private store: Store) {
	}

	private static trackHasChanged(file: MatchFile): boolean {
		return (!file.track) ||
			(file.stat.mtime !== file.track.stat.modified) ||
			(file.stat.ctime !== file.track.stat.created) ||
			(file.stat.size !== file.track.stat.size);
	}

	private static buildDefaultTag(dir: MatchDir): FolderTag {
		return {
			level: dir.level,
			type: FolderType.unknown,
			trackCount: dir.files.filter(t => t.type === FileTyp.AUDIO).length,
			folderCount: dir.directories.length
		};
	}

	static buildFolder(dir: MatchDir): Folder {
		return {
			id: '',
			rootID: dir.rootID,
			path: ensureTrailingPathSeparator(dir.name),
			parentID: (dir.parent && dir.parent.folder ? dir.parent.folder.id : undefined),
			stat: {
				created: dir.stat.ctime,
				modified: dir.stat.mtime
			},
			tag: dir.tag || MatchDirMergeBuilder.buildDefaultTag(dir),
			type: DBObjectType.folder
		};
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

	private async buildMergeTrack(file: MatchFile, folder: Folder, changes: Changes, forceTrackMetaRefresh: boolean): Promise<void> {
		if (!file.track) {
			file.track = await this.buildTrack(file, folder);
			file.track.id = await this.store.trackStore.getNewId();
			changes.newTracks.push(file.track);
		} else if (forceTrackMetaRefresh || MatchDirMergeBuilder.trackHasChanged(file)) {
			const oldTrack = file.track;
			file.track = await this.buildTrack(file, folder);
			file.track.id = oldTrack.id;
			changes.updateTracks.push({track: file.track, oldTrack});
		}
	}

	async buildMerge(dir: MatchDir, changes: Changes, forceTrackMetaRefresh: boolean): Promise<MergeMatchDir> {
		if (!dir.folder) {
			dir.folder = MatchDirMergeBuilder.buildFolder(dir);
			dir.folder.id = await this.store.trackStore.getNewId();
			changes.newFolders.push(dir.folder);
		}
		for (const sub of dir.directories) {
			await this.buildMerge(sub, changes, forceTrackMetaRefresh);
		}
		for (const file of dir.files) {
			if (file.type === FileTyp.AUDIO && dir.folder) {
				await this.buildMergeTrack(file, dir.folder, changes, forceTrackMetaRefresh);
			}
		}
		return dir as MergeMatchDir;
	}

}

export class MatchDirMergeTagBuilder {

	constructor(private settings: Jam.AdminSettingsLibrary, private strategy: RootScanStrategy, private imageModule: ImageModule) {
	}

	private static isExtraFolder(dir: MergeMatchDir): boolean {
		// TODO: generalise extra folder detection (an admin setting?)
		const name = path.basename(dir.name).toLowerCase();
		return !!name.match(/(\[(extra|various)]|^(extra|various)$)/);
	}

	private static getFolderType(dir: MergeMatchDir, metaStat: MetaStat, strategy: RootScanStrategy): FolderType {
		if (dir.level === 0) {
			return FolderType.collection;
		}
		if (MatchDirMergeTagBuilder.isExtraFolder(dir)) {
			return FolderType.extras;
		}
		if (metaStat.trackCount > 0) {
			const dirCount = dir.directories.filter(d => !!d.tag && d.tag.type !== FolderType.extras).length;
			return (dirCount === 0) ? FolderType.album : MatchDirMergeTagBuilder.getMultiAlbumFolderType(dir);
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
		return MatchDirMergeTagBuilder.getMultiAlbumFolderType(dir);
	}

	private static getMultiAlbumFolderType(dir: MergeMatchDir): FolderType {
		const a = dir.directories.find(d => {
			return (!!d.tag && d.tag.type === FolderType.artist);
		});
		return a ? FolderType.collection : FolderType.multialbum;
	}

	private static applyFolderTagType(dir: MergeMatchDir, strategy: RootScanStrategy): void {
		if (!dir.tag || !dir.metaStat) {
			return;
		}
		const result = MatchDirMergeTagBuilder.getFolderType(dir, dir.metaStat, strategy);
		MatchDirMergeTagBuilder.setFolderTagType(dir.tag, result);
		if (result === FolderType.multialbum) {
			MatchDirMergeTagBuilder.markMultiAlbumChildDirs(dir);
		} else if (result === FolderType.artist) {
			dir.directories.forEach(MatchDirMergeTagBuilder.markArtistChildDirs);
		}
	}

	private static markMultiAlbumChildDirs(dir: MergeMatchDir): void {
		if (dir.tag && dir.tag.type !== FolderType.extras) {
			MatchDirMergeTagBuilder.setFolderTagType(dir.tag, FolderType.multialbum);
		}
		dir.directories.forEach(d => {
			if (dir.tag && d.tag && d.tag.type !== FolderType.extras) {
				// parent multialbum gets same album type as child multialbum folder
				dir.tag.albumType = d.tag.albumType;
			}
			MatchDirMergeTagBuilder.markMultiAlbumChildDirs(d);
		});
	}

	private static markArtistChildDirs(dir: MergeMatchDir): void {
		if (dir.tag && dir.tag.type === FolderType.artist) {
			MatchDirMergeTagBuilder.setFolderTagType(dir.tag, FolderType.collection);
		}
		dir.directories.forEach(d => {
			MatchDirMergeTagBuilder.markArtistChildDirs(d);
		});
	}

	private static setFolderTagType(tag: FolderTag, type: FolderType): void {
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

	private async buildFolderTag(dir: MergeMatchDir): Promise<FolderTag> {
		const metaStat = dir.metaStat;
		if (!metaStat) {
			throw Error('internal error, metastat must exist');
		}
		const nameSplit = MatchDirMergeTagBuilder.splitDirectoryName(dir.name);
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

	private async buildFolderArtworks(dir: MergeMatchDir): Promise<Array<Artwork>> {
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

	async buildMergeTags(dir: MergeMatchDir, rebuildTag: (dir: MatchDir) => boolean): Promise<void> {
		for (const sub of dir.directories) {
			await this.buildMergeTags(sub, rebuildTag);
		}
		if (rebuildTag(dir)) {
			dir.metaStat = MatchDirMetaStats.buildMetaStat(dir, this.settings, this.strategy);
			dir.tag = await this.buildFolderTag(dir);
		}
		MatchDirMergeTagBuilder.applyFolderTagType(dir, this.strategy);
	}
}
