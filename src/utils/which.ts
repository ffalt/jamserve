import fse from 'fs-extra';
import path from 'node:path';
import which from 'which';

export const isWindows = ['win32', 'cygwin', 'msys'].includes(process.platform);

const cache: Record<string, string> = {};

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
	} catch {
		// nop
	}
	try {
		// Search in the PATH
		const s = await which(name);
		if (s && s.length > 0) {
			cache[name] = s;
			return s;
		}
	} catch {
		// nop
	}
	try {
		// Search in the PATH
		const s = await localBin(name);
		if (s && s.length > 0) {
			cache[name] = s;
			return s;
		}
	} catch {
		// nop
	}
	return;
}
