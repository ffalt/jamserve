import {FileTyp} from '../types';
import path from 'path';
import fs from 'fs';
import {getFileType} from '../utils/filetype';
import Logger from '../utils/logger';
import {dirRead, fsStat} from '../utils/fs-utils';

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

async function scanDirR(dir: string, stat: fs.Stats): Promise<ScanDir> {
	log.debug('Scanning Directory', dir);
	const result: ScanDir = {
		name: dir,
		stat: {
			ctime: stat.ctime.valueOf(),
			mtime: stat.mtime.valueOf()
		},
		directories: [],
		files: []
	};
	const folders: Array<{ dir: string, stat: fs.Stats }> = [];
	const list = await dirRead(dir);
	for (const filename of list) {
		if (filename[0] !== '.') {
			const sub = path.join(dir, filename);
			const substat = await fsStat(sub);
			if (substat.isDirectory()) {
				folders.push({dir: sub, stat: substat});
			} else {
				const file: ScanFile = {
					name: sub,
					type: getFileType(sub),
					stat: {
						ctime: substat.ctime.valueOf(),
						mtime: substat.mtime.valueOf(),
						size: substat.size
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
	const stat = await fsStat(dir);
	return scanDirR(dir, stat);
}
