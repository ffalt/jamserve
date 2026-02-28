import fse from 'fs-extra';
import mimeTypes from 'mime-types';
import path from 'node:path';
import sharp, { FormatEnum } from 'sharp';
import { downloadFile } from '../../utils/download.js';
import { SupportedReadImageFormat, SupportedWriteImageFormat } from '../../utils/filetype.js';
import { validateExternalUrl } from '../../utils/url-check.js';
import { fileDeleteIfExists, fileSuffix } from '../../utils/fs-utils.js';
import { IDFolderCache } from '../../utils/id-file-cache.js';
import { logger } from '../../utils/logger.js';
import { randomString } from '../../utils/random.js';
import { AvatarGen } from './image.avatar.js';
import { ImageResult } from './image.format.js';
import { ConfigService } from '../engine/services/config.service.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { ImageFormatType } from '../../types/enums.js';
import { Jimp, loadFont, VerticalAlign, HorizontalAlign } from 'jimp';
import { SANS_32_WHITE } from './image.font.js';
import { BmFont } from '@jimp/plugin-print';

export interface ImageInfo {
	width: number;
	height: number;
	colorDepth: number;
	colors: number;
	format: string;
}

type JimpFont = BmFont<any>;

const log = logger('Images');
sharp.cache(false);
sharp.simd(false);

/**
 * Handles image access/reading/writing/transforming
 */

@InRequestScope
export class ImageModule {
	private readonly format = 'png';
	private font?: JimpFont;
	private readonly cache: IDFolderCache<{ size?: number; format?: string }>;
	private readonly imageCachePath: string;
	@Inject
	private readonly configService!: ConfigService;

	constructor() {
		this.imageCachePath = this.configService.getDataPath(['cache', 'images']);
		this.cache = new IDFolderCache<{ size?: number; format?: string }>(
			this.imageCachePath,
			'thumb',
			(parameters: { size?: number; format?: string }) => {
				const sizePrefix = parameters.size === undefined ? '' : `-${parameters.size}`;
				const fileFormat = parameters.format ?? this.format;
				return `${sizePrefix}.${fileFormat}`;
			}
		);
	}

