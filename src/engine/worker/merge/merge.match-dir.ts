import path from 'path';
import {DBObjectType} from '../../../db/db.types';
import {Jam} from '../../../model/jam-rest-data';
import {FileTyp, FolderType, RootScanStrategy, TrackTagFormatType} from '../../../model/jam-types';
import {AudioModule} from '../../../modules/audio/audio.module';
import {ImageModule} from '../../../modules/image/image.module';
import {generateArtworkId} from '../../../utils/artwork-id';
import {deepCompare} from '../../../utils/deep-compare';
import {ensureTrailingPathSeparator} from '../../../utils/fs-utils';
import {artWorkImageNameToType} from '../../folder/folder.format';
import {Artwork, Folder, FolderTag} from '../../folder/folder.model';
import {Store} from '../../store/store';
import {Track, TrackTag} from '../../track/track.model';
import {Changes} from '../changes/changes';
import {buildMetaStat, MetaStat} from '../match-dir/match-dir.meta-stats';
import {MatchDir, MatchFile} from '../match-dir/match-dir.types';

export class MatchDirMerge {

	constructor(
		private audioModule: AudioModule, private imageModule: ImageModule,
		private store: Store, private settings: Jam.AdminSettingsLibrary, private strategy: RootScanStrategy
	) {
	}

	private splitDirectoryName(name: string): { title: string; year?: number; } {
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

	private buildDefaultTag(dir: MatchDir): FolderTag {
		return {
			level: dir.level,
			type: FolderType.unknown,
			trackCount: dir.files.filter(t => t.type === FileTyp.AUDIO).length,
			folderCount: dir.directories.length
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

	private trackHasChanged(file: MatchFile): boolean {
		return (!file.track) ||
			(file.stat.mtime !== file.track.stat.modified) ||
			(file.stat.ctime !== file.track.stat.created) ||
			(file.stat.size !== file.track.stat.size);
	}

	private async buildMerge(dir: MatchDir, changes: Changes): Promise<void> {
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
					changes.newTracks.push(track);
				} else if (this.trackHasChanged(file)) {
					const old = file.track;
					if (!old) {
						return;
					}
					const track = await this.buildTrack(file, dir.folder);
					track.id = old.id;
					file.track = track;
					changes.updateTracks.push({track, oldTrack: old});
				}
			}
		}
	}

