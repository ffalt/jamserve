import path from 'path';
import {AudioModule} from '../../modules/audio/audio.module.js';
import {ImageModule} from '../../modules/image/image.module.js';
import {Track, TrackHealth} from './track.js';
import {logger} from '../../utils/logger.js';
import {trackTagToRawTag} from '../../modules/audio/metadata.js';
import {processQueue} from '../../utils/queue.js';
import {TrackRulesChecker} from '../health/track.rule.js';
import {Inject, InRequestScope} from 'typescript-ioc';
import {RawTag} from '../../modules/audio/rawTag.js';
import {FolderService} from '../folder/folder.service.js';
import {TrackHealthHint} from '../health/health.model.js';
import {Orm} from '../../modules/engine/services/orm.service.js';
import {basenameStripExt} from '../../utils/fs-utils.js';
import {ApiBinaryResult} from '../../modules/deco/express/express-responder.js';

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
		} catch {
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
			} catch {
				log.error('TrackService', 'Extracting image from audio failed: ' + path.join(track.path, track.fileName));
			}
		}
		const folder = await track.folder.get();
		if (folder) {
			const name = basenameStripExt(track.fileName);
			const artworks = await folder.artworks.getItems();
			const artwork = artworks.find(a => a.name.startsWith(name));
			if (artwork) {
				return this.imageModule.get(artwork.id, path.join(artwork.path, artwork.name), size, format);
			}
			return this.folderService.getImage(orm, folder, size, format);
		}
		return;
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
