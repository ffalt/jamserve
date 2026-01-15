import fse from 'fs-extra';
import path from 'node:path';
import which from 'which';
export const isWindows = ['win32', 'cygwin', 'msys'].includes(process.platform);
let cache = {};
export function clearBinCache() {
    cache = {};
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
    catch {
    }
    try {
        const s = await which(name);
        if (s && s.length > 0) {
            cache[name] = s;
            return s;
        }
    }
    catch {
    }
    try {
        const s = await localBin(name);
        if (s && s.length > 0) {
            cache[name] = s;
            return s;
        }
    }
    catch {
    }
    return;
}
//# sourceMappingURL=which.js.map