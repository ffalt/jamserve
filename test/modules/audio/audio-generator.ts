import { spawn } from 'node:child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

export async function ffmpegAvailable(ffmpegPath?: string): Promise<boolean> {
	const bin = ffmpegPath || 'ffmpeg';
	return new Promise<boolean>(resolve => {
		const p = spawn(bin, ['-version']);
		p.on('error', () => resolve(false));
		p.on('close', code => resolve(code === 0));
	});
}

export async function temporaryDirectory(dir?: string): Promise<string> {
	const base = dir || path.join(os.tmpdir(), 'jamserve-test-audio');
	await fs.promises.mkdir(base, { recursive: true });
	return base;
}

export async function generateSineWav(filePath: string, durationSeconds = 1, freq = 440, ffmpegPath?: string): Promise<void> {
	const bin = ffmpegPath || 'ffmpeg';
	await temporaryDirectory(path.dirname(filePath));
	return new Promise((resolve, reject) => {
		// Use lavfi sine source to generate a tone
		const args = [
			'-y',
			'-f', 'lavfi',
			'-i', `sine=frequency=${freq}:sample_rate=44100`,
			'-t', String(durationSeconds),
			'-c:a', 'pcm_s16le',
			filePath
		];
		const p = spawn(bin, args);
		let stderr = '';
		p.stderr.on('data', d => stderr += d.toString());
		p.on('error', err => reject(err));
		p.on('close', code => {
			if (code === 0) resolve();
			else reject(new Error(`ffmpeg exited with ${code}: ${stderr}`));
		});
	});
}

export async function convertToMp3(input: string, output: string, bitrate = '128k', ffmpegPath?: string): Promise<void> {
	const bin = ffmpegPath || 'ffmpeg';
	await temporaryDirectory(path.dirname(output));
	return new Promise((resolve, reject) => {
		const args = ['-y', '-i', input, '-codec:a', 'libmp3lame', '-b:a', bitrate, output];
		const p = spawn(bin, args);
		let stderr = '';
		p.stderr.on('data', d => stderr += d.toString());
		p.on('error', err => reject(err));
		p.on('close', code => {
			if (code === 0) resolve();
			else reject(new Error(`ffmpeg exited with ${code}: ${stderr}`));
		});
	});
}

