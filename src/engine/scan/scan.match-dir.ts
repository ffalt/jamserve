import {FileTyp} from '../../model/jam-types';
import {Folder, FolderTag} from '../folder/folder.model';
import {Track} from '../track/track.model';
import {MetaStat} from './scan.metastats';

export interface MatchDir {
	name: string;
	rootID: string;
	stat: {
		ctime: number,
		mtime: number
	};
	directories: Array<MatchDir>;
	files: Array<MatchFile>;
	level: number;
	tag?: FolderTag;
	parent?: MatchDir;
	folder?: Folder;
	metaStat?: MetaStat;
}

export interface MatchFile {
	name: string;
	type: FileTyp;
	stat: {
		ctime: number,
		mtime: number,
		size: number
	};
	rootID: string;
	track?: Track;
}

/*
export function debugPrintTree(match: MatchDir, level: number = 0) {
	const prefix = ' '.repeat(level);
	if (match.folder) {
		console.log(prefix + '📁 ' + path.basename(match.name), '[' + match.folder.tag.type + ']', FolderTypesAlbum.indexOf(match.folder.tag.type) >= 0 ? '[' + match.folder.tag.albumType + ']' : '');
	} else {
		console.log(prefix + '📁 ' + path.basename(match.name), '[new]');
	}
	// console.log(prefix + JSON.stringify(match.tag));
	for (const sub of match.directories) {
		debugPrintTree(sub, level + 1);
	}
	// if (wFiles) {
	// 	for (const f of match.files) {
	// 		if (f.type === FileTyp.AUDIO) {
	// 			console.log(prefix + ' 🎧 ' + path.basename(f.name), f.track ? '' : '[new]');
	// 		}
	// 	}
	// }
}
*/
