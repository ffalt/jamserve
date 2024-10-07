var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { fileSuffix } from '../../utils/fs-utils.js';
import { ImageModule } from '../image/image.module.js';
import { FORMAT } from './audio.format.js';
import { AcousticbrainzClient } from './clients/acousticbrainz-client.js';
import { AcoustidClient } from './clients/acoustid-client.js';
import { CoverArtArchiveClient } from './clients/coverartarchive-client.js';
import { LastFMClient } from './clients/lastfm-client.js';
import { LyricsOVHClient } from './clients/lyricsovh-client.js';
import { MusicbrainzClient } from './clients/musicbrainz-client.js';
import { WikipediaClient } from './clients/wikipedia-client.js';
import { AudioModuleFLAC } from './formats/flac.module.js';
import { AudioModuleMP3 } from './formats/mp3.module.js';
import { probe } from './tools/ffprobe.js';
import { TranscoderModule } from './transcoder/transcoder.module.js';
import { WaveformModule } from './waveform/waveform.module.js';
import { AudioFormatType, TagFormatType } from '../../types/enums.js';
import { SettingsService } from '../../entity/settings/settings.service.js';
import { ConfigService } from '../engine/services/config.service.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { GpodderClient } from './clients/gpodder-client.js';
export const ID3TrackTagRawFormatTypes = [TagFormatType.id3v20, TagFormatType.id3v21, TagFormatType.id3v22, TagFormatType.id3v23, TagFormatType.id3v24];
let AudioModule = class AudioModule {
    constructor() {
        this.waveformCachePath = this.configService.getDataPath(['cache', 'waveforms']);
        this.transcodeCachePath = this.configService.getDataPath(['cache', 'transcode']);
        this.musicbrainz = new MusicbrainzClient({ userAgent: this.configService.tools.musicbrainz.userAgent, retryOn: true });
        this.acousticbrainz = new AcousticbrainzClient({ userAgent: this.configService.tools.acousticbrainz.userAgent, retryOn: true });
        this.lastFM = new LastFMClient({ key: this.configService.tools.lastfm.apiKey, userAgent: this.configService.tools.lastfm.userAgent });
        this.acoustid = new AcoustidClient({ key: this.configService.tools.acoustid.apiKey, userAgent: this.configService.tools.acoustid.userAgent });
        this.lyricsOVH = new LyricsOVHClient(this.configService.tools.lyricsovh.userAgent);
        this.wikipedia = new WikipediaClient(this.configService.tools.wikipedia.userAgent);
        this.gpodder = new GpodderClient(this.configService.tools.gpodder.userAgent);
        this.coverArtArchive = new CoverArtArchiveClient({ userAgent: this.configService.tools.coverartarchive.userAgent, retryOn: true });
        this.transcoder = new TranscoderModule(this.transcodeCachePath);
        this.mp3 = new AudioModuleMP3();
        this.flac = new AudioModuleFLAC(this.imageModule);
        this.waveform = new WaveformModule(this.waveformCachePath);
        this.settingsService.registerChangeListener(async () => {
            this.setSettings(this.settingsService.settings.externalServices);
        });
        this.setSettings(this.settingsService.settings.externalServices);
    }
    setSettings(externalServices) {
        const enabled = externalServices?.enabled;
        this.musicbrainz.enabled = enabled;
        this.acoustid.enabled = enabled;
        this.lastFM.enabled = enabled;
        this.lyricsOVH.enabled = enabled;
        this.acousticbrainz.enabled = enabled;
        this.coverArtArchive.enabled = enabled;
        this.wikipedia.enabled = enabled;
        this.gpodder.enabled = enabled;
    }
    async read(filename) {
        const suffix = fileSuffix(filename);
        if (suffix === AudioFormatType.mp3) {
            return this.mp3.read(filename);
        }
        if (suffix === AudioFormatType.flac) {
            return this.flac.read(filename);
        }
        const p = await probe(filename, []);
        if (!p) {
            return { format: TagFormatType.none };
        }
        return { ...FORMAT.packProbeJamServeTag(p), ...FORMAT.packProbeJamServeMedia(p, suffix) };
    }
    async readRawTag(filename) {
        const suffix = fileSuffix(filename);
        if (suffix === AudioFormatType.mp3) {
            return this.mp3.readRaw(filename);
        }
        if (suffix === AudioFormatType.flac) {
            return this.flac.readRaw(filename);
        }
        return;
    }
    async writeRawTag(filename, tag) {
        const suffix = fileSuffix(filename);
        try {
            if (suffix === AudioFormatType.mp3) {
                await this.mp3.write(filename, tag);
            }
            else if (suffix === AudioFormatType.flac) {
                await this.flac.write(filename, tag);
            }
            else {
                return Promise.reject(new Error(`Writing to format ${suffix} is currently not supported`));
            }
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    async extractTagImage(filename) {
        const suffix = fileSuffix(filename);
        if (suffix === AudioFormatType.mp3) {
            return this.mp3.extractTagImage(filename);
        }
        if (suffix === AudioFormatType.flac) {
            return this.flac.extractTagImage(filename);
        }
        return;
    }
    async extractTagLyrics(filename) {
        const suffix = fileSuffix(filename);
        if (suffix === AudioFormatType.mp3) {
            return this.mp3.extractTagSyncedLyrics(filename);
        }
        return;
    }
    async clearCacheByIDs(ids) {
        await this.transcoder.clearCacheByIDs(ids);
        await this.waveform.clearCacheByIDs(ids);
    }
};
__decorate([
    Inject,
    __metadata("design:type", ConfigService)
], AudioModule.prototype, "configService", void 0);
__decorate([
    Inject,
    __metadata("design:type", SettingsService)
], AudioModule.prototype, "settingsService", void 0);
__decorate([
    Inject,
    __metadata("design:type", ImageModule)
], AudioModule.prototype, "imageModule", void 0);
AudioModule = __decorate([
    InRequestScope,
    __metadata("design:paramtypes", [])
], AudioModule);
export { AudioModule };
//# sourceMappingURL=audio.module.js.map