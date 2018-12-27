import {FileTyp} from '../../../types';
import path from 'path';
import {getFileType} from '../../../utils/filetype';
import Logger from '../../../utils/logger';
import fse from 'fs-extra';
import {ensureTrailingPathSeparator} from '../../../utils/fs-utils';

const log = Logger('IO.scan');

export interface ScanDir {
	name: string;
	stat: {
		ctime: number,
		mtime: number,
	};
	directories: Array<ScanDir>;
	files: Array<ScanFile>;
}

export interface ScanFile {
	name: string;
	type: FileTyp;
	stat: {
		ctime: number,
		mtime: number,
		size: number
	};
}

async function scanDirR(dir: string, stat: fse.Stats): Promise<ScanDir> {
	log.debug('Scanning Directory', dir);
	const result: ScanDir = {
		name: ensureTrailingPathSeparator(dir),
		stat: {
			ctime: stat.ctime.valueOf(),
			mtime: stat.mtime.valueOf()
		},
		directories: [],
		files: []
	};
	const folders: Array<{ dir: string, stat: fse.Stats }> = [];
	const list = await fse.readdir(dir);
	for (const filename of list) {
		if (filename[0] !== '.') {
			const sub = path.join(dir, filename);
			const subStat = await fse.stat(sub);
			if (subStat.isDirectory()) {
				folders.push({dir: sub, stat: subStat});
			} else {
				const file: ScanFile = {
					name: sub,
					type: getFileType(sub),
					stat: {
						ctime: subStat.ctime.valueOf(),
						mtime: subStat.mtime.valueOf(),
						size: subStat.size
					}
				};
				result.files.push(file);
			}
		}
	}
	for (const folder of folders) {
		const sub = await scanDirR(folder.dir, folder.stat);
		result.directories.push(sub);
	}
	return result;
}

export async function scanDir(dir: string): Promise<ScanDir> {
	const stat = await fse.stat(dir);
	return scanDirR(dir, stat);
}
