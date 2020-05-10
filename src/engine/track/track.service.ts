import path from 'path';
import {AudioModule} from '../../modules/audio/audio.module';
import {ImageModule} from '../../modules/image/image.module';
import {ApiBinaryResult} from '../../typings';
import {BaseListService} from '../base/dbobject-list.service';
import {Folder} from '../folder/folder.model';
import {FolderService} from '../folder/folder.service';
import {StateService} from '../state/state.service';
import {Track} from './track.model';
import {SearchQueryTrack, TrackStore} from './track.store';
import {logger} from '../../utils/logger';
import {Jam} from '../../model/jam-rest-data';
import {trackTagToRawTag} from '../../modules/audio/metadata';

const log = logger('TrackService');

export class TrackService extends BaseListService<Track, SearchQueryTrack> {

	constructor(
		public trackStore: TrackStore, private folderService: FolderService, private audioModule: AudioModule,
		private imageModule: ImageModule, stateService: StateService
	) {
		super(trackStore, stateService);
	}

	async getRawTag(track: Track): Promise<Jam.RawTag | undefined> {
		try {
			const result = await this.audioModule.readRawTag(path.join(track.path, track.name));
			if (!result) {
				return trackTagToRawTag(track.tag);
			}
			return result;
		} catch (e) {
			return trackTagToRawTag(track.tag);
		}
	}

	defaultCompare(a: Track, b: Track): number {
		let res = a.path.localeCompare(b.path);
		if (res !== 0) {
			return res;
		}
		if (a.tag.disc !== undefined && b.tag.disc !== undefined) {
			res = a.tag.disc - b.tag.disc;
			if (res !== 0) {
				return res;
			}
		}
		if (a.tag.track !== undefined && b.tag.track !== undefined) {
			res = a.tag.track - b.tag.track;
			if (res !== 0) {
				return res;
			}
		}
		return a.name.localeCompare(b.name);
	}

	defaultSort(tracks: Array<Track>): Array<Track> {
		return tracks.sort((a, b) => this.defaultCompare(a, b));
	}

	async getTrackFolder(track: Track): Promise<Folder | undefined> {
		return this.folderService.folderStore.byId(track.parentID);
	}

	async getImage(track: Track, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		if (track.tag && track.tag.nrTagImages) {
			const result = await this.imageModule.getExisting(track.id, size, format);
			if (result) {
				return result;
			}
			try {
				const buffer = await this.audioModule.extractTagImage(path.join(track.path, track.name));
				if (buffer) {
					return await this.imageModule.getBuffer(track.id, buffer, size, format);
				}
			} catch (e) {
				log.error('TrackService', 'Extracting image from audio failed: ' + path.join(track.path, track.name));
			}
		}
		const folder = await this.getTrackFolder(track);
		if (folder) {
			return this.folderService.getImage(folder, size, format);
		}
	}

}
