import { Folder } from '../folder/folder.js';
import { Album } from './album.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { TrackService } from '../track/track.service.js';
import { FolderService } from '../folder/folder.service.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { ApiBinaryResult } from '../../modules/deco/express/express-responder.js';

@InRequestScope
export class AlbumService {
	@Inject
	private readonly trackService!: TrackService;

	@Inject
	private readonly folderService!: FolderService;

	private static async getAlbumFolder(album: Album): Promise<Folder | undefined> {
		const folders = await album.folders.getItems();
		if (folders.length > 0) {
			return folders.sort((a, b) => b.level - a.level).at(0);
		}
		return;
	}

	private async getAlbumTrackImage(orm: Orm, album: Album, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const tracks = await album.tracks.getItems();
		const track = tracks.at(0);
		if (track) {
			return this.trackService.getImage(orm, track, size, format);
		}
		return;
	}

	private async getAlbumFolderImage(orm: Orm, album: Album, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const folder = await AlbumService.getAlbumFolder(album);
		if (folder) {
			return this.folderService.getImage(orm, folder, size, format);
		}
		return;
	}

	async getImage(orm: Orm, album: Album, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		let result: ApiBinaryResult | undefined;
		if (album.series.id()) {
			result = await this.getAlbumTrackImage(orm, album, size, format);
		}
		result ??= await this.getAlbumFolderImage(orm, album, size, format);
		result ??= await this.getAlbumTrackImage(orm, album, size, format);
		return result;
	}
}
