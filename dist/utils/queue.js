import asyncPool from 'tiny-async-pool';
export async function processQueue(concurrent, list, process) {
    if (list.length === 0) {
        return;
    }
    const maxConcurrent = 10;
    await asyncPool(maxConcurrent, list, process);
}
//# sourceMappingURL=queue.js.map