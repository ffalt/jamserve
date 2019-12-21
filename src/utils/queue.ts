import PQueue from 'p-queue';

export async function processQueue<T>(concurrent: number, list: Array<T>, process: (item: T) => Promise<void>): Promise<void> {
	if (list.length === 0) {
		return;
	}
	const q = new PQueue({concurrency: 10});
	// console.log('start');
	for (const item of list) {
		// console.log(folder.dir, 'add');
		q.add(async () => {
			await process(item);
		}).then(() => {
			// console.log(folder.dir, 'added');
		});
	}
	await q.onIdle();
}
