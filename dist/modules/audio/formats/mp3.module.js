import { ID3v1, ID3v2, MP3 } from 'jamp3';
import { StaticPool } from 'node-worker-threads-pool';
import { logger } from '../../../utils/logger.js';
import { FORMAT } from '../audio.format.js';
import { id3v2ToRawTag, rawTagToID3v2 } from '../metadata.js';
import path, { dirname } from 'path';
import { TagFormatType } from '../../../types/enums.js';
import { analyzeMP3 } from '../tasks/task-analyze-mp3.js';
import { rewriteAudio } from '../tasks/task-rewrite-mp3.js';
import { fixMP3 } from '../tasks/task-fix-mp3.js';
import { removeID3v1 } from '../tasks/task-remove-id3v1.js';
import { fileURLToPath } from 'url';
const USE_TASKS = process.env.JAM_USE_TASKS;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const taskPath = path.join(__dirname, '..', 'tasks');
export const taskRewriteMp3 = path.join(taskPath, 'task-rewrite-mp3.js');
export const taskFixMp3 = path.join(taskPath, 'task-fix-mp3.js');
export const taskRemoveID3v1 = path.join(taskPath, 'task-remove-id3v1.js');
export const taskAnalyzeMp3 = path.join(taskPath, 'task-analyze-mp3.js');
const log = logger('Audio:MP3');
export class AudioModuleMP3 {
    async read(filename) {
        const mp3 = new MP3();
        try {
            const result = await mp3.read(filename, { mpegQuick: true, mpeg: true, id3v2: true });
            if (!result) {
                return { format: TagFormatType.none };
            }
            if (result.id3v2) {
                return {
                    format: TagFormatType.none,
                    ...FORMAT.packID3v2JamServeTag(result.id3v2),
                    ...FORMAT.packJamServeMedia(result.mpeg)
                };
            }
            const id3v1 = new ID3v1();
            const v1 = await id3v1.read(filename);
            if (!v1) {
                return { format: TagFormatType.none, ...FORMAT.packJamServeMedia(result.mpeg) };
            }
            return {
                format: TagFormatType.none,
                ...FORMAT.packID3v1JamServeTag(v1),
                ...FORMAT.packJamServeMedia(result.mpeg)
            };
        }
        catch {
            return { format: TagFormatType.none };
        }
    }
    async readRaw(filename) {
        const id3v2 = new ID3v2();
        const result = await id3v2.read(filename);
        if (!result || !result.head) {
            return Promise.reject(Error('No ID3v2 Tag found'));
        }
        return id3v2ToRawTag(result);
    }
    async write(filename, tag) {
        const id3 = rawTagToID3v2(tag);
        const id3v2 = new ID3v2();
        await id3v2.write(filename, id3, id3.head ? id3.head.ver : 4, id3.head ? id3.head.rev : 0, { keepBackup: false, paddingSize: 10 });
    }
    async removeID3v1(filename) {
        if (!USE_TASKS) {
            await removeID3v1(filename);
            return;
        }
        if (!this.removeID3v1Pool) {
            this.removeID3v1Pool = new StaticPool({
                size: 3, task: taskRemoveID3v1
            });
        }
        log.debug('remove ID3v1 Tag', filename);
        await this.removeID3v1Pool.exec(filename);
    }
    async fixAudio(filename) {
        if (!USE_TASKS) {
            return fixMP3(filename);
        }
        if (!this.fixMP3Pool) {
            this.fixMP3Pool = new StaticPool({
                size: 3, task: taskFixMp3
            });
        }
        log.debug('fix Audio', filename);
        await this.fixMP3Pool.exec(filename);
    }
    async rewrite(filename) {
        if (!USE_TASKS) {
            return rewriteAudio(filename);
        }
        if (!this.rewriteAudioPool) {
            this.rewriteAudioPool = new StaticPool({
                size: 3, task: taskRewriteMp3
            });
        }
        log.debug('rewrite', filename);
        await this.rewriteAudioPool.exec(filename);
    }
    async analyze(filename) {
        if (!USE_TASKS) {
            return analyzeMP3(filename);
        }
        if (!this.analyzeMp3Pool) {
            this.analyzeMp3Pool = new StaticPool({
                size: 3, task: taskAnalyzeMp3
            });
        }
        log.debug('analyze', filename);
        return this.analyzeMp3Pool.exec(filename);
    }
    async extractTagImage(filename) {
        log.debug('extractTagImage', filename);
        const id3v2 = new ID3v2();
        const tag = await id3v2.read(filename);
        if (tag) {
            const frames = tag.frames.filter(f => ['APIC', 'PIC'].includes(f.id));
            let frame = frames.find(f => f.value.pictureType === 3);
            if (!frame) {
                frame = frames[0];
            }
            if (frame) {
                return (frame.value).bin;
            }
        }
        return;
    }
    async extractTagSyncedLyrics(filename) {
        log.debug('extractTagSyncedLyrics', filename);
        const id3v2 = new ID3v2();
        const tag = await id3v2.read(filename);
        const resolveTimeStampFormat = (timestampFormat) => {
            switch (timestampFormat) {
                case 1:
                    return 'MPEG frames';
                default:
                    return 'milliseconds';
            }
        };
        if (tag) {
            const frames = tag.frames.filter(f => ['SLT'].includes(f.id));
            if (frames.length > 0) {
                const frame = frames.find(f => f.value?.contentType === 1);
                if (frame) {
                    return {
                        language: frame.value.language,
                        contentType: 'lyrics',
                        timestampFormat: resolveTimeStampFormat(frame.value.timestampFormat),
                        events: frame.value.events
                    };
                }
            }
        }
        return;
    }
}
//# sourceMappingURL=mp3.module.js.map