import {logger} from '../../../utils/logger';
import {ScanDir, ScanFile} from '../../../utils/scan-dir';
import {Folder} from '../../../entity/folder/folder';
import {Root} from '../../../entity/root/root';
import {Changes} from './changes';
import {FileTyp, FolderType} from '../../../types/enums';
import {splitDirectoryName} from '../../../utils/dir-name';
import {Track} from '../../../entity/track/track';
import path from 'path';
import {basenameStripExt, ensureTrailingPathSeparator} from '../../../utils/fs-utils';
import {AudioModule} from '../../audio/audio.module';
import {OrmService} from '../services/orm.service';
import {Artwork} from '../../../entity/artwork/artwork';
import {artWorkImageNameToType} from '../../../utils/artwork-type';
import {ImageModule} from '../../image/image.module';

const log = logger('Worker.Scan');

export interface MatchNode {
	scan: ScanDir;
	folder: Folder;
	children: Array<MatchNode>;
	tracks: Array<Track>;
	artworks: Array<Artwork>;
	changed: boolean;
}

export class WorkerScan {

	constructor(private orm: OrmService, private root: Root, private audioModule: AudioModule, private imageModule: ImageModule, private changes: Changes) {
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
		const artwork = this.orm.Artwork.create({name, path: folder.path, folder});
		await this.setArtworkValues(file, artwork);
		this.changes.artworks.added.add(artwork);
		return artwork;
	}

	private async updateArtwork(file: ScanFile, artwork: Artwork) {
		log.info('Artwork has changed', file.path);
		await this.setArtworkValues(file, artwork);
		this.changes.artworks.updated.add(artwork);
	}

	private async setTrackValues(file: ScanFile, track: Track): Promise<void> {
		const data = await this.audioModule.read(file.path);
		const tag = this.orm.Tag.create(data);
		this.orm.orm.em.persistLater(tag);
		const oldTag = await track.tag;
		if (oldTag) {
			this.orm.orm.em.removeLater(oldTag);
		}
		track.tag = tag;
		track.fileSize = file.size;
		track.statCreated = file.ctime;
		track.statModified = file.mtime;
		this.orm.orm.em.persistLater(track);
	}

	private async buildTrack(file: ScanFile, parent: Folder): Promise<Track> {
		log.info('New Track', file.path);
		const track = this.orm.Track.create({
			name: basenameStripExt(file.path),
			fileName: path.basename(file.path),
			path: ensureTrailingPathSeparator(path.dirname(file.path)),
			folder: parent,
			root: this.root
		});
		await this.setTrackValues(file, track);
		this.changes.tracks.added.add(track);
		return track;
	}

	private async updateTrack(file: ScanFile, track: Track): Promise<void> {
		if (!this.changes.tracks.removed.has(track)) {
			log.info('Track has changed', file.path);
			await this.setTrackValues(file, track);
			this.changes.tracks.updated.add(track);
		}
	}

	private async buildFolder(dir: ScanDir, parent?: Folder): Promise<Folder> {
		log.info('New Folder', dir.path);
		const {title, year} = splitDirectoryName(dir.path);
		const folder = this.orm.Folder.create({
			level: dir.level,
			path: dir.path,
			name: title,
			title,
			year,
			folderType: FolderType.unknown,
			root: this.root,
			parent,
			statCreated: dir.ctime,
			statModified: dir.mtime
		});
		this.orm.orm.em.persistLater(folder);
		return folder;
	}

	private async buildNode(dir: ScanDir, parent?: Folder): Promise<MatchNode> {
		const folder = await this.buildFolder(dir, parent);
		this.changes.folders.added.add(folder);
		const result: MatchNode = {
			scan: dir,
			folder,
			children: [],
			tracks: [],
			artworks: [],
			changed: true
		};
		for (const subDir of dir.directories) {
			result.children.push(await this.buildNode(subDir, folder));
		}
		for (const file of dir.files) {
			if (file.type === FileTyp.audio) {
				result.tracks.push(await this.buildTrack(file, folder));
			} else if (file.type === FileTyp.image) {
				result.artworks.push(await this.buildArtwork(file, folder));
			}
		}
		return result;
	}

