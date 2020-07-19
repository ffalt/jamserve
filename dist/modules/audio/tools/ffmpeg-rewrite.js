"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewriteWriteFFmpeg = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const fs_utils_1 = require("../../../utils/fs-utils");
async function rewriteWriteFFmpeg(filename, destination) {
    return new Promise((resolve, reject) => {
        const proc = fluent_ffmpeg_1.default({ source: filename })
            .addOption('-c:a', 'copy')
            .addOption('-c:v', 'copy')
            .addOption('-map_metadata', '-1')
            .output(destination)
            .format(fs_utils_1.fileSuffix(filename));
        proc.on('end', () => {
            resolve();
        }).on('error', err => {
            reject(err);
        });
        proc.run();
    });
}
exports.rewriteWriteFFmpeg = rewriteWriteFFmpeg;
//# sourceMappingURL=ffmpeg-rewrite.js.map