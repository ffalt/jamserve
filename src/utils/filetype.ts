import { fileSuffix } from './fs-utils.js';
import { AudioFormatType, FileTyp } from '../types/enums.js';

// TODO: 'bmp' is not supported by sharp, preconvert with jimp?
export const SupportedReadImageFormat = ['png', 'jpeg', 'jpg', 'gif', 'tiff', 'webp'];
export const SupportedWriteImageFormat = ['png', 'jpeg', 'jpg', 'tiff', 'webp'];

export const SupportedAudioFormat: Array<AudioFormatType> = [
	AudioFormatType.mp3,
	AudioFormatType.flac,
	AudioFormatType.m4a,
	AudioFormatType.mp4,
	AudioFormatType.ogg,
	AudioFormatType.oga,
	AudioFormatType.webma,
	AudioFormatType.wav
];
export const SupportedTranscodeAudioFormat: Array<AudioFormatType> = [
	AudioFormatType.mp3,
	AudioFormatType.flv,
	AudioFormatType.ogg,
	AudioFormatType.oga,
	AudioFormatType.flac,
	AudioFormatType.wav,
	AudioFormatType.webma,
	AudioFormatType.mp4,
	AudioFormatType.m4a
];

export function getFileType(filename: string): FileTyp {
	const suffix = fileSuffix(filename);
	if (SupportedReadImageFormat.includes(suffix)) {
		return FileTyp.image;
	}
	if (SupportedAudioFormat.includes(suffix as AudioFormatType)) {
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
