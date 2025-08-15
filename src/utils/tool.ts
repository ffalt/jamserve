import { spawn } from 'node:child_process';
import { getBinPath } from './which.js';

export async function spawnTool(binName: string, envName: string, parameters: Array<string>): Promise<{ result: string; errMsg: string }> {
	const bin = await getBinPath(binName, envName);
	if (!bin || bin.length === 0) {
		return Promise.reject(new Error(`Tool binary not found ${binName}`));
	}
	return new Promise<{ result: string; errMsg: string }>(resolve => {
		const child = spawn(bin, parameters);
		let result = '';
		let errorMessage = '';
		child.stdout.on('data', (data: Buffer) => {
			result += data.toString();
		});
		child.stderr.on('data', (data: Buffer) => {
			errorMessage += data.toString();
		});
		child.on('close', () => {
			resolve({ result, errMsg: errorMessage });
		});
	});
}

export async function spawnToolJson<T>(binName: string, envName: string, parameters: Array<string>): Promise<T> {
	const data = await spawnTool(binName, envName, parameters);
	return JSON.parse(data.result) as T;
}
