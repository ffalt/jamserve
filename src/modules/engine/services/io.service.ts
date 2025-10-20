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
import { errorToString } from '../../../utils/error.js';

const log = logger('IO');

/*
	The IO Service queues the requests coming from REST & Services, the actual work is done through WorkerService
 */
@InRequestScope
export class IoService {
	@Inject
	public readonly orm!: OrmService;

	@Inject
	public readonly workerService!: WorkerService;

	public readonly artwork = new IoCommandsArtwork(this);
	public readonly folder = new IoCommandsFolder(this);
	public readonly root = new IoCommandsRoot(this);
	public readonly track = new IoCommandsTrack(this);
	public scanning = false;

	private readonly rootStatus = new Map<string, RootStatus>();
	private readonly queue: Array<IoRequest<WorkerRequestParameters>> = [];
	private readonly history: Array<{ id: string; error?: string; date: number }> = [];
	private current: IoRequest<WorkerRequestParameters> | undefined;
	private afterRefreshListeners: Array<() => Promise<void>> = [];
	private nextID: number = Date.now();
	private afterScanTimeout: ReturnType<typeof setTimeout> | undefined;

	private async runRequest(cmd: IoRequest<WorkerRequestParameters>): Promise<void> {
		this.clearAfterRefresh();
		this.rootStatus.set(cmd.parameters.rootID, { lastScan: Date.now(), scanning: true });
		try {
			this.current = cmd;
			await cmd.run();
			this.rootStatus.set(cmd.parameters.rootID, { lastScan: Date.now() });
			this.history.push({ id: cmd.id, date: Date.now() });
			this.current = undefined;
		} catch (error: unknown) {
			console.error(error);
			this.current = undefined;
			let message = errorToString(error);
			if (message.startsWith('Error:')) {
				message = message.slice(6).trim();
			}
			this.rootStatus.set(cmd.parameters.rootID, { lastScan: Date.now(), error: message });
			this.history.push({ id: cmd.id, error: message, date: Date.now() });
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
					.catch((error: unknown) => {
						console.error(error);
					});
			}
		}, 10_000);
	}

	private clearAfterRefresh(): void {
		if (this.afterScanTimeout) {
			clearTimeout(this.afterScanTimeout);
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
			.catch((error: unknown) => {
				this.scanning = false;
				log.error(error);
			});
	}

	generateRequestID(): string {
		this.nextID += 1;
		return this.nextID.toString();
	}

	addRequest<T extends WorkerRequestParameters>(req: IoRequest<T>): AdminChangeQueueInfo {
		this.queue.push(req as unknown as IoRequest<WorkerRequestParameters>);
		this.run();
		return this.getRequestInfo(req);
	}

	findRequest(rootID: string, mode: WorkerRequestMode): IoRequest<WorkerRequestParameters> | undefined {
		return this.queue.find(c => !!c.parameters.rootID && (c.parameters.rootID === rootID && c.mode === mode));
	}

	find(parameter: (cmd: IoRequest<WorkerRequestParameters>) => boolean): IoRequest<WorkerRequestParameters> | undefined {
		// eslint-disable-next-line unicorn/no-array-callback-reference
		return this.queue.find(parameter);
	}

	getRequestInfo<Y extends WorkerRequestParameters>(req: IoRequest<Y>): AdminChangeQueueInfo {
		const pos = this.queue.indexOf(req as unknown as IoRequest<WorkerRequestParameters>);
		return { id: req.id, pos: pos === -1 ? undefined : pos };
	}

	newRequest<Y extends WorkerRequestParameters>(mode: WorkerRequestMode, execute: (parameters: Y) => Promise<Changes>, parameters: Y): AdminChangeQueueInfo {
		const request: IoRequest<Y> = (new IoRequest<Y>(this.generateRequestID(), mode, execute, parameters));
		return this.addRequest<Y>(request);
	}

	getAdminChangeQueueInfoStatus(id: string): AdminChangeQueueInfo {
		if (this.current?.id === id) {
			return { id };
		}
		const cmd = this.queue.find(c => c.id === id);
		if (cmd) {
			const pos = this.queue.indexOf(cmd);
			return { id, pos: pos === -1 ? undefined : pos };
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
		status ??= { lastScan: Date.now() };
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
