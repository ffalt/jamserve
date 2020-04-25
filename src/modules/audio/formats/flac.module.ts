import fse from 'fs-extra';
import {Jam} from '../../../model/jam-rest-data';
import {TrackTagFormatType} from '../../../model/jam-types';
import {ImageModule} from '../../image/image.module';
import {FORMAT} from '../audio.format';
import {AudioScanResult} from '../audio.module';
import {flacToRawTag, id3v2ToFlacMetaData, rawTagToID3v2} from '../metadata';
import {Flac} from './flac';
import {MetaWriteableDataBlock} from './flac/lib/block.writeable';

export class AudioModuleFLAC {

	constructor(private imageModule: ImageModule) {
	}

	async read(filename: string): Promise<AudioScanResult> {
		const flac = new Flac();
		try {
			const result = await flac.read(filename);
			return {tag: FORMAT.packFlacVorbisCommentJamServeTag(result.comment, result.pictures), media: FORMAT.packFlacMediaInfoJamServeMedia(result.media)};
		} catch (e) {
			console.error(e);
			return {tag: {format: TrackTagFormatType.none}, media: {}};
		}
	}

	async readRaw(filename: string): Promise<Jam.RawTag | undefined> {
		const flac = new Flac();
		const result = await flac.read(filename);
		if (!result || !result.comment) {
			return Promise.reject(Error('No Flac Vorbis Comment found'));
		}
		return flacToRawTag(result);
	}

	async write(filename: string, tag: Jam.RawTag): Promise<void> {
		const id3 = rawTagToID3v2(tag);
		const flacBlocks: Array<MetaWriteableDataBlock> = await id3v2ToFlacMetaData(id3, this.imageModule);
		const flac = new Flac();
		// TODO: add tests for flac writing, make backup copy as long it is not well tested
		const exits = await fse.pathExists(`${filename}.bak`);
		if (!exits) {
			await fse.copy(filename, `${filename}.bak`);
		}
		await flac.write(filename, flacBlocks);
	}

	async extractTagImage(filename: string): Promise<Buffer | undefined> {
		const flac = new Flac();
		const tag = await flac.read(filename);
		if (tag && tag.pictures) {
			let pic = tag.pictures.find(p => p.pictureType === 3 /*ID3v2 picture type "cover front" used in FLAC */);
			if (!pic) {
				pic = tag.pictures[0];
			}
			if (pic) {
				return pic.pictureData;
			}
		}
	}

}
