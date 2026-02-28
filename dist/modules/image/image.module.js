var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ImageModule_1;
import fse from 'fs-extra';
import mimeTypes from 'mime-types';
import path from 'node:path';
import sharp from 'sharp';
import { downloadFile } from '../../utils/download.js';
import { SupportedReadImageFormat, SupportedWriteImageFormat } from '../../utils/filetype.js';
import { validateExternalUrl } from '../../utils/url-check.js';
import { fileDeleteIfExists, fileSuffix } from '../../utils/fs-utils.js';
import { IDFolderCache } from '../../utils/id-file-cache.js';
import { logger } from '../../utils/logger.js';
import { randomString } from '../../utils/random.js';
import { AvatarGen } from './image.avatar.js';
import { ConfigService } from '../engine/services/config.service.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { ImageFormatType } from '../../types/enums.js';
import { Jimp, loadFont, VerticalAlign, HorizontalAlign } from 'jimp';
import { SANS_32_WHITE } from './image.font.js';
const log = logger('Images');
sharp.cache(false);
sharp.simd(false);
let ImageModule = ImageModule_1 = class ImageModule {
    constructor() {
        this.format = 'png';
        this.imageCachePath = this.configService.getDataPath(['cache', 'images']);
        this.cache = new IDFolderCache(this.imageCachePath, 'thumb', (parameters) => {
            const sizePrefix = parameters.size === undefined ? '' : `-${parameters.size}`;
            const fileFormat = parameters.format ?? this.format;
            return `${sizePrefix}.${fileFormat}`;
        });
    }
    static async verifyDownloadedImage(temporaryFilename) {
        let sharpFormat;
        try {
            const metadata = await sharp(temporaryFilename, { failOn: 'error' }).metadata();
            sharpFormat = metadata.format;
        }
        catch (error) {
            await fileDeleteIfExists(temporaryFilename);
            throw new Error(`Downloaded file is not a valid image: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
        }
        const normalizedFormat = sharpFormat === 'jpeg' ? 'jpg' : sharpFormat;
        if (!SupportedReadImageFormat.includes(normalizedFormat)) {
            await fileDeleteIfExists(temporaryFilename);
            throw new Error(`Downloaded file has unsupported image format: ${sharpFormat}`);
        }
        return normalizedFormat;
    }
    async storeImage(filepath, name, imageUrl) {
        log.debug('Requesting image', imageUrl);
        await validateExternalUrl(imageUrl);
        const urlExtension = (path.extname(imageUrl).split('?').at(0) ?? '').trim().toLowerCase().slice(1);
        if (urlExtension.length > 0 && !SupportedReadImageFormat.includes(urlExtension)) {
            return Promise.reject(new Error(`Unsupported image format in URL: ${urlExtension}`));
        }
        const temporaryFilename = path.join(filepath, `${name}-tmp-${randomString(8)}`);
        await fse.ensureDir(filepath);
        let contentType;
        try {
            contentType = await downloadFile(imageUrl, temporaryFilename, 20 * 1024 * 1024);
        }
        catch (error) {
            await fileDeleteIfExists(temporaryFilename);
            throw error;
        }
        const mimeFromHeader = contentType?.split(';').at(0)?.trim().toLowerCase();
        const allowedMimes = new Set(SupportedReadImageFormat.map(extension => mimeTypes.lookup(extension)).filter(Boolean));
        if (mimeFromHeader && !allowedMimes.has(mimeFromHeader)) {
            await fileDeleteIfExists(temporaryFilename);
            return Promise.reject(new Error(`Rejected image: Content-Type "${mimeFromHeader}" is not an allowed image type`));
        }
        const normalizedFormat = await ImageModule_1.verifyDownloadedImage(temporaryFilename);
        let filename = `${name}.${normalizedFormat}`;
        let nr = 2;
        while (await fse.pathExists(path.join(filepath, filename))) {
            filename = `${name}-${nr}.${normalizedFormat}`;
            nr++;
        }
        try {
            await fse.rename(temporaryFilename, path.join(filepath, filename));
        }
        catch (error) {
            await fileDeleteIfExists(temporaryFilename);
            throw error;
        }
        log.info('Image downloaded and verified', filename);
        return filename;
    }
    async paint(text, size, format) {
        size = size ?? 320;
        const image = new Jimp({ width: 360, height: 360, color: '#0f1217' });
        this.font ?? (this.font = await loadFont(SANS_32_WHITE));
        image.print({
            font: this.font,
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
        const buffer = await image.getBuffer(mime);
        return { buffer: { buffer, contentType: mime } };
    }
    async getImage(filename, size, name) {
        if (!size) {
            return { file: { filename, name } };
        }
        let fileFormat = fileSuffix(filename);
        if (!SupportedWriteImageFormat.includes(fileFormat)) {
            fileFormat = this.format;
        }
        return ImageModule_1.getImageAs(filename, fileFormat, size, name);
    }
    static async getImageAs(filename, format, size, name) {
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
            sharpy.toFormat(format);
            const buffer = await sharpy.toBuffer();
            return { buffer: { buffer, contentType: mime } };
        }
        return { file: { filename, name } };
    }
    async getImageBufferAs(buffer, format, size) {
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
                        .toFormat(destinationFormat)
                        .toBuffer(),
                    contentType
                }
            };
        }
        if (format && info.format !== destinationFormat) {
            return {
                buffer: {
                    buffer: await sharp(buffer, { failOn: 'warning' })
                        .toFormat(destinationFormat)
                        .toBuffer(),
                    contentType
                }
            };
        }
        return {
            buffer: { buffer, contentType }
        };
    }
    async getExisting(id, size, format) {
        return this.cache.getExisting(id, { size, format });
    }
    async getBuffer(id, buffer, size, format) {
        if (format && !SupportedWriteImageFormat.includes(format)) {
            return Promise.reject(new Error('Invalid Format'));
        }
        return this.cache.get(id, { size, format }, async (cachefile) => {
            const result = await this.getImageBufferAs(buffer, format, size);
            if (result.buffer) {
                log.debug('Writing image cache file', cachefile);
                await fse.writeFile(cachefile, result.buffer.buffer);
            }
            else {
                return Promise.reject(new Error('Error while writing image cache file'));
            }
        });
    }
    async get(id, filename, size, format) {
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
            return this.cache.get(id, { size, format }, async (cachefile) => {
                const name = path.basename(cachefile);
                const result = format ?
                    await ImageModule_1.getImageAs(filename, format, size, name) :
                    await this.getImage(filename, size, name);
                if (result.buffer) {
                    log.debug('Writing image cache file', cachefile);
                    await fse.writeFile(cachefile, result.buffer.buffer);
                }
            });
        }
        return this.getImage(filename, size, `${id}.${this.format}`);
    }
    async resizeImagePNG(filename, destination, size) {
        await sharp(filename, { failOn: 'warning' })
            .resize(size, size, { fit: sharp.fit.cover })
            .png()
            .toFile(destination);
    }
    async clearImageCacheByIDs(ids) {
        await this.cache.removeByIDs(ids);
    }
    async createAvatar(filename, destination) {
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
    async generateAvatar(seed, destination) {
        const avatarGenerator = new AvatarGen();
        const avatar = await avatarGenerator.generate(seed);
        await fse.writeFile(destination, avatar);
    }
    static async formatImageInfo(sharpy) {
        try {
            const metadata = await sharpy.metadata();
            return {
                width: metadata.width || 0,
                height: metadata.height || 0,
                format: metadata.format || 'unknown',
                colorDepth: metadata.density ?? 0,
                colors: 0
            };
        }
        catch {
            return { width: 0, height: 0, format: 'invalid', colorDepth: 0, colors: 0 };
        }
    }
    async getImageInfo(filename) {
        return ImageModule_1.formatImageInfo(sharp(filename, { failOn: 'warning' }));
    }
    async getImageInfoBuffer(bin) {
        return ImageModule_1.formatImageInfo(sharp(bin, { failOn: 'warning' }));
    }
};
__decorate([
    Inject,
    __metadata("design:type", ConfigService)
], ImageModule.prototype, "configService", void 0);
ImageModule = ImageModule_1 = __decorate([
    InRequestScope,
    __metadata("design:paramtypes", [])
], ImageModule);
export { ImageModule };
//# sourceMappingURL=image.module.js.map