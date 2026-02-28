import { spawn } from 'node:child_process';
import { getBinPath } from './which.js';
export async function spawnTool(binName, envName, parameters) {
    const bin = await getBinPath(binName, envName);
    if (!bin || bin.length === 0) {
        return Promise.reject(new Error(`Tool binary not found ${binName}`));
    }
    return new Promise((resolve, reject) => {
        const child = spawn(bin, parameters);
        let result = '';
        let errorMessage = '';
        child.stdout.on('data', (data) => {
            result += data.toString();
        });
        child.stderr.on('data', (data) => {
            errorMessage += data.toString();
        });
        child.on('close', (code, signal) => {
            if (signal) {
                reject(new Error(`Tool ${binName} killed by signal ${signal}`));
                return;
            }
            if (code !== 0) {
                reject(new Error(`Tool ${binName} exited with code ${code}: ${errorMessage}`));
                return;
            }
            resolve({ result, errMsg: errorMessage });
        });
        child.on('error', (error) => {
            reject(new Error(`Failed to spawn tool ${binName}: ${error.message}`));
        });
    });
}
export async function spawnToolJson(binName, envName, parameters) {
    const data = await spawnTool(binName, envName, parameters);
    return JSON.parse(data.result);
}
//# sourceMappingURL=tool.js.map