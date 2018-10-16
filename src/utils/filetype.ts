import {FileTyp} from '../types';
import {fileSuffix} from './fs-utils';

export const SupportedImageFormat = ['bmp', 'png', 'jpeg', 'jpg', 'gif'];

export const SupportedAudioFormat = ['mp3', 'flac', 'm4a', 'ogg', 'oga', 'webma', 'wav'];

export function getFileType(filename: string): FileTyp {
	const suffix = fileSuffix(filename);
	if (SupportedImageFormat.indexOf(suffix) >= 0) {
		return FileTyp.IMAGE;
	} else if (SupportedAudioFormat.indexOf(suffix) >= 0) {
		return FileTyp.AUDIO;
	} else if (['tag'].indexOf(suffix) >= 0) {
		return FileTyp.TAG;
	} else if (['bak'].indexOf(suffix) >= 0) {
		return FileTyp.BACKUP;
	}
	return FileTyp.OTHER;
}
