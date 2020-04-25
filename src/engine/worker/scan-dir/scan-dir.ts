import fse from 'fs-extra';
import path from 'path';
import {FileTyp} from '../../../model/jam-types';
import {getFileType} from '../../../utils/filetype';
import {ensureTrailingPathSeparator} from '../../../utils/fs-utils';
import {logger} from '../../../utils/logger';
import {processQueue} from '../../../utils/queue';

const log = logger('IO.DirScanner');

export interface ScanDir {
	name: string;
	rootID: string;
	stat: {
		ctime: number;
		mtime: number;
	};
	directories: Array<ScanDir>;
	files: Array<ScanFile>;
}

export interface ScanFile {
	name: string;
	type: FileTyp;
	stat: {
		ctime: number;
		mtime: number;
		size: number;
	};
}

export class DirScanner {

	private async scanDirR(dir: string, stat: fse.Stats, rootID: string): Promise<ScanDir> {
		log.debug('Scanning:', dir);
		const result: ScanDir = {
			name: ensureTrailingPathSeparator(dir),
			stat: {
				ctime: stat.ctime.valueOf(),
				mtime: stat.mtime.valueOf()
			},
			rootID,
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
		if (folders.length > 0) {
			await processQueue<{ dir: string; stat: fse.Stats }>(3, folders, async folder => {
				const sub = await this.scanDirR(folder.dir, folder.stat, rootID);
				result.directories.push(sub);
			});
		}
		return result;
	}

	public async scan(dir: string, rootID: string): Promise<ScanDir> {
		log.info('Scanning Root', dir);
		const stat = await fse.stat(dir);
		return this.scanDirR(dir, stat, rootID);
	}

}
