import fse from 'fs-extra';
import { ImageModule } from '../../image/image.module.js';
import { FORMAT } from '../audio.format.js';
import { AudioScanResult } from '../audio.module.js';
import { flacToRawTag, id3v2ToFlacMetaData, rawTagToID3v2 } from '../metadata.js';
import { Flac } from './flac/index.js';
import { MetaWriteableDataBlock } from './flac/lib/block.writeable.js';
import { TagFormatType } from '../../../types/enums.js';
import { MediaTagRaw } from '../../../entity/tag/tag.model.js';

export class AudioModuleFLAC {
	constructor(private readonly imageModule: ImageModule) {
	}

	async read(filename: string): Promise<AudioScanResult> {
		const flac = new Flac();
		try {
			const result = await flac.read(filename);
			return {
				format: TagFormatType.none,
				...FORMAT.packFlacMediaInfoJamServeMedia(result.media),
				...FORMAT.packFlacVorbisCommentJamServeTag(result.comment, result.pictures)
			};
		} catch (error: unknown) {
			console.error(error);
			return { format: TagFormatType.none };
		}
	}

	async readRaw(filename: string): Promise<MediaTagRaw | undefined> {
		const flac = new Flac();
		const result = await flac.read(filename);
		if (!result.comment) {
			return Promise.reject(new Error('No Flac Vorbis Comment found'));
		}
		return flacToRawTag(result);
	}

	async write(filename: string, tag: MediaTagRaw): Promise<void> {
		const id3 = rawTagToID3v2(tag);
		const flacBlocks: Array<MetaWriteableDataBlock> = await id3v2ToFlacMetaData(id3, this.imageModule);
		const flac = new Flac();
		const exits = await fse.pathExists(`${filename}.bak`);
		if (!exits) {
			await fse.copy(filename, `${filename}.bak`);
		}
		await flac.write(filename, flacBlocks);
	}

	async extractTagImage(filename: string): Promise<Buffer | undefined> {
		const flac = new Flac();
		const tag = await flac.read(filename);
		if (tag.pictures) {
			let pic = tag.pictures.find(p => p.pictureType === 3 /* ID3v2 picture type "cover front" used in FLAC */);
			if (!pic && tag.pictures.length > 0) {
				pic = tag.pictures.at(0);
			}
			if (pic) {
				return pic.pictureData;
			}
		}
		return;
	}
}
