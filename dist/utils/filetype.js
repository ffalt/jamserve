"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileType = exports.SupportedTranscodeAudioFormat = exports.SupportedAudioFormat = exports.SupportedWriteImageFormat = exports.SupportedReadImageFormat = void 0;
const fs_utils_1 = require("./fs-utils");
const enums_1 = require("../types/enums");
exports.SupportedReadImageFormat = ['png', 'jpeg', 'jpg', 'gif', 'tiff'];
exports.SupportedWriteImageFormat = ['png', 'jpeg', 'jpg', 'tiff'];
exports.SupportedAudioFormat = [
    enums_1.AudioFormatType.mp3,
    enums_1.AudioFormatType.flac,
    enums_1.AudioFormatType.m4a,
    enums_1.AudioFormatType.mp4,
    enums_1.AudioFormatType.ogg,
    enums_1.AudioFormatType.oga,
    enums_1.AudioFormatType.webma,
    enums_1.AudioFormatType.wav
];
exports.SupportedTranscodeAudioFormat = [
    enums_1.AudioFormatType.mp3,
    enums_1.AudioFormatType.flv,
    enums_1.AudioFormatType.ogg,
    enums_1.AudioFormatType.oga,
    enums_1.AudioFormatType.flac,
    enums_1.AudioFormatType.wav,
    enums_1.AudioFormatType.webma,
    enums_1.AudioFormatType.mp4,
    enums_1.AudioFormatType.m4a
];
function getFileType(filename) {
    const suffix = fs_utils_1.fileSuffix(filename);
    if (exports.SupportedReadImageFormat.includes(suffix)) {
        return enums_1.FileTyp.image;
    }
    if (exports.SupportedAudioFormat.includes(suffix)) {
        return enums_1.FileTyp.audio;
    }
    if (['tag'].includes(suffix)) {
        return enums_1.FileTyp.tag;
    }
    if (['bak'].includes(suffix)) {
        return enums_1.FileTyp.backup;
    }
    return enums_1.FileTyp.other;
}
exports.getFileType = getFileType;
//# sourceMappingURL=filetype.js.map