var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import fse from 'fs-extra';
import Jimp from 'jimp';
import mimeTypes from 'mime-types';
import path from 'path';
import sharp from 'sharp';
import { downloadFile } from '../../utils/download';
import { SupportedWriteImageFormat } from '../../utils/filetype';
import { fileDeleteIfExists, fileSuffix } from '../../utils/fs-utils';
import { IDFolderCache } from '../../utils/id-file-cache';
import { logger } from '../../utils/logger';
import { randomString } from '../../utils/random';
import { AvatarGen } from './image.avatar';
import { ConfigService } from '../engine/services/config.service';
import { Inject, InRequestScope } from 'typescript-ioc';
import { ImageFormatType } from '../../types/enums';
const log = logger('Images');
sharp.cache(false);
sharp.simd(false);
let ImageModule = class ImageModule {
    constructor() {
        this.format = 'png';
        this.imageCachePath = this.configService.getDataPath(['cache', 'images']);
        this.cache = new IDFolderCache(this.imageCachePath, 'thumb', (params) => {
            return `${params.size !== undefined ? `-${params.size}` : ''}.${params.format || this.format}`;
        });
    }
    async storeImage(filepath, name, imageUrl) {
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
    async paint(text, size, format) {
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
        return this.getImageAs(filename, fileFormat, size, name);
    }
    async getImageAs(filename, format, size, name) {
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
            const sharpy = sharp(filename, { failOnError: false });
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
        const destFormat = format || info.format;
        const contentType = mimeTypes.lookup(destFormat);
        if (!contentType) {
            return Promise.reject(`Unknown Image Format Request: ${format}`);
        }
        if (size) {
            return {
                buffer: {
                    buffer: await sharp(buffer, { failOnError: false })
                        .resize(size, size, { fit: sharp.fit.cover })
                        .toFormat(destFormat)
                        .toBuffer(),
                    contentType
                }
            };
        }
        if (format && info.format !== destFormat) {
            return {
                buffer: {
                    buffer: await sharp(buffer, { failOnError: false })
                        .toFormat(destFormat)
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
            return Promise.reject(Error('Invalid Format'));
        }
        return this.cache.get(id, { size, format }, async (cachefile) => {
            const result = await this.getImageBufferAs(buffer, format, size);
            if (result.buffer) {
                log.debug('Writing image cache file', cachefile);
                await fse.writeFile(cachefile, result.buffer.buffer);
            }
            else {
                return Promise.reject(Error('Error while writing image cache file'));
            }
        });
    }
    async get(id, filename, size, format) {
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
            return this.cache.get(id, { size, format }, async (cachefile) => {
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
    async resizeImagePNG(filename, destination, size) {
        await sharp(filename, { failOnError: false })
            .resize(size, size, { fit: sharp.fit.cover })
            .png()
            .toFile(destination);
    }
    async clearImageCacheByIDs(ids) {
        await this.cache.removeByIDs(ids);
    }
    async createAvatar(filename, destination) {
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
    async generateAvatar(seed, destination) {
        const avatarGenerator = new AvatarGen();
        const avatar = await avatarGenerator.generate(seed);
        await fse.writeFile(destination, avatar);
    }
    async formatImageInfo(sharpy) {
        try {
            const metadata = await sharpy.metadata();
            return {
                width: metadata.width || 0,
                height: metadata.height || 0,
                format: metadata.format || '',
                colorDepth: metadata.density || 0,
                colors: 0
            };
        }
        catch (e) {
            return { width: 0, height: 0, format: 'invalid', colorDepth: 0, colors: 0 };
        }
    }
    async getImageInfo(filename) {
        return this.formatImageInfo(sharp(filename, { failOnError: false }));
    }
    async getImageInfoBuffer(bin) {
        return this.formatImageInfo(sharp(bin, { failOnError: false }));
    }
};
__decorate([
    Inject,
    __metadata("design:type", ConfigService)
], ImageModule.prototype, "configService", void 0);
ImageModule = __decorate([
    InRequestScope,
    __metadata("design:paramtypes", [])
], ImageModule);
export { ImageModule };
//# sourceMappingURL=image.module.js.map