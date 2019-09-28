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

	public async remove(root: Root): Promise<{ removedFolders: Array<Folder>, removedTracks: Array<Track> }> {
		const removedTracks = (await this.store.trackStore.search({rootID: root.id})).items;
		const removedFolders = (await this.store.folderStore.search({rootID: root.id})).items;
		await this.store.rootStore.remove(root.id);
		return {removedTracks, removedFolders};
	}

	public async scan(root: Root): Promise<{ rootMatch: MatchDir, removedFolders: Array<Folder>, removedTracks: Array<Track> }> {
		const dirScanner = new DirScanner();
		const scanDir = await dirScanner.scan(root.path, root.id);
		const scanMatcher = new MatchDirBuilderScan(this.store);
		return scanMatcher.match(scanDir);
	}
}
