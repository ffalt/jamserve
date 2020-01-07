import {ID3v1, ID3v2, IID3V2, IMP3Analyzer, MP3} from 'jamp3';
import {StaticPool} from 'node-worker-threads-pool';
import {Jam} from '../../../model/jam-rest-data';
import {TrackTagFormatType} from '../../../model/jam-types';
import {logger} from '../../../utils/logger';
import {FORMAT} from '../audio.format';
import {AudioScanResult} from '../audio.module';
import {id3v2ToRawTag, rawTagToID3v2} from '../metadata';
import * as taskAnalyzeMp3 from '../tasks/task-analyze-mp3';
import * as taskFixMp3 from '../tasks/task-fix-mp3';
import * as taskRemoveID3v1 from '../tasks/task-remove-id3v1';
import * as taskRewriteMp3 from '../tasks/task-rewrite-mp3';

const log = logger('Audio:MP3');

export class AudioModuleMP3 {
	private analyzeMp3Pool?: StaticPool;
	private rewriteAudioPool?: StaticPool;
	private removeID3v1Pool?: StaticPool;
	private fixMP3Pool?: StaticPool;

	async read(filename: string): Promise<AudioScanResult> {
		const mp3 = new MP3();
		try {
			const result = await mp3.read(filename, {mpegQuick: true, mpeg: true, id3v2: true});
			if (!result) {
				return {tag: {format: TrackTagFormatType.none}, media: {}};
			}
			if (result.id3v2) {
				return {tag: FORMAT.packID3v2JamServeTag(result.id3v2), media: FORMAT.packJamServeMedia(result.mpeg)};
			}
			const id3v1 = new ID3v1();
			const v1 = await id3v1.read(filename);
			if (!v1) {
				return {tag: {format: TrackTagFormatType.none}, media: FORMAT.packJamServeMedia(result.mpeg)};
			}
			return {tag: FORMAT.packID3v1JamServeTag(v1), media: FORMAT.packJamServeMedia(result.mpeg)};
		} catch (e) {
			return {tag: {format: TrackTagFormatType.none}, media: {}};
		}
	}

	async readRaw(filename: string): Promise<Jam.RawTag | undefined> {
		const id3v2 = new ID3v2();
		const result = await id3v2.read(filename);
		if (!result || !result.head) {
			return Promise.reject(Error('No ID3v2 Tag found'));
		}
		return id3v2ToRawTag(result);
	}

	async write(filename: string, tag: Jam.RawTag): Promise<void> {
		const id3 = rawTagToID3v2(tag);
		const id3v2 = new ID3v2();
		await id3v2.write(filename, id3, id3.head ? id3.head.ver : 4, id3.head ? id3.head.rev : 0, {keepBackup: false, paddingSize: 10});
	}

	async removeID3v1(filename: string): Promise<void> {
		if (!this.removeID3v1Pool) {
			this.removeID3v1Pool = new StaticPool({size: 3, task: taskRemoveID3v1.workerPath});
		}
		log.debug('remove ID3v1 Tag', filename);
		await this.removeID3v1Pool.exec(filename);
	}

	async fixAudio(filename: string): Promise<void> {
		if (!this.fixMP3Pool) {
			this.fixMP3Pool = new StaticPool({size: 3, task: taskFixMp3.workerPath});
		}
		log.debug('fix Audio', filename);
		await this.fixMP3Pool.exec(filename);
	}

	async rewrite(filename: string): Promise<void> {
		if (!this.rewriteAudioPool) {
			this.rewriteAudioPool = new StaticPool({size: 3, task: taskRewriteMp3.workerPath});
		}
		log.debug('rewrite', filename);
		await this.rewriteAudioPool.exec(filename);
	}

	async analyze(filename: string): Promise<IMP3Analyzer.Report> {
		if (!this.analyzeMp3Pool) {
			this.analyzeMp3Pool = new StaticPool({size: 3, task: taskAnalyzeMp3.workerPath});
		}
		log.debug('analyze', filename);
		return this.analyzeMp3Pool.exec(filename);
	}

	async extractTagImage(filename: string): Promise<Buffer | undefined> {
		const id3v2 = new ID3v2();
		const tag = await id3v2.read(filename);
		if (tag) {
			const frames = tag.frames.filter(f => ['APIC', 'PIC'].includes(f.id)) as Array<IID3V2.Frames.PicFrame>;
			let frame = frames.find(f => f.value.pictureType === 3 /*ID3v2 picture type "cover front" */);
			if (!frame) {
				frame = frames[0];
			}
			if (frame) {
				return (frame.value).bin;
			}
		}
	}

}