	private static async verifyDownloadedImage(temporaryFilename: string): Promise<string> {
		let sharpFormat: string;
		try {
			const metadata = await sharp(temporaryFilename, { failOn: 'error' }).metadata();
			// metadata.format is always a string when sharp does not throw
			sharpFormat = metadata.format as string;
		} catch (error) {
			await fileDeleteIfExists(temporaryFilename);
			throw new Error(`Downloaded file is not a valid image: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
		}
		// Normalize 'jpeg' → 'jpg' for consistency with the rest of the codebase.
		const normalizedFormat = sharpFormat === 'jpeg' ? 'jpg' : sharpFormat;
		if (!SupportedReadImageFormat.includes(normalizedFormat)) {
			await fileDeleteIfExists(temporaryFilename);
			throw new Error(`Downloaded file has unsupported image format: ${sharpFormat}`);
		}
		return normalizedFormat;
	}

	async storeImage(filepath: string, name: string, imageUrl: string): Promise<string> {
		log.debug('Requesting image', imageUrl);
		await validateExternalUrl(imageUrl);

		// Stage 1: cheap URL-extension pre-flight — catches obvious non-images early.
		const urlExtension = (path.extname(imageUrl).split('?').at(0) ?? '').trim().toLowerCase().slice(1);
		if (urlExtension.length > 0 && !SupportedReadImageFormat.includes(urlExtension)) {
			return Promise.reject(new Error(`Unsupported image format in URL: ${urlExtension}`));
		}

		// Download to a temporary file so we can inspect the content before
		// committing it under a permanent name.
		const temporaryFilename = path.join(filepath, `${name}-tmp-${randomString(8)}`);
		await fse.ensureDir(filepath);

		let contentType: string | undefined;
		try {
			contentType = await downloadFile(imageUrl, temporaryFilename, 20 * 1024 * 1024);
		} catch (error) {
			await fileDeleteIfExists(temporaryFilename);
			throw error;
		}

		// Stage 2a: verify Content-Type header against allowed MIME types.
		// Strip parameters like "; charset=utf-8" before comparing.
		const mimeFromHeader = contentType?.split(';').at(0)?.trim().toLowerCase();
		const allowedMimes = new Set(
			SupportedReadImageFormat.map(extension => mimeTypes.lookup(extension) as string).filter(Boolean)
		);
		if (mimeFromHeader && !allowedMimes.has(mimeFromHeader)) {
			await fileDeleteIfExists(temporaryFilename);
			return Promise.reject(new Error(`Rejected image: Content-Type "${mimeFromHeader}" is not an allowed image type`));
		}

		// Stage 2b: authoritative check — read magic bytes via sharp.
		// Cannot be spoofed by a misleading URL extension or Content-Type header.
		const normalizedFormat = await ImageModule.verifyDownloadedImage(temporaryFilename);

		// Commit: rename the temp file using the sharp-verified extension.
		let filename = `${name}.${normalizedFormat}`;
		let nr = 2;
		while (await fse.pathExists(path.join(filepath, filename))) {
			filename = `${name}-${nr}.${normalizedFormat}`;
			nr++;
		}
		try {
			await fse.rename(temporaryFilename, path.join(filepath, filename));
		} catch (error) {
			await fileDeleteIfExists(temporaryFilename);
			throw error;
		}

		log.info('Image downloaded and verified', filename);
		return filename;
	}

	async paint(text: string, size: number | undefined, format: string | undefined): Promise<ImageResult> {
		size = size ?? 320;
		const image = new Jimp({ width: 360, height: 360, color: '#0f1217' });
		this.font ??= await loadFont(SANS_32_WHITE);
		image.print({
			font: this.font!,
			x: 10,
			y: 10,
			maxHeight: 340,
			maxWidth: 340,
			text: {
				text,
				alignmentX: HorizontalAlign.CENTER,
				alignmentY: VerticalAlign.MIDDLE
			}
		});
		image.resize({ w: size, h: size });
		const mime = mimeTypes.lookup(format ?? this.format);
		if (!mime) {
			return Promise.reject(new Error('Unknown Image Format Request'));
		}
		if (mime === 'image/webp') {
			const png_buffer = await image.getBuffer('image/png');
			const buffer = await sharp(png_buffer).webp().toBuffer();
			return { buffer: { buffer, contentType: mime } };
		}
		const buffer = await image.getBuffer(mime as 'image/png');
		return { buffer: { buffer, contentType: mime } };
	}

	private async getImage(filename: string, size: number | undefined, name: string): Promise<ImageResult> {
		if (!size) {
			return { file: { filename, name } };
		}
		let fileFormat = fileSuffix(filename);
		if (!SupportedWriteImageFormat.includes(fileFormat)) {
			fileFormat = this.format;
		}
		return ImageModule.getImageAs(filename, fileFormat, size, name);
	}

	private static async getImageAs(filename: string, format: string, size: number | undefined, name: string): Promise<ImageResult> {
		const fileFormat = fileSuffix(filename);
		const exists = await fse.pathExists(filename);
		if (!exists) {
			return Promise.reject(new Error('File not found'));
		}
		if (size || (fileFormat !== format)) {
			const mime = mimeTypes.lookup(format);
			if (!mime) {
				return Promise.reject(new Error(`Unknown Image Format Request: ${format} ${filename}`));
			}
			const sharpy = sharp(filename, { failOn: 'none' });
			if (size) {
				sharpy.resize(size, size, { fit: sharp.fit.cover, position: sharp.strategy.entropy });
			}
			sharpy.toFormat(format as keyof FormatEnum);
			const buffer = await sharpy.toBuffer();
			return { buffer: { buffer, contentType: mime } };
		}
		return { file: { filename, name } };
	}

	private async getImageBufferAs(buffer: Buffer, format: string | undefined, size: number | undefined): Promise<ImageResult> {
		const info = await this.getImageInfoBuffer(buffer);
		if (!format && size && !SupportedWriteImageFormat.includes(info.format)) {
			format = ImageFormatType.jpeg;
		}
		const destinationFormat = format ?? info.format;
		const contentType = mimeTypes.lookup(destinationFormat);
		if (!contentType) {
			return Promise.reject(new Error(`Unknown Image Format Request: ${format}`));
		}
		if (size) {
			return {
				buffer: {
					buffer: await sharp(buffer, { failOn: 'warning' })
						.resize(size, size, { fit: sharp.fit.cover })
						.toFormat(destinationFormat as keyof FormatEnum)
						.toBuffer(),
					contentType
				}
			};
		}
		if (format && info.format !== destinationFormat) {
			return {
				buffer: {
					buffer: await sharp(buffer, { failOn: 'warning' })
						.toFormat(destinationFormat as keyof FormatEnum)
						.toBuffer(),
					contentType
				}
			};
		}
		return {
			buffer: { buffer, contentType }
		};
	}

	async getExisting(id: string, size: number | undefined, format?: string): Promise<ImageResult | undefined> {
		return this.cache.getExisting(id, { size, format });
	}

	async getBuffer(id: string, buffer: Buffer, size: number | undefined, format?: string): Promise<ImageResult> {
		if (format && !SupportedWriteImageFormat.includes(format)) {
			return Promise.reject(new Error('Invalid Format'));
		}
		return this.cache.get(id, { size, format }, async cachefile => {
			const result = await this.getImageBufferAs(buffer, format, size);
			if (result.buffer) {
				log.debug('Writing image cache file', cachefile);
				await fse.writeFile(cachefile, result.buffer.buffer);
			} else {
				return Promise.reject(new Error('Error while writing image cache file'));
			}
		});
	}

	async get(id: string, filename: string, size: number | undefined, format?: string): Promise<ImageResult> {
		if (!filename) {
			return Promise.reject(new Error('Invalid Path'));
		}
		if (format && !SupportedWriteImageFormat.includes(format)) {
			return Promise.reject(new Error('Invalid Format'));
		}
		if (format && format === this.format) {
			format = undefined;
		}
		if (format || size) {
			return this.cache.get(id, { size, format }, async cachefile => {
				const name = path.basename(cachefile);
				const result = format ?
					await ImageModule.getImageAs(filename, format, size, name) :
					await this.getImage(filename, size, name);
				if (result.buffer) {
					log.debug('Writing image cache file', cachefile);
					await fse.writeFile(cachefile, result.buffer.buffer);
				}
			});
		}
		return this.getImage(filename, size, `${id}.${this.format}`);
	}

	async resizeImagePNG(filename: string, destination: string, size: number): Promise<void> {
		await sharp(filename, { failOn: 'warning' })
			.resize(size, size, { fit: sharp.fit.cover })
			.png()
			.toFile(destination);
	}

	async clearImageCacheByIDs(ids: Array<string>): Promise<void> {
		await this.cache.removeByIDs(ids);
	}

	async createAvatar(filename: string, destination: string): Promise<void> {
		if ((!filename)) {
			return Promise.reject(new Error('Invalid Path'));
		}
		const exists = await fse.pathExists(filename);
		if (!exists) {
			return Promise.reject(new Error('File not found'));
		}
		const temporaryFile = `${filename}.new${randomString(8)}.png`;
		await this.resizeImagePNG(filename, temporaryFile, 300);
		await fileDeleteIfExists(destination);
		await fse.rename(temporaryFile, destination);
	}

	async generateAvatar(seed: string, destination: string): Promise<void> {
		const avatarGenerator = new AvatarGen();
		const avatar = await avatarGenerator.generate(seed);
		await fse.writeFile(destination, avatar);
	}

	private static async formatImageInfo(sharpy: sharp.Sharp): Promise<ImageInfo> {
		try {
			const metadata = await sharpy.metadata();
			return {
				width: metadata.width || 0,
				height: metadata.height || 0,
				// defensive: sharp can return undefined for corrupt images
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				format: metadata.format || 'unknown',
				colorDepth: metadata.density ?? 0,
				colors: 0
			};
		} catch {
			return { width: 0, height: 0, format: 'invalid', colorDepth: 0, colors: 0 };
		}
	}

	async getImageInfo(filename: string): Promise<ImageInfo> {
		return ImageModule.formatImageInfo(sharp(filename, { failOn: 'warning' }));
	}

	async getImageInfoBuffer(bin: Buffer): Promise<ImageInfo> {
		return ImageModule.formatImageInfo(sharp(bin, { failOn: 'warning' }));
	}
}
