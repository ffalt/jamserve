export class DebouncePromises<T> {
	private readonly pendingPromises = new Map<string, Array<(error?: unknown, result?: T) => void>>();

	private getPendingArray(id: string): Array<(error?: unknown, result?: T) => void> {
		return this.pendingPromises.get(id) ?? [];
	}

	async append(id: string): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			const run = (error?: unknown, result?: T): void => {
				if (error) {
					reject(error as unknown);
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
		for (const callback of pending) {
			callback(undefined, result);
		}
	}

	reject(id: string, error: unknown): void {
		const pending = this.getPendingArray(id);
		this.pendingPromises.delete(id);
		for (const callback of pending) {
			callback(error);
		}
	}
}
