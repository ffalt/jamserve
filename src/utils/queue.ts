import asyncPool from 'tiny-async-pool';

export async function processQueue<T>(concurrent: number, list: Array<T>, process: (item: T) => Promise<void>): Promise<void> {
	if (list.length === 0) {
		return;
	}
	const maxConcurrent = 10;
	await asyncPool(maxConcurrent, list, process);
}
