import fs from 'fs';
import path from 'path';
import {NodeDataCallback} from '../typings';
import {fileExists} from './fs-utils';

const isWindows = process && (process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE || ''));

const cache: { [name: string]: string; } = {};

const COLON = isWindows ? ';' : ':';

function getPathInfo(cmd: string, opt: any) {
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

function getNotFoundError(cmd: string): Error {
	const er = new Error('not found: ' + cmd);
	(<any>er).code = 'ENOENT';
	return er;
}

function checkWindowsMode(filename: string, options: { pathExt?: string }, stat: fs.Stats): boolean {
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
	for (let i = 0; i < pathexts.length; i++) {
		const p = pathexts[i].toLowerCase();
		if (p && filename.substr(-p.length).toLowerCase() === p) {
			return true;
		}
	}
	return false;
}

function checkMode(filename: string, options: { pathExt?: string }, stat: fs.Stats): boolean {
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

function isexeStat(filename: string, options: { pathExt?: string }, stat: fs.Stats) {
	if (!stat.isFile()) {
		return false;
	}
	if (!isWindows) {
		return checkMode(filename, options, stat);
	} else {
		return checkWindowsMode(filename, options, stat);
	}
}

function isexe(filename: string, options: { pathExt?: string }, cb: NodeDataCallback<boolean>) {
	fs.stat(filename, (err, stat) => {
		cb(err, err ? false : isexeStat(filename, options, stat));
	});
}

export function whichs(cmd: string, cb: (error: Error | null, result?: Array<string>) => void) {
	const opt: { all?: boolean } = {};
	const info = getPathInfo(cmd, opt);
	const pathEnv = info.env;
	const pathExt = info.ext;
	const pathExtExe = info.extExe;
	const found: Array<string> = [];

	(function F(i, l) {
		if (i === l) {
			if (opt.all && found.length) {
				return cb(null, found);
			} else {
				return cb(getNotFoundError(cmd));
			}
		}

		let pathPart = pathEnv[i];
		if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"') {
			pathPart = pathPart.slice(1, -1);
		}

		let p = path.join(pathPart, cmd);
		if (!pathPart && (/^\.[\\\/]/).test(cmd)) {
			p = cmd.slice(0, 2) + p;
		}
		(function E(ii, ll) {
			if (ii === ll) {
				return F(i + 1, l);
			}
			const ext = pathExt[ii];
			isexe(p + ext, {pathExt: pathExtExe}, (err, is) => {
				if (!err && is) {
					if (opt.all) {
						found.push(p + ext);
					} else {
						return cb(null, [p + ext]);
					}
				}
				return E(ii + 1, ll);
			});
		})(0, pathExt.length);
	})(0, pathEnv.length);
}

async function which(name: string): Promise<string | undefined> {
	return new Promise<string | undefined>((resolve, reject) => {
		whichs(name, (err, result) => {
			if (err) {
				reject(err);
			} else if (result && result.length > 0) {
				resolve(result[0]);
			} else {
				resolve();
			}
		});
	});
}

async function localBin(name: string): Promise<string | undefined> {
	const s = path.join('.', 'bin', 'tools', name, process.platform, process.arch, name) + (isWindows ? '.exe' : '');
	const exists = await fileExists(s);
	if (exists) {
		return s;
	}
}

async function enviroment(envName: string): Promise<string | undefined> {
	const s = process.env[envName];
	if (s && s.length > 0) {
		const exists = await fileExists(s);
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
		const s = await enviroment(envName);
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
