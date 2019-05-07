import fse from 'fs-extra';
import {ID3v1, ID3v2, IID3V2, MP3} from 'jamp3';
import {ThirdpartyToolsConfig} from '../../config/thirdparty.config';
import {AcousticBrainz} from '../../model/acousticbrainz-rest-data';
import {Acoustid} from '../../model/acoustid-rest-data';
import {CoverArtArchive} from '../../model/coverartarchive-rest-data';
import {Jam} from '../../model/jam-rest-data';
import {AudioFormatType, CoverArtArchiveLookupType, TrackTagFormatType} from '../../model/jam-types';
import {LastFM} from '../../model/lastfm-rest-data';
import {MusicBrainz} from '../../model/musicbrainz-rest-data';
import {TrackMedia, TrackTag} from '../../objects/track/track.model';
import {fileDeleteIfExists, fileSuffix} from '../../utils/fs-utils';
import {ImageModule} from '../image/image.module';
import {FORMAT} from './audio.format';
import {AcousticbrainzClient} from './clients/acousticbrainz-client';
import {AcoustidClient} from './clients/acoustid-client';
import {ChartLyricsClient, ChartLyricsResult} from './clients/chartlyrics-client';
import {CoverArtArchiveClient} from './clients/coverartarchive-client';
import {LastFMClient} from './clients/lastfm-client';
import {MusicbrainzClient} from './clients/musicbrainz-client';
import {MusicbrainzClientApi} from './clients/musicbrainz-client.interface';
import {WikiData, WikipediaClient} from './clients/wikipedia-client';
import {Flac} from './formats/flac';
import {MetaWriteableDataBlock} from './formats/flac/lib/block.writeable';
import {flacToRawTag, id3v2ToFlacMetaData, id3v2ToRawTag, rawTagToID3v2} from './metadata';
import {rewriteWriteFFmpeg} from './tools/ffmpeg-rewrite';
import {probe} from './tools/ffprobe';

export interface AudioScanResult {
	media?: TrackMedia;
	tag?: TrackTag;
}

export const ID3TrackTagRawFormatTypes = [TrackTagFormatType.id3v20, TrackTagFormatType.id3v21, TrackTagFormatType.id3v22, TrackTagFormatType.id3v23, TrackTagFormatType.id3v24];

export class AudioModule {
	musicbrainz: MusicbrainzClient;
	acoustid: AcoustidClient;
	lastFM: LastFMClient;
	chartLyrics: ChartLyricsClient;
	acousticbrainz: AcousticbrainzClient;
	coverArtArchive: CoverArtArchiveClient;
	wikipedia: WikipediaClient;
	private isSaving: { [filename: string]: boolean } = {};

	constructor(tools: ThirdpartyToolsConfig, public imageModule: ImageModule) {
		this.musicbrainz = new MusicbrainzClient({userAgent: tools.musicbrainz.userAgent, retryOn: true});
		this.acousticbrainz = new AcousticbrainzClient({userAgent: tools.acousticbrainz.userAgent, retryOn: true});
		this.lastFM = new LastFMClient({key: tools.lastfm.apiKey, userAgent: tools.lastfm.userAgent});
		this.acoustid = new AcoustidClient({key: tools.acoustid.apiKey, userAgent: tools.acoustid.userAgent});
		this.chartLyrics = new ChartLyricsClient(tools.chartlyrics.userAgent);
		this.wikipedia = new WikipediaClient(tools.wikipedia.userAgent);
		this.coverArtArchive = new CoverArtArchiveClient({userAgent: tools.coverartarchive.userAgent, retryOn: true});
	}

	async read(filename: string): Promise<AudioScanResult> {
		const suffix = fileSuffix(filename);
		if (suffix === AudioFormatType.mp3) {
			const mp3 = new MP3();
			try {
				const result = await mp3.read(filename, {mpegQuick: true, mpeg: true, id3v2: true});
				if (!result) {
					return {tag: {format: TrackTagFormatType.none}, media: {}};
				} else {
					if (result.id3v2) {
						return {tag: FORMAT.packID3v2JamServeTag(result.id3v2), media: FORMAT.packJamServeMedia(result.mpeg)};
					}
					const id3v1 = new ID3v1();
					const v1 = await id3v1.read(filename);
					if (!v1) {
						return {tag: {format: TrackTagFormatType.none}, media: FORMAT.packJamServeMedia(result.mpeg)};
					}
					return {tag: FORMAT.packID3v1JamServeTag(v1), media: FORMAT.packJamServeMedia(result.mpeg)};
				}
			} catch (e) {
				console.error(e);
				return {tag: {format: TrackTagFormatType.none}, media: {}};
			}
		} else if (suffix === AudioFormatType.flac) {
			const flac = new Flac();
			try {
				const result = await flac.read(filename);
				return {tag: FORMAT.packFlacVorbisCommentJamServeTag(result.comment), media: FORMAT.packFlacMediaInfoJamServeMedia(result.media)};
			} catch (e) {
				console.error(e);
				return {tag: {format: TrackTagFormatType.none}, media: {}};
			}
		} else {
			const p = await probe(filename, []);
			if (!p) {
				return {tag: {format: TrackTagFormatType.none}, media: {}};
			} else {
				return {tag: FORMAT.packProbeJamServeTag(p), media: FORMAT.packProbeJamServeMedia(p, suffix as AudioFormatType)};
			}
		}
	}

