import {DBObjectType} from '../../../db/db.types';
import {RootScanStrategy} from '../../../model/jam-types';
import {Folder} from '../../folder/folder.model';
import {Root} from '../../root/root.model';
import {Store} from '../../store/store';
import {Track} from '../../track/track.model';
import {MatchDirBuilderScan} from '../match-dir/match-dir.builder.scan';
import {MatchDir} from '../match-dir/match-dir.types';
import {DirScanner} from '../scan-dir/scan-dir';

export class RootWorker {

	constructor(private store: Store) {

	}

	private async checkUsedPath(dir: string): Promise<void> {
		const roots = await this.store.rootStore.all();
		for (const r of roots) {
			if (dir.startsWith(r.path) || r.path.startsWith(dir)) {
				return Promise.reject(Error('Root path already used'));
			}
		}
	}

	async remove(root: Root): Promise<{ removedFolders: Array<Folder>; removedTracks: Array<Track> }> {
		const removedTracks = (await this.store.trackStore.search({rootID: root.id})).items;
		const removedFolders = (await this.store.folderStore.search({rootID: root.id})).items;
		await this.store.rootStore.remove(root.id);
		return {removedTracks, removedFolders};
	}

	async scan(root: Root): Promise<{ rootMatch: MatchDir; removedFolders: Array<Folder>; removedTracks: Array<Track> }> {
		const dirScanner = new DirScanner();
		const scanDir = await dirScanner.scan(root.path, root.id);
		const scanMatcher = new MatchDirBuilderScan(this.store);
		return scanMatcher.match(scanDir);
	}

	async create(name: string, path: string, strategy: RootScanStrategy): Promise<Root> {
		const root: Root = {id: '', created: Date.now(), type: DBObjectType.root, name, path, strategy};
		await this.addRoot(root);
		return root;
	}

	async addRoot(root: Root): Promise<string> {
		await this.checkUsedPath(root.path);
		root.id = await this.store.rootStore.add(root);
		return root.id;
	}

	async update(root: Root, name: string, path: string, strategy: RootScanStrategy): Promise<void> {
		root.name = name;
		if (root.path !== path) {
			await this.checkUsedPath(path);
			root.path = path;
		}
		root.strategy = strategy;
		await this.store.rootStore.replace(root);
	}
}
