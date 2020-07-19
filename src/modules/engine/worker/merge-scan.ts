import {Changes} from './changes';
import {MatchNode} from './scan';
import {AlbumType, FolderType, RootScanStrategy} from '../../../types/enums';
import {splitDirectoryName} from '../../../utils/dir-name';
import path from 'path';
import {logger} from '../../../utils/logger';
import {MatchNodeMetaStats, MetaStat} from './meta-stats';

const log = logger('Worker.MergeScan');

export class WorkerMergeScan {

	constructor(private strategy: RootScanStrategy, private changes: Changes) {
	}

	async merge(matchRoot: MatchNode): Promise<void> {
		this.markChangedParents(matchRoot);
		await this.mergeNode(matchRoot);
	}

	private static isExtraFolder(node: MatchNode): boolean {
		// TODO: generalise extra folder detection (an admin setting?)
		const name = path.basename(node.scan.path).toLowerCase();
		return !!name.match(/(\[(extra|various)]|^(extra|various)$)/);
	}

	private static getMultiAlbumFolderType(node: MatchNode): FolderType {
		const a = node.children.find(d => {
			return (d.folder.folderType === FolderType.artist);
		});
		return a ? FolderType.collection : FolderType.multialbum;
	}

	private static getMixedFolderType(node: MatchNode, _: MetaStat, __: RootScanStrategy): FolderType {
		return WorkerMergeScan.getMultiAlbumFolderType(node);
	}

	private static getFolderType(node: MatchNode, metaStat: MetaStat, strategy: RootScanStrategy): FolderType {
		if (node.scan.level === 0) {
			return FolderType.collection;
		}
		if (WorkerMergeScan.isExtraFolder(node)) {
			return FolderType.extras;
		}
		if (metaStat.trackCount > 0) {
			if (metaStat.hasMultipleAlbums && node.folder.albumType === AlbumType.series) {
				return FolderType.artist;
			}
			const dirCount = node.children.filter(d => d.folder.folderType !== FolderType.extras).length;
			if (dirCount > 0) {
				return WorkerMergeScan.getMixedFolderType(node, metaStat, strategy);
			}
			return FolderType.album;
		}
		if (node.children.length === 0) {
			return (node.tracks.length === 0) ? FolderType.extras : FolderType.album;
		}
		if (metaStat.hasMultipleAlbums) {
			return (metaStat.hasMultipleArtists || strategy === RootScanStrategy.compilation) ? FolderType.collection : FolderType.artist;
		}
		if (node.children.length === 1) {
			return (strategy === RootScanStrategy.compilation) ? FolderType.collection : FolderType.artist;
		}
		if (!metaStat.hasMultipleArtists && node.children.filter(d => d.folder.folderType === FolderType.artist).length > 0) {
			return FolderType.artist;
		}
		return WorkerMergeScan.getMultiAlbumFolderType(node);
	}

	private static setFolderType(node: MatchNode, type: FolderType): void {
		node.folder.folderType = type;
		switch (type) {
			case FolderType.collection:
				node.folder.albumType = undefined;
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

	private static markMultiAlbumChildDirs(node: MatchNode): void {
		if (node.folder.folderType !== FolderType.extras) {
			WorkerMergeScan.setFolderType(node, FolderType.multialbum);
		}
		for (const child of node.children) {
			if (node.folder.folderType !== FolderType.extras) {
				// parent multialbum gets same album type as child multialbum folder
				node.folder.albumType = child.folder.albumType;
			}
			WorkerMergeScan.markMultiAlbumChildDirs(child);
		}
	}

	private static markArtistChildDirs(node: MatchNode): void {
		if (node.folder.folderType === FolderType.artist) {
			WorkerMergeScan.setFolderType(node, FolderType.collection);
		}
		for (const child of node.children) {
			WorkerMergeScan.markArtistChildDirs(child);
		}
	}

	private async buildFolderMeta(node: MatchNode): Promise<void> {
		log.debug('Merge Folder Meta', node.scan.path);
		const metaStat = await MatchNodeMetaStats.buildMetaStat(node, this.strategy);
		const nameSplit = splitDirectoryName(node.scan.path);
		const folder = node.folder;
		folder.album = metaStat.album;
		folder.albumType = metaStat.albumType;
		folder.artist = metaStat.artist;
		folder.artistSort = metaStat.artistSort;
		folder.title = nameSplit.title;
		folder.name = nameSplit.title || folder.name;
		folder.genres = metaStat.genres || [];
		folder.mbReleaseID = metaStat.mbReleaseID;
		folder.mbReleaseGroupID = metaStat.mbReleaseGroupID;
		folder.mbAlbumType = metaStat.mbAlbumType;
		folder.mbArtistID = metaStat.mbArtistID;
		folder.albumTrackCount = metaStat.trackCount;
		folder.year = (nameSplit.year !== undefined && nameSplit.year > 0) ? nameSplit.year : metaStat.year;
		folder.folderType = WorkerMergeScan.getFolderType(node, metaStat, this.strategy);
		WorkerMergeScan.setFolderType(node, folder.folderType);
		if (folder.folderType === FolderType.multialbum) {
			WorkerMergeScan.markMultiAlbumChildDirs(node);
		} else if (folder.folderType === FolderType.artist) {
			for (const child of node.children) {
				WorkerMergeScan.markArtistChildDirs(child);
			}
		}
	}

	private async mergeNode(node: MatchNode): Promise<void> {
		// merge children first
		for (const child of node.children) {
			await this.mergeNode(child);
		}
		if (node.changed) {
			await this.buildFolderMeta(node);
		}
	}

	private markChangedParents(node: MatchNode): void {
		let changed = node.changed;
		for (const child of node.children) {
			this.markChangedParents(child);
			if (child.changed) {
				changed = true;
			}
		}
		if (changed) {
			if (!this.changes.folders.added.has(node.folder) && !this.changes.folders.removed.has(node.folder)) {
				this.changes.folders.updated.add(node.folder);
			}
		}
		node.changed = changed;
	}
}
