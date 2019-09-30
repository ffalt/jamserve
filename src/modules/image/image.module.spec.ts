import Jimp from 'jimp';
import mimeTypes from 'mime-types';
import path from 'path';
import tmp from 'tmp';
import {ImageModule} from './image.module';

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

export class ImageModuleTest {
	imageModule!: ImageModule;
	dir!: tmp.DirResult;

	async setup(): Promise<void> {
		this.dir = tmp.dirSync();
		this.imageModule = new ImageModule(this.dir.name, path.join(__dirname, 'avatar-generator'));
	}

	async cleanup(): Promise<void> {
		this.dir.removeCallback();
	}

}
