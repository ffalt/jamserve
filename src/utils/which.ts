import fse from 'fs-extra';
import path from 'path';
import which from 'which';

export const isWindows = ['win32', 'cygwin', 'msys'].includes(process.platform);

const cache: { [name: string]: string } = {};

async function whichAsync(name: string): Promise<string | undefined> {
	return new Promise<string | undefined>((resolve, reject) => {
		which(name, (err, resolvedPath) => {
			if (err) {
				reject(err);
			} else {
				resolve(resolvedPath);
			}
		});
	});
}

async function localBin(name: string): Promise<string | undefined> {
	const s = path.join('.', 'bin', 'tools', name, process.platform, process.arch, name) + (isWindows ? '.exe' : '');
	const exists = await fse.pathExists(s);
	if (exists) {
		return s;
	}
	return;
}

async function environment(envName: string): Promise<string | undefined> {
	const s = process.env[envName];
	if (s && s.length > 0) {
		const exists = await fse.pathExists(s);
		if (exists) {
			return s;
		}
	}
	return;
}

export async function getBinPath(name: string, envName: string): Promise<string | undefined> {
	if (name in cache) {
		return cache[name];
	}
	try {
		// Try envName
		const s = await environment(envName);
		if (s && s.length > 0) {
			cache[name] = s;
			return s;
		}
	} catch (e) {
		// nop
	}
	try {
		// Search in the PATH
		const s = await whichAsync(name);
		if (s && s.length > 0) {
			cache[name] = s;
			return s;
		}
	} catch (e) {
		// nop
	}
	try {
		// Search in the PATH
		const s = await localBin(name);
		if (s && s.length > 0) {
			cache[name] = s;
			return s;
		}
	} catch (e) {
		// nop
	}
	return;
}
