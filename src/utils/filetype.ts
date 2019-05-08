import {AudioFormatType, FileTyp} from '../model/jam-types';
import {fileSuffix} from './fs-utils';

export const SupportedReadImageFormat = ['bmp', 'png', 'jpeg', 'jpg', 'gif', 'tiff'];
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
	if (SupportedReadImageFormat.indexOf(suffix) >= 0) {
		return FileTyp.IMAGE;
	}
	if (SupportedAudioFormat.indexOf(suffix as AudioFormatType) >= 0) {
		return FileTyp.AUDIO;
	}
	if (['tag'].indexOf(suffix) >= 0) {
		return FileTyp.TAG;
	}
	if (['bak'].indexOf(suffix) >= 0) {
		return FileTyp.BACKUP;
	}
	return FileTyp.OTHER;
}
