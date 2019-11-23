import fse from 'fs-extra';
import {ID3v1, ID3v2, IID3V2, MP3} from 'jamp3';
import {ThirdpartyToolsConfig} from '../../config/thirdparty.config';
import {TrackMedia, TrackTag} from '../../engine/track/track.model';
import {AcousticBrainz} from '../../model/acousticbrainz-rest-data';
import {Acoustid} from '../../model/acoustid-rest-data';
import {CoverArtArchive} from '../../model/coverartarchive-rest-data';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {AudioFormatType, CoverArtArchiveLookupType, TrackTagFormatType, WaveformFormatType} from '../../model/jam-types';
import {LastFM} from '../../model/lastfm-rest-data';
import {MusicBrainz} from '../../model/musicbrainz-rest-data';
import {WikiData} from '../../model/wikidata-rest-data';
import {ApiBinaryResult} from '../../typings';
import {fileDeleteIfExists, fileSuffix} from '../../utils/fs-utils';
import {IDFolderCache} from '../../utils/id-file-cache';
import {logger} from '../../utils/logger';
import {ImageModule} from '../image/image.module';
import {FORMAT} from './audio.format';
import {AcousticbrainzClient} from './clients/acousticbrainz-client';
import {AcoustidClient} from './clients/acoustid-client';
import {CoverArtArchiveClient} from './clients/coverartarchive-client';
import {LastFMClient} from './clients/lastfm-client';
import {LyricsOVHClient, LyricsResult} from './clients/lyricsovh-client';
import {MusicbrainzClient} from './clients/musicbrainz-client';
import {MusicbrainzClientApi} from './clients/musicbrainz-client.interface';
import {WikipediaClient} from './clients/wikipedia-client';
import {Flac} from './formats/flac';
import {MetaWriteableDataBlock} from './formats/flac/lib/block.writeable';
import {flacToRawTag, id3v2ToFlacMetaData, id3v2ToRawTag, rawTagToID3v2} from './metadata';
import {rewriteWriteFFmpeg} from './tools/ffmpeg-rewrite';
import {probe} from './tools/ffprobe';
import {mp3val} from './tools/mp3val';
import {TranscoderStream} from './transcoder/transcoder-stream';
import {WaveformGenerator} from './waveform/waveform.generator';

const log = logger('Audio');

export interface AudioScanResult {
	media?: TrackMedia;
	tag?: TrackTag;
}

export const ID3TrackTagRawFormatTypes = [TrackTagFormatType.id3v20, TrackTagFormatType.id3v21, TrackTagFormatType.id3v22, TrackTagFormatType.id3v23, TrackTagFormatType.id3v24];

export class AudioModule {
	musicbrainz: MusicbrainzClient;
	acoustid: AcoustidClient;
	lastFM: LastFMClient;
	lyricsOVH: LyricsOVHClient;
	acousticbrainz: AcousticbrainzClient;
	coverArtArchive: CoverArtArchiveClient;
	wikipedia: WikipediaClient;
	private waveformCache: IDFolderCache<{ width?: number, format: string }>;
	private transcodeCache: IDFolderCache<{ maxBitRate?: number, format: string }>;
	private savingBlock = new Map<string, boolean>();

