import {getBinPath} from './which';
import {spawn} from 'child_process';

export async function spawnToolStream(binName: string, envName: string, args: Array<string>, onData: (buffer: Buffer) => void): Promise<string> {
	const bin = await getBinPath(binName, envName);
	if (!bin || bin.length === 0) {
		return Promise.reject(Error('Tool binary not found ' + binName));
	}
	return new Promise<string>((resolve, reject) => {
		const child = spawn(bin, args);
		let stderr = '';
		child.stdout.on('data', (data: Buffer) => {
			onData(data);
		});
		child.stderr.on('data', (data: Buffer) => {
			stderr += data.toString();
		});
		child.on('close', (code: number) => {
			resolve(stderr);
		});
	});
}

export async function spawnTool(binName: string, envName: string, args: Array<string>): Promise<string> {
	const bin = await getBinPath(binName, envName);
	if (!bin || bin.length === 0) {
		return Promise.reject(Error('Tool binary not found ' + binName));
	}
	return new Promise<string>((resolve, reject) => {
		const child = spawn(bin, args);
		let result = '';
		let error = '';
		child.stdout.on('data', (data: Buffer) => {
			result += data.toString();
		});
		child.stderr.on('data', (data: Buffer) => {
			error += data.toString();
		});
		child.on('close', (code: number) => {
			resolve(result);
		});
	});
}

export async function spawnToolJson<T>(binName: string, envName: string, args: Array<string>): Promise<T> {
	const data = await spawnTool(binName, envName, args);
	const result: T = JSON.parse(data);
	return result;
}
