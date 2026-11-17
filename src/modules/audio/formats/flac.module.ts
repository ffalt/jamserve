import fse from 'fs-extra';
import { ImageModule } from '../../image/image.module.js';
import { FORMAT, TrackSyncronizedLyrics } from '../audio.format.js';
import { AudioScanResult } from '../audio.module.js';
import { flacToRawTag, id3v2ToFlacMetadata, rawTagToID3v2 } from '../metadata.js';
import { Flac } from './flac/index.js';
import { MetaWriteableDataBlock } from './flac/lib/block.writeable.js';
import { TagFormatType } from '../../../types/enums.js';
import { MediaTagRaw } from '../../../entity/tag/tag.model.js';
import { TrackLyrics } from '../../../entity/track/track.model.js';
import { hasLyricsTimestamps, lyricsLanguageCode, lyricsToEvents, parseSimplifiedSynchronisedLyrics, plainLyrics } from '../../../utils/lyrics-lrc.js';
import { logger } from '../../../utils/logger.js';

const log = logger('FLAC');

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
			log.error(error);
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
		const flacBlocks: Array<MetaWriteableDataBlock> = await id3v2ToFlacMetadata(id3, this.imageModule);
		const flac = new Flac();
		const exits = await fse.pathExists(`${filename}.bak`);
		if (!exits) {
			await fse.copy(filename, `${filename}.bak`);
		}
		await flac.write(filename, flacBlocks);
	}

	async writeLyrics(filename: string, lyrics: TrackLyrics): Promise<void> {
		const text = lyrics.lyrics ?? (lyrics.syncedLyrics ? plainLyrics(lyrics.syncedLyrics) : undefined);
		if (!text) {
			return;
		}
		let tag: MediaTagRaw | undefined;
		try {
			tag = await this.readRaw(filename);
		} catch {
			tag = undefined;
		}
		const raw: MediaTagRaw = tag ?? { version: 4, frames: {} };
		const language = lyricsLanguageCode(lyrics.language);
		raw.frames.USLT = [{ id: 'USLT', value: { id: 'lyrics', language, text } }];
		if (lyrics.syncedLyrics) {
			const events = lyricsToEvents(lyrics.syncedLyrics);
			if (events.length > 0) {
				raw.frames.SYLT = [{
					id: 'SYLT',
					value: { id: 'lyrics', language, timestampFormat: 2, contentType: 1, events } as any
				}];
			} else {
				delete raw.frames.SYLT;
			}
		} else {
			delete raw.frames.SYLT;
		}
		delete raw.frames.ULT;
		delete raw.frames.SLT;
		await this.write(filename, raw);
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

	resolveTimeStampFormat(timestampFormat: number): string {
		if (timestampFormat === 1) {
			return 'MPEG frames';
		}
		return 'milliseconds';
	}

	resolveContentType(contentType: number): string {
		switch (contentType) {
			case 1: {
				return 'lyrics';
			}
			case 2: {
				return 'text transcription';
			}
			case 3: {
				return 'part name';
			}
			case 4: {
				return 'events';
			}
			case 5: {
				return 'chord';
			}
			case 6: {
				return 'trivia';
			}
			default: {
				return 'other';
			}
		}
	}

	async extractTagSyncedLyrics(filename: string): Promise<TrackSyncronizedLyrics | undefined> {
		const flac = new Flac();
		const result = await flac.read(filename);
		const simple: Record<string, string | undefined> | undefined = result.comment?.tag;
		if (!simple) {
			return;
		}
		const syncedRaw = simple.SYNCHRONISEDLYRICS ?? simple.SYNCEDLYRICS ?? (simple.LYRICS && hasLyricsTimestamps(simple.LYRICS) ? simple.LYRICS : undefined);
		if (syncedRaw) {
			const parsed = parseSimplifiedSynchronisedLyrics(syncedRaw);
			if (parsed && parsed.events.length > 0) {
				return {
					language: parsed.language,
					contentType: this.resolveContentType(parsed.contentType),
					timestampFormat: this.resolveTimeStampFormat(parsed.timestampFormat),
					events: parsed.events
				};
			}
		}
		return;
	}
}
