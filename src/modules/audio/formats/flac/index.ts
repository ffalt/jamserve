import fs from 'node:fs';
import fse from 'fs-extra';
import { MetaDataBlock } from './lib/block.js';
import { MetaDataBlockPicture } from './lib/block.picture.js';
import { MetaDataBlockStreamInfo } from './lib/block.streaminfo.js';
import { BlockVorbiscomment } from './lib/block.vorbiscomment.js';
import { MetaWriteableDataBlock } from './lib/block.writeable.js';
import { FlacProcessorStream, MDB_TYPE } from './lib/processor.js';

export interface FlacComment {
	vendor: string;
	tag: Record<string, string>;
}

export interface FlacPicture {
	pictureType: number;
	mimeType: string;
	description: string;
	width: number;
	height: number;
	bitsPerPixel: number;
	colors: number;
	pictureData: Buffer;
}

export interface FlacMedia {
	duration: number;
	channels: number;
	bitsPerSample: number;
	sampleRate: number;
	sampleCount: number;
	minBlockSize: number;
	maxBlockSize: number;
	minFrameSize: number;
	maxFrameSize: number;
}

export interface FlacInfo {
	media?: FlacMedia;
	comment?: FlacComment;
	pictures?: Array<FlacPicture>;
	id3?: Buffer;
}

export class Flac {
	async read(filename: string): Promise<FlacInfo> {
		const result: FlacInfo = {};
		return new Promise<FlacInfo>((resolve, reject) => {
			const reader = fs.createReadStream(filename);
			const processor = new FlacProcessorStream(true, true);
			processor.on('postprocess', (mdb: MetaDataBlock) => {
				if (mdb.type === MDB_TYPE.STREAMINFO) {
					result.media = Flac.formatMediaBlock(mdb as MetaDataBlockStreamInfo);
				} else if (mdb.type === MDB_TYPE.VORBIS_COMMENT) {
					result.comment = this.formatMediaComment(mdb as BlockVorbiscomment);
				} else if (mdb.type === MDB_TYPE.PICTURE && (mdb as MetaDataBlockPicture).pictureData) {
					result.pictures = result.pictures || [];
					result.pictures.push(Flac.formatMediaPicture(mdb as MetaDataBlockPicture));
				}
			});
			processor.on('id3', (buffer: Buffer) => {
				result.id3 = buffer;
			});
			processor.on('done', () => {
				resolve(result);
			});
			processor.on('error', (e: Error) => {
				reject(e);
			});
			reader.on('error', (e: Error) => {
				reject(e);
			});
			try {
				reader.pipe(processor);
			} catch (error) {
				reject(error);
			}
		});
	}

	async writeTo(filename: string, destination: string, flacBlocks: Array<MetaWriteableDataBlock>): Promise<void> {
		if (flacBlocks.length === 0) {
			return Promise.reject(new Error('Must write minimum 1 MetaDataBlock'));
		}
		for (const flacBlock of flacBlocks) {
			flacBlock.isLast = false;
		}
		const reader = fs.createReadStream(filename);
		const writer = fs.createWriteStream(destination);
		const processor = new FlacProcessorStream(false, false);
		return new Promise<void>((resolve, reject) => {
			processor.on('preprocess', mdb => {
				if (mdb.type === MDB_TYPE.VORBIS_COMMENT || mdb.type === MDB_TYPE.PICTURE || mdb.type === MDB_TYPE.PADDING) {
					mdb.remove();
				}
				if (mdb.isLast) {
					if (mdb.remove) {
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
			reader.on('error', (e: Error) => {
				reject(e);
			});
			processor.on('error', (e: Error) => {
				reject(e);
			});
			writer.on('error', (e: Error) => {
				reject(e);
			});
			writer.on('finish', () => {
				resolve();
			});
			reader.pipe(processor).pipe(writer);
		});
	}

	async write(filename: string, flacBlocks: Array<MetaWriteableDataBlock>): Promise<void> {
		const tmpFile = `${filename}.tmp`;
		try {
			await this.writeTo(filename, tmpFile, flacBlocks);
			const exists = await fse.pathExists(filename);
			if (exists) {
				await fse.remove(filename);
			}
			await fse.move(tmpFile, filename);
		} catch (error) {
			const exists = await fse.pathExists(tmpFile);
			if (exists) {
				await fse.remove(tmpFile);
			}
			return Promise.reject(error);
		}
	}

	private formatMediaComment(mdb: BlockVorbiscomment): FlacComment {
		const tag: Record<string, string> = {};
		for (const line of mdb.comments) {
			const pos = line.indexOf('=');
			const key = line.slice(0, pos).toUpperCase().replaceAll(' ', '_');
			let i = 1;
			let suffix = '';
			while (tag[key + suffix]) {
				i++;
				suffix = `|${i}`;
			}
			tag[key + suffix] = line.slice(pos + 1);
		}
		return { vendor: mdb.vendor, tag };
	}

	private static formatMediaBlock(mdb: MetaDataBlockStreamInfo): FlacMedia {
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

	private static formatMediaPicture(mdb: MetaDataBlockPicture): FlacPicture {
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
