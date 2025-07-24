import { Root } from '../../../../entity/root/root.js';
import { RootScanStrategy } from '../../../../types/enums.js';
import { DirScanner } from '../../../../utils/scan-dir.js';
import { ObjLoadTrackMatch, OnDemandTrackMatch, WorkerScan } from '../scan.js';
import { Changes } from '../changes.js';
import { BaseWorker } from './base.js';
import { InRequestScope } from 'typescript-ioc';
import { Orm } from '../../services/orm.service.js';
import { MergeNode, WorkerMergeScan } from '../merge-scan.js';
import { Folder } from '../../../../entity/folder/folder.js';

@InRequestScope
export class RootWorker extends BaseWorker {
	private static async validateRootPath(orm: Orm, dir: string): Promise<void> {
		const d = dir.trim();
		if (d.startsWith('.')) {
			return Promise.reject(new Error('Root Directory must be absolute'));
		}
		if (d.length === 0 || d.includes('*')) {
			return Promise.reject(new Error('Root Directory invalid'));
		}
		const roots = await orm.Root.all();
		for (const r of roots) {
			if (dir.startsWith(r.path) || r.path.startsWith(dir)) {
				return Promise.reject(new Error('Root path already used'));
			}
		}
	}

	async remove(orm: Orm, root: Root, changes: Changes): Promise<void> {
		const removedTracks = await orm.Track.find({ where: { root: root.id } });
		const removedFolders = await orm.Folder.find({ where: { root: root.id } });
		if (removedFolders.length > 0) {
			const removedArtworks = await orm.Artwork.findFilter({ folderIDs: removedFolders.map(r => r.id) });
			changes.artworks.removed.append(removedArtworks);
		}
		changes.folders.removed.append(removedFolders);
		changes.tracks.removed.append(removedTracks);
		changes.roots.removed.add(root);
	}

	async scan(orm: Orm, root: Root, changes: Changes): Promise<void> {
		const dirScanner = new DirScanner();
		const scanDir = await dirScanner.scan(root.path);
		const scanMatcher = new WorkerScan(orm, root.id, this.audioModule, this.imageModule, changes);
		const rootMatch = await scanMatcher.match(scanDir);
		const scanMerger = new WorkerMergeScan(orm, root.strategy, changes);
		await scanMerger.mergeMatch(rootMatch);
	}

	async refreshMeta(orm: Orm, root: Root, changes: Changes): Promise<void> {
		const trackIDs = await orm.Track.findIDsFilter({ rootIDs: [root.id] });
		changes.tracks.updated.appendIDs(trackIDs);
		await this.scan(orm, root, changes);
	}

	async mergeChanges(orm: Orm, root: Root, changes: Changes): Promise<void> {
		if (orm.em.hasChanges()) {
			await orm.em.flush();
		}
		const folders = await orm.Folder.findByIDs(changes.folders.updated.ids());
		let rootMatch: MergeNode | undefined;
		for (const folder of folders) {
			const parents = await this.getParents(folder);
			if (parents[0]) {
				if (!rootMatch) {
					const tracks = await RootWorker.buildMergeTracks(parents[0]);
					rootMatch = { changed: true, folder: parents[0], path: parents[0].path, children: [], tracks, nrOfTracks: tracks.length };
				}
				const pathToChild = [...parents.slice(1), folder];
				await this.buildMergeNode(pathToChild, rootMatch);
			}
		}
		if (rootMatch) {
			await this.loadEmptyUnchanged(rootMatch);
			const scanMerger = new WorkerMergeScan(orm, root.strategy, changes);
			await scanMerger.merge(rootMatch);
		}
	}

	private async buildMergeNode(pathToChild: Array<Folder>, merge: MergeNode) {
		const folder = pathToChild[0];
		let node = merge.children.find(c => c.folder.id === folder.id);
		if (!node) {
			const tracks = await RootWorker.buildMergeTracks(folder);
			node = {
				changed: true,
				folder,
				path: folder.path,
				children: [],
				tracks,
				nrOfTracks: tracks.length
			};
			merge.children.push(node);
		}
		if (pathToChild.length > 1) {
			await this.buildMergeNode(pathToChild.slice(1), node);
		}
	}

	async create(orm: Orm, name: string, path: string, strategy: RootScanStrategy): Promise<Root> {
		await RootWorker.validateRootPath(orm, path);
		const root = orm.Root.create({ name, path, strategy });
		await orm.Root.persistAndFlush(root);
		return root;
	}

	async update(orm: Orm, root: Root, name: string, path: string, strategy: RootScanStrategy): Promise<void> {
		root.name = name;
		if (root.path !== path) {
			await RootWorker.validateRootPath(orm, path);
			root.path = path;
		}
		root.strategy = strategy;
		orm.Root.persistLater(root);
	}

	private async getParents(folder: Folder): Promise<Array<Folder>> {
		const parent = await folder.parent.get();
		if (!parent) {
			return [];
		}
		return [...(await this.getParents(parent)), parent];
	}

	private async loadEmptyUnchanged(node: MergeNode): Promise<void> {
		const folders = await node.folder.children.getItems();
		for (const folder of folders) {
			const child = node.children.find(f => f.folder.id === folder.id);
			if (child) {
				await this.loadEmptyUnchanged(child);
			} else {
				node.children.push({
					changed: false,
					folder,
					path: folder.path,
					children: [],
					nrOfTracks: await folder.tracks.count(),
					tracks: []
				});
			}
		}
	}

	private logNode(node?: MergeNode): Array<string> {
		let stat = [' '.repeat(node?.folder?.level ?? 0) + (node?.changed ? '** ' : '|- ') + node?.folder?.path];
		for (const n of (node?.children || [])) {
			stat = [...stat, ...this.logNode(n)];
		}
		return stat;
	}

	private static async buildMergeTracks(folder: Folder): Promise<Array<OnDemandTrackMatch>> {
		const tracks = await folder.tracks.getItems();
		const list: Array<OnDemandTrackMatch> = [];
		for (const track of tracks) {
			list.push(new ObjLoadTrackMatch(track));
		}
		return list;
	}
}
