import { logger } from '../../../utils/logger.js';
import { ScanDir, ScanFile } from '../../../utils/scan-dir.js';
import { Folder } from '../../../entity/folder/folder.js';
import { Root } from '../../../entity/root/root.js';
import { Changes } from './changes.js';
import { FileTyp, FolderType } from '../../../types/enums.js';
import { splitDirectoryName } from '../../../utils/dir-name.js';
import { Track } from '../../../entity/track/track.js';
import path from 'path';
import { basenameStripExt, ensureTrailingPathSeparator } from '../../../utils/fs-utils.js';
import { AudioModule } from '../../audio/audio.module.js';
import { Orm } from '../services/orm.service.js';
import { Artwork } from '../../../entity/artwork/artwork.js';
import { artWorkImageNameToType } from '../../../utils/artwork-type.js';
import { ImageModule } from '../../image/image.module.js';
import moment from 'moment';
import { TrackUpdater } from './tasks/track.js';

const log = logger('IO.Scan');

export interface MatchTrack {
	artist?: string;
	artistSort?: string;
	album?: string;
	year?: number;
	trackTotal?: number;
	discTotal?: number;
	disc?: number;
	track?: number;
	series?: string;
	mbAlbumType?: string;
	mbArtistID?: string;
	mbReleaseID?: string;
	mbReleaseGroupID?: string;
	genres?: Array<string>;
}

export abstract class OnDemandTrackMatch {
	abstract get(): Promise<MatchTrack>;
}

export class ObjTrackMatch {
	constructor(private readonly match: MatchTrack) {
	}

	async get(): Promise<MatchTrack> {
		return this.match;
	}
}

export class ObjLoadTrackMatch {
	constructor(private readonly track: Track) {
	}

	async get(): Promise<MatchTrack> {
		return WorkerScan.buildTrackMatch(this.track);
	}
}

export interface MatchNode {
	scan: ScanDir;
	folder: Folder;
	children: Array<MatchNode>;
	tracks: Array<OnDemandTrackMatch>;
	artworksCount: number;
	changed: boolean;
}

export class WorkerScan {
	root!: Root;
	trackUpdater: TrackUpdater;

	constructor(
		private readonly orm: Orm,
		private readonly rootID: string,
		audioModule: AudioModule,
		private readonly imageModule: ImageModule,
		private readonly changes: Changes
	) {
		this.trackUpdater = new TrackUpdater(orm, audioModule, changes);
	}

	private async setArtworkValues(file: ScanFile, artwork: Artwork): Promise<void> {
		const name = path.basename(file.path);
		const info = await this.imageModule.getImageInfo(file.path);
		artwork.types = artWorkImageNameToType(name);
		artwork.format = info?.format;
		artwork.height = info?.height;
		artwork.width = info?.width;
		artwork.statCreated = file.ctime;
		artwork.statModified = file.mtime;
		artwork.fileSize = file.size;
		this.orm.Artwork.persistLater(artwork);
	}

	private async buildArtwork(file: ScanFile, folder: Folder): Promise<Artwork> {
		log.info('New Artwork', file.path);
		const name = path.basename(file.path);
		const artwork = this.orm.Artwork.create({ name, path: folder.path });
		await artwork.folder.set(folder);
		await this.setArtworkValues(file, artwork);
		this.changes.artworks.added.add(artwork);
		return artwork;
	}

	private async updateArtwork(file: ScanFile, artwork: Artwork) {
		log.info('Artwork has changed', file.path);
		await this.setArtworkValues(file, artwork);
		this.changes.artworks.updated.add(artwork);
	}

	static async buildTrackMatch(track: Track): Promise<MatchTrack> {
		const tag = await track.tag.get();
		return {
			artist: tag?.albumArtist || tag?.artist,
			artistSort: tag?.albumArtistSort || tag?.artistSort,
			genres: tag?.genres,
			album: tag?.album,
			series: tag?.series,
			year: tag?.year,
			trackTotal: tag?.trackTotal,
			discTotal: tag?.discTotal,
			disc: tag?.disc,
			track: tag?.trackNr,
			mbArtistID: tag?.mbArtistID,
			mbReleaseID: tag?.mbReleaseID,
			mbAlbumType: `${tag?.mbAlbumType || ''}/${tag?.mbAlbumStatus || ''}`
		};
	}

