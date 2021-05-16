"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processQueue = void 0;
const tiny_async_pool_1 = __importDefault(require("tiny-async-pool"));
async function processQueue(concurrent, list, process) {
    if (list.length === 0) {
        return;
    }
    const maxConcurrent = 10;
    await tiny_async_pool_1.default(maxConcurrent, list, process);
}
exports.processQueue = processQueue;
//# sourceMappingURL=queue.js.map