"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = void 0;
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const request_1 = __importDefault(require("request"));
const fs_utils_1 = require("./fs-utils");
async function downloadFile(url, filename) {
    return new Promise((resolve, reject) => {
        request_1.default.get(url)
            .on('error', (err) => {
            reject(err);
        })
            .on('complete', (res) => {
            if (res.statusCode !== 200) {
                fs_utils_1.fileDeleteIfExists(filename).then(() => {
                    reject(new Error(http_1.default.STATUS_CODES[res.statusCode]));
                }).catch(_ => {
                    reject(new Error(http_1.default.STATUS_CODES[res.statusCode]));
                });
            }
            else {
                resolve();
            }
        })
            .pipe(fs_1.default.createWriteStream(filename));
    });
}
exports.downloadFile = downloadFile;
//# sourceMappingURL=download.js.map