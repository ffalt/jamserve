import fs from 'fs';
import fse from 'fs-extra';
import {MetaDataBlock} from './lib/block';
import {MetaDataBlockPicture} from './lib/block.picture';
import {MetaDataBlockStreamInfo} from './lib/block.streaminfo';
import {BlockVorbiscomment} from './lib/block.vorbiscomment';
import {MetaWriteableDataBlock} from './lib/block.writeable';
import {FlacProcessorStream, MDB_TYPE_PADDING, MDB_TYPE_PICTURE, MDB_TYPE_STREAMINFO, MDB_TYPE_VORBIS_COMMENT} from './lib/processor';

export interface FlacComment {
	vendor: string;
	tag: {
		[key: string]: string;
	};
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
				if (mdb.type === MDB_TYPE_STREAMINFO) {
					result.media = this.formatMediaBlock(mdb as MetaDataBlockStreamInfo);
				} else if (mdb.type === MDB_TYPE_VORBIS_COMMENT) {
					result.comment = this.formatMediaComment(mdb as BlockVorbiscomment);
				} else if (mdb.type === MDB_TYPE_PICTURE) {
					if ((mdb as MetaDataBlockPicture).pictureData) {
						result.pictures = result.pictures || [];
						result.pictures.push(this.formatMediaPicture(mdb as MetaDataBlockPicture));
					}
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
			} catch (e) {
				reject(e);
			}
		});
	}

	async writeTo(filename: string, destination: string, flacBlocks: Array<MetaWriteableDataBlock>): Promise<void> {
		if (flacBlocks.length === 0) {
			return Promise.reject(Error('Must write minimum 1 MetaDataBlock'));
		}
		flacBlocks.forEach(flacBlock => {
			flacBlock.isLast = false;
		});
		const reader = fs.createReadStream(filename);
		const writer = fs.createWriteStream(destination);
		const processor = new FlacProcessorStream(false, false);
		return new Promise<void>((resolve, reject) => {
			processor.on('preprocess', mdb => {
				if (mdb.type === MDB_TYPE_VORBIS_COMMENT || mdb.type === MDB_TYPE_PICTURE || mdb.type === MDB_TYPE_PADDING) {
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
		} catch (e) {
			const exists = await fse.pathExists(tmpFile);
			if (exists) {
				await fse.remove(tmpFile);
			}
			return Promise.reject(e);
		}
	}

	private formatMediaComment(mdb: BlockVorbiscomment): FlacComment {
		const tag: { [key: string]: string } = {};
		mdb.comments.forEach(line => {
			const pos = line.indexOf('=');
			const key = line.slice(0, pos).toUpperCase().replace(/ /g, '_');
			let i = 1;
			let suffix = '';
			while (tag[key + suffix]) {
				i++;
				suffix = `|${i}`;
			}
			const val = line.slice(pos + 1);
			tag[key + suffix] = val;
		});
		return {vendor: mdb.vendor, tag};
	}

	private formatMediaBlock(mdb: MetaDataBlockStreamInfo): FlacMedia {
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

	private formatMediaPicture(mdb: MetaDataBlockPicture): FlacPicture {
		return {
			pictureType: mdb.pictureType,
			mimeType: mdb.mimeType,
			description: mdb.description,
			width: mdb.width,
			height: mdb.height,
			bitsPerPixel: mdb.bitsPerPixel,
			colors: mdb.colors,
			pictureData: mdb.pictureData as Buffer
		};
	}

}
