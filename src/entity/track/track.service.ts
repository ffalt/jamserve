import path from 'path';
import {AudioModule} from '../../modules/audio/audio.module';
import {ImageModule} from '../../modules/image/image.module';
import {Track, TrackHealth} from './track';
import {logger} from '../../utils/logger';
import {trackTagToRawTag} from '../../modules/audio/metadata';
import {processQueue} from '../../utils/queue';
import {TrackRulesChecker} from '../health/track.rule';
import {Inject, Singleton} from 'typescript-ioc';
import {RawTag} from '../../modules/audio/rawTag';
import {ApiBinaryResult} from '../../modules/rest/builder/express-responder';
import {FolderService} from '../folder/folder.service';
import {TrackHealthHint} from '../health/health.model';

const log = logger('TrackService');

@Singleton
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
			if (!result && track.tag) {
				return trackTagToRawTag(track.tag);
			}
			return result;
		} catch (e) {
			return track.tag ? trackTagToRawTag(track.tag) : undefined;
		}
	}

	defaultCompare(a: Track, b: Track): number {
		let res = a.path.localeCompare(b.path);
		if (res !== 0) {
			return res;
		}
		if (a.tag?.disc !== undefined && b.tag?.disc !== undefined) {
			res = a.tag.disc - b.tag.disc;
			if (res !== 0) {
				return res;
			}
		}
		if (a.tag?.trackNr !== undefined && b.tag?.trackNr !== undefined) {
			res = a.tag.trackNr - b.tag.trackNr;
			if (res !== 0) {
				return res;
			}
		}
		return a.name.localeCompare(b.name);
	}

	defaultSort(tracks: Array<Track>): Array<Track> {
		return tracks.sort((a, b) => this.defaultCompare(a, b));
	}

	async getImage(track: Track, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		if (track.tag && track.tag.nrTagImages) {
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
		if (track.folder) {
			return this.folderService.getImage(track.folder, size, format);
		}
	}

	async health(list: Array<Track>, media?: boolean): Promise<Array<TrackHealth>> {
		const tracks = this.defaultSort(list);
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