	private async removeFolder(folder: Folder): Promise<void> {
		const removedTracks = await this.orm.Track.findFilter({childOfID: folder.id});
		const removedFolders = await this.orm.Folder.findFilter({childOfID: folder.id});
		const removedArtworks = await this.orm.Artwork.findFilter({childOfID: folder.id});
		removedFolders.push(folder);
		this.changes.folders.removed.append(removedFolders);
		this.changes.artworks.removed.append(removedArtworks);
		this.changes.tracks.removed.append(removedTracks);
	}

	private async scanNode(dir: ScanDir, folder: Folder): Promise<MatchNode> {
		log.debug('Matching:', dir.path);
		const result: MatchNode = {
			scan: dir,
			folder,
			children: [],
			tracks: [],
			artworks: [],
			changed: false
		};
		await this.scanSubfolders(folder, dir, result);
		await this.scanTracks(dir, folder, result);
		await this.scanArtworks(dir, folder, result);
		return result;
	}

	private async scanSubfolders(folder: Folder, dir: ScanDir, result: MatchNode) {
		await this.orm.Folder.populate(folder, 'children');
		const folders = folder.children.getItems();
		for (const subDir of dir.directories) {
			if (subDir.path !== folder.path) {
				const subFolder = folders.find(f => f.path === subDir.path);
				if (!subFolder) {
					result.children.push(await this.buildNode(subDir, folder));
				} else {
					result.children.push(await this.scanNode(subDir, subFolder))
				}
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
		await this.orm.Folder.populate(folder, 'artworks');
		const artworks = folder.artworks.getItems();
		for (const artwork of artworks) {
			const filename = path.join(artwork.path, artwork.name);
			const scanArtwork = scanArtworks.find(t => t.path == filename);
			if (scanArtwork) {
				foundScanArtworks.push(scanArtwork);
				result.artworks.push(artwork);
				if (
					scanArtwork.size !== artwork.fileSize ||
					scanArtwork.ctime !== artwork.statCreated ||
					scanArtwork.mtime !== artwork.statModified
				) {
					result.changed = true;
					await this.updateArtwork(scanArtwork, artwork);
				}
			} else {
				log.info('Artwork has been removed', filename);
				result.changed = true;
				this.changes.artworks.removed.add(artwork);
			}
		}
		const newArtworks = scanArtworks.filter(t => !foundScanArtworks.includes(t));
		for (const newArtwork of newArtworks) {
			result.changed = true;
			result.artworks.push(await this.buildArtwork(newArtwork, folder));
		}
	}

	private async scanTracks(dir: ScanDir, folder: Folder, result: MatchNode) {
		const scanTracks = dir.files.filter(f => f.type === FileTyp.audio);
		const foundScanTracks: Array<ScanFile> = [];
		await this.orm.Folder.populate(folder, ['tracks', 'artworks']);
		const tracks = folder.tracks.getItems();
		for (const track of tracks) {
			const filename = path.join(track.path, track.fileName);
			const scanTrack = scanTracks.find(t => t.path == filename);
			if (scanTrack) {
				foundScanTracks.push(scanTrack);
				result.tracks.push(track);
				if (
					scanTrack.size !== track.fileSize ||
					scanTrack.ctime !== track.statCreated ||
					scanTrack.mtime !== track.statModified
				) {
					await this.updateTrack(scanTrack, track);
					result.changed = true;
				}
			} else {
				log.info('Track has been removed', filename);
				result.changed = true;
				this.changes.tracks.removed.add(track);
			}
		}
		const newTracks = scanTracks.filter(t => !foundScanTracks.includes(t));
		for (const newTrack of newTracks) {
			result.changed = true;
			result.tracks.push(await this.buildTrack(newTrack, folder));
		}
	}

	async match(dir: ScanDir): Promise<MatchNode> {
		const parent = await this.orm.Folder.findOne({path: {$eq: dir.path}});
		if (!parent) {
			const oldParent = await this.orm.Folder.findOneFilter({rootIDs: [this.root.id], level: 0});
			if (oldParent) {
				await this.removeFolder(oldParent);
			}
		}
		let rootMatch: MatchNode;
		if (!parent) {
			rootMatch = await this.buildNode(dir);
		} else {
			rootMatch = await this.scanNode(dir, parent)
		}
		return rootMatch;
	}
}
