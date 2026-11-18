import fse from 'fs-extra';
import { FORMAT } from '../audio.format.js';
import { flacToRawTag, id3v2ToFlacMetadata, rawTagToID3v2 } from '../metadata.js';
import { Flac } from './flac/index.js';
import { TagFormatType } from '../../../types/enums.js';
import { hasLyricsTimestamps, lyricsLanguageCode, lyricsToEvents, parseSimplifiedSynchronisedLyrics, plainLyrics } from '../../../utils/lyrics-lrc.js';
import { logger } from '../../../utils/logger.js';
const log = logger('FLAC');
export class AudioModuleFLAC {
    constructor(imageModule) {
        this.imageModule = imageModule;
    }
    async read(filename) {
        const flac = new Flac();
        try {
            const result = await flac.read(filename);
            return {
                format: TagFormatType.none,
                ...FORMAT.packFlacMediaInfoJamServeMedia(result.media),
                ...FORMAT.packFlacVorbisCommentJamServeTag(result.comment, result.pictures)
            };
        }
        catch (error) {
            log.error(error);
            return { format: TagFormatType.none };
        }
    }
    async readRaw(filename) {
        const flac = new Flac();
        const result = await flac.read(filename);
        if (!result.comment) {
            return Promise.reject(new Error('No Flac Vorbis Comment found'));
        }
        return flacToRawTag(result);
    }
    async write(filename, tag) {
        const id3 = rawTagToID3v2(tag);
        const flacBlocks = await id3v2ToFlacMetadata(id3, this.imageModule);
        const flac = new Flac();
        const exits = await fse.pathExists(`${filename}.bak`);
        if (!exits) {
            await fse.copy(filename, `${filename}.bak`);
        }
        await flac.write(filename, flacBlocks);
    }
    async writeLyrics(filename, lyrics) {
        const text = lyrics.lyrics ?? (lyrics.syncedLyrics ? plainLyrics(lyrics.syncedLyrics) : undefined);
        if (!text) {
            return;
        }
        let tag;
        try {
            tag = await this.readRaw(filename);
        }
        catch {
            tag = undefined;
        }
        const raw = tag ?? { version: 4, frames: {} };
        const language = lyricsLanguageCode(lyrics.language);
        raw.frames.USLT = [{ id: 'USLT', value: { id: 'lyrics', language, text } }];
        if (lyrics.syncedLyrics) {
            const events = lyricsToEvents(lyrics.syncedLyrics);
            if (events.length > 0) {
                raw.frames.SYLT = [{
                        id: 'SYLT',
                        value: { id: 'lyrics', language, timestampFormat: 2, contentType: 1, events }
                    }];
            }
            else {
                delete raw.frames.SYLT;
            }
        }
        else {
            delete raw.frames.SYLT;
        }
        delete raw.frames.ULT;
        delete raw.frames.SLT;
        await this.write(filename, raw);
    }
    async extractTagImage(filename) {
        const flac = new Flac();
        const tag = await flac.read(filename);
        if (tag.pictures) {
            let pic = tag.pictures.find(p => p.pictureType === 3);
            if (!pic && tag.pictures.length > 0) {
                pic = tag.pictures.at(0);
            }
            if (pic) {
                return pic.pictureData;
            }
        }
        return;
    }
    resolveTimeStampFormat(timestampFormat) {
        if (timestampFormat === 1) {
            return 'MPEG frames';
        }
        return 'milliseconds';
    }
    resolveContentType(contentType) {
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
    async extractTagSyncedLyrics(filename) {
        const flac = new Flac();
        const result = await flac.read(filename);
        const simple = result.comment?.tag;
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
//# sourceMappingURL=flac.module.js.map