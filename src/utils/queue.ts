import asyncPool from 'tiny-async-pool';

export async function processQueue<T>(concurrent: number, list: Array<T>, process: (item: T) => Promise<void>): Promise<void> {
	if (list.length === 0) {
		return;
	}
	const pool = asyncPool(Math.max(1, concurrent), list, process);
	for await (const _ of pool) {
		//
	}
}