	private async setTrackValues(file: ScanFile, track: Track): Promise<MatchTrack> {
		track.fileSize = file.size;
		track.statCreated = file.ctime;
		track.statModified = file.mtime;
		await this.trackUpdater.updateTrackValues(track, file.path);
		this.orm.Track.persistLater(track);
		return WorkerScan.buildTrackMatch(track);
	}

	private async buildTrack(file: ScanFile, parent: Folder): Promise<MatchTrack> {
		log.info('New Track', file.path);
		const track = this.orm.Track.create({
			name: basenameStripExt(file.path),
			fileName: path.basename(file.path),
			path: ensureTrailingPathSeparator(path.dirname(file.path))
		});
		await track.folder.set(parent);
		await track.root.set(this.root);
		this.changes.tracks.added.add(track);
		return await this.setTrackValues(file, track);
	}

	private async updateTrack(file: ScanFile, track: Track): Promise<MatchTrack | undefined> {
		if (!this.changes.tracks.removed.has(track)) {
			log.info('Updating Track', file.path);
			this.changes.tracks.updated.add(track);
		}
		if (this.changes.tracks.updated.has(track)) {
			return await this.setTrackValues(file, track);
		}
		return;
	}

	private async buildFolder(dir: ScanDir, parent?: Folder): Promise<Folder> {
		log.info('New Folder', dir.path);
		const { title, year } = splitDirectoryName(dir.path);
		const name = path.basename(dir.path);
		const folder = this.orm.Folder.create({
			level: dir.level,
			path: dir.path,
			name,
			title: name !== title ? title : undefined,
			year,
			folderType: FolderType.unknown,
			statCreated: dir.ctime,
			statModified: dir.mtime
		});
		await folder.root.set(this.root);
		if (parent) {
			await folder.parent.set(parent);
		}
		this.orm.Folder.persistLater(folder);
		return folder;
	}

	private static createNode(dir: ScanDir, folder: Folder): MatchNode {
		return {
			scan: dir,
			folder,
			children: [],
			tracks: [],
			artworksCount: 0,
			changed: false
		};
	}

	private async buildNode(dir: ScanDir, parent?: Folder): Promise<MatchNode> {
		const folder = await this.buildFolder(dir, parent);
		this.changes.folders.added.add(folder);
		const result = WorkerScan.createNode(dir, folder);
		result.changed = true;
		for (const subDir of dir.directories) {
			result.children.push(await this.buildNode(subDir, folder));
		}
		for (const file of dir.files) {
			if (file.type === FileTyp.audio) {
				result.tracks.push(new ObjTrackMatch(await this.buildTrack(file, folder)));
			} else if (file.type === FileTyp.image) {
				result.artworksCount += 1;
				await this.buildArtwork(file, folder);
			}
		}
		await this.flushIfEnough();
		return result;
	}

	private async flushIfEnough(): Promise<void> {
		if (this.orm.em.changesCount() > 1000) {
			log.debug('Syncing Track/Artwork Changes to DB');
			await this.orm.em.flush();
		}
	}

	private async removeFolder(folder: Folder): Promise<void> {
		const removedTracks = await this.orm.Track.findFilter({ childOfID: folder.id });
		const removedFolders = await this.orm.Folder.findFilter({ childOfID: folder.id });
		const removedArtworks = await this.orm.Artwork.findFilter({ childOfID: folder.id });
		removedFolders.push(folder);
		this.changes.folders.removed.append(removedFolders);
		this.changes.artworks.removed.append(removedArtworks);
		this.changes.tracks.removed.append(removedTracks);
	}

	private async scanNode(dir: ScanDir, folder: Folder): Promise<MatchNode> {
		log.debug('Matching:', dir.path);
		const result = WorkerScan.createNode(dir, folder);
		await this.scanSubfolders(folder, dir, result);
		await this.scanTracks(dir, folder, result);
		await this.scanArtworks(dir, folder, result);
		await this.flushIfEnough();
		return result;
	}

