import { spawn } from 'node:child_process';
import { getBinPath } from './which.js';
export async function spawnTool(binName, envName, parameters) {
    const bin = await getBinPath(binName, envName);
    if (!bin || bin.length === 0) {
        return Promise.reject(new Error(`Tool binary not found ${binName}`));
    }
    return new Promise(resolve => {
        const child = spawn(bin, parameters);
        let result = '';
        let errorMessage = '';
        child.stdout.on('data', (data) => {
            result += data.toString();
        });
        child.stderr.on('data', (data) => {
            errorMessage += data.toString();
        });
        child.on('close', () => {
            resolve({ result, errMsg: errorMessage });
        });
    });
}
export async function spawnToolJson(binName, envName, parameters) {
    const data = await spawnTool(binName, envName, parameters);
    return JSON.parse(data.result);
}
//# sourceMappingURL=tool.js.map