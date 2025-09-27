import asyncPool from 'tiny-async-pool';
export async function processQueue(_concurrent, list, process) {
    if (list.length === 0) {
        return;
    }
    const maxConcurrent = 10;
    for await (const _ of asyncPool(maxConcurrent, list, process)) {
    }
}
//# sourceMappingURL=queue.js.map