import {fileSuffix} from '../../utils/fs-utils';
import {ImageModule} from '../image/image.module';
import {FORMAT, TrackMedia, TrackTag} from './audio.format';
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
import {AudioFormatType, TagFormatType} from '../../types/enums';
import {AdminSettingsExternal, SettingsService} from '../../entity/settings/settings.service';
import {RawTag} from './rawTag';
import {ConfigService} from '../engine/services/config.service';
import {Inject, Singleton} from 'typescript-ioc';

export interface AudioScanResult extends TrackTag, TrackMedia {
}

export const ID3TrackTagRawFormatTypes = [TagFormatType.id3v20, TagFormatType.id3v21, TagFormatType.id3v22, TagFormatType.id3v23, TagFormatType.id3v24];

@Singleton
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
	waveformCachePath: string;
	transcodeCachePath: string;
	@Inject
	private configService!: ConfigService;
	@Inject
	private settingsService!: SettingsService;
	@Inject
	private imageModule!: ImageModule;

	constructor() {
		this.waveformCachePath = this.configService.getDataPath(['cache', 'waveforms']);
		this.transcodeCachePath = this.configService.getDataPath(['cache', 'transcode']);
		this.musicbrainz = new MusicbrainzClient({userAgent: this.configService.tools.musicbrainz.userAgent, retryOn: true});
		this.acousticbrainz = new AcousticbrainzClient({userAgent: this.configService.tools.acousticbrainz.userAgent, retryOn: true});
		this.lastFM = new LastFMClient({key: this.configService.tools.lastfm.apiKey, userAgent: this.configService.tools.lastfm.userAgent});
		this.acoustid = new AcoustidClient({key: this.configService.tools.acoustid.apiKey, userAgent: this.configService.tools.acoustid.userAgent});
		this.lyricsOVH = new LyricsOVHClient(this.configService.tools.lyricsovh.userAgent);
		this.wikipedia = new WikipediaClient(this.configService.tools.wikipedia.userAgent);
		this.coverArtArchive = new CoverArtArchiveClient({userAgent: this.configService.tools.coverartarchive.userAgent, retryOn: true});
		this.transcoder = new TranscoderModule(this.transcodeCachePath);
		this.mp3 = new AudioModuleMP3();
		this.flac = new AudioModuleFLAC(this.imageModule);
		this.waveform = new WaveformModule(this.waveformCachePath);
		this.settingsService.registerChangeListener(async () => {
			this.setSettings(this.settingsService.settings.externalServices);
		})
		this.setSettings(this.settingsService.settings.externalServices);
	}

	setSettings(externalServices: AdminSettingsExternal): void {
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
			return {format: TagFormatType.none};
		}
		return {...FORMAT.packProbeJamServeTag(p), ...FORMAT.packProbeJamServeMedia(p, suffix as AudioFormatType)};
	}

	async readRawTag(filename: string): Promise<RawTag | undefined> {
		const suffix = fileSuffix(filename);
		if (suffix === AudioFormatType.mp3) {
			return this.mp3.readRaw(filename);
		}
		if (suffix === AudioFormatType.flac) {
			return this.flac.readRaw(filename);
		}
	}

	async writeRawTag(filename: string, tag: RawTag): Promise<void> {
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
