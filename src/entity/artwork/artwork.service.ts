import {Inject, InRequestScope} from 'typescript-ioc';
import {AdminChangeQueueInfo} from '../admin/admin';
import {ArtworkImageType} from '../../types/enums';
import {Folder} from '../folder/folder';
import {IoService} from '../../modules/engine/services/io.service';
import {Artwork} from './artwork';
import path from 'path';
import {ImageModule} from '../../modules/image/image.module';
import {Orm} from '../../modules/engine/services/orm.service';

@InRequestScope
export class ArtworkService {
	@Inject
	private ioService!: IoService;
	@Inject
	private imageModule!: ImageModule;

	async createByUrl(folder: Folder, url: string, types: Array<ArtworkImageType>): Promise<AdminChangeQueueInfo> {
		return this.ioService.downloadArtwork(folder.id, url, types, folder.root.idOrFail());
	}

	async createByFile(folder: Folder, filename: string, types: Array<ArtworkImageType>): Promise<AdminChangeQueueInfo> {
		return this.ioService.createArtwork(folder.id, filename, types, folder.root.idOrFail());
	}

	async upload(artwork: Artwork, filename: string): Promise<AdminChangeQueueInfo> {
		return this.ioService.replaceArtwork(artwork.id, filename, (await artwork.folder.getOrFail()).root.idOrFail());
	}

	async rename(artwork: Artwork, newName: string): Promise<AdminChangeQueueInfo> {
		return this.ioService.renameArtwork(artwork.id, newName, (await artwork.folder.getOrFail()).root.idOrFail());
	}

	async remove(artwork: Artwork): Promise<AdminChangeQueueInfo> {
		return this.ioService.deleteArtwork(artwork.id, (await artwork.folder.getOrFail()).root.idOrFail());
	}

	public async getImage(orm: Orm, artwork: Artwork, size: number | undefined, format: string | undefined) {
		return this.imageModule.get(artwork.id, path.join(artwork.path, artwork.name), size, format);
	}
}
