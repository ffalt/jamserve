"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = void 0;
const fs_1 = __importDefault(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_utils_1 = require("./fs-utils");
async function downloadFile(url, filename) {
    const response = await node_fetch_1.default(url);
    if (!response.ok) {
        throw new Error(`Unexpected Response ${response.statusText}`);
    }
    return new Promise((resolve, reject) => {
        const dest = fs_1.default.createWriteStream(filename);
        response.body.pipe(dest);
        dest.on('close', () => resolve());
        dest.on('error', (e) => {
            fs_utils_1.fileDeleteIfExists(filename).then(() => {
                reject(e);
            }).catch(_ => {
                reject(e);
            });
        });
    });
}
exports.downloadFile = downloadFile;
//# sourceMappingURL=download.js.map