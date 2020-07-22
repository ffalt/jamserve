import PQueue from 'p-queue';

export async function processQueue<T>(concurrent: number, list: Array<T>, process: (item: T) => Promise<void>): Promise<void> {
	if (list.length === 0) {
		return;
	}
	const q = new PQueue({concurrency: 10});
	for (const item of list) {
		q.add(async () => {
			await process(item);
		}).then(() => {
			// 
		});
	}
	await q.onIdle();
}
