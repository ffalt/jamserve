import fse from 'fs-extra';
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

export class TrackService extends BaseListService<Track, SearchQueryTrack> {

	constructor(public trackStore: TrackStore, private folderService: FolderService, private audioModule: AudioModule, private imageModule: ImageModule, stateService: StateService) {
		super(trackStore, stateService);
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

	async getTrackImage(track: Track, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		if (track.tag && track.tag.nrTagImages) {
			const thumbnail = this.imageModule.buildThumbnailFilenamePath(track.id, size, format);
			if (await fse.pathExists(thumbnail)) {
				return {file: {filename: thumbnail, name: path.basename(thumbnail)}};
			}
			const buffer = await this.audioModule.extractTagImage(track.path);
			if (buffer) {
				return this.imageModule.getBuffer(track.id, buffer, size, format);
			}
		}
		const folder = await this.getTrackFolder(track);
		if (folder) {
			return this.folderService.getFolderImage(folder, size, format);
		}
	}

}
