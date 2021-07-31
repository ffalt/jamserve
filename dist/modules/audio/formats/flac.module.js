import fse from 'fs-extra';
import { FORMAT } from '../audio.format';
import { flacToRawTag, id3v2ToFlacMetaData, rawTagToID3v2 } from '../metadata';
import { Flac } from './flac';
import { TagFormatType } from '../../../types/enums';
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
        catch (e) {
            console.error(e);
            return { format: TagFormatType.none };
        }
    }
    async readRaw(filename) {
        const flac = new Flac();
        const result = await flac.read(filename);
        if (!result || !result.comment) {
            return Promise.reject(Error('No Flac Vorbis Comment found'));
        }
        return flacToRawTag(result);
    }
    async write(filename, tag) {
        const id3 = rawTagToID3v2(tag);
        const flacBlocks = await id3v2ToFlacMetaData(id3, this.imageModule);
        const flac = new Flac();
        const exits = await fse.pathExists(`${filename}.bak`);
        if (!exits) {
            await fse.copy(filename, `${filename}.bak`);
        }
        await flac.write(filename, flacBlocks);
    }
    async extractTagImage(filename) {
        const flac = new Flac();
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
//# sourceMappingURL=flac.module.js.map