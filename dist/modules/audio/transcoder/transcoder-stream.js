import ffmpeg from 'fluent-ffmpeg';
import { SupportedTranscodeAudioFormat } from '../../../utils/filetype';
import { logger } from '../../../utils/logger';
import { AudioFormatType } from '../../../types/enums';
const log = logger('transcoder.stream');
export class TranscoderStream {
    static needsTranscoding(mediaFormat, format, maxBitRate) {
        return (format !== mediaFormat) || (maxBitRate > 0);
    }
    static validTranscoding(format) {
        return SupportedTranscodeAudioFormat.includes(format);
    }
    static async getAvailableFormats() {
        return new Promise((resolve, reject) => {
            ffmpeg().getAvailableFormats((err, formats) => {
                if (err || !formats) {
                    return reject(err);
                }
                resolve(Object.keys(formats).filter(key => formats[key].canDemux).map(key => {
                    return { format: key, name: formats[key].description };
                }));
            });
        });
    }
    static getTranscodeProc(source, format, maxBitRate) {
        const proc = ffmpeg({ source })
            .withNoVideo();
        switch (format) {
            case AudioFormatType.flv:
                return proc.toFormat(format).addOptions(['-ar 44100', `-maxrate ${maxBitRate || 128}k`]);
            case AudioFormatType.ogg:
            case AudioFormatType.oga:
                return proc.toFormat(format)
                    .withAudioCodec('libvorbis')
                    .addOptions([`-maxrate ${maxBitRate || 128}k`]);
            case AudioFormatType.mp3:
                return proc
                    .toFormat(format)
                    .withAudioBitrate(`${maxBitRate || 128}k`)
                    .withAudioCodec('libmp3lame');
            case AudioFormatType.mp4:
            case AudioFormatType.m4a:
                return proc
                    .toFormat('mp4')
                    .withAudioBitrate(`${maxBitRate || 128}k`);
            case AudioFormatType.webma: {
                return proc
                    .toFormat('webm');
            }
            default:
                return proc
                    .toFormat(format)
                    .withAudioBitrate(`${maxBitRate || 128}k`);
        }
    }
    static async transcodeToFile(source, destination, format, maxBitRate) {
        return new Promise((resolve, reject) => {
            const proc = TranscoderStream.getTranscodeProc(source, format, maxBitRate);
            proc
                .on('start', cmd => {
                log.debug(`ffmpeg started with ${cmd}`);
            })
                .on('end', () => {
                resolve();
            })
                .on('error', (err) => {
                reject(err);
            })
                .save(destination);
        });
    }
}
//# sourceMappingURL=transcoder-stream.js.map