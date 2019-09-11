import {AudioFormatType, FileTyp} from '../model/jam-types';
import {fileSuffix} from './fs-utils';

// TODO: 'bmp' is not supported by sharp, preconvert with jimp?
export const SupportedReadImageFormat = ['png', 'jpeg', 'jpg', 'gif', 'tiff'];
export const SupportedWriteImageFormat = ['png', 'jpeg', 'jpg', 'tiff'];

export const SupportedAudioFormat: Array<AudioFormatType> = [
	AudioFormatType.mp3,
	AudioFormatType.flac,
	AudioFormatType.m4a,
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
	AudioFormatType.m4a
];

export function getFileType(filename: string): FileTyp {
	const suffix = fileSuffix(filename);
	if (SupportedReadImageFormat.includes(suffix)) {
		return FileTyp.IMAGE;
	}
	if (SupportedAudioFormat.includes(suffix as AudioFormatType)) {
		return FileTyp.AUDIO;
	}
	if (['tag'].includes(suffix)) {
		return FileTyp.TAG;
	}
	if (['bak'].includes(suffix)) {
		return FileTyp.BACKUP;
	}
	return FileTyp.OTHER;
}
