import { Album } from './album.js';
import { injectable, inject } from 'inversify';
import { TrackService } from '../track/track.service.js';
import { FolderService } from '../folder/folder.service.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { ApiBinaryResult } from '../../modules/deco/express/express-responder.js';

@injectable()
export class AlbumService {
	@inject(TrackService)
	private readonly trackService!: TrackService;

	@inject(FolderService)
	private readonly folderService!: FolderService;

	private async getAlbumTrackImage(orm: Orm, album: Album, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const tracks = await album.tracks.getItems();
		const track = tracks.at(0);
		if (track) {
			return this.trackService.getImage(orm, track, size, format);
		}
		return;
	}

	private async getAlbumFolderImage(orm: Orm, album: Album, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const folders = await album.folders.getItems();
		const sorted = folders.sort((a, b) => b.level - a.level);
		for (const folder of sorted) {
			const result = await this.folderService.getImage(orm, folder, size, format);
			if (result) {
				return result;
			}
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
