import fse from 'fs-extra';
import Jimp from 'jimp';
import mimeTypes from 'mime-types';
import path from 'path';
import sharp, {FormatEnum} from 'sharp';
import {downloadFile} from '../../utils/download';
import {SupportedWriteImageFormat} from '../../utils/filetype';
import {fileDeleteIfExists, fileSuffix} from '../../utils/fs-utils';
import {IDFolderCache} from '../../utils/id-file-cache';
import {logger} from '../../utils/logger';
import {randomString} from '../../utils/random';
import {AvatarGen} from './image.avatar';
import {ImageResult} from './image.format';
import {ConfigService} from '../engine/services/config.service';
import {Inject, InRequestScope} from 'typescript-ioc';
import {ImageFormatType} from '../../types/enums';

export interface ImageInfo {
	width: number;
	height: number;
	colorDepth: number;
	colors: number;
	format: string;
}

type JimpFont = any;

const log = logger('Images');
sharp.cache(false);
sharp.simd(false);

/**
 * Handles image access/reading/writing/transforming
 */

@InRequestScope
export class ImageModule {
	private format = 'png';
	private font: JimpFont | undefined;
	private cache: IDFolderCache<{ size?: number; format?: string }>;
	private readonly imageCachePath: string;
	@Inject
	private configService!: ConfigService;

	constructor() {
		this.imageCachePath = this.configService.getDataPath(['cache', 'images']);
		this.cache = new IDFolderCache<{ size?: number; format?: string }>(this.imageCachePath, 'thumb', (params: { size?: number; format?: string }) => {
			return `${params.size !== undefined ? `-${params.size}` : ''}.${params.format || this.format}`;
		});
	}

	async storeImage(filepath: string, name: string, imageUrl: string): Promise<string> {
		log.debug('Requesting image', imageUrl);
		const imageext = path.extname(imageUrl).split('?')[0].trim().toLowerCase();
		if (imageext.length === 0) {
			return Promise.reject(Error('Invalid Image URL'));
		}
		let filename = name + imageext;
		let nr = 2;
		while (await fse.pathExists(path.join(filepath, filename))) {
			filename = `${name}-${nr}${imageext}`;
			nr++;
		}
		await downloadFile(imageUrl, path.join(filepath, filename));
		log.info('Image downloaded', filename);
		return filename;
	}

