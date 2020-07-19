import fse from 'fs-extra';
import path from 'path';
import {logger} from './logger';
import {FileTyp} from '../types/enums';
import {ensureTrailingPathSeparator} from './fs-utils';
import {processQueue} from './queue';
import {getFileType} from './filetype';

const log = logger('IO.DirScanner');

export interface ScanDir {
	path: string;
	level: number;
	ctime: number;
	mtime: number;
	directories: Array<ScanDir>;
	files: Array<ScanFile>;
}

export interface ScanFile {
	path: string;
	type: FileTyp;
	ctime: number;
	mtime: number;
	size: number;
}

export class DirScanner {

	private async scanDirR(dir: string, stat: fse.Stats, level: number): Promise<ScanDir> {
		log.debug('Scanning:', dir);
		const result: ScanDir = {
			path: ensureTrailingPathSeparator(dir),
			level,
			ctime: stat.ctime.valueOf(),
			mtime: stat.mtime.valueOf(),
			directories: [],
			files: []
		};
		const folders: Array<{ dir: string; stat: fse.Stats }> = [];
		const list = await fse.readdir(dir);
		for (const filename of list) {
			if (filename[0] !== '.') {
				const sub = path.join(dir, filename);
				const subStat = await fse.stat(sub);
				if (subStat.isDirectory()) {
					folders.push({dir: sub, stat: subStat});
				} else {
					const file: ScanFile = {
						path: sub,
						type: getFileType(sub),
						ctime: subStat.ctime.valueOf(),
						mtime: subStat.mtime.valueOf(),
						size: subStat.size
					};
					result.files.push(file);
				}
			}
		}
		if (folders.length > 0) {
			await processQueue<{ dir: string; stat: fse.Stats }>(3, folders, async folder => {
				const sub = await this.scanDirR(folder.dir, folder.stat, level + 1);
				result.directories.push(sub);
			});
		}
		return result;
	}

	public async scan(dir: string): Promise<ScanDir> {
		log.info('Scanning Directory', dir);
		const stat = await fse.stat(dir);
		return this.scanDirR(dir, stat, 0);
	}

}
