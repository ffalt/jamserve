import {Changes} from './changes.js';
import {MatchNode, OnDemandTrackMatch} from './scan.js';
import {AlbumType, FolderType, RootScanStrategy} from '../../../types/enums.js';
import {splitDirectoryName} from '../../../utils/dir-name.js';
import path from 'path';
import {logger} from '../../../utils/logger.js';
import {MatchNodeMetaStats, MetaStat} from './meta-stats.js';
import {Orm} from '../services/orm.service.js';
import {Folder} from '../../../entity/folder/folder.js';
import {QHelper} from '../../orm/index.js';
import {Genre} from '../../../entity/genre/genre.js';

const log = logger('IO.MergeScan');

export interface MergeNode {
	path: string;
	folder: Folder;
	nrOfTracks: number;
	children: Array<MergeNode>;
	tracks: Array<OnDemandTrackMatch>;
	changed: boolean;
}

export class WorkerMergeScan {

	constructor(private orm: Orm, private strategy: RootScanStrategy, private changes: Changes) {
	}

	async mergeMatch(matchRoot: MatchNode): Promise<void> {
		const mergeRoot = WorkerMergeScan.buildNodes(matchRoot);
		return this.merge(mergeRoot);
	}

	async merge(mergeRoot: MergeNode): Promise<void> {
		this.markChangedParents(mergeRoot);
		await this.mergeNode(mergeRoot);
		if (this.orm.em.hasChanges()) {
			log.debug('Syncing Folder Changes to DB');
			await this.orm.em.flush();
		}
	}

	private static isExtraFolder(node: MergeNode): boolean {
		// TODO: generalise extra folder detection (an admin setting?)
		const name = path.basename(node.path).toLowerCase();
		return !!name.match(/(\[(extra|various)]|^(extra|various)$)/);
	}

	private static getMultiAlbumFolderType(node: MergeNode): FolderType {
		// Multi-Album ( eg. Album with CD1, CD2, etc)
		const a = node.children.find(d => d.folder.folderType === FolderType.artist);
		return a ? FolderType.collection : FolderType.multialbum;
	}

	private static getMultipleAlbumFolderType(metaStat: MetaStat, strategy: RootScanStrategy): FolderType {
		// Multiple Albums ( different Albums )
		return (metaStat.hasMultipleArtists || strategy === RootScanStrategy.compilation) ? FolderType.collection : FolderType.artist;
	}

	private static getMixedFolderType(node: MergeNode, _: MetaStat, __: RootScanStrategy): FolderType {
		return WorkerMergeScan.getMultiAlbumFolderType(node);
	}

	private static getTrackFolderType(node: MergeNode, metaStat: MetaStat, strategy: RootScanStrategy): FolderType {
		if (metaStat.hasMultipleAlbums && metaStat.albumType === AlbumType.series) {
			return FolderType.artist;
		}
		const dirCount = node.children.filter(d => d.folder.folderType !== FolderType.extras).length;
		if (dirCount > 0) {
			return WorkerMergeScan.getMixedFolderType(node, metaStat, strategy);
		}
		return FolderType.album;
	}

	private static getFolderType(node: MergeNode, metaStat: MetaStat, strategy: RootScanStrategy): FolderType {
		if (node.folder.level === 0) {
			// root folder is always a collection
			return FolderType.collection;
		}
		if (WorkerMergeScan.isExtraFolder(node)) {
			// special folder handling
			return FolderType.extras;
		}
		if (metaStat.trackCount > 0) {
			// has tracks
			return this.getTrackFolderType(node, metaStat, strategy);
		}
		if (node.children.length === 0) {
			// no tracks, no children folder
			return FolderType.extras;
		}
		// no tracks, has children folder
		if (metaStat.hasMultipleAlbums) {
			return WorkerMergeScan.getMultipleAlbumFolderType(metaStat, strategy);
		}
		if (node.children.length === 1) {
			return (strategy === RootScanStrategy.compilation) ? FolderType.collection : FolderType.artist;
		}
		if (!metaStat.hasMultipleArtists && !!node.children.find(d => d.folder.folderType === FolderType.artist)) {
			// choose artist folder, if it's not an pure album (without artist folders in children nodes)
			return FolderType.artist;
		}
		return WorkerMergeScan.getMultiAlbumFolderType(node);
	}

