import {Root} from '../../../../entity/root/root';
import {RootScanStrategy} from '../../../../types/enums';
import {DirScanner} from '../../../../utils/scan-dir';
import {WorkerScan} from '../scan';
import {Changes} from '../changes';
import {WorkerMergeScan} from '../merge-scan';
import {BaseWorker} from './base';

export class RootWorker extends BaseWorker {

	private async validateRootPath(dir: string): Promise<void> {
		const d = dir.trim();
		if (d[0] === '.') {
			return Promise.reject(Error('Root Directory must be absolute'));
		}
		if (d.length === 0 || d.includes('*')) {
			return Promise.reject(Error('Root Directory invalid'));
		}
		const roots = await this.orm.Root.all();
		for (const r of roots) {
			if (dir.startsWith(r.path) || r.path.startsWith(dir)) {
				return Promise.reject(Error('Root path already used'));
			}
		}
	}

	async remove(root: Root, changes: Changes): Promise<void> {
		const removedTracks = await this.orm.Track.find({root: root.id});
		const removedFolders = await this.orm.Folder.find({root: root.id});
		const removedArtworks = await this.orm.Artwork.findFilter({folderIDs: removedFolders.map(r => r.id)});
		changes.folders.removed.append(removedFolders);
		changes.artworks.removed.append(removedArtworks);
		changes.tracks.removed.append(removedTracks);
		changes.roots.removed.add(root);
	}

	async scan(root: Root, changes: Changes): Promise<void> {
		const dirScanner = new DirScanner();
		const scanDir = await dirScanner.scan(root.path);
		const scanMatcher = new WorkerScan(this.orm, root, this.audioModule, this.imageModule, changes);
		const matchRoot = await scanMatcher.match(scanDir);
		const scanMerger = new WorkerMergeScan(root.strategy, changes);
		await scanMerger.merge(matchRoot);
	}

	async create(name: string, path: string, strategy: RootScanStrategy): Promise<Root> {
		await this.validateRootPath(path);
		const root = this.orm.Root.create({name, path, strategy});
		await this.orm.orm.em.persistAndFlush(root);
		return root;
	}

	async update(root: Root, name: string, path: string, strategy: RootScanStrategy): Promise<void> {
		root.name = name;
		if (root.path !== path) {
			await this.validateRootPath(path);
			root.path = path;
		}
		root.strategy = strategy;
		this.orm.orm.em.persistLater(root);
	}
}