	constructor(waveformCachePath: string, transcodeCachePath: string, tools: ThirdpartyToolsConfig, public imageModule: ImageModule) {
		this.musicbrainz = new MusicbrainzClient({userAgent: tools.musicbrainz.userAgent, retryOn: true});
		this.acousticbrainz = new AcousticbrainzClient({userAgent: tools.acousticbrainz.userAgent, retryOn: true});
		this.lastFM = new LastFMClient({key: tools.lastfm.apiKey, userAgent: tools.lastfm.userAgent});
		this.acoustid = new AcoustidClient({key: tools.acoustid.apiKey, userAgent: tools.acoustid.userAgent});
		this.lyricsOVH = new LyricsOVHClient(tools.chartlyrics.userAgent);
		this.wikipedia = new WikipediaClient(tools.wikipedia.userAgent);
		this.coverArtArchive = new CoverArtArchiveClient({userAgent: tools.coverartarchive.userAgent, retryOn: true});
		this.waveformCache = new IDFolderCache<{ width?: number, format: string }>(waveformCachePath, 'waveform', (params: { width?: number, format: string }) => {
			return `${params.width !== undefined ? `-${params.width}` : ''}.${params.format}`;
		});
		this.transcodeCache = new IDFolderCache<{ maxBitRate?: number, format: string }>(transcodeCachePath, 'transcode',
			(params: { maxBitRate?: number, format: string }) => `${params.maxBitRate ? `-${params.maxBitRate}` : ''}.${params.format}`);
	}

	private async generateWaveform(filename: string, format: JamParameters.WaveformFormatType, width?: number): Promise<ApiBinaryResult> {
		const wf = new WaveformGenerator();
		switch (format) {
			case WaveformFormatType.svg:
				const svg = await wf.svg(filename, width);
				return {buffer: {buffer: Buffer.from(svg, 'ascii'), contentType: 'image/svg+xml'}};
			case WaveformFormatType.json:
				return {json: await wf.json(filename)};
			case WaveformFormatType.dat:
				return {buffer: {buffer: await wf.binary(filename), contentType: 'application/binary'}};
			default:
		}
		return Promise.reject(Error('Invalid Format for Waveform generation'));
	}

	async getWaveForm(id: string, filename: string, format: WaveformFormatType, width?: number): Promise<ApiBinaryResult> {
		if (!filename || !(await fse.pathExists(filename))) {
			return Promise.reject(Error('Invalid filename for waveform generation'));
		}
		return this.waveformCache.get(id, {format, width}, async cacheFilename => {
			const result = await this.generateWaveform(filename, format, width);
			log.debug('Writing waveform cache file', cacheFilename);
			if (result.buffer) {
				await fse.writeFile(cacheFilename, result.buffer.buffer);
			} else if (result.json) {
				await fse.writeFile(cacheFilename, JSON.stringify(result.json));
			} else {
				throw  new Error('Invalid waveform generation result');
			}
		});
	}

	async getTranscode(filename: string, id: string, format: string, maxBitRate: number): Promise<ApiBinaryResult> {
		if (!TranscoderStream.validTranscoding(format as AudioFormatType)) {
			return Promise.reject(Error('Unsupported transcoding format'));
		}
		// if (live) {
		// 	return {pipe: new LiveTranscoderStream(filename, destFormat, maxBitRate)};
		// }
		return this.transcodeCache.get(id, {format, maxBitRate}, async cacheFilename => {
			log.debug('Writing transcode cache file', cacheFilename);
			await TranscoderStream.transcodeToFile(filename, cacheFilename, format, maxBitRate);
		});
	}

	async read(filename: string): Promise<AudioScanResult> {
		const suffix = fileSuffix(filename);
		if (suffix === AudioFormatType.mp3) {
			return this.readMP3(filename);
		}
		if (suffix === AudioFormatType.flac) {
			return this.readFlac(filename);
		}
		const p = await probe(filename, []);
		if (!p) {
			return {tag: {format: TrackTagFormatType.none}, media: {}};
		}
		return {tag: FORMAT.packProbeJamServeTag(p), media: FORMAT.packProbeJamServeMedia(p, suffix as AudioFormatType)};
	}

	private async readFlac(filename: string): Promise<AudioScanResult> {
		const flac = new Flac();
		try {
			const result = await flac.read(filename);
			return {tag: FORMAT.packFlacVorbisCommentJamServeTag(result.comment, result.pictures), media: FORMAT.packFlacMediaInfoJamServeMedia(result.media)};
		} catch (e) {
			console.error(e);
			return {tag: {format: TrackTagFormatType.none}, media: {}};
		}
	}

