import {ImageModule} from './image.module';
import tmp, {SynchrounousResult} from 'tmp';
import Jimp from 'jimp';
import mimeTypes from 'mime-types';

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
	// @ts-ignore
	imageModule: ImageModule;
	// @ts-ignore
	dir: SynchrounousResult;

	async setup() {
		this.dir = tmp.dirSync();
		this.imageModule = new ImageModule(this.dir.name);
	}

	async cleanup() {
		this.dir.removeCallback();
	}

}
