import {Track} from './track.model';
import {IApiBinaryResult} from '../../typings';
import {SearchQueryTrack, TrackStore} from './track.store';
import {FolderService} from '../folder/folder.service';
import {Folder} from '../folder/folder.model';
import {BaseListService} from '../base/base.list.service';
import {StateService} from '../state/state.service';
import {ensureTrailingPathSeparator, replaceFileSystemChars} from '../../utils/fs-utils';
import path from 'path';
import fse from 'fs-extra';

export class TrackService extends BaseListService<Track, SearchQueryTrack> {

	constructor(public trackStore: TrackStore, private folderService: FolderService, stateService: StateService) {
		super(trackStore, stateService);
	}

	async getTrackFolder(track: Track): Promise<Folder | undefined> {
		return await this.folderService.folderStore.byId(track.parentID);
	}

	async getTrackImage(track: Track, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		const folder = await this.getTrackFolder(track);
		if (folder) {
			return this.folderService.getFolderImage(folder, size, format);
		}
	}

	async renameTrack(track: Track, name: string): Promise<void> {
		name = replaceFileSystemChars(name, '').trim();
		if (name.length === 0) {
			return Promise.reject(Error('Invalid Name'));
		}
		const ext = path.extname(name).toLowerCase();
		const ext2 = path.extname(track.name).toLowerCase();
		if (ext !== ext2) {
			return Promise.reject(Error('Changing File extension not supported ' + ext + '=>' + ext2));
		}
		const newPath = path.join(track.path, name);
		const exists = await fse.pathExists(newPath);
		if (exists) {
			return Promise.reject(Error('File already exists'));
		}
		await fse.rename(path.join(track.path, track.name), path.join(track.path, name));
		track.name = name;
		await this.trackStore.replace(track);
	}

}
