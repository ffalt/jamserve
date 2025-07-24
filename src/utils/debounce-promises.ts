export class DebouncePromises<T> {
	private readonly pendingPromises = new Map<string, Array<(error?: Error, result?: T) => void>>();

	private getPendingArray(id: string): Array<(error?: Error, result?: T) => void> {
		return this.pendingPromises.get(id) || [];
	}

	async append(id: string): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			const run = (error?: Error, result?: T): void => {
				if (error) {
					reject(error);
				} else if (result) {
					resolve(result);
				} else {
					reject(new Error('Invalid Promise Result'));
				}
			};
			this.pendingPromises.set(id, [...this.getPendingArray(id), run]);
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
			cb(undefined, result);
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