	private async readMP3(filename: string): Promise<AudioScanResult> {
		const mp3 = new MP3();
		try {
			const result = await mp3.read(filename, {mpegQuick: true, mpeg: true, id3v2: true});
			if (!result) {
				return {tag: {format: TrackTagFormatType.none}, media: {}};
			}
			if (result.id3v2) {
				return {tag: FORMAT.packID3v2JamServeTag(result.id3v2), media: FORMAT.packJamServeMedia(result.mpeg)};
			}
			const id3v1 = new ID3v1();
			const v1 = await id3v1.read(filename);
			if (!v1) {
				return {tag: {format: TrackTagFormatType.none}, media: FORMAT.packJamServeMedia(result.mpeg)};
			}
			return {tag: FORMAT.packID3v1JamServeTag(v1), media: FORMAT.packJamServeMedia(result.mpeg)};
		} catch (e) {
			console.error(e);
			return {tag: {format: TrackTagFormatType.none}, media: {}};
		}
	}

	async writeRawTag(filename: string, tag: Jam.RawTag): Promise<void> {
		if (this.savingBlock.get(filename)) {
			console.error('Another save is in progress', filename);
			return Promise.reject(Error('Another save is in progress'));
		}
		this.savingBlock.set(filename, true);
		const suffix = fileSuffix(filename);
		try {
			if (suffix === AudioFormatType.mp3) {
				await this.writeMP3Tag(filename, tag);
			} else if (suffix === AudioFormatType.flac) {
				await this.writeFlacTag(filename, tag);
			} else {
				this.savingBlock.delete(filename);
				return Promise.reject(new Error(`Writing to format ${suffix} is currently not supported`));
			}
			this.savingBlock.delete(filename);
		} catch (e) {
			this.savingBlock.delete(filename);
			return Promise.reject(e);
		}
	}

	async readRawTag(filename: string): Promise<Jam.RawTag | undefined> {
		const suffix = fileSuffix(filename);
		if (suffix === AudioFormatType.mp3) {
			return this.readMP3RawTag(filename);
		}
		if (suffix === AudioFormatType.flac) {
			return this.readFlacRawTag(filename);
		}
	}

	private async readFlacRawTag(filename: string): Promise<Jam.RawTag | undefined> {
		const flac = new Flac();
		const result = await flac.read(filename);
		if (!result || !result.comment) {
			return Promise.reject(Error('No Flac Vorbis Comment found'));
		}
		return flacToRawTag(result);
	}

	private async readMP3RawTag(filename: string): Promise<Jam.RawTag | undefined> {
		const id3v2 = new ID3v2();
		const result = await id3v2.read(filename);
		if (!result || !result.head) {
			return Promise.reject(Error('No ID3v2 Tag found'));
		}
		return id3v2ToRawTag(result);
	}

	private async writeMP3Tag(filename: string, tag: Jam.RawTag): Promise<void> {
		const id3 = rawTagToID3v2(tag);
		const id3v2 = new ID3v2();
		await id3v2.write(filename, id3, id3.head ? id3.head.ver : 4, id3.head ? id3.head.rev : 0, {keepBackup: false, paddingSize: 10});
	}

