import {FileTyp} from '../../../model/jam-types';
import {Folder, FolderTag} from '../../folder/folder.model';
import {Track} from '../../track/track.model';
import {MetaStat} from './match-dir.meta-stats';

export interface MatchDir {
	name: string;
	rootID: string;
	stat: {
		ctime: number;
		mtime: number;
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
		ctime: number;
		mtime: number;
		size: number;
	};
	rootID: string;
	track?: Track;
}
