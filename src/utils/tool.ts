import { spawn } from 'child_process';
import { getBinPath } from './which.js';

export async function spawnTool(binName: string, envName: string, args: Array<string>): Promise<{ result: string; errMsg: string }> {
	const bin = await getBinPath(binName, envName);
	if (!bin || bin.length === 0) {
		return Promise.reject(Error(`Tool binary not found ${binName}`));
	}
	return new Promise<{ result: string; errMsg: string }>((resolve, reject) => {
		const child = spawn(bin, args);
		if (!child.stdout || !child.stderr) {
			return reject(Error('Unsupported std out'));
		}
		let result = '';
		let errMsg = '';
		child.stdout.on('data', (data: Buffer) => {
			result += data.toString();
		});
		child.stderr.on('data', (data: Buffer) => {
			errMsg += data.toString();
		});
		child.on('close', () => {
			resolve({ result, errMsg });
		});
	});
}

export async function spawnToolJson<T>(binName: string, envName: string, args: Array<string>): Promise<T> {
	const data = await spawnTool(binName, envName, args);
	return JSON.parse(data.result);
}