	async paint(text: string, size: number | undefined, format: string | undefined): Promise<ImageResult> {
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

	private async getImage(filename: string, size: number | undefined, name: string): Promise<ImageResult> {
		if (!size) {
			return {file: {filename, name}};
		}
		let fileFormat = fileSuffix(filename);
		if (!SupportedWriteImageFormat.includes(fileFormat)) {
			fileFormat = this.format;
		}
		return this.getImageAs(filename, fileFormat, size, name);
	}

	private async getImageAs(filename: string, format: string, size: number | undefined, name: string): Promise<ImageResult> {
		const fileFormat = fileSuffix(filename);
		const exists = await fse.pathExists(filename);
		if (!exists) {
			return Promise.reject(Error('File not found'));
		}
		if (size || (fileFormat !== format)) {
			const mime = mimeTypes.lookup(format);
			if (!mime) {
				return Promise.reject(`Unknown Image Format Request: ${format} ${filename}`);
			}
			const sharpy = sharp(filename, {failOnError: false});
			if (size) {
				sharpy.resize(size, size, {fit: sharp.fit.cover, position: sharp.strategy.entropy});
			}
			sharpy.toFormat(format as keyof FormatEnum);
			const buffer = await sharpy.toBuffer();
			return {buffer: {buffer, contentType: mime}};
		}
		return {file: {filename, name}};
	}

	private async getImageBufferAs(buffer: Buffer, format: string | undefined, size: number | undefined): Promise<ImageResult> {
		const info = await this.getImageInfoBuffer(buffer);
		if (!format && size && !SupportedWriteImageFormat.includes(info.format)) {
			format = ImageFormatType.jpeg;
		}
		const destFormat = format || info.format;
		const contentType = mimeTypes.lookup(destFormat);
		if (!contentType) {
			return Promise.reject(`Unknown Image Format Request: ${format}`);
		}
		if (size) {
			return {
				buffer: {
					buffer: await sharp(buffer, {failOnError: false})
						.resize(size, size, {fit: sharp.fit.cover})
						.toFormat(destFormat as keyof FormatEnum)
						.toBuffer(),
					contentType
				}
			};
		}
		if (format && info.format !== destFormat) {
			return {
				buffer: {
					buffer: await sharp(buffer, {failOnError: false})
						.toFormat(destFormat as keyof FormatEnum)
						.toBuffer(),
					contentType
				}
			};
		}
		return {
			buffer: {buffer, contentType}
		};
	}

	async getExisting(id: string, size: number | undefined, format?: string): Promise<ImageResult | undefined> {
		return this.cache.getExisting(id, {size, format});
	}

	async getBuffer(id: string, buffer: Buffer, size: number | undefined, format?: string): Promise<ImageResult> {
		if (format && !SupportedWriteImageFormat.includes(format)) {
			return Promise.reject(Error('Invalid Format'));
		}
		return this.cache.get(id, {size, format}, async cachefile => {
			const result = await this.getImageBufferAs(buffer, format, size);
			if (result.buffer) {
				log.debug('Writing image cache file', cachefile);
				await fse.writeFile(cachefile, result.buffer.buffer);
			} else {
				return Promise.reject(Error('Error while writing image cache file'));
			}
		});
	}

	async get(id: string, filename: string, size: number | undefined, format?: string): Promise<ImageResult> {
		if (!filename) {
			return Promise.reject(Error('Invalid Path'));
		}
		if (format && !SupportedWriteImageFormat.includes(format)) {
			return Promise.reject(Error('Invalid Format'));
		}
		if (format && format === this.format) {
			format = undefined;
		}
		if (format || size) {
			return this.cache.get(id, {size, format}, async cachefile => {
				const name = path.basename(cachefile);
				const result = format ?
					await this.getImageAs(filename, format, size, name) :
					await this.getImage(filename, size, name);
				if (result.buffer) {
					log.debug('Writing image cache file', cachefile);
					await fse.writeFile(cachefile, result.buffer.buffer);
				}
			});
		}
		return this.getImage(filename, size, `${id}.${this.format}`);
	}

	// async resizeImage(filename: string, destination: string, size: number): Promise<void> {
	// 	await sharp(filename)
	// 		.resize(size, size, {fit: sharp.fit.cover})
	// 		.toFile(destination);
	// }

	async resizeImagePNG(filename: string, destination: string, size: number): Promise<void> {
		await sharp(filename, {failOnError: false})
			.resize(size, size, {fit: sharp.fit.cover})
			.png()
			.toFile(destination);
	}

	async clearImageCacheByIDs(ids: Array<string>): Promise<void> {
		await this.cache.removeByIDs(ids);
	}

	async createAvatar(filename: string, destination: string): Promise<void> {
		if ((!filename)) {
			return Promise.reject(Error('Invalid Path'));
		}
		const exists = await fse.pathExists(filename);
		if (!exists) {
			return Promise.reject(Error('File not found'));
		}
		const tempFile = `${filename}.new${randomString(8)}.png`;
		await this.resizeImagePNG(filename, tempFile, 300);
		await fileDeleteIfExists(destination);
		await fse.rename(tempFile, destination);
	}

	async generateAvatar(seed: string, destination: string): Promise<void> {
		const avatarGenerator = new AvatarGen();
		const avatar = await avatarGenerator.generate(seed);
		await fse.writeFile(destination, avatar);
	}

	private async formatImageInfo(sharpy: sharp.Sharp): Promise<ImageInfo> {
		try {
			const metadata = await sharpy.metadata();
			return {
				width: metadata.width || 0,
				height: metadata.height || 0,
				format: metadata.format || '',
				colorDepth: metadata.density || 0,
				colors: 0
			};
		} catch (e) {
			return {width: 0, height: 0, format: 'invalid', colorDepth: 0, colors: 0};
		}
	}

	async getImageInfo(filename: string): Promise<ImageInfo> {
		return this.formatImageInfo(sharp(filename, {failOnError: false}));
	}

	async getImageInfoBuffer(bin: Buffer): Promise<ImageInfo> {
		return this.formatImageInfo(sharp(bin, {failOnError: false}));
	}

}
