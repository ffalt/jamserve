"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processQueue = void 0;
const p_queue_1 = __importDefault(require("p-queue"));
async function processQueue(concurrent, list, process) {
    if (list.length === 0) {
        return;
    }
    const q = new p_queue_1.default({ concurrency: 10 });
    for (const item of list) {
        q.add(async () => {
            await process(item);
        }).then(() => {
        });
    }
    await q.onIdle();
}
exports.processQueue = processQueue;
//# sourceMappingURL=queue.js.map