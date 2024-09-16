import { spawn } from 'child_process';
import { getBinPath } from './which.js';
export async function spawnTool(binName, envName, args) {
    const bin = await getBinPath(binName, envName);
    if (!bin || bin.length === 0) {
        return Promise.reject(Error(`Tool binary not found ${binName}`));
    }
    return new Promise((resolve, reject) => {
        const child = spawn(bin, args);
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
export async function spawnToolJson(binName, envName, args) {
    const data = await spawnTool(binName, envName, args);
    return JSON.parse(data.result);
}
//# sourceMappingURL=tool.js.map