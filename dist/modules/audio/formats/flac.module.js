"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioModuleFLAC = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const audio_format_1 = require("../audio.format");
const metadata_1 = require("../metadata");
const flac_1 = require("./flac");
const enums_1 = require("../../../types/enums");
class AudioModuleFLAC {
    constructor(imageModule) {
        this.imageModule = imageModule;
    }
    async read(filename) {
        const flac = new flac_1.Flac();
        try {
            const result = await flac.read(filename);
            return {
                format: enums_1.TagFormatType.none,
                ...audio_format_1.FORMAT.packFlacMediaInfoJamServeMedia(result.media),
                ...audio_format_1.FORMAT.packFlacVorbisCommentJamServeTag(result.comment, result.pictures)
            };
        }
        catch (e) {
            console.error(e);
            return { format: enums_1.TagFormatType.none };
        }
    }
    async readRaw(filename) {
        const flac = new flac_1.Flac();
        const result = await flac.read(filename);
        if (!result || !result.comment) {
            return Promise.reject(Error('No Flac Vorbis Comment found'));
        }
        return metadata_1.flacToRawTag(result);
    }
    async write(filename, tag) {
        const id3 = metadata_1.rawTagToID3v2(tag);
        const flacBlocks = await metadata_1.id3v2ToFlacMetaData(id3, this.imageModule);
        const flac = new flac_1.Flac();
        const exits = await fs_extra_1.default.pathExists(`${filename}.bak`);
        if (!exits) {
            await fs_extra_1.default.copy(filename, `${filename}.bak`);
        }
        await flac.write(filename, flacBlocks);
    }
    async extractTagImage(filename) {
        const flac = new flac_1.Flac();
        const tag = await flac.read(filename);
        if (tag && tag.pictures) {
            let pic = tag.pictures.find(p => p.pictureType === 3);
            if (!pic) {
                pic = tag.pictures[0];
            }
            if (pic) {
                return pic.pictureData;
            }
        }
        return;
    }
}
exports.AudioModuleFLAC = AudioModuleFLAC;
//# sourceMappingURL=flac.module.js.map