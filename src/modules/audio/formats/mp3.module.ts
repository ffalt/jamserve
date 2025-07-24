import { ID3v1, ID3v2, IID3V2, IMP3Analyzer, MP3 } from 'jamp3';
import { StaticPool } from 'node-worker-threads-pool';
import { logger } from '../../../utils/logger.js';
import { FORMAT, TrackSyncronizedLyrics } from '../audio.format.js';
import { AudioScanResult } from '../audio.module.js';
import { id3v2ToRawTag, rawTagToID3v2 } from '../metadata.js';
import path from 'node:path';
import { TagFormatType } from '../../../types/enums.js';
import { RawTag } from '../rawTag.js';
import { analyzeMP3 } from '../tasks/task-analyze-mp3.js';
import { rewriteAudio } from '../tasks/task-rewrite-mp3.js';
import { fixMP3 } from '../tasks/task-fix-mp3.js';
import { removeID3v1 } from '../tasks/task-remove-id3v1.js';
import { fileURLToPath } from 'node:url';

const USE_TASKS = process.env.JAM_USE_TASKS;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const taskPath = path.join(__dirname, '..', 'tasks');
export const taskRewriteMp3 = path.join(taskPath, 'task-rewrite-mp3.js');
export const taskFixMp3 = path.join(taskPath, 'task-fix-mp3.js');
export const taskRemoveID3v1 = path.join(taskPath, 'task-remove-id3v1.js');
export const taskAnalyzeMp3 = path.join(taskPath, 'task-analyze-mp3.js');

const log = logger('Audio:MP3');

export class AudioModuleMP3 {
	private analyzeMp3Pool?: StaticPool<any, any>;
	private rewriteAudioPool?: StaticPool<any, any>;
	private removeID3v1Pool?: StaticPool<any, any>;
	private fixMP3Pool?: StaticPool<any, any>;

	async read(filename: string): Promise<AudioScanResult> {
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
		} catch {
			return { format: TagFormatType.none };
		}
	}

	async readRaw(filename: string): Promise<RawTag | undefined> {
		const id3v2 = new ID3v2();
		const result = await id3v2.read(filename);
		if (!result?.head) {
			return Promise.reject(new Error('No ID3v2 Tag found'));
		}
		return id3v2ToRawTag(result);
	}

	async write(filename: string, tag: RawTag): Promise<void> {
		const id3 = rawTagToID3v2(tag);
		const id3v2 = new ID3v2();
		await id3v2.write(filename, id3, id3.head ? id3.head.ver : 4, id3.head ? id3.head.rev : 0, { keepBackup: false, paddingSize: 10 });
	}

	async removeID3v1(filename: string): Promise<void> {
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

	async fixAudio(filename: string): Promise<void> {
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

	async rewrite(filename: string): Promise<void> {
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

	async analyze(filename: string): Promise<IMP3Analyzer.Report> {
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

	async extractTagImage(filename: string): Promise<Buffer | undefined> {
		log.debug('extractTagImage', filename);
		const id3v2 = new ID3v2();
		const tag = await id3v2.read(filename);
		if (tag) {
			const frames = tag.frames.filter(f => ['APIC', 'PIC'].includes(f.id)) as Array<IID3V2.Frames.PicFrame>;
			let frame = frames.find(f => f.value.pictureType === 3 /* ID3v2 picture type "cover front" */);
			if (!frame) {
				frame = frames[0];
			}
			if (frame) {
				return (frame.value).bin;
			}
		}
		return;
	}

	resolveTimeStampFormat(timestampFormat: number) {
		if (timestampFormat === 1) {
			return 'MPEG frames';
		}
		return 'milliseconds';
	}

	resolveContentType(contentType: number) {
		switch (contentType) {
			case 1: {
				return 'lyrics';
			}
			case 2: {
				return 'text transcription';
			}
			case 3: {
				return 'part name';
			}
			case 4: {
				return 'events';
			}
			case 5: {
				return 'chord';
			}
			case 6: {
				return 'trivia';
			}
			default: {
				return 'other';
			}
		}
	};

	async extractTagSyncedLyrics(filename: string): Promise<TrackSyncronizedLyrics | undefined> {
		log.debug('extractTagSyncedLyrics', filename);
		const id3v2 = new ID3v2();
		const tag = await id3v2.read(filename);
		if (tag) {
			const frames = tag.frames.filter(f => ['SLT'].includes(f.id)) as Array<IID3V2.Frames.SynchronisedLyricsFrame>;
			if (frames.length > 0) {
				const frame = frames.find(f => f.value?.contentType === 1);
				if (frame) {
					return {
						language: frame.value.language,
						contentType: this.resolveContentType(frame.value.contentType),
						timestampFormat: this.resolveTimeStampFormat(frame.value.timestampFormat),
						events: frame.value.events
					};
				}
			}
		}
		return;
	}
}
