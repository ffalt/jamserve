import {Folder} from '../folder/folder';
import {Album} from './album';
import {Inject, Singleton} from 'typescript-ioc';
import {ApiBinaryResult} from '../../modules/rest/builder/express-responder';
import {TrackService} from '../track/track.service';
import {FolderService} from '../folder/folder.service';
import {OrmService} from '../../modules/engine/services/orm.service';

@Singleton
export class AlbumService {
	@Inject
	private trackService!: TrackService;
	@Inject
	private folderService!: FolderService;
	@Inject
	private orm!: OrmService;

	private async getAlbumFolder(album: Album): Promise<Folder | undefined> {
		await this.orm.Album.populate(album, ['folders'])
		if (album.folders.length === 0) {
			return;
		}
		const folders = album.folders.getItems().sort((a, b) => b.level - a.level);
		return folders[0];
	}

	private async getAlbumTrackImage(album: Album, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		await this.orm.Album.populate(album, ['tracks'])
		if (album.tracks.length > 0) {
			const tracks = album.tracks.getItems();
			return this.trackService.getImage(tracks[0], size, format);
		}
	}

	private async getAlbumFolderImage(album: Album, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const folder = await this.getAlbumFolder(album);
		if (folder) {
			return this.folderService.getImage(folder, size, format);
		}
	}

	async getImage(album: Album, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		let result: ApiBinaryResult | undefined;
		if (album.series) {
			result = await this.getAlbumTrackImage(album, size, format);
		}
		if (!result) {
			result = await this.getAlbumFolderImage(album, size, format);
		}
		if (!result) {
			result = await this.getAlbumTrackImage(album, size, format);
		}
		return result;
	}
}
