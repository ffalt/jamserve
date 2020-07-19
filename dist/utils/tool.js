"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnToolJson = exports.spawnTool = void 0;
const child_process_1 = require("child_process");
const which_1 = require("./which");
async function spawnTool(binName, envName, args) {
    const bin = await which_1.getBinPath(binName, envName);
    if (!bin || bin.length === 0) {
        return Promise.reject(Error(`Tool binary not found ${binName}`));
    }
    return new Promise((resolve, reject) => {
        const child = child_process_1.spawn(bin, args);
        if (!child.stdout || !child.stderr) {
            return reject(Error('Unsupported std out'));
        }
        let result = '';
        let errMsg = '';
        child.stdout.on('data', (data) => {
            result += data.toString();
        });
        child.stderr.on('data', (data) => {
            errMsg += data.toString();
        });
        child.on('close', () => {
            resolve({ result, errMsg });
        });
    });
}
exports.spawnTool = spawnTool;
async function spawnToolJson(binName, envName, args) {
    const data = await spawnTool(binName, envName, args);
    return JSON.parse(data.result);
}
exports.spawnToolJson = spawnToolJson;
//# sourceMappingURL=tool.js.map