import fse from 'fs-extra';
import Jimp from 'jimp';
import mimeTypes from 'mime-types';
import path from 'path';
import sharp from 'sharp';
import {ApiBinaryResult} from '../../typings';
import {DebouncePromises} from '../../utils/debounce-promises';
import {downloadFile} from '../../utils/download';
import {SupportedWriteImageFormat} from '../../utils/filetype';
import {fileDeleteIfExists, fileSuffix} from '../../utils/fs-utils';
import {logger} from '../../utils/logger';
import {AvatarGen} from './image.avatar';

type JimpFont = any;

const log = logger('Images');

/**
 * Handles image access/reading/writing/transforming
 */

export class ImageModule {
	private format = 'png';
	private font: JimpFont | undefined;
	private imageCacheDebounce = new DebouncePromises<ApiBinaryResult>();
	private readonly avatarPartsLocation: string;

	constructor(private imageCachePath: string, avatarPartsLocation?: string) {
		this.avatarPartsLocation = avatarPartsLocation || path.join(__dirname, 'static', 'avatar');
	}

	async storeImage(filepath: string, name: string, imageUrl: string): Promise<string> {
		log.debug('Requesting image', imageUrl);
		const imageext = path.extname(imageUrl).split('?')[0].trim().toLowerCase();
		if (imageext.length === 0) {
			return Promise.reject(Error('Invalid Image Url'));
		}
		let filename = name + imageext;
		let nr = 2;
		while (await fse.pathExists(path.join(filepath, filename))) {
			filename = `${name}-${nr}${imageext}`;
			nr++;
		}
		await downloadFile(imageUrl, path.join(filepath, filename));
		log.info('image downloaded', filename);
		return filename;
	}

	async paint(text: string, size: number | undefined, format: string | undefined): Promise<ApiBinaryResult> {
		size = size || 320;
		const image = new Jimp(360, 360, '#282828');
		if (!this.font) {
			this.font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
		}
		image.print(this.font, 10, 10, {
			text,
			alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
			alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
		}, 340, 340);
		image.resize(size, size);
		const mime = mimeTypes.lookup(format ? format : this.format);
		if (!mime) {
			return Promise.reject('Unknown Image Format Request');
		}
		const buffer = await image.getBufferAsync(mime);
		return {buffer: {buffer, contentType: mime}};
	}

	private async getImage(filename: string, size: number | undefined, name: string): Promise<ApiBinaryResult> {
		if (!size) {
			return {file: {filename, name}};
		}
		let fileFormat = fileSuffix(filename);
		if (!SupportedWriteImageFormat.includes(fileFormat)) {
			fileFormat = this.format;
		}
		return this.getImageAs(filename, fileFormat, size, name);
	}

	private async getImageAs(filename: string, format: string, size: number | undefined, name: string): Promise<ApiBinaryResult> {
		const fileFormat = fileSuffix(filename);
		const exists = await fse.pathExists(filename);
		if (!exists) {
			return Promise.reject(Error('File not found'));
		}
		if (size || (fileFormat !== format)) {
			const mime = mimeTypes.lookup(format);
			if (!mime) {
				return Promise.reject('Unknown Image Format Request');
			}
			if (size) {
				return {
					buffer: {
						buffer: await sharp(filename)
							.resize(size, size,
								{
									fit: sharp.fit.cover,
									position: sharp.strategy.entropy
								}).toFormat(format)
							.toBuffer(),
						contentType: mime
					}
				};
			}
			return {
				buffer: {
					buffer: await sharp(filename)
						.toFormat(format)
						.toBuffer(),
					contentType: mime
				}
			};
		}
		return {file: {filename, name}};
	}

	async get(id: string, filename: string, size: number | undefined, format?: string): Promise<ApiBinaryResult> {
		if (!filename) {
			return Promise.reject(Error('Invalid Path'));
		}
		if (format && !SupportedWriteImageFormat.includes(format)) {
			return Promise.reject(Error('Invalid Format'));
		}
		if (format || size) {
			const cacheID = `thumb-${id}${size ? `-${size}` : ''}.${format || this.format}`;
			if (this.imageCacheDebounce.isPending(cacheID)) {
				return this.imageCacheDebounce.append(cacheID);
			}
			this.imageCacheDebounce.setPending(cacheID);
			try {
				let result: ApiBinaryResult;
				const cachefile = path.join(this.imageCachePath, cacheID);
				const exists = await fse.pathExists(cachefile);
				if (exists) {
					result = {file: {filename: cachefile, name: cacheID}};
				} else {
					result = format ?
						await this.getImageAs(filename, format, size, cacheID) :
						await this.getImage(filename, size, cacheID);
					if (result.buffer) {
						log.debug('Writing image cache file', cachefile);
						await fse.writeFile(cachefile, result.buffer.buffer);
					}
				}
				this.imageCacheDebounce.resolve(cacheID, result);
				return result;
			} catch (e) {
				this.imageCacheDebounce.reject(cacheID, e);
				return Promise.reject(e);
			}
		} else {
			return this.getImage(filename, size, `${id}.${format || this.format}`);
		}
	}

	async resizeImage(filename: string, destination: string, size: number): Promise<void> {
		await sharp(filename)
			.resize(size, size,
				{
					fit: sharp.fit.cover,
					position: sharp.strategy.entropy
				})
			.toFile(destination);
	}

	async clearImageCacheByIDs(ids: Array<string>): Promise<void> {
		const searches = ids.filter(id => id.length > 0).map(id => `thumb-${id}`);
		if (searches.length > 0) {
			let list = await fse.readdir(this.imageCachePath);
			list = list.filter(name => {
				return searches.findIndex(s => name.startsWith(s)) >= 0;
			});
			for (const filename of list) {
				await fse.unlink(path.resolve(this.imageCachePath, filename));
			}
		}
	}

	async clearImageCacheByID(id: string): Promise<void> {
		if (id.length === 0) {
			return;
		}
		const search = `thumb-${id}`;
		let list = await fse.readdir(this.imageCachePath);
		list = list.filter(name => name.startsWith(search));
		for (const filename of list) {
			await fse.unlink(path.resolve(this.imageCachePath, filename));
		}
	}

	async createAvatar(filename: string, destination: string): Promise<void> {
		if ((!filename)) {
			return Promise.reject(Error('Invalid Path'));
		}
		const exists = await fse.pathExists(filename);
		if (!exists) {
			return Promise.reject(Error('File not found'));
		}
		await this.resizeImage(filename, `${filename}.new`, 64);
		await fileDeleteIfExists(destination);
		await fse.rename(`${filename}.new`, destination);
	}

	async generateAvatar(seed: string, destination: string): Promise<void> {
		const avatarGenerator = new AvatarGen(this.avatarPartsLocation);
		const avatar = await avatarGenerator.generate(seed);
		await fse.writeFile(destination, avatar);
	}

	async getImageInfo(bin: Buffer, mimeType: string | undefined): Promise<{ width: number, height: number, colorDepth: number, colors: number }> {
		try {
			const metadata = await sharp(bin).metadata();
			return {
				width: metadata.width || 0,
				height: metadata.height || 0,
				colorDepth: metadata.density || 0,
				colors: 0
			};
		} catch (e) {
			log.error('Error reading image dimensions from Buffer', e);
			return {
				width: 0,
				height: 0,
				colorDepth: 0,
				colors: 0
			};
		}
	}
}