	private async writeFlacTag(filename: string, tag: Jam.RawTag): Promise<void> {
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

	async removeMP3ID3v1Tag(filename: string): Promise<void> {
		const mp3 = new MP3();
		await mp3.removeTags(filename, {id3v1: true, id3v2: false, keepBackup: true});
	}

	async fixMP3Audio(filename: string): Promise<void> {
		await mp3val(filename, true);
	}

	async rewriteMP3(filename: string): Promise<void> {
		const tempFile = `${filename}.tmp`;
		const backupFile = `${filename}.bak`;
		try {
			const suffix = fileSuffix(filename);
			const id3v2 = new ID3v2();
			let tag: IID3V2.Tag | undefined;
			if (suffix === AudioFormatType.mp3) {
				tag = await id3v2.read(filename);
			}
			await rewriteWriteFFmpeg(filename, tempFile);
			const exits = await fse.pathExists(backupFile);
			if (exits) {
				await fileDeleteIfExists(filename);
			} else {
				await fse.copy(filename, backupFile);
			}
			if (tag) {
				await id3v2.write(tempFile, tag, 4, 0, {keepBackup: false, paddingSize: 10});
			}
			await fse.rename(tempFile, filename);
		} catch (e) {
			await fileDeleteIfExists(tempFile);
			return Promise.reject(e);
		}
	}

	async extractTagImageMP3(filename: string): Promise<Buffer | undefined> {
		const id3v2 = new ID3v2();
		const tag = await id3v2.read(filename);
		if (tag) {
			const frames = tag.frames.filter(f => ['APIC', 'PIC'].includes(f.id)) as Array<IID3V2.Frames.PicFrame>;
			let frame = frames.find(f => f.value.pictureType === 3 /*ID3v2 picture type "cover front" */);
			if (!frame) {
				frame = frames[0];
			}
			if (frame) {
				return (frame.value).bin;
			}
		}
	}

	async extractTagImageFLAC(filename: string): Promise<Buffer | undefined> {
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

	async extractTagImage(filename: string): Promise<Buffer | undefined> {
		const suffix = fileSuffix(filename);
		if (suffix === AudioFormatType.mp3) {
			return this.extractTagImageMP3(filename);
		}
		if (suffix === AudioFormatType.flac) {
			return this.extractTagImageFLAC(filename);
		}
	}

	async acoustidLookup(filename: string, includes: string | undefined): Promise<Array<Acoustid.Result>> {
		return this.acoustid.acoustid(filename, includes);
	}

	async musicbrainzSearch(type: string, query: MusicbrainzClientApi.SearchQuery): Promise<MusicBrainz.Response> {
		return this.musicbrainz.search({type, query});
	}

	async musicbrainzLookup(type: string, id: string, inc: string | undefined): Promise<MusicBrainz.Response> {
		return this.musicbrainz.lookup({type, id, inc});
	}

	async acousticbrainzLookup(id: string, nr: number | undefined): Promise<AcousticBrainz.Response> {
		return this.acousticbrainz.highLevel(id, nr);
	}

	async coverartarchiveLookup(type: string, id: string): Promise<CoverArtArchive.Response> {
		if (type === CoverArtArchiveLookupType.release) {
			return this.coverArtArchive.releaseImages(id);
		}
		if (type === CoverArtArchiveLookupType.releaseGroup) {
			return this.coverArtArchive.releaseGroupImages(id);
		}
		return Promise.reject(Error('Invalid CoverArtArchive Lookup Type'));
	}

	async lastFMLookup(type: string, id: string): Promise<LastFM.Result> {
		// TODO: get more than 50
		return this.lastFM.lookup(type, id);
	}

	async getLyrics(artist: string, song: string): Promise<LyricsResult | undefined> {
		let result = await this.lyricsOVH.search(artist, song);
		if (!result || !result.lyrics) {
			if (song.includes('(')) {
				const title = song.slice(0, song.indexOf('(')).trim();
				if (title.length > 0) {
					result = await this.lyricsOVH.search(artist, title);
				}
			}
		}
		if (!result || !result.lyrics) {
			if (song.includes('(')) {
				const title = song.replace(/[()]/g, '').trim();
				if (title.length > 0) {
					result = await this.lyricsOVH.search(artist, title);
				}
			}
		}
		return result;
	}

	async wikipediaSummary(title: string, lang: string | undefined): Promise<{ title: string, url: string, summary: string } | undefined> {
		return this.wikipedia.summary(title, lang);
	}

	async wikidataID(id: string): Promise<WikiData.Entity | undefined> {
		return this.wikipedia.wikidata(id);
	}

	async clearCacheByIDs(ids: Array<string>): Promise<void> {
		await this.transcodeCache.removeByIDs(ids);
		await this.waveformCache.removeByIDs(ids);
	}

}
