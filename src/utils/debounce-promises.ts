export class DebouncePromises<T> {
	private pendingPromises = new Map<string, Array<(err: Error | null, result?: T) => void>>();

	private getPendingArray(id: string): Array<(err: Error | null, result?: T) => void> {
		return this.pendingPromises.get(id) || [];
	}

	async append(id: string): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			const run = (err: Error | null, result?: T): void => {
				if (err) {
					reject(err);
				} else if (!result) {
					reject(new Error('Invalid Promise Result'));
				} else {
					resolve(result);
				}
			};
			this.pendingPromises.set(id, this.getPendingArray(id).concat([run]));
		});
	}

	setPending(id: string): void {
		this.pendingPromises.set(id, []);
	}

	isPending(id: string): boolean {
		return !!this.pendingPromises.get(id);
	}

	resolve(id: string, result: T): void {
		const pending = this.getPendingArray(id);
		this.pendingPromises.delete(id);
		for (const cb of pending) {
			cb(null, result);
		}
	}

	reject(id: string, error: Error): void {
		const pending = this.getPendingArray(id);
		this.pendingPromises.delete(id);
		for (const cb of pending) {
			cb(error);
		}
	}
}
