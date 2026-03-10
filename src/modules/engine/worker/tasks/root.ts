import { Root } from '../../../../entity/root/root.js';
import { RootScanStrategy } from '../../../../types/enums.js';
import { DirScanner } from '../../../../utils/scan-dir.js';
import { ObjLoadTrackMatch, OnDemandTrackMatch, WorkerScan } from '../scan.js';
import { Changes } from '../changes.js';
import { BaseWorker } from './base.js';
import { injectable } from 'inversify';
import { Orm } from '../../services/orm.service.js';
import { MergeNode, WorkerMergeScan } from '../merge-scan.js';
import { Folder } from '../../../../entity/folder/folder.js';
import { ensureTrailingPathSeparator, removeTrailingPathSeparator } from '../../../../utils/fs-utils.js';
import path from 'node:path';
import fs from 'node:fs/promises';
import { logger } from '../../../../utils/logger.js';

const log = logger('RootWorker');

@injectable()
export class RootWorker extends BaseWorker {
	// System directories that must not be used as media roots
	private static readonly DENIED_ROOT_PATHS = [
		'/', // filesystem root
		'/bin', // system binaries
		'/boot', // boot files
		'/dev', // device files
		'/etc', // system configuration
		'/lib', // system libraries
		'/lib64', // 64-bit system libraries
		'/proc', // kernel process info
		'/root', // root home (in some contexts)
		'/run', // runtime data
		'/sbin', // system binaries
		'/sys', // kernel sysfs
		'/usr', // user programs and data
		'/var', // variable data (logs, caches, etc.)
		'/opt', // optional software (usually system)
		'/srv', // service data (usually system)
		'/root' // root home directory
	];

	private static async validateRootPath(orm: Orm, dir: string, rootIdToIgnore?: string): Promise<string> {
		const d = dir.trim();
		if (d.startsWith('.')) {
			throw new Error('Root Directory must be absolute');
		}
		if (d.length === 0 || d.includes('*')) {
			throw new Error('Root Directory invalid');
		}
		// Resolve symlinks so that a symlink pointing to a sensitive path is also caught
		let resolvedDir: string;
		try {
			resolvedDir = await fs.realpath(d);
		} catch {
			resolvedDir = d;
		}
		// Check against deny-list of sensitive system paths
		const normalizedPath = removeTrailingPathSeparator(resolvedDir);
		for (const deniedPath of RootWorker.DENIED_ROOT_PATHS) {
			if (normalizedPath === deniedPath || normalizedPath.startsWith(deniedPath + '/')) {
				throw new Error(`Root Directory cannot be a sensitive system path: ${deniedPath}`);
			}
		}
		const roots = (await orm.Root.all()).filter(r => r.id !== rootIdToIgnore);
		const newPath = ensureTrailingPathSeparator(path.isAbsolute(resolvedDir) ? resolvedDir : path.resolve(resolvedDir));
		for (const r of roots) {
			const existingPath = ensureTrailingPathSeparator(path.resolve(r.path));
			if (newPath === existingPath) {
				throw new Error(`Root path is already used by root '${r.name}'`);
			}
			if (newPath.startsWith(existingPath)) {
				throw new Error(`Root path '${d}' is inside an existing root '${r.name}' ('${r.path}')`);
			}
			if (existingPath.startsWith(newPath)) {
				throw new Error(`Root path '${d}' contains an existing root '${r.name}' ('${r.path}')`);
			}
		}
		return newPath;
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
			const parent = parents.at(0);
			if (parent) {
				if (!rootMatch) {
					const tracks = await RootWorker.buildMergeTracks(parent);
					rootMatch = { changed: true, folder: parent, path: parent.path, children: [], tracks, nrOfTracks: tracks.length };
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
		const folder = pathToChild.at(0);
		if (!folder) {
			return;
		}
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
		const newPath = await RootWorker.validateRootPath(orm, path);
		const root = orm.Root.create({ name, path: newPath, strategy });
		await orm.Root.persistAndFlush(root);
		return root;
	}

	async update(orm: Orm, root: Root, name: string, path: string, strategy: RootScanStrategy): Promise<void> {
		root.name = name;
		if (root.path !== path) {
			const newPath = await RootWorker.validateRootPath(orm, path, root.id);
			const oldPath = ensureTrailingPathSeparator(root.path);
			root.path = newPath;
			await this.migrateRootPath(orm, root, oldPath, newPath);
		}
		root.strategy = strategy;
		orm.Root.persistLater(root);
	}

	private async migrateRootPath(orm: Orm, root: Root, oldPath: string, newPath: string): Promise<void> {
		log.info(`Migrating root path from ${oldPath} to ${newPath}`);
		const folders = await orm.Folder.find({ where: { root: root.id } });
		const tracks = await orm.Track.find({ where: { root: root.id } });
		const artworks = await orm.Artwork.findFilter({ folderIDs: folders.map(f => f.id) });

		let updatedFolders = 0;
		for (const folder of folders) {
			if (folder.path.startsWith(oldPath)) {
				folder.path = newPath + folder.path.slice(oldPath.length);
				orm.Folder.persistLater(folder);
				updatedFolders++;
			}
		}

		let updatedTracks = 0;
		for (const track of tracks) {
			if (track.path.startsWith(oldPath)) {
				track.path = newPath + track.path.slice(oldPath.length);
				orm.Track.persistLater(track);
				updatedTracks++;
			}
		}

		let updatedArtworks = 0;
		for (const artwork of artworks) {
			if (artwork.path.startsWith(oldPath)) {
				artwork.path = newPath + artwork.path.slice(oldPath.length);
				orm.Artwork.persistLater(artwork);
				updatedArtworks++;
			}
		}
		log.info(`Migrated ${updatedFolders} folders, ${updatedTracks} tracks, ${updatedArtworks} artworks`);
		await orm.em.flush();
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
		let stat = [`${' '.repeat(node?.folder.level ?? 0)}${node?.changed ? '** ' : '|- '}${node?.folder.path}`];
		for (const n of (node?.children ?? [])) {
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
