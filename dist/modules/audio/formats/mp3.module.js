"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioModuleMP3 = exports.taskAnalyzeMp3 = exports.taskRemoveID3v1 = exports.taskFixMp3 = exports.taskRewriteMp3 = void 0;
const jamp3_1 = require("jamp3");
const node_worker_threads_pool_1 = require("node-worker-threads-pool");
const logger_1 = require("../../../utils/logger");
const audio_format_1 = require("../audio.format");
const metadata_1 = require("../metadata");
const path_1 = __importDefault(require("path"));
const enums_1 = require("../../../types/enums");
const task_analyze_mp3_1 = require("../tasks/task-analyze-mp3");
const task_rewrite_mp3_1 = require("../tasks/task-rewrite-mp3");
const task_fix_mp3_1 = require("../tasks/task-fix-mp3");
const task_remove_id3v1_1 = require("../tasks/task-remove-id3v1");
const USE_TASKS = process.env.JAM_USE_TASKS;
const taskPath = path_1.default.join(__dirname, '..', 'tasks');
exports.taskRewriteMp3 = path_1.default.join(taskPath, 'task-rewrite-mp3.js');
exports.taskFixMp3 = path_1.default.join(taskPath, 'task-fix-mp3.js');
exports.taskRemoveID3v1 = path_1.default.join(taskPath, 'task-remove-id3v1.js');
exports.taskAnalyzeMp3 = path_1.default.join(taskPath, 'task-analyze-mp3.js');
const log = logger_1.logger('Audio:MP3');
class AudioModuleMP3 {
    async read(filename) {
        const mp3 = new jamp3_1.MP3();
        try {
            const result = await mp3.read(filename, { mpegQuick: true, mpeg: true, id3v2: true });
            if (!result) {
                return { format: enums_1.TagFormatType.none };
            }
            if (result.id3v2) {
                return {
                    format: enums_1.TagFormatType.none,
                    ...audio_format_1.FORMAT.packID3v2JamServeTag(result.id3v2),
                    ...audio_format_1.FORMAT.packJamServeMedia(result.mpeg)
                };
            }
            const id3v1 = new jamp3_1.ID3v1();
            const v1 = await id3v1.read(filename);
            if (!v1) {
                return { format: enums_1.TagFormatType.none, ...audio_format_1.FORMAT.packJamServeMedia(result.mpeg) };
            }
            return {
                format: enums_1.TagFormatType.none,
                ...audio_format_1.FORMAT.packID3v1JamServeTag(v1),
                ...audio_format_1.FORMAT.packJamServeMedia(result.mpeg)
            };
        }
        catch (e) {
            return { format: enums_1.TagFormatType.none };
        }
    }
    async readRaw(filename) {
        const id3v2 = new jamp3_1.ID3v2();
        const result = await id3v2.read(filename);
        if (!result || !result.head) {
            return Promise.reject(Error('No ID3v2 Tag found'));
        }
        return metadata_1.id3v2ToRawTag(result);
    }
    async write(filename, tag) {
        const id3 = metadata_1.rawTagToID3v2(tag);
        const id3v2 = new jamp3_1.ID3v2();
        await id3v2.write(filename, id3, id3.head ? id3.head.ver : 4, id3.head ? id3.head.rev : 0, { keepBackup: false, paddingSize: 10 });
    }
    async removeID3v1(filename) {
        if (!USE_TASKS) {
            await task_remove_id3v1_1.removeID3v1(filename);
            return;
        }
        if (!this.removeID3v1Pool) {
            this.removeID3v1Pool = new node_worker_threads_pool_1.StaticPool({
                size: 3, task: exports.taskRemoveID3v1
            });
        }
        log.debug('remove ID3v1 Tag', filename);
        await this.removeID3v1Pool.exec(filename);
    }
    async fixAudio(filename) {
        if (!USE_TASKS) {
            return task_fix_mp3_1.fixMP3(filename);
        }
        if (!this.fixMP3Pool) {
            this.fixMP3Pool = new node_worker_threads_pool_1.StaticPool({
                size: 3, task: exports.taskFixMp3
            });
        }
        log.debug('fix Audio', filename);
        await this.fixMP3Pool.exec(filename);
    }
    async rewrite(filename) {
        if (!USE_TASKS) {
            return task_rewrite_mp3_1.rewriteAudio(filename);
        }
        if (!this.rewriteAudioPool) {
            this.rewriteAudioPool = new node_worker_threads_pool_1.StaticPool({
                size: 3, task: exports.taskRewriteMp3
            });
        }
        log.debug('rewrite', filename);
        await this.rewriteAudioPool.exec(filename);
    }
    async analyze(filename) {
        if (!USE_TASKS) {
            return task_analyze_mp3_1.analyzeMP3(filename);
        }
        if (!this.analyzeMp3Pool) {
            this.analyzeMp3Pool = new node_worker_threads_pool_1.StaticPool({
                size: 3, task: exports.taskAnalyzeMp3
            });
        }
        log.debug('analyze', filename);
        return this.analyzeMp3Pool.exec(filename);
    }
    async extractTagImage(filename) {
        log.debug('extractTagImage', filename);
        const id3v2 = new jamp3_1.ID3v2();
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
    }
}
exports.AudioModuleMP3 = AudioModuleMP3;
//# sourceMappingURL=mp3.module.js.map