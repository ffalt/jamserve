import path from 'path';
import Logger from '../utils/logger';
import {downloadFile} from '../utils/download';
import {dirRead, fileDelete, fileDeleteIfExists, fileExists, fileRename, fileWrite} from '../utils/fs-utils';
import {IApiBinaryResult} from '../typings';
import {Config} from '../config';
import Jimp from 'jimp';
import mimeTypes from 'mime-types';

const log = Logger('Images');

/**
 * Handles image access/reading/writing/transforming
 */

export class Images {
	private imageCachePath: string;
	private format = 'png';
	private font: Jimp.Font | undefined;

	constructor(config: Config) {
		this.imageCachePath = config.getDataPath(['cache', 'images']);
	}

	async storeImage(filepath: string, name: string, imageUrl: string): Promise<string> {
		log.debug('Requesting image', imageUrl);
		const imageext = path.extname(imageUrl).split('?')[0].trim().toLowerCase();
		if (imageext.length === 0) {
			return Promise.reject(Error('Invalid Image Url'));
		}
		const filename = name + imageext;
		await downloadFile(imageUrl, path.join(filepath, filename));
		log.info('image downloaded', filename);
		return filename;
	}

	async paint(text: string, size: number, format: string | undefined): Promise<IApiBinaryResult> {
		size = size || 320;
		const image = new Jimp(360, 360, '#404040');
		if (!this.font) {
			this.font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
		}
		image.print(this.font, 10, 10, {
			text: text,
			alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
			alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
		}, 340, 340);
		image.greyscale();
		image.resize(size, size);
		const mime = mimeTypes.lookup(format ? format : this.format);
		if (!mime) {
			return Promise.reject('Unknown Image Format Request');
		}
		const buffer = await image.getBufferAsync(mime);
		return {
			buffer: {
				buffer: buffer,
				contentType: mime
			}
		};
	}

	async getImage(filename: string, size: number | undefined, name: string): Promise<IApiBinaryResult> {
		const exists = await fileExists(filename);
		if (!exists) {
			return Promise.reject(Error('File not found'));
		}
		if (!size) {
			return {file: {filename, name}};
		} else {
			const image = await Jimp.read(filename);
			const mime = mimeTypes.lookup(path.extname(filename));
			if (!mime) {
				return Promise.reject('Unknown Image Format Request');
			}
			image.contain(size, size);
			const buffer = await image.getBufferAsync(mime);
			return {
				buffer: {
					buffer: buffer,
					contentType: mime
				}
			};
		}
	}

	async get(id: string, filename: string, size: number | undefined, format?: string): Promise<IApiBinaryResult> {
		if (!filename) {
			return Promise.reject(Error('Invalid Path'));
		}
		if (size) {
			const cachefile = path.join(this.imageCachePath, 'thumb-' + id + '-' + size + '.' + this.format);
			const exists = await fileExists(cachefile);
			if (exists) {
				return {file: {filename: cachefile, name: id + '-' + size + '.' + this.format}};
			}
			const result = await this.getImage(filename, size, id + '-' + size + '.' + this.format);
			if (result.buffer) {
				log.debug('Writing image cache file', cachefile);
				await fileWrite(cachefile, result.buffer.buffer);
			}
			return result;
		} else {
			return this.getImage(filename, size, id + '.' + this.format);
		}
	}

	async resizeImage(filename: string, destination: string, size: number): Promise<void> {
		const image = await Jimp.read(filename);
		image.contain(size, size);
		await image.writeAsync(destination);
	}

	async clearImageCacheByIDs(ids: Array<string>): Promise<void> {
		const searches = ids.filter(id => id.length > 0).map(id => 'thumb-' + id);
		if (searches.length > 0) {
			let list = await dirRead(this.imageCachePath);
			list = list.filter(name => {
				return searches.findIndex(s => name.indexOf(s) === 0) >= 0;
			});
			for (const filename of list) {
				await fileDelete(path.resolve(this.imageCachePath, filename));
			}
		}
	}

	async clearImageCacheByID(id: string): Promise<void> {
		if (id.length === 0) {
			return;
		}
		const search = 'thumb-' + id;
		let list = await dirRead(this.imageCachePath);
		list = list.filter(name => name.indexOf(search) === 0);
		for (const filename of list) {
			await fileDelete(path.resolve(this.imageCachePath, filename));
		}
	}

	async createAvatar(filename: string, destination: string): Promise<void> {
		if ((!filename)) {
			return Promise.reject(Error('Invalid Path'));
		}
		const exists = await fileExists(filename);
		if (!exists) {
			return Promise.reject(Error('File not found'));
		}
		await this.resizeImage(filename, filename + '.new', 64);
		await fileDeleteIfExists(destination);
		await fileRename(filename + '.new', destination);
	}

}
