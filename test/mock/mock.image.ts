import { Jimp } from 'jimp';
import mimeTypes from 'mime-types';
import fse from 'fs-extra';

export interface MockImage {
	buffer: Buffer;
	mime: string;
}

export async function mockImage(format: string): Promise<MockImage> {
	const image = new Jimp({ width: 360, height: 360, color: '#282828' });
	const mime = mimeTypes.lookup(format) || 'image/png';
	const buffer = await image.getBuffer(mime as 'image/png');
	return { mime, buffer };
}

export async function writeImage(filename: string): Promise<void> {
	const image = new Jimp({ width: 1, height: 1, color: '#282828' });
	await image.write(filename as '`${string}.${Extension}`');
}

export async function writeMockImage(filename: string, format: string): Promise<void> {
	const image = await mockImage(format);
	await fse.writeFile(filename, image.buffer);
}
