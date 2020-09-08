"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBinPath = exports.isWindows = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const which_1 = __importDefault(require("which"));
exports.isWindows = ['win32', 'cygwin', 'msys'].includes(process.platform);
const cache = {};
async function whichAsync(name) {
    return new Promise((resolve, reject) => {
        which_1.default(name, (err, resolvedPath) => {
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
    const s = path_1.default.join('.', 'bin', 'tools', name, process.platform, process.arch, name) + (exports.isWindows ? '.exe' : '');
    const exists = await fs_extra_1.default.pathExists(s);
    if (exists) {
        return s;
    }
    return;
}
async function environment(envName) {
    const s = process.env[envName];
    if (s && s.length > 0) {
        const exists = await fs_extra_1.default.pathExists(s);
        if (exists) {
            return s;
        }
    }
    return;
}
async function getBinPath(name, envName) {
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
exports.getBinPath = getBinPath;
//# sourceMappingURL=which.js.map