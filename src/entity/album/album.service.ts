import {Folder} from '../folder/folder';
import {Album} from './album';
import {Inject, InRequestScope} from 'typescript-ioc';
import {ApiBinaryResult} from '../../modules/rest';
import {TrackService} from '../track/track.service';
import {FolderService} from '../folder/folder.service';
import {Orm} from '../../modules/engine/services/orm.service';

@InRequestScope
export class AlbumService {
	@Inject
	private trackService!: TrackService;
	@Inject
	private folderService!: FolderService;

	private static async getAlbumFolder(album: Album): Promise<Folder | undefined> {
		const folders = await album.folders.getItems();
		if (folders.length > 0) {
			return folders.sort((a, b) => b.level - a.level)[0];
		}
	}

	private async getAlbumTrackImage(orm: Orm, album: Album, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const tracks = await album.tracks.getItems();
		if (tracks.length > 0) {
			return this.trackService.getImage(orm, tracks[0], size, format);
		}
	}

	private async getAlbumFolderImage(orm: Orm, album: Album, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const folder = await AlbumService.getAlbumFolder(album);
		if (folder) {
			return this.folderService.getImage(orm, folder, size, format);
		}
	}

	async getImage(orm: Orm, album: Album, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		let result: ApiBinaryResult | undefined;
		if (album.series) {
			result = await this.getAlbumTrackImage(orm, album, size, format);
		}
		if (!result) {
			result = await this.getAlbumFolderImage(orm, album, size, format);
		}
		if (!result) {
			result = await this.getAlbumTrackImage(orm, album, size, format);
		}
		return result;
	}
}
