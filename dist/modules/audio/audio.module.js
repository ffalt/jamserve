"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioModule = exports.ID3TrackTagRawFormatTypes = void 0;
const fs_utils_1 = require("../../utils/fs-utils");
const image_module_1 = require("../image/image.module");
const audio_format_1 = require("./audio.format");
const acousticbrainz_client_1 = require("./clients/acousticbrainz-client");
const acoustid_client_1 = require("./clients/acoustid-client");
const coverartarchive_client_1 = require("./clients/coverartarchive-client");
const lastfm_client_1 = require("./clients/lastfm-client");
const lyricsovh_client_1 = require("./clients/lyricsovh-client");
const musicbrainz_client_1 = require("./clients/musicbrainz-client");
const wikipedia_client_1 = require("./clients/wikipedia-client");
const flac_module_1 = require("./formats/flac.module");
const mp3_module_1 = require("./formats/mp3.module");
const ffprobe_1 = require("./tools/ffprobe");
const transcoder_module_1 = require("./transcoder/transcoder.module");
const waveform_module_1 = require("./waveform/waveform.module");
const enums_1 = require("../../types/enums");
const settings_service_1 = require("../../entity/settings/settings.service");
const config_service_1 = require("../engine/services/config.service");
const typescript_ioc_1 = require("typescript-ioc");
exports.ID3TrackTagRawFormatTypes = [enums_1.TagFormatType.id3v20, enums_1.TagFormatType.id3v21, enums_1.TagFormatType.id3v22, enums_1.TagFormatType.id3v23, enums_1.TagFormatType.id3v24];
let AudioModule = class AudioModule {
    constructor() {
        this.waveformCachePath = this.configService.getDataPath(['cache', 'waveforms']);
        this.transcodeCachePath = this.configService.getDataPath(['cache', 'transcode']);
        this.musicbrainz = new musicbrainz_client_1.MusicbrainzClient({ userAgent: this.configService.tools.musicbrainz.userAgent, retryOn: true });
        this.acousticbrainz = new acousticbrainz_client_1.AcousticbrainzClient({ userAgent: this.configService.tools.acousticbrainz.userAgent, retryOn: true });
        this.lastFM = new lastfm_client_1.LastFMClient({ key: this.configService.tools.lastfm.apiKey, userAgent: this.configService.tools.lastfm.userAgent });
        this.acoustid = new acoustid_client_1.AcoustidClient({ key: this.configService.tools.acoustid.apiKey, userAgent: this.configService.tools.acoustid.userAgent });
        this.lyricsOVH = new lyricsovh_client_1.LyricsOVHClient(this.configService.tools.lyricsovh.userAgent);
        this.wikipedia = new wikipedia_client_1.WikipediaClient(this.configService.tools.wikipedia.userAgent);
        this.coverArtArchive = new coverartarchive_client_1.CoverArtArchiveClient({ userAgent: this.configService.tools.coverartarchive.userAgent, retryOn: true });
        this.transcoder = new transcoder_module_1.TranscoderModule(this.transcodeCachePath);
        this.mp3 = new mp3_module_1.AudioModuleMP3();
        this.flac = new flac_module_1.AudioModuleFLAC(this.imageModule);
        this.waveform = new waveform_module_1.WaveformModule(this.waveformCachePath);
        this.settingsService.registerChangeListener(async () => {
            this.setSettings(this.settingsService.settings.externalServices);
        });
        this.setSettings(this.settingsService.settings.externalServices);
    }
    setSettings(externalServices) {
        const enabled = externalServices && externalServices.enabled;
        this.musicbrainz.enabled = enabled;
        this.acoustid.enabled = enabled;
        this.lastFM.enabled = enabled;
        this.lyricsOVH.enabled = enabled;
        this.acousticbrainz.enabled = enabled;
        this.coverArtArchive.enabled = enabled;
        this.wikipedia.enabled = enabled;
    }
    async read(filename) {
        const suffix = fs_utils_1.fileSuffix(filename);
        if (suffix === enums_1.AudioFormatType.mp3) {
            return this.mp3.read(filename);
        }
        if (suffix === enums_1.AudioFormatType.flac) {
            return this.flac.read(filename);
        }
        const p = await ffprobe_1.probe(filename, []);
        if (!p) {
            return { format: enums_1.TagFormatType.none };
        }
        return { ...audio_format_1.FORMAT.packProbeJamServeTag(p), ...audio_format_1.FORMAT.packProbeJamServeMedia(p, suffix) };
    }
    async readRawTag(filename) {
        const suffix = fs_utils_1.fileSuffix(filename);
        if (suffix === enums_1.AudioFormatType.mp3) {
            return this.mp3.readRaw(filename);
        }
        if (suffix === enums_1.AudioFormatType.flac) {
            return this.flac.readRaw(filename);
        }
    }
    async writeRawTag(filename, tag) {
        const suffix = fs_utils_1.fileSuffix(filename);
        try {
            if (suffix === enums_1.AudioFormatType.mp3) {
                await this.mp3.write(filename, tag);
            }
            else if (suffix === enums_1.AudioFormatType.flac) {
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
        const suffix = fs_utils_1.fileSuffix(filename);
        if (suffix === enums_1.AudioFormatType.mp3) {
            return this.mp3.extractTagImage(filename);
        }
        if (suffix === enums_1.AudioFormatType.flac) {
            return this.flac.extractTagImage(filename);
        }
    }
    async clearCacheByIDs(ids) {
        await this.transcoder.clearCacheByIDs(ids);
        await this.waveform.clearCacheByIDs(ids);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", config_service_1.ConfigService)
], AudioModule.prototype, "configService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", settings_service_1.SettingsService)
], AudioModule.prototype, "settingsService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", image_module_1.ImageModule)
], AudioModule.prototype, "imageModule", void 0);
AudioModule = __decorate([
    typescript_ioc_1.InRequestScope,
    __metadata("design:paramtypes", [])
], AudioModule);
exports.AudioModule = AudioModule;
//# sourceMappingURL=audio.module.js.map