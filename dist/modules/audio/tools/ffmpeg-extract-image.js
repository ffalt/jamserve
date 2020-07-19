"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFFmpegImage = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
async function extractFFmpegImage(filename, index, stream) {
    return new Promise((resolve, reject) => {
        const proc = fluent_ffmpeg_1.default({ source: filename })
            .addOption('-map', `0:${index}`)
            .toFormat('mjpeg')
            .on('end', () => {
            resolve();
        })
            .on('error', err => {
            reject(err);
        });
        proc.writeToStream(stream, { end: true });
    });
}
exports.extractFFmpegImage = extractFFmpegImage;
//# sourceMappingURL=ffmpeg-extract-image.js.map