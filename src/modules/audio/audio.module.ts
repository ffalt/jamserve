import {ThirdpartyToolsConfig} from '../../config/thirdparty.config';
import {TrackMedia, TrackTag} from '../../engine/track/track.model';
import {Jam} from '../../model/jam-rest-data';
import {AudioFormatType, TrackTagFormatType} from '../../model/jam-types';
import {fileSuffix} from '../../utils/fs-utils';
import {ImageModule} from '../image/image.module';
import {FORMAT} from './audio.format';
import {AcousticbrainzClient} from './clients/acousticbrainz-client';
import {AcoustidClient} from './clients/acoustid-client';
import {CoverArtArchiveClient} from './clients/coverartarchive-client';
import {LastFMClient} from './clients/lastfm-client';
import {LyricsOVHClient} from './clients/lyricsovh-client';
import {MusicbrainzClient} from './clients/musicbrainz-client';
import {WikipediaClient} from './clients/wikipedia-client';
import {AudioModuleFLAC} from './formats/flac.module';
import {AudioModuleMP3} from './formats/mp3.module';
import {probe} from './tools/ffprobe';
import {TranscoderModule} from './transcoder/transcoder.module';
import {WaveformModule} from './waveform/waveform.module';

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
	mp3: AudioModuleMP3;
	flac: AudioModuleFLAC;
	transcoder: TranscoderModule;
	waveform: WaveformModule;

	constructor(waveformCachePath: string, transcodeCachePath: string, tools: ThirdpartyToolsConfig, public imageModule: ImageModule) {
		this.musicbrainz = new MusicbrainzClient({userAgent: tools.musicbrainz.userAgent, retryOn: true});
		this.acousticbrainz = new AcousticbrainzClient({userAgent: tools.acousticbrainz.userAgent, retryOn: true});
		this.lastFM = new LastFMClient({key: tools.lastfm.apiKey, userAgent: tools.lastfm.userAgent});
		this.acoustid = new AcoustidClient({key: tools.acoustid.apiKey, userAgent: tools.acoustid.userAgent});
		this.lyricsOVH = new LyricsOVHClient(tools.chartlyrics.userAgent);
		this.wikipedia = new WikipediaClient(tools.wikipedia.userAgent);
		this.coverArtArchive = new CoverArtArchiveClient({userAgent: tools.coverartarchive.userAgent, retryOn: true});
		this.transcoder = new TranscoderModule(transcodeCachePath);
		this.mp3 = new AudioModuleMP3();
		this.flac = new AudioModuleFLAC(imageModule);
		this.waveform = new WaveformModule(waveformCachePath);
	}

	setSettings(externalServices: Jam.AdminSettingsExternal): void {
		const enabled = externalServices && externalServices.enabled;
		this.musicbrainz.enabled = enabled;
		this.acoustid.enabled = enabled;
		this.lastFM.enabled = enabled;
		this.lyricsOVH.enabled = enabled;
		this.acousticbrainz.enabled = enabled;
		this.coverArtArchive.enabled = enabled;
		this.wikipedia.enabled = enabled;
	}

	async read(filename: string): Promise<AudioScanResult> {
		const suffix = fileSuffix(filename);
		if (suffix === AudioFormatType.mp3) {
			return this.mp3.read(filename);
		}
		if (suffix === AudioFormatType.flac) {
			return this.flac.read(filename);
		}
		const p = await probe(filename, []);
		if (!p) {
			return {tag: {format: TrackTagFormatType.none}, media: {}};
		}
		return {tag: FORMAT.packProbeJamServeTag(p), media: FORMAT.packProbeJamServeMedia(p, suffix as AudioFormatType)};
	}

	async readRawTag(filename: string): Promise<Jam.RawTag | undefined> {
		const suffix = fileSuffix(filename);
		if (suffix === AudioFormatType.mp3) {
			return this.mp3.readRaw(filename);
		}
		if (suffix === AudioFormatType.flac) {
			return this.flac.readRaw(filename);
		}
	}

	async writeRawTag(filename: string, tag: Jam.RawTag): Promise<void> {
		const suffix = fileSuffix(filename);
		try {
			if (suffix === AudioFormatType.mp3) {
				await this.mp3.write(filename, tag);
			} else if (suffix === AudioFormatType.flac) {
				await this.flac.write(filename, tag);
			} else {
				return Promise.reject(new Error(`Writing to format ${suffix} is currently not supported`));
			}
		} catch (e) {
			return Promise.reject(e);
		}
	}

	async extractTagImage(filename: string): Promise<Buffer | undefined> {
		const suffix = fileSuffix(filename);
		if (suffix === AudioFormatType.mp3) {
			return this.mp3.extractTagImage(filename);
		}
		if (suffix === AudioFormatType.flac) {
			return this.flac.extractTagImage(filename);
		}
	}

	async clearCacheByIDs(ids: Array<string>): Promise<void> {
		await this.transcoder.clearCacheByIDs(ids);
		await this.waveform.clearCacheByIDs(ids);
	}

}
