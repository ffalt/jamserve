import { Inject, InRequestScope } from 'typescript-ioc';
import { AdminChangeQueueInfo } from '../admin/admin.js';
import { ArtworkImageType } from '../../types/enums.js';
import { Folder } from '../folder/folder.js';
import { IoService } from '../../modules/engine/services/io.service.js';
import { Artwork } from './artwork.js';
import path from 'path';
import { ImageModule } from '../../modules/image/image.module.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { ImageResult } from '../../modules/image/image.format.js';

@InRequestScope
export class ArtworkService {
	@Inject
	private readonly ioService!: IoService;

	@Inject
	private readonly imageModule!: ImageModule;

	async createByUrl(folder: Folder, url: string, types: Array<ArtworkImageType>): Promise<AdminChangeQueueInfo> {
		return this.ioService.artwork.download(folder.id, url, types, folder.root.idOrFail());
	}

	async createByFile(folder: Folder, filename: string, types: Array<ArtworkImageType>): Promise<AdminChangeQueueInfo> {
		return this.ioService.artwork.create(folder.id, filename, types, folder.root.idOrFail());
	}

	async upload(artwork: Artwork, filename: string): Promise<AdminChangeQueueInfo> {
		return this.ioService.artwork.replace(artwork.id, filename, (await artwork.folder.getOrFail()).root.idOrFail());
	}

	async rename(artwork: Artwork, newName: string): Promise<AdminChangeQueueInfo> {
		return this.ioService.artwork.rename(artwork.id, newName, (await artwork.folder.getOrFail()).root.idOrFail());
	}

	async remove(artwork: Artwork): Promise<AdminChangeQueueInfo> {
		return this.ioService.artwork.delete(artwork.id, (await artwork.folder.getOrFail()).root.idOrFail());
	}

	async getImage(orm: Orm, artwork: Artwork, size: number | undefined, format: string | undefined): Promise<ImageResult> {
		return this.imageModule.get(artwork.id, path.join(artwork.path, artwork.name), size, format);
	}
}
