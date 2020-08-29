"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageModule = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const jimp_1 = __importDefault(require("jimp"));
const mime_types_1 = __importDefault(require("mime-types"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const download_1 = require("../../utils/download");
const filetype_1 = require("../../utils/filetype");
const fs_utils_1 = require("../../utils/fs-utils");
const id_file_cache_1 = require("../../utils/id-file-cache");
const logger_1 = require("../../utils/logger");
const random_1 = require("../../utils/random");
const image_avatar_1 = require("./image.avatar");
const config_service_1 = require("../engine/services/config.service");
const typescript_ioc_1 = require("typescript-ioc");
const enums_1 = require("../../types/enums");
const log = logger_1.logger('Images');
sharp_1.default.cache(false);
sharp_1.default.simd(false);
let ImageModule = class ImageModule {
    constructor() {
        this.format = 'png';
        this.imageCachePath = this.configService.getDataPath(['cache', 'images']);
        this.cache = new id_file_cache_1.IDFolderCache(this.imageCachePath, 'thumb', (params) => {
            return `${params.size !== undefined ? `-${params.size}` : ''}.${params.format || this.format}`;
        });
    }
    async storeImage(filepath, name, imageUrl) {
        log.debug('Requesting image', imageUrl);
        const imageext = path_1.default.extname(imageUrl).split('?')[0].trim().toLowerCase();
        if (imageext.length === 0) {
            return Promise.reject(Error('Invalid Image URL'));
        }
        let filename = name + imageext;
        let nr = 2;
        while (await fs_extra_1.default.pathExists(path_1.default.join(filepath, filename))) {
            filename = `${name}-${nr}${imageext}`;
            nr++;
        }
        await download_1.downloadFile(imageUrl, path_1.default.join(filepath, filename));
        log.info('Image downloaded', filename);
        return filename;
    }
    async paint(text, size, format) {
        size = size || 320;
        const image = new jimp_1.default(360, 360, '#282828');
        if (!this.font) {
            this.font = await jimp_1.default.loadFont(jimp_1.default.FONT_SANS_32_WHITE);
        }
        image.print(this.font, 10, 10, {
            text,
            alignmentX: jimp_1.default.HORIZONTAL_ALIGN_CENTER,
            alignmentY: jimp_1.default.VERTICAL_ALIGN_MIDDLE
        }, 340, 340);
        image.resize(size, size);
        const mime = mime_types_1.default.lookup(format ? format : this.format);
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
        let fileFormat = fs_utils_1.fileSuffix(filename);
        if (!filetype_1.SupportedWriteImageFormat.includes(fileFormat)) {
            fileFormat = this.format;
        }
        return this.getImageAs(filename, fileFormat, size, name);
    }
    async getImageAs(filename, format, size, name) {
        const fileFormat = fs_utils_1.fileSuffix(filename);
        const exists = await fs_extra_1.default.pathExists(filename);
        if (!exists) {
            return Promise.reject(Error('File not found'));
        }
        if (size || (fileFormat !== format)) {
            const mime = mime_types_1.default.lookup(format);
            if (!mime) {
                return Promise.reject(`Unknown Image Format Request: ${format} ${filename}`);
            }
            const sharpy = sharp_1.default(filename, { failOnError: false });
            if (size) {
                sharpy.resize(size, size, { fit: sharp_1.default.fit.cover, position: sharp_1.default.strategy.entropy });
            }
            sharpy.toFormat(format);
            const buffer = await sharpy.toBuffer();
            return { buffer: { buffer, contentType: mime } };
        }
        return { file: { filename, name } };
    }
    async getImageBufferAs(buffer, format, size) {
        const info = await this.getImageInfoBuffer(buffer);
        if (!format && size && !filetype_1.SupportedWriteImageFormat.includes(info.format)) {
            format = enums_1.ImageFormatType.jpeg;
        }
        const destFormat = format || info.format;
        const contentType = mime_types_1.default.lookup(destFormat);
        if (!contentType) {
            return Promise.reject(`Unknown Image Format Request: ${format}`);
        }
        if (size) {
            return {
                buffer: {
                    buffer: await sharp_1.default(buffer, { failOnError: false })
                        .resize(size, size, { fit: sharp_1.default.fit.cover })
                        .toFormat(destFormat)
                        .toBuffer(),
                    contentType
                }
            };
        }
        if (format && info.format !== destFormat) {
            return {
                buffer: {
                    buffer: await sharp_1.default(buffer, { failOnError: false })
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
        if (format && !filetype_1.SupportedWriteImageFormat.includes(format)) {
            return Promise.reject(Error('Invalid Format'));
        }
        return this.cache.get(id, { size, format }, async (cachefile) => {
            const result = await this.getImageBufferAs(buffer, format, size);
            if (result.buffer) {
                log.debug('Writing image cache file', cachefile);
                await fs_extra_1.default.writeFile(cachefile, result.buffer.buffer);
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
        if (format && !filetype_1.SupportedWriteImageFormat.includes(format)) {
            return Promise.reject(Error('Invalid Format'));
        }
        if (format && format === this.format) {
            format = undefined;
        }
        if (format || size) {
            return this.cache.get(id, { size, format }, async (cachefile) => {
                const name = path_1.default.basename(cachefile);
                const result = format ?
                    await this.getImageAs(filename, format, size, name) :
                    await this.getImage(filename, size, name);
                if (result.buffer) {
                    log.debug('Writing image cache file', cachefile);
                    await fs_extra_1.default.writeFile(cachefile, result.buffer.buffer);
                }
            });
        }
        return this.getImage(filename, size, `${id}.${this.format}`);
    }
    async resizeImagePNG(filename, destination, size) {
        await sharp_1.default(filename, { failOnError: false })
            .resize(size, size, { fit: sharp_1.default.fit.cover })
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
        const exists = await fs_extra_1.default.pathExists(filename);
        if (!exists) {
            return Promise.reject(Error('File not found'));
        }
        const tempFile = `${filename}.new${random_1.randomString(8)}.png`;
        await this.resizeImagePNG(filename, tempFile, 300);
        await fs_utils_1.fileDeleteIfExists(destination);
        await fs_extra_1.default.rename(tempFile, destination);
    }
    async generateAvatar(seed, destination) {
        const avatarGenerator = new image_avatar_1.AvatarGen();
        const avatar = await avatarGenerator.generate(seed);
        await fs_extra_1.default.writeFile(destination, avatar);
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
        return this.formatImageInfo(sharp_1.default(filename, { failOnError: false }));
    }
    async getImageInfoBuffer(bin) {
        return this.formatImageInfo(sharp_1.default(bin, { failOnError: false }));
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", config_service_1.ConfigService)
], ImageModule.prototype, "configService", void 0);
ImageModule = __decorate([
    typescript_ioc_1.InRequestScope,
    __metadata("design:paramtypes", [])
], ImageModule);
exports.ImageModule = ImageModule;
//# sourceMappingURL=image.module.js.map