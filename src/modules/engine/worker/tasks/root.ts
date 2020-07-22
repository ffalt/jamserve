import {Root} from '../../../../entity/root/root';
import {RootScanStrategy} from '../../../../types/enums';
import {DirScanner} from '../../../../utils/scan-dir';
import {WorkerScan} from '../scan';
import {Changes} from '../changes';
import {BaseWorker} from './base';
import {InRequestScope} from 'typescript-ioc';
import {Orm} from '../../services/orm.service';

@InRequestScope
export class RootWorker extends BaseWorker {

	private async validateRootPath(orm: Orm, dir: string): Promise<void> {
		const d = dir.trim();
		if (d[0] === '.') {
			return Promise.reject(Error('Root Directory must be absolute'));
		}
		if (d.length === 0 || d.includes('*')) {
			return Promise.reject(Error('Root Directory invalid'));
		}
		const roots = await orm.Root.all();
		for (const r of roots) {
			if (dir.startsWith(r.path) || r.path.startsWith(dir)) {
				return Promise.reject(Error('Root path already used'));
			}
		}
	}

	async remove(orm: Orm, root: Root, changes: Changes): Promise<void> {
		const removedTracks = await orm.Track.find({where: {root: root.id}});
		const removedFolders = await orm.Folder.find({where: {root: root.id}});
		if (removedFolders.length > 0) {
			const removedArtworks = await orm.Artwork.findFilter({folderIDs: removedFolders.map(r => r.id)});
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
		await scanMatcher.match(scanDir);
	}

	async create(orm: Orm, name: string, path: string, strategy: RootScanStrategy): Promise<Root> {
		await this.validateRootPath(orm, path);
		const root = orm.Root.create({name, path, strategy});
		await orm.Root.persistAndFlush(root);
		return root;
	}

	async update(orm: Orm, root: Root, name: string, path: string, strategy: RootScanStrategy): Promise<void> {
		root.name = name;
		if (root.path !== path) {
			await this.validateRootPath(orm, path);
			root.path = path;
		}
		root.strategy = strategy;
		orm.Root.persistLater(root);
	}
}
