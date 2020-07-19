"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flac = void 0;
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const processor_1 = require("./lib/processor");
class Flac {
    async read(filename) {
        const result = {};
        return new Promise((resolve, reject) => {
            const reader = fs_1.default.createReadStream(filename);
            const processor = new processor_1.FlacProcessorStream(true, true);
            processor.on('postprocess', (mdb) => {
                if (mdb.type === 0) {
                    result.media = this.formatMediaBlock(mdb);
                }
                else if (mdb.type === 4) {
                    result.comment = this.formatMediaComment(mdb);
                }
                else if (mdb.type === 6) {
                    if (mdb.pictureData) {
                        result.pictures = result.pictures || [];
                        result.pictures.push(this.formatMediaPicture(mdb));
                    }
                }
            });
            processor.on('id3', (buffer) => {
                result.id3 = buffer;
            });
            processor.on('done', () => {
                resolve(result);
            });
            processor.on('error', (e) => {
                reject(e);
            });
            reader.on('error', (e) => {
                reject(e);
            });
            try {
                reader.pipe(processor);
            }
            catch (e) {
                reject(e);
            }
        });
    }
    async writeTo(filename, destination, flacBlocks) {
        if (flacBlocks.length === 0) {
            return Promise.reject(Error('Must write minimum 1 MetaDataBlock'));
        }
        flacBlocks.forEach(flacBlock => {
            flacBlock.isLast = false;
        });
        const reader = fs_1.default.createReadStream(filename);
        const writer = fs_1.default.createWriteStream(destination);
        const processor = new processor_1.FlacProcessorStream(false, false);
        return new Promise((resolve, reject) => {
            processor.on('preprocess', mdb => {
                if (mdb.type === 4 || mdb.type === 6 || mdb.type === 1) {
                    mdb.remove();
                }
                if (mdb.isLast) {
                    if (mdb.remove) {
                        flacBlocks[flacBlocks.length - 1].isLast = true;
                    }
                    for (const block of flacBlocks) {
                        processor.push(block.publish());
                    }
                    flacBlocks = [];
                }
            });
            reader.on('error', (e) => {
                reject(e);
            });
            processor.on('error', (e) => {
                reject(e);
            });
            writer.on('error', (e) => {
                reject(e);
            });
            writer.on('finish', () => {
                resolve();
            });
            reader.pipe(processor).pipe(writer);
        });
    }
    async write(filename, flacBlocks) {
        const tmpFile = `${filename}.tmp`;
        try {
            await this.writeTo(filename, tmpFile, flacBlocks);
            const exists = await fs_extra_1.default.pathExists(filename);
            if (exists) {
                await fs_extra_1.default.remove(filename);
            }
            await fs_extra_1.default.move(tmpFile, filename);
        }
        catch (e) {
            const exists = await fs_extra_1.default.pathExists(tmpFile);
            if (exists) {
                await fs_extra_1.default.remove(tmpFile);
            }
            return Promise.reject(e);
        }
    }
    formatMediaComment(mdb) {
        const tag = {};
        mdb.comments.forEach(line => {
            const pos = line.indexOf('=');
            const key = line.slice(0, pos).toUpperCase().replace(/ /g, '_');
            let i = 1;
            let suffix = '';
            while (tag[key + suffix]) {
                i++;
                suffix = `|${i}`;
            }
            tag[key + suffix] = line.slice(pos + 1);
        });
        return { vendor: mdb.vendor, tag };
    }
    formatMediaBlock(mdb) {
        return {
            duration: mdb.duration,
            channels: mdb.channels + 1,
            bitsPerSample: mdb.bitsPerSample + 1,
            sampleRate: mdb.sampleRate,
            sampleCount: mdb.samples,
            minBlockSize: mdb.minBlockSize,
            maxBlockSize: mdb.maxBlockSize,
            minFrameSize: mdb.minFrameSize,
            maxFrameSize: mdb.maxFrameSize
        };
    }
    formatMediaPicture(mdb) {
        return {
            pictureType: mdb.pictureType,
            mimeType: mdb.mimeType,
            description: mdb.description,
            width: mdb.width,
            height: mdb.height,
            bitsPerPixel: mdb.bitsPerPixel,
            colors: mdb.colors,
            pictureData: mdb.pictureData
        };
    }
}
exports.Flac = Flac;
//# sourceMappingURL=index.js.map