	private static setFolderType(node: MergeNode, type: FolderType): void {
		if (node.folder.folderType !== type) {
			node.folder.folderType = type;
			node.changed = true;
		}
		switch (type) {
			case FolderType.collection:
				// node.folder.albumType = undefined;
				node.folder.mbArtistID = undefined;
				node.folder.mbReleaseID = undefined;
				node.folder.mbAlbumType = undefined;
				node.folder.mbReleaseGroupID = undefined;
				node.folder.artist = undefined;
				node.folder.artistSort = undefined;
				node.folder.album = undefined;
				node.folder.year = undefined;
				break;
			case FolderType.artist:
				node.folder.mbReleaseID = undefined;
				node.folder.mbAlbumType = undefined;
				node.folder.mbReleaseGroupID = undefined;
				node.folder.album = undefined;
				node.folder.year = undefined;
				break;
			default:
		}
	}

	private static markMultiAlbumChildDirs(node: MergeNode): void {
		if (node.folder.folderType !== FolderType.extras) {
			WorkerMergeScan.setFolderType(node, FolderType.multialbum);
		}
		for (const child of node.children) {
			if (child.folder.folderType !== FolderType.extras) {
				// parent multialbum gets same album type as child multialbum folder
				if (node.folder.albumType !== child.folder.albumType) {
					node.folder.albumType = child.folder.albumType;
					node.changed = true;
				}
			}
			WorkerMergeScan.markMultiAlbumChildDirs(child);
		}
	}

	private static markArtistChildDirs(node: MergeNode): void {
		if (node.folder.folderType === FolderType.artist) {
			WorkerMergeScan.setFolderType(node, FolderType.collection);
		}
		for (const child of node.children) {
			WorkerMergeScan.markArtistChildDirs(child);
		}
	}

	private async buildFolderMeta(node: MergeNode): Promise<void> {
		log.debug('Merge Folder Meta', node.path);
		const metaStat = await MatchNodeMetaStats.buildMetaStat(node, this.strategy);
		const name = path.basename(node.path);
		const {title, year} = splitDirectoryName(node.path);
		const folder = node.folder;
		folder.album = metaStat.album;
		folder.albumType = metaStat.albumType;
		folder.artist = metaStat.artist;
		folder.artistSort = metaStat.artistSort;
		folder.title = title !== name ? title : undefined;
		folder.name = name;
		folder.mbReleaseID = metaStat.mbReleaseID;
		folder.mbReleaseGroupID = metaStat.mbReleaseGroupID;
		folder.mbAlbumType = metaStat.mbAlbumType;
		folder.mbArtistID = metaStat.mbArtistID;
		folder.albumTrackCount = metaStat.trackCount;
		folder.year = (year !== undefined && year > 0) ? year : metaStat.year;
		folder.folderType = WorkerMergeScan.getFolderType(node, metaStat, this.strategy);

		const genreNames = metaStat.genres || [];
		let genres: Array<Genre> = [];
		if (genreNames.length > 0) {
			genres = await this.orm.Genre.find({where: {name: QHelper.inOrEqual(genreNames)}});
		}
		await folder.genres.set(genres);

		WorkerMergeScan.setFolderType(node, folder.folderType);
		if (folder.folderType === FolderType.multialbum) {
			WorkerMergeScan.markMultiAlbumChildDirs(node);
		} else if (folder.folderType === FolderType.artist) {
			for (const child of node.children) {
				WorkerMergeScan.markArtistChildDirs(child);
			}
		}
		this.orm.Folder.persistLater(folder);
	}

	private async mergeNode(node: MergeNode): Promise<void> {
		// merge children first
		for (const child of node.children) {
			await this.mergeNode(child);
		}
		if (node.changed) {
			await this.buildFolderMeta(node);
		}
	}

	private markChangedParents(node: MergeNode): void {
		let changed = node.changed;
		for (const child of node.children) {
			this.markChangedParents(child);
			if (child.changed) {
				changed = true;
			}
		}
		if (changed) {
			if (!this.changes.folders.added.hasID(node.folder.id) && !this.changes.folders.removed.hasID(node.folder.id)) {
				this.changes.folders.updated.addID(node.folder.id);
			}
		}
		node.changed = changed;
	}

	private static buildNodes(node: MatchNode): MergeNode {
		return {
			path: node.scan.path,
			children: node.children.map(c => WorkerMergeScan.buildNodes(c)),
			tracks: node.tracks,
			nrOfTracks: node.tracks.length,
			folder: node.folder,
			changed: node.changed
		};
	}
}
