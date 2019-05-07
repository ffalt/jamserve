export class DebouncePromises<T> {
	private pendingPromises: { [id: string]: Array<any> } = {};

	async append(id: string): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			const run = (err: Error | null, result: T) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			};
			this.pendingPromises[id].push(run);
		});
	}

	setPending(id: string): void {
		this.pendingPromises[id] = [];
	}

	isPending(id: string): boolean {
		return !!this.pendingPromises[id];
	}

	resolve(id: string, result: T): void {
		for (const cb of this.pendingPromises[id]) {
			cb(null, result);
		}
		delete this.pendingPromises[id];
	}

	reject(id: string, error: Error): void {
		for (const cb of this.pendingPromises[id]) {
			cb(error);
		}
		delete this.pendingPromises[id];
	}

}
