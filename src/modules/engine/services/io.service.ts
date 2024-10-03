import { Changes } from '../worker/changes.js';
import { WorkerService } from './worker.service.js';
import { OrmService } from './orm.service.js';
import { AdminChangeQueueInfo, IoRequest, RootStatus, WorkerRequestMode } from './io/io.types.js';
import { WorkerRequestParameters } from './worker/worker.types.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { logger } from '../../../utils/logger.js';
import { IoCommandsArtwork } from './io/io.commands.artwork.js';
import { IoCommandsFolder } from './io/io.commands.folder.js';
import { IoCommandsRoot } from './io/io.commands.root.js';
import { IoCommandsTrack } from './io/io.commands.track.js';

const log = logger('IO');
/*
	The IO Service queues the requests coming from REST & Services, the actual work is done through WorkerService
 */
@InRequestScope
export class IoService {
	@Inject
	public orm!: OrmService;

	@Inject
	public workerService!: WorkerService;

	public scanning = false;
	private afterRefreshListeners: Array<() => Promise<void>> = [];
	private rootStatus = new Map<string, RootStatus>();
	private current: IoRequest<WorkerRequestParameters> | undefined;
	private queue: Array<IoRequest<WorkerRequestParameters>> = [];
	private nextID: number = Date.now();
	private afterScanTimeout: ReturnType<typeof setTimeout> | undefined;
	private history: Array<{ id: string; error?: string; date: number }> = [];

	public artwork = new IoCommandsArtwork(this);
	public folder = new IoCommandsFolder(this);
	public root = new IoCommandsRoot(this);
	public track = new IoCommandsTrack(this);

	private async runRequest(cmd: IoRequest<WorkerRequestParameters>): Promise<void> {
		this.clearAfterRefresh();
		this.rootStatus.set(cmd.parameters.rootID, { lastScan: Date.now(), scanning: true });
		try {
			this.current = cmd;
			await cmd.run();
			this.rootStatus.set(cmd.parameters.rootID, { lastScan: Date.now() });
			this.history.push({ id: cmd.id, date: Date.now() });
			this.current = undefined;
		} catch (e: any) {
			console.error(e);
			this.current = undefined;
			let msg = e.toString();
			if (msg.startsWith('Error:')) {
				msg = msg.slice(6).trim();
			}
			this.rootStatus.set(cmd.parameters.rootID, { lastScan: Date.now(), error: msg });
			this.history.push({ id: cmd.id, error: msg, date: Date.now() });
		}
		if (this.queue.length === 0) {
			this.runAfterRefresh();
		}
	}

	private runAfterRefresh(): void {
		this.clearAfterRefresh();
		this.afterScanTimeout = setTimeout(() => {
			this.clearAfterRefresh();
			for (const listener of this.afterRefreshListeners) {
				listener()
					.catch(e => {
						console.error(e);
					});
			}
		}, 10000);
	}

	private clearAfterRefresh(): void {
		if (this.afterScanTimeout) {
			clearTimeout(this.afterScanTimeout as any);
		}
		this.afterScanTimeout = undefined;
	}

	private async next(): Promise<void> {
		const cmd = this.queue.shift();
		if (cmd) {
			await this.runRequest(cmd);
			await this.next();
		}
	}

	private run(): void {
		if (this.scanning) {
			return;
		}
		this.scanning = true;
		log.info('Start Processing');
		this.next()
			.then(() => {
				this.scanning = false;
				log.info('Stop Processing');
			})
			.catch(e => {
				this.scanning = false;
				log.error(e);
			});
	}

	generateRequestID(): string {
		this.nextID += 1;
		return this.nextID.toString();
	}

	addRequest(req: IoRequest<any>): AdminChangeQueueInfo {
		this.queue.push(req);
		this.run();
		return this.getRequestInfo(req);
	}

	findRequest(rootID: string, mode: WorkerRequestMode): IoRequest<WorkerRequestParameters> | undefined {
		return this.queue.find(c => !!c.parameters.rootID && (c.parameters.rootID === rootID && c.mode === mode));
	}

	find(param: (cmd: IoRequest<WorkerRequestParameters>) => boolean): IoRequest<WorkerRequestParameters> | undefined {
		return this.queue.find(param);
	}

	getRequestInfo(req: IoRequest<any>): AdminChangeQueueInfo {
		const pos = this.queue.indexOf(req);
		return { id: req.id, pos: pos >= 0 ? pos : undefined };
	}

	newRequest<T extends WorkerRequestParameters>(mode: WorkerRequestMode, execute: (parameters: T) => Promise<Changes>, parameters: T): AdminChangeQueueInfo {
		return this.addRequest(new IoRequest<T>(this.generateRequestID(), mode, execute, parameters));
	}

	getAdminChangeQueueInfoStatus(id: string): AdminChangeQueueInfo {
		if (this.current && this.current.id === id) {
			return { id };
		}
		const cmd = this.queue.find(c => c.id === id);
		if (cmd) {
			const pos = this.queue.indexOf(cmd);
			return { id, pos: pos >= 0 ? pos : undefined };
		}
		const done = this.history.find(c => c.id === id);
		if (done) {
			return { id, error: done.error, done: done.date };
		}
		if (this.track.delayedTrackTagWrite.findbyID(id)) {
			return { id };
		}
		if (this.track.delayedTrackFix.findbyID(id)) {
			return { id };
		}
		return { id, error: 'ID not found', done: Date.now() };
	}

	getRootStatus(id: string): RootStatus {
		let status = this.rootStatus.get(id);
		if (!status) {
			status = { lastScan: Date.now() };
		}
		if (!status.scanning) {
			const cmd = this.queue.find(c => c.parameters.rootID === id);
			status.scanning = !!cmd;
		}
		return status;
	}

	registerAfterRefresh(listener: () => Promise<void>): void {
		this.afterRefreshListeners.push(listener);
	}

	removeAfterRefresh(listener: () => Promise<void>): void {
		this.afterRefreshListeners = this.afterRefreshListeners.filter(l => l !== listener);
	}
}
