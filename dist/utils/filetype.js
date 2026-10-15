import { fileSuffix } from './fs-utils.js';
import { AudioFormatType, FileTyp } from '../types/enums.js';
export const SupportedReadImageFormat = ['png', 'jpeg', 'jpg', 'gif', 'tiff', 'webp'];
export const SupportedWriteImageFormat = ['png', 'jpeg', 'jpg', 'tiff', 'webp'];
export const SupportedAudioFormat = [
    AudioFormatType.mp3,
    AudioFormatType.flac,
    AudioFormatType.m4a,
    AudioFormatType.m4b,
    AudioFormatType.mp4,
    AudioFormatType.ogg,
    AudioFormatType.oga,
    AudioFormatType.webma,
    AudioFormatType.wav
];
export const SupportedTranscodeAudioFormat = [
    AudioFormatType.mp3,
    AudioFormatType.flv,
    AudioFormatType.ogg,
    AudioFormatType.oga,
    AudioFormatType.flac,
    AudioFormatType.wav,
    AudioFormatType.webma,
    AudioFormatType.mp4,
    AudioFormatType.m4b,
    AudioFormatType.m4a
];
export function isAudioFormatType(suffix) {
    return Object.values(AudioFormatType).includes(suffix);
}
export function isSupportedAudioFormat(suffix) {
    return SupportedAudioFormat.includes(suffix);
}
export function getFileType(filename) {
    const suffix = fileSuffix(filename);
    if (SupportedReadImageFormat.includes(suffix)) {
        return FileTyp.image;
    }
    if (isSupportedAudioFormat(suffix)) {
        return FileTyp.audio;
    }
    if (['tag'].includes(suffix)) {
        return FileTyp.tag;
    }
    if (['bak'].includes(suffix)) {
        return FileTyp.backup;
    }
    return FileTyp.other;
}
//# sourceMappingURL=filetype.js.map