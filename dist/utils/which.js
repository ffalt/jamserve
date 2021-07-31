import fse from 'fs-extra';
import path from 'path';
import which from 'which';
export const isWindows = ['win32', 'cygwin', 'msys'].includes(process.platform);
const cache = {};
async function whichAsync(name) {
    return new Promise((resolve, reject) => {
        which(name, (err, resolvedPath) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(resolvedPath);
            }
        });
    });
}
async function localBin(name) {
    const s = path.join('.', 'bin', 'tools', name, process.platform, process.arch, name) + (isWindows ? '.exe' : '');
    const exists = await fse.pathExists(s);
    if (exists) {
        return s;
    }
    return;
}
async function environment(envName) {
    const s = process.env[envName];
    if (s && s.length > 0) {
        const exists = await fse.pathExists(s);
        if (exists) {
            return s;
        }
    }
    return;
}
export async function getBinPath(name, envName) {
    if (name in cache) {
        return cache[name];
    }
    try {
        const s = await environment(envName);
        if (s && s.length > 0) {
            cache[name] = s;
            return s;
        }
    }
    catch (e) {
    }
    try {
        const s = await whichAsync(name);
        if (s && s.length > 0) {
            cache[name] = s;
            return s;
        }
    }
    catch (e) {
    }
    try {
        const s = await localBin(name);
        if (s && s.length > 0) {
            cache[name] = s;
            return s;
        }
    }
    catch (e) {
    }
    return;
}
//# sourceMappingURL=which.js.map