	private async scanSubfolders(folder: Folder, dir: ScanDir, result: MatchNode) {
		const folders = await folder.children.getItems();
		for (const subDir of dir.directories) {
			if (subDir.path !== folder.path) {
				const subFolder = folders.find(f => f.path === subDir.path);
				result.children.push(!subFolder ? await this.buildNode(subDir, folder) : await this.scanNode(subDir, subFolder));
			}
		}
		for (const child of folders) {
			const subf = result.children.find(f => f.scan.path === child.path);
			if (!subf) {
				await this.removeFolder(child);
				this.changes.folders.updated.add(folder);
			}
		}
	}

	private async scanArtworks(dir: ScanDir, folder: Folder, result: MatchNode) {
		const scanArtworks = dir.files.filter(f => f.type === FileTyp.image);
		const foundScanArtworks: Array<ScanFile> = [];
		const artworks = await folder.artworks.getItems();
		for (const artwork of artworks) {
			await this.scanArtwork(artwork, scanArtworks, foundScanArtworks, result);
		}
		const newArtworks = scanArtworks.filter(t => !foundScanArtworks.includes(t));
		for (const newArtwork of newArtworks) {
			result.changed = true;
			result.artworksCount += 1;
			await this.buildArtwork(newArtwork, folder);
		}
	}

	private async scanArtwork(artwork: Artwork, scanArtworks: ScanFile[], foundScanArtworks: Array<ScanFile>, result: MatchNode): Promise<void> {
		const filename = path.join(artwork.path, artwork.name);
		const scanArtwork = scanArtworks.find(t => t.path == filename);
		if (!scanArtwork) {
			log.info('Artwork has been removed', filename);
			result.changed = true;
			this.changes.artworks.removed.add(artwork);
			return;
		}
		foundScanArtworks.push(scanArtwork);
		result.artworksCount += 1;
		if (
			scanArtwork.size !== artwork.fileSize ||
			!moment(scanArtwork.ctime).isSame(artwork.statCreated) ||
			!moment(scanArtwork.mtime).isSame(artwork.statModified)
		) {
			result.changed = true;
			await this.updateArtwork(scanArtwork, artwork);
		}
	}

	private async scanTracks(dir: ScanDir, folder: Folder, result: MatchNode) {
		const scanTracks = dir.files.filter(f => f.type === FileTyp.audio);
		const foundScanTracks: Array<ScanFile> = [];
		const tracks = await folder.tracks.getItems();
		for (const track of tracks) {
			await this.scanTrack(track, scanTracks, foundScanTracks, result);
		}
		const newTracks = scanTracks.filter(t => !foundScanTracks.includes(t));
		for (const newTrack of newTracks) {
			result.changed = true;
			result.tracks.push(new ObjTrackMatch(await this.buildTrack(newTrack, folder)));
		}
	}

	private async scanTrack(track: Track, scanTracks: ScanFile[], foundScanTracks: Array<ScanFile>, result: MatchNode) {
		const filename = path.join(track.path, track.fileName);
		const scanTrack = scanTracks.find(t => t.path == filename);
		if (!scanTrack) {
			log.info('Track has been removed', filename);
			result.changed = true;
			this.changes.tracks.removed.add(track);
			return;
		}
		foundScanTracks.push(scanTrack);
		if (this.changes.tracks.updated.has(track) ||
			scanTrack.size !== track.fileSize ||
			!moment(scanTrack.ctime).isSame(track.statCreated) ||
			!moment(scanTrack.mtime).isSame(track.statModified)
		) {
			const t = await this.updateTrack(scanTrack, track);
			if (t) {
				result.tracks.push(new ObjTrackMatch(t));
			}
			result.changed = true;
		} else {
			result.tracks.push(new ObjLoadTrackMatch(track));
		}
	}

	async match(dir: ScanDir): Promise<MatchNode> {
		this.root = await this.orm.Root.oneOrFailByID(this.rootID);
		const parent = await this.orm.Folder.findOne({ where: { path: dir.path } });
		if (!parent) {
			const oldParent = await this.orm.Folder.findOneFilter({ rootIDs: [this.root.id], level: 0 });
			if (oldParent) {
				await this.removeFolder(oldParent);
			}
		}
		const rootMatch: MatchNode = !parent ? await this.buildNode(dir) : await this.scanNode(dir, parent);
		if (this.orm.em.hasChanges()) {
			log.debug('Syncing Track/Artwork Changes to DB');
			await this.orm.em.flush();
		}
		return rootMatch;
	}
}
