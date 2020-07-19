import Jimp from 'jimp';
import mimeTypes from 'mime-types';
import fse from 'fs-extra';

export interface MockImage {
	buffer: Buffer;
	mime: string;
}

export async function mockImage(format: string): Promise<MockImage> {
	const image = new Jimp(360, 360, '#282828');
	const mime = mimeTypes.lookup(format) || 'image/png';
	const buffer = await image.getBufferAsync(mime);
	return {mime, buffer};
}

export async function writeImage(filename: string): Promise<void> {
	const image = new Jimp(1, 1, '#282828');
	await image.writeAsync(filename);
}

export async function writeMockImage(filename: string, format: string): Promise<void> {
	const image = await mockImage(format);
	await fse.writeFile(filename, image.buffer);
}
