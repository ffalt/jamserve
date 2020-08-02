import path from 'path';
import {AudioModule} from '../../modules/audio/audio.module';
import {ImageModule} from '../../modules/image/image.module';
import {Track, TrackHealth} from './track';
import {logger} from '../../utils/logger';
import {trackTagToRawTag} from '../../modules/audio/metadata';
import {processQueue} from '../../utils/queue';
import {TrackRulesChecker} from '../health/track.rule';
import {Inject, InRequestScope} from 'typescript-ioc';
import {RawTag} from '../../modules/audio/rawTag';
import {ApiBinaryResult} from '../../modules/rest';
import {FolderService} from '../folder/folder.service';
import {TrackHealthHint} from '../health/health.model';
import {Orm} from '../../modules/engine/services/orm.service';

const log = logger('TrackService');

@InRequestScope
export class TrackService {
	readonly checker: TrackRulesChecker;
	@Inject
	private audioModule!: AudioModule;
	@Inject
	private imageModule!: ImageModule;
	@Inject
	private folderService!: FolderService;

	constructor() {
		this.checker = new TrackRulesChecker(this.audioModule);
	}

	async getRawTag(track: Track): Promise<RawTag | undefined> {
		try {
			const result = await this.audioModule.readRawTag(path.join(track.path, track.fileName));
			if (!result) {
				const tag = await track.tag.get();
				if (tag) {
					return trackTagToRawTag(tag);
				}
			}
			return result;
		} catch (e) {
			const tag = await track.tag.get();
			return tag ? trackTagToRawTag(tag) : undefined;
		}
	}

	async getImage(orm: Orm, track: Track, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const tag = await track.tag.get();
		if (tag?.nrTagImages) {
			const result = await this.imageModule.getExisting(track.id, size, format);
			if (result) {
				return result;
			}
			try {
				const buffer = await this.audioModule.extractTagImage(path.join(track.path, track.fileName));
				if (buffer) {
					return await this.imageModule.getBuffer(track.id, buffer, size, format);
				}
			} catch (e) {
				log.error('TrackService', 'Extracting image from audio failed: ' + path.join(track.path, track.fileName));
			}
		}
		const folder = await track.folder.get();
		if (folder) {
			return this.folderService.getImage(orm, folder, size, format);
		}
	}

	async health(tracks: Array<Track>, media?: boolean): Promise<Array<TrackHealth>> {
		const result: Array<{ track: Track; health: Array<TrackHealthHint> }> = [];
		await processQueue<Track>(3, tracks, async track => {
			const health = await this.checker.run(track, !!media);
			if (health && health.length > 0) {
				result.push({track, health});
			}
		});
		return result;
	}
}
