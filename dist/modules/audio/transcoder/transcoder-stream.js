"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscoderStream = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const filetype_1 = require("../../../utils/filetype");
const logger_1 = require("../../../utils/logger");
const enums_1 = require("../../../types/enums");
const log = logger_1.logger('transcoder.stream');
class TranscoderStream {
    static needsTranscoding(mediaFormat, format, maxBitRate) {
        return (format !== mediaFormat) || (maxBitRate > 0);
    }
    static validTranscoding(format) {
        return filetype_1.SupportedTranscodeAudioFormat.includes(format);
    }
    static async getAvailableFormats() {
        return new Promise((resolve, reject) => {
            fluent_ffmpeg_1.default().getAvailableFormats((err, formats) => {
                if (err || !formats) {
                    return reject(err);
                }
                resolve(Object.keys(formats).filter(key => formats[key].canDemux).map(key => {
                    return { format: key, name: formats[key].description };
                }));
            });
        });
    }
    static getTranscodeProc(source, format, maxBitRate) {
        const proc = fluent_ffmpeg_1.default({ source })
            .withNoVideo();
        switch (format) {
            case enums_1.AudioFormatType.flv:
                return proc.toFormat(format).addOptions(['-ar 44100', `-maxrate ${maxBitRate || 128}k`]);
            case enums_1.AudioFormatType.ogg:
            case enums_1.AudioFormatType.oga:
                return proc.toFormat(format)
                    .withAudioCodec('libvorbis')
                    .addOptions([`-maxrate ${maxBitRate || 128}k`]);
            case enums_1.AudioFormatType.mp3:
                return proc
                    .toFormat(format)
                    .withAudioBitrate(`${maxBitRate || 128}k`)
                    .withAudioCodec('libmp3lame');
            case enums_1.AudioFormatType.mp4:
            case enums_1.AudioFormatType.m4a:
                return proc
                    .toFormat('mp4')
                    .withAudioBitrate(`${maxBitRate || 128}k`);
            case enums_1.AudioFormatType.webma:
                return proc
                    .toFormat('webm')
                    .withAudioBitrate(`${maxBitRate || 128}k`);
            default:
                return proc
                    .toFormat(format)
                    .withAudioBitrate(`${maxBitRate || 128}k`);
        }
    }
    static async transcodeToFile(source, destination, format, maxBitRate) {
        return new Promise((resolve, reject) => {
            const proc = TranscoderStream.getTranscodeProc(source, format, maxBitRate);
            proc
                .on('start', cmd => {
                log.debug(`ffmpeg started with ${cmd}`);
            })
                .on('end', () => {
                resolve();
            })
                .on('error', (err) => {
                reject(err);
            })
                .save(destination);
        });
    }
}
exports.TranscoderStream = TranscoderStream;
//# sourceMappingURL=transcoder-stream.js.map