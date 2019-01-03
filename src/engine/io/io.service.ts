import Logger from '../../utils/logger';
import {Subsonic} from '../../model/subsonic-rest-data';
import {Root, RootStatus} from '../../objects/root/root.model';
import {Track} from '../../objects/track/track.model';
import {IndexService} from '../index/index.service';
import {GenreService} from '../genre/genre.service';
import {logChanges, ScanService} from '../scan/scan.service';
import {RootStore} from '../../objects/root/root.store';

const log = Logger('IO');

export class IoService {
	public scanning = false;
	private scanningCount: undefined | number;
	private rootstatus: { [id: string]: RootStatus } = {};

	constructor(private rootStore: RootStore, private scanService: ScanService, private indexService: IndexService, private genreService: GenreService) {
	}

	getScanStatus(): Subsonic.ScanStatus {
		return {scanning: this.scanning, count: this.scanningCount};
	}

	getRootStatus(id: string): RootStatus {
		return this.rootstatus[id];
	}

	private async scanRoot(root: Root): Promise<void> {
		log.info('Scanning Root', root.path);
		this.rootstatus[root.id] = {lastScan: Date.now(), scanning: true};
		try {
			const changes = await this.scanService.run(root.path, root.id);
			logChanges(changes);
			this.rootstatus[root.id] = {lastScan: Date.now()};
		} catch (e) {
			log.error('Scanning Error', root.path, e.toString());
			if (['EACCES', 'ENOENT'].indexOf((<any>e).code) >= 0) {
				this.rootstatus[root.id] = {lastScan: Date.now(), error: 'Directory not found/no access/error in filesystem'};
			} else {
				this.rootstatus[root.id] = {lastScan: Date.now(), error: e.toString()};
			}
		}
	}

	private async start() {
		this.scanning = true;
		log.info('Start Scanning');
	}

	private async stop() {
		this.scanning = false;
		log.info('Stop Scanning');
		await this.indexService.buildIndexes();
		await this.genreService.refresh();
	}

	async refresh(): Promise<void> {
		if (this.scanning) {
			return;
		}
		await this.start();
		const roots = await this.rootStore.all();
		for (const root of roots) {
			await this.scanRoot(root);
		}
		await this.stop();
	}

	async refreshTracks(tracks: Array<Track>): Promise<void> {
		// TODO: rescan tracks only, not the whole library
		await this.refresh();
	}

	async refreshRoot(root: Root): Promise<void> {
		if (this.scanning) {
			return;
		}
		await this.start();
		await this.scanRoot(root);
		await this.stop();
	}

}