	async writeRawTag(filename: string, tag: Jam.RawTag): Promise<void> {
		if (this.isSaving[filename]) {
			console.error('Another save is in progress', filename);
			return Promise.reject(Error('Another save is in progress'));
		}
		this.isSaving[filename] = true;
		const suffix = fileSuffix(filename);
		try {
			if (suffix === AudioFormatType.mp3) {
				await this.writeMP3Tag(filename, tag);
			} else if (suffix === AudioFormatType.flac) {
				await this.writeFlacTag(filename, tag);
			} else {
				delete this.isSaving[filename];
				return Promise.reject(new Error('Writing to format ' + suffix + ' is currently not supported'));
			}
			delete this.isSaving[filename];
		} catch (e) {
			delete this.isSaving[filename];
			return Promise.reject(e);
		}
	}

	async readRawTag(filename: string): Promise<Jam.RawTag | undefined> {
		const suffix = fileSuffix(filename);
		if (suffix === AudioFormatType.mp3) {
			return this.readMP3RawTag(filename);
		} else if (suffix === AudioFormatType.flac) {
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
		await id3v2.write(filename, id3, id3.head ? id3.head.ver : 4, id3.head ? id3.head.rev : 0);
	}

	private async writeFlacTag(filename: string, tag: Jam.RawTag): Promise<void> {
		const id3 = rawTagToID3v2(tag);
		const flacBlocks: Array<MetaWriteableDataBlock> = await id3v2ToFlacMetaData(id3, this.imageModule);
		const flac = new Flac();
		// TODO: add tests for flac writing, make backup copy as long it is not well tested
		const exits = await fse.pathExists(filename + '.bak');
		if (!exits) {
			await fse.copy(filename, filename + '.bak');
		}
		await flac.write(filename, flacBlocks);
	}

	async rewriteAudio(filename: string): Promise<void> {
		try {
			const suffix = fileSuffix(filename);
			const id3v2 = new ID3v2();
			let tag: IID3V2.Tag | undefined;
			if (suffix === AudioFormatType.mp3) {
				tag = await id3v2.read(filename);
			}
			await rewriteWriteFFmpeg(filename, filename + '.tmp');
			const exits = await fse.pathExists(filename + '.bak');
			if (exits) {
				await fileDeleteIfExists(filename);
			} else {
				await fse.copy(filename, filename + '.bak');
			}
			if (tag) {
				await id3v2.write(filename + '.tmp', tag, 4, 0);
			}
			await fse.rename(filename + '.tmp', filename);
		} catch (e) {
			await fileDeleteIfExists(filename + '.tmp');
			return Promise.reject(e);
		}
	}

	async readMP3Image(filename: string, type: number): Promise<{ buffer?: Buffer, mimeType?: string }> {
		const id3v2 = new ID3v2();
		const tag = await id3v2.read(filename);
		if (!tag) {
			return {};
		}
		const frame = tag.frames.find(f => {
			if (['APIC', 'PIC'].indexOf(f.id) >= 0) {
				return (f.value as IID3V2.FrameValue.Pic).pictureType === type;
			}
			return false;
		});
		if (!frame) {
			return {};
		}
		return {buffer: (frame.value as IID3V2.FrameValue.Pic).bin, mimeType: (frame.value as IID3V2.FrameValue.Pic).mimeType};
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
		} else if (type === CoverArtArchiveLookupType.releaseGroup) {
			return this.coverArtArchive.releaseGroupImages(id);
		} else {
			return Promise.reject(Error('Invalid CoverArtArchive Lookup Type'));
		}
	}

	async lastFMLookup(type: string, id: string): Promise<LastFM.Result> {
		// TODO: get more than 50
		return this.lastFM.lookup(type, id);
	}

	async getLyrics(artist: string, song: string): Promise<ChartLyricsResult | undefined> {
		return this.chartLyrics.search(artist, song);
	}

	async wikipediaSummary(title: string, lang: string | undefined): Promise<{ title: string, url: string, summary: string } | undefined> {
		return this.wikipedia.summary(title, lang);
	}

	async wikidataID(id: string): Promise<WikiData.Entity | undefined> {
		return this.wikipedia.wikidata(id);
	}

}
