import path from 'path';
import {DBObjectType} from '../../db/db.types';
import {Jam} from '../../model/jam-rest-data';
import {ArtworkImageType, FileTyp, FolderType, RootScanStrategy, TrackTagFormatType} from '../../model/jam-types';
import {AudioModule} from '../../modules/audio/audio.module';
import {ensureTrailingPathSeparator} from '../../utils/fs-utils';
import Logger from '../../utils/logger';
import {artWorkImageNameToType} from '../folder/folder.format';
import {Artwork, Folder, FolderTag} from '../folder/folder.model';
import {Store} from '../store/store';
import {Track, TrackTag} from '../track/track.model';
import {MergeChanges} from './scan.changes';
import {MatchDir, MatchFile} from './scan.match-dir';
import {buildMetaStat} from './scan.metastats';
import {folderHasChanged, generateArtworkId, splitDirectoryName, trackHasChanged} from './scan.utils';

const log = Logger('IO.Merge');

export class ScanMerger {

	constructor(private  audioModule: AudioModule, private store: Store, private settings: Jam.AdminSettingsLibrary, private strategy: RootScanStrategy) {
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
					changes.newTracks.push(track);
				} else if (trackHasChanged(file)) {
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

	private buildFolderTag(dir: MatchDir): FolderTag {
		const metaStat = dir.metaStat;
		if (!metaStat) {
			throw Error('internal error, metastat must exist');
		}
		const nameSplit = splitDirectoryName(dir.name);
		const images = this.collectFolderImages(dir);
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
		}
	}

	private collectFolderImages(dir: MatchDir): Array<Artwork> {
		if (!dir.folder) {
			log.error('folder obj must exist at this point');
			return [];
		}
		const folderID = dir.folder.id;
		return dir.files.filter(file => file.type === FileTyp.IMAGE).map(file => {
			const name = path.basename(file.name);
			const types: Array<ArtworkImageType> = artWorkImageNameToType(name);
			const id = generateArtworkId(folderID, name);
			return {id, name, types, stat: {created: file.stat.ctime, modified: file.stat.mtime, size: file.stat.size}};
		});
	}

	private applyFolderTagType(dir: MatchDir): void {
		if (!dir.tag || !dir.metaStat) {
			return;
		}
		const metaStat = dir.metaStat;
		const name = path.basename(dir.name).toLowerCase();
		let result: FolderType = FolderType.unknown;
		if (dir.level === 0) {
			result = FolderType.collection;
		} else if (name.match(/\[(extra|various)]/) || name.match(/^(extra|various)$/)) {
			// TODO: generalise extra folder detection
			result = FolderType.extras;
		} else if (metaStat.trackCount > 0) {
			const dirCount = dir.directories.filter(d => !!d.tag && d.tag.type !== FolderType.extras).length;
			result = (dirCount === 0) ? FolderType.album : FolderType.multialbum;
		} else if (dir.directories.length > 0) {
			if (metaStat.hasMultipleAlbums) {
				if (metaStat.hasMultipleArtists) {
					result = FolderType.collection;
				} else if (this.strategy === RootScanStrategy.compilation) {
					result = FolderType.collection;
				} else {
					result = FolderType.artist;
				}
			} else if (dir.directories.length === 1) {
				result = (this.strategy === RootScanStrategy.compilation) ? FolderType.collection : FolderType.artist;
			} else if (!metaStat.hasMultipleArtists && dir.directories.filter(d => d.tag && d.tag.type === FolderType.artist).length > 0) {
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

	private async buildMergeTags(dir: MatchDir, rebuildTag: (dir: MatchDir) => boolean): Promise<void> {
		for (const sub of dir.directories) {
			await this.buildMergeTags(sub, rebuildTag);
		}
		if (dir.folder && rebuildTag(dir)) {
			dir.metaStat = buildMetaStat(dir, this.settings, this.strategy);
			dir.tag = this.buildFolderTag(dir);
		}
		this.applyFolderTagType(dir);
	}

	async merge(dir: MatchDir, rootID: string, rebuildTag: (dir: MatchDir) => boolean, changes: MergeChanges): Promise<void> {
		log.info('Merging:', dir.name);
		await this.buildMerge(dir, changes);
		await this.buildMergeTags(dir, rebuildTag);
		await this.mergeR(dir, changes);
	}

}
