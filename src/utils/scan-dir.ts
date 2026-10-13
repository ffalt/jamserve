import fse from 'fs-extra';
import path from 'node:path';
import { logger } from './logger.js';
import { FileTyp } from '../types/enums.js';
import { ensureTrailingPathSeparator } from './fs-utils.js';
import { processQueue } from './queue.js';
import { getFileType } from './filetype.js';

const log = logger('IO.DirScanner');
const MAX_RECURSION_DEPTH = 50;
// Directories read at the same time, for the whole walk. Reading them recursively with
// a queue of its own per directory multiplies the limit with every level of the tree.
const MAX_CONCURRENT_DIRS = 10;

export interface ScanDir {
	path: string;
	level: number;
	ctime: Date;
	mtime: Date;
	directories: Array<ScanDir>;
	files: Array<ScanFile>;
}

export interface ScanFile {
	path: string;
	type: FileTyp;
	ctime: Date;
	mtime: Date;
	size: number;
}

export class DirScanner {
	private static createDir(dir: string, stat: fse.Stats, level: number): ScanDir {
		return {
			path: ensureTrailingPathSeparator(dir),
			level,
			ctime: stat.ctime,
			mtime: stat.mtime,
			directories: [],
			files: []
		};
	}

	// Read the entries of one directory into it and return the sub directories to be read next.
	private async readDir(node: ScanDir): Promise<Array<ScanDir>> {
		log.debug('Scanning:', node.path);
		// Check recursion depth limit to prevent stack overflow
		if (node.level >= MAX_RECURSION_DEPTH) {
			log.warn(`Maximum recursion depth (${MAX_RECURSION_DEPTH}) reached at ${node.path}, stopping scan`);
			return [];
		}
		const subDirectories: Array<ScanDir> = [];
		const list = await fse.readdir(node.path);
		for (const filename of list) {
			if (filename.startsWith('.')) {
				continue;
			}

			const sub = path.join(node.path, filename);
			const subStat = await fse.stat(sub);
			if (subStat.isDirectory()) {
				const subDir = DirScanner.createDir(sub, subStat, node.level + 1);
				node.directories.push(subDir);
				subDirectories.push(subDir);
			} else {
				const file: ScanFile = {
					path: sub,
					type: getFileType(sub),
					ctime: subStat.ctime,
					mtime: subStat.mtime,
					size: subStat.size
				};
				node.files.push(file);
			}
		}
		return subDirectories;
	}

	public async scan(dir: string): Promise<ScanDir> {
		log.info('Scanning Directory', dir);
		const stat = await fse.stat(dir);
		const root = DirScanner.createDir(dir, stat, 0);
		// walk level by level, so the number of directories read at the same time stays limited
		let level = [root];
		while (level.length > 0) {
			const next: Array<ScanDir> = [];
			await processQueue<ScanDir>(MAX_CONCURRENT_DIRS, level, async node => {
				next.push(...await this.readDir(node));
			});
			level = next;
		}
		return root;
	}
}
