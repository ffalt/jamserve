import fs from 'node:fs';
import fse from 'fs-extra';
import { FlacProcessorStream, MDB_TYPE } from './lib/processor.js';
export class Flac {
    async read(filename) {
        const result = {};
        return new Promise((resolve, reject) => {
            const reader = fs.createReadStream(filename);
            const processor = new FlacProcessorStream(true, true);
            processor.on('postprocess', (mdb) => {
                if (mdb.type === MDB_TYPE.STREAMINFO) {
                    result.media = Flac.formatMediaBlock(mdb);
                }
                else if (mdb.type === MDB_TYPE.VORBIS_COMMENT) {
                    result.comment = this.formatMediaComment(mdb);
                }
                else if (mdb.type === MDB_TYPE.PICTURE && mdb.pictureData) {
                    result.pictures = result.pictures ?? [];
                    result.pictures.push(Flac.formatMediaPicture(mdb));
                }
            });
            processor.on('id3', (buffer) => {
                result.id3 = buffer;
            });
            processor.on('done', () => {
                resolve(result);
            });
            processor.on('error', (error) => {
                reject(error);
            });
            reader.on('error', (error) => {
                reject(error);
            });
            try {
                reader.pipe(processor);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async writeTo(filename, destination, flacBlocks) {
        if (flacBlocks.length === 0) {
            return Promise.reject(new Error('Must write minimum 1 MetaDataBlock'));
        }
        for (const flacBlock of flacBlocks) {
            flacBlock.isLast = false;
        }
        const reader = fs.createReadStream(filename);
        const writer = fs.createWriteStream(destination);
        const processor = new FlacProcessorStream(false, false);
        return new Promise((resolve, reject) => {
            processor.on('preprocess', (mdb) => {
                if (mdb.type === MDB_TYPE.VORBIS_COMMENT || mdb.type === MDB_TYPE.PICTURE || mdb.type === MDB_TYPE.PADDING) {
                    mdb.remove();
                }
                if (mdb.isLast) {
                    if (mdb.removed) {
                        const lastBlock = flacBlocks.at(-1);
                        if (lastBlock) {
                            lastBlock.isLast = true;
                        }
                    }
                    for (const block of flacBlocks) {
                        processor.push(block.publish());
                    }
                    flacBlocks = [];
                }
            });
            reader.on('error', (error) => {
                reject(error);
            });
            processor.on('error', (error) => {
                reject(error);
            });
            writer.on('error', (error) => {
                reject(error);
            });
            writer.on('finish', () => {
                resolve();
            });
            reader.pipe(processor).pipe(writer);
        });
    }
    async write(filename, flacBlocks) {
        const temporaryFile = `${filename}.tmp`;
        try {
            await this.writeTo(filename, temporaryFile, flacBlocks);
            const exists = await fse.pathExists(filename);
            if (exists) {
                await fse.remove(filename);
            }
            await fse.move(temporaryFile, filename);
        }
        catch (error) {
            const exists = await fse.pathExists(temporaryFile);
            if (exists) {
                await fse.remove(temporaryFile);
            }
            return Promise.reject(error);
        }
    }
    formatMediaComment(mdb) {
        const tag = {};
        for (const line of mdb.comments) {
            const pos = line.indexOf('=');
            const key = line.slice(0, pos).toUpperCase().replaceAll(' ', '_');
            let index = 1;
            let suffix = '';
            while (tag[key + suffix]) {
                index++;
                suffix = `|${index}`;
            }
            tag[key + suffix] = line.slice(pos + 1);
        }
        return { vendor: mdb.vendor, tag };
    }
    static formatMediaBlock(mdb) {
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
    static formatMediaPicture(mdb) {
        return {
            pictureType: mdb.pictureType,
            mimeType: mdb.mimeType,
            description: mdb.description,
            width: mdb.width,
            height: mdb.height,
            bitsPerPixel: mdb.bitsPerPixel,
            colors: mdb.colors,
            pictureData: mdb.pictureData ?? Buffer.alloc(0)
        };
    }
}
//# sourceMappingURL=index.js.map