	private async buildTrack(file: MatchFile, parent: Folder): Promise<Track> {
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

	private folderHasChanged(dir: MatchDir): boolean {
		return (!dir.folder) ||
			(dir.stat.mtime !== dir.folder.stat.modified) ||
			(dir.stat.ctime !== dir.folder.stat.created) ||
			(!deepCompare(dir.folder.tag, dir.tag));
	}

	private async mergeR(dir: MatchDir, changes: Changes): Promise<void> {
		if (dir.folder) {
			if (this.folderHasChanged(dir)) {
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
			return Promise.reject(Error(`db entry must exists to compare ${dir.name}`));
		}
	}

	private async buildFolderTag(dir: MatchDir): Promise<FolderTag> {
		const metaStat = dir.metaStat;
		if (!metaStat) {
			throw Error('internal error, metastat must exist');
		}
		const nameSplit = this.splitDirectoryName(dir.name);
		const images = await this.collectFolderArtworks(dir);
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
			artworks: images,
			genre: metaStat.genre,
			mbAlbumID: metaStat.mbAlbumID,
			mbReleaseGroupID: metaStat.mbReleaseGroupID,
			mbAlbumType: metaStat.mbAlbumType,
			mbArtistID: metaStat.mbArtistID,
			year: (nameSplit.year !== undefined && nameSplit.year > 0) ? nameSplit.year : metaStat.year
		};
	}

	private markMultiAlbumChilds(dir: MatchDir): void {
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

	private markArtistChilds(dir: MatchDir): void {
		if (dir.tag && dir.tag.type === FolderType.artist) {
			this.setTagType(dir.tag, FolderType.collection);
		}
		dir.directories.forEach(d => {
			this.markArtistChilds(d);
		});
	}

	private setTagType(tag: FolderTag, type: FolderType): void {
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

	private async collectFolderArtworks(dir: MatchDir): Promise<Array<Artwork>> {
		if (!dir.folder) {
			// log.error('folder obj must exist at this point');
			return [];
		}
		const folderID = dir.folder.id;
		const files = dir.files.filter(file => file.type === FileTyp.IMAGE);
		const result: Array<Artwork> = [];
		const oldArtworks = dir.folder && dir.folder.tag && dir.folder.tag.artworks ? dir.folder.tag.artworks : [];
		for (const file of files) {
			const name = path.basename(file.name);
			const id = generateArtworkId(folderID, name, file.stat.size);
			const oldArtwork = oldArtworks.find(o => o.name === name);
			if (!oldArtwork || oldArtwork.stat.modified !== file.stat.mtime) {
				result.push({
					id,
					name,
					types: artWorkImageNameToType(name),
					image: await this.imageModule.getImageInfo(file.name),
					stat: {created: file.stat.ctime, modified: file.stat.mtime, size: file.stat.size}
				});
			} else {
				result.push(oldArtwork);
			}
		}
		return result;
	}

	private applyFolderTagType(dir: MatchDir): void {
		if (!dir.tag || !dir.metaStat) {
			return;
		}
		const result = this.findFolderType(dir, dir.metaStat);
		this.setTagType(dir.tag, result);
		if (result === FolderType.multialbum) {
			this.markMultiAlbumChilds(dir);
		} else if (result === FolderType.artist) {
			for (const sub of dir.directories) {
				this.markArtistChilds(sub);
			}
		}
	}

	private findMultiAlbumFolderType(dir: MatchDir, metaStat: MetaStat): FolderType {
		let result: FolderType = FolderType.multialbum;
		const a = dir.directories.find(d => {
			return (!!d.tag && d.tag.type === FolderType.artist);
		});
		if (a) {
			result = FolderType.collection;
		}
		return result;
	}

	private findFolderType(dir: MatchDir, metaStat: MetaStat): FolderType {
		const name = path.basename(dir.name).toLowerCase();
		if (dir.level === 0) {
			return FolderType.collection;
		}
		if (name.match(/\[(extra|various)]/) || name.match(/^(extra|various)$/)) {
			// TODO: generalise extra folder detection
			return FolderType.extras;
		}
		if (metaStat.trackCount > 0) {
			const dirCount = dir.directories.filter(d => !!d.tag && d.tag.type !== FolderType.extras).length;
			return (dirCount === 0) ? FolderType.album : this.findMultiAlbumFolderType(dir, metaStat);
		}
		if (dir.directories.length > 0) {
			if (metaStat.hasMultipleAlbums) {
				return (metaStat.hasMultipleArtists || this.strategy === RootScanStrategy.compilation) ? FolderType.collection : FolderType.artist;
			}
			if (dir.directories.length === 1) {
				return (this.strategy === RootScanStrategy.compilation) ? FolderType.collection : FolderType.artist;
			}
			if (!metaStat.hasMultipleArtists && dir.directories.filter(d => d.tag && d.tag.type === FolderType.artist).length > 0) {
				return FolderType.artist;
			}
			return this.findMultiAlbumFolderType(dir, metaStat);
		}
		return (dir.directories.length === 0 && dir.files.filter(f => f.type === FileTyp.AUDIO).length === 0) ? FolderType.extras : FolderType.album;
	}

	private async buildMergeTags(dir: MatchDir, rebuildTag: (dir: MatchDir) => boolean): Promise<void> {
		for (const sub of dir.directories) {
			await this.buildMergeTags(sub, rebuildTag);
		}
		if (dir.folder && rebuildTag(dir)) {
			dir.metaStat = buildMetaStat(dir, this.settings, this.strategy);
			dir.tag = await this.buildFolderTag(dir);
		}
		this.applyFolderTagType(dir);
	}

	async merge(dir: MatchDir, rootID: string, rebuildTag: (dir: MatchDir) => boolean, changes: Changes): Promise<void> {
		await this.buildMerge(dir, changes);
		await this.buildMergeTags(dir, rebuildTag);
		await this.mergeR(dir, changes);
	}

}
