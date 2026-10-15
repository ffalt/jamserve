import asyncPool from 'tiny-async-pool';
export async function processQueue(concurrent, list, process) {
    if (list.length === 0) {
        return;
    }
    const pool = asyncPool(Math.max(1, concurrent), list, process);
    for await (const _ of pool) {
    }
}
//# sourceMappingURL=queue.js.map