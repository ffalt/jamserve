import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import tmp from 'tmp';

export async function fsStat(pathName: string): Promise<fs.Stats> {
	return new Promise<fs.Stats>((resolve, reject) => {
		fs.stat(pathName, (err, stat) => {
			if (err) {
				reject(err);
			} else {
				resolve(stat);
			}
		});
	});
}

export async function fileRename(source: string, dest: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		fs.rename(source, dest, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

export async function dirRename(source: string, dest: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		fs.rename(source, dest, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

export async function dirRead(pathName: string): Promise<Array<string>> {
	return new Promise<Array<string>>((resolve, reject) => {
		fs.readdir(pathName, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

export async function fileDelete(pathName: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		fs.unlink(pathName, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

export async function fileCopy(source: string, dest: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		fs.copyFile(source, dest, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

export async function fileWrite(pathName: string, data: string | Buffer): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		fs.writeFile(pathName, data, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

export async function fileDeleteIfExists(pathName: string): Promise<void> {
	const exists = await fileExists(pathName);
	if (exists) {
		return await fileDelete(pathName);
	}
}

export async function fileExists(pathName: string): Promise<boolean> {
	try {
		const stat = await fsStat(pathName);
		return stat.isFile();
	} catch (e) {
		if (e && e.code === 'ENOENT') {
			return false;
		} else {
			return Promise.reject(e);
		}
	}
}

export async function dirExist(pathName: string): Promise<boolean> {
	try {
		const stat = await fsStat(pathName);
		return stat.isDirectory();
	} catch (e) {
		if (e && e.code === 'ENOENT') {
			return false;
		} else {
			return Promise.reject(e);
		}
	}
}

export function fileSuffix(filename: string): string {
	return path.extname(filename).slice(1).toLowerCase();
}

export async function makePath(folder: string): Promise<void> {
	const exists = await dirExist(folder);
	if (exists) {
		return;
	}
	return new Promise<void>((resolve, reject) => {
		mkdirp(folder, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

export function replaceFileSystemChars(s: string, replace: string): string {
	return s.toString()
		.replace(/:/g, ' - ').replace(/  /g, ' ')
		.replace(/[\?\/!\\]/g, replace);
}

export async function tmpFile(): Promise<{ filename: string; cleanupCallback: () => void; }> {
	return new Promise<{ filename: string; cleanupCallback: () => void; }>((resolve, reject) => {
		tmp.file((err, filename, fd, cleanupCallback) => {
			if (err) {
				reject(err);
			} else {
				resolve({filename, cleanupCallback});
			}
		});
	});
}
