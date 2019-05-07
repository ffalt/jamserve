/***
 * based on https://github.com/npm/node-which
 * ISC
 *
 * https://github.com/isaacs/isexe
 * ISC
 */
import fse from 'fs-extra';
import path from 'path';

export const isWindows = process && (process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE || ''));

const cache: { [name: string]: string; } = {};

const COLON = isWindows ? ';' : ':';

interface PathInfo {
	env: string;
	ext: Array<string>;
	extExe: string;
}

function getPathInfo(cmd: string, opt: any): PathInfo {
	const colon = opt.colon || COLON;
	let pathEnv = opt.path || process.env.PATH || '';
	let pathExt = [''];

	pathEnv = pathEnv.split(colon);

	let pathExtExe = '';
	if (isWindows) {
		pathEnv.unshift(process.cwd());
		pathExtExe = (opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM');
		pathExt = pathExtExe.split(colon);
		// Always test the cmd itself first.  isexe will check to make sure
		// it's found in the pathExt set.
		if (cmd.indexOf('.') !== -1 && pathExt[0] !== '') {
			pathExt.unshift('');
		}
	}
	// If it has a slash, then we don't bother searching the pathenv.
	// just check the file itself, and that's it.
	if (cmd.match(/\//) || isWindows && cmd.match(/\\/)) {
		pathEnv = [''];
	}
	return {
		env: pathEnv,
		ext: pathExt,
		extExe: pathExtExe
	};
}

function checkWindowsMode(filename: string, options: { pathExt?: string }, stat: fse.Stats): boolean {
	if (!stat.isSymbolicLink() && !stat.isFile()) {
		return false;
	}
	const pathext = options.pathExt !== undefined ? options.pathExt : process.env.PATHEXT;
	if (!pathext) {
		return true;
	}
	const pathexts = pathext.split(';');
	if (pathexts.indexOf('') !== -1) {
		return true;
	}
	for (const pa of pathexts) {
		const p = pa.toLowerCase();
		if (p.length && filename.substr(-p.length).toLowerCase() === p) {
			return true;
		}
	}
	return false;
}

function checkMode(filename: string, options: { pathExt?: string }, stat: fse.Stats): boolean {
	const mod = stat.mode;
	const uid = stat.uid;
	const gid = stat.gid;
	const myUid = /*options.uid !== undefined ? options.uid :*/ process.getuid && process.getuid();
	const myGid = /*options.gid !== undefined ? options.gid :*/ process.getgid && process.getgid();
	const u = parseInt('100', 8);
	const g = parseInt('010', 8);
	const o = parseInt('001', 8);
	const ug = u | g;
	const ret = (mod & o) ||
		(mod & g) && gid === myGid ||
		(mod & u) && uid === myUid ||
		(mod & ug) && myUid === 0;
	return !!ret;
}

function isexeStat(filename: string, options: { pathExt?: string }, stat: fse.Stats): boolean {
	if (!stat.isFile()) {
		return false;
	}
	if (!isWindows) {
		return checkMode(filename, options, stat);
	} else {
		return checkWindowsMode(filename, options, stat);
	}
}

async function isExe(filename: string, options: { pathExt?: string }): Promise<boolean> {
	try {
		const stat = await fse.stat(filename);
		return isexeStat(filename, options, stat);
	} catch (e) {
		return false;
	}
}

export async function whichs(cmd: string, options?: { all?: boolean }): Promise<Array<string> | undefined> {
	const opt = options || {};
	const info = getPathInfo(cmd, opt);
	const pathEnv = info.env;
	const pathExt = info.ext;
	const pathExtExe = info.extExe;
	const found: Array<string> = [];

	for (let i = 0, l = pathEnv.length; i < l; i++) {
		let pathPart = pathEnv[i];
		if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"') {
			pathPart = pathPart.slice(1, -1);
		}

		let p = path.join(pathPart, cmd);
		if (!pathPart && /^\.[\\\/]/.test(cmd)) {
			p = cmd.slice(0, 2) + p;
		}
		for (let j = 0, ll = pathExt.length; j < ll; j++) {
			const cur = p + pathExt[j];
			try {
				const is = await isExe(cur, {pathExt: pathExtExe});
				if (is) {
					if (opt.all) {
						found.push(cur);
					} else {
						return [cur];
					}
				}
			} catch (ex) {
			}
		}
	}
	if (opt.all && found.length) {
		return found;
	}
}

async function which(name: string): Promise<string | undefined> {
	const result = await whichs(name);
	if (result) {
		return result[0];
	}
}

async function localBin(name: string): Promise<string | undefined> {
	const s = path.join('.', 'bin', 'tools', name, process.platform, process.arch, name) + (isWindows ? '.exe' : '');
	const exists = await fse.pathExists(s);
	if (exists) {
		return s;
	}
}

async function environment(envName: string): Promise<string | undefined> {
	const s = process.env[envName];
	if (s && s.length > 0) {
		const exists = await fse.pathExists(s);
		if (exists) {
			return s;
		}
	}
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
	}
	try {
		// Search in the PATH
		const s = await which(name);
		if (s && s.length > 0) {
			cache[name] = s;
			return s;
		}
	} catch (e) {
	}
	try {
		// Search in the PATH
		const s = await localBin(name);
		if (s && s.length > 0) {
			cache[name] = s;
			return s;
		}
	} catch (e) {
	}
}
