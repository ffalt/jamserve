import { WorkerRequestParameters } from '../worker/worker.types.js';
import { IoRequest } from './io.types.js';

interface DelayedRequest<T extends WorkerRequestParameters> {
	request: IoRequest<T>;
	rootID: string;
	timeout?: ReturnType<typeof setTimeout>;
}

export class DelayedRequests<T extends WorkerRequestParameters> {
	requests = new Map<string, DelayedRequest<T>>();

	findbyID(id: string): DelayedRequest<T> | undefined {
		for (const d of this.requests) {
			if (d[1].request.id === id) {
				return d[1];
			}
		}
		return;
	}

	findByRoot(rootID: string): DelayedRequest<T> | undefined {
		return this.requests.get(rootID);
	}

	register(rootID: string, request: IoRequest<T>): DelayedRequest<T> {
		const cmd = { request, timeout: undefined, rootID };
		this.requests.set(rootID, cmd);
		return cmd;
	}

	startTimeOut(delayedCmd: DelayedRequest<T>, onStart: (request: IoRequest<T>) => void): void {
		if (delayedCmd.timeout) {
			clearTimeout(delayedCmd.timeout);
		}
		delayedCmd.timeout = setTimeout(() => {
			this.requests.delete(delayedCmd.rootID);
			onStart(delayedCmd.request);
		}, 10000);
	}
}
