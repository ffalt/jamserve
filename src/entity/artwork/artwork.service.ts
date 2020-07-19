import {Inject, Singleton} from 'typescript-ioc';
import {AdminChangeQueueInfo} from '../admin/admin';
import {ArtworkImageType} from '../../types/enums';
import {Folder} from '../folder/folder';
import {IoService} from '../../modules/engine/services/io.service';
import {Artwork} from './artwork';
import path from "path";
import {ImageModule} from '../../modules/image/image.module';

@Singleton
export class ArtworkService {
	@Inject
	private ioService!: IoService;
	@Inject
	private imageModule!: ImageModule;

	async createByUrl(folder: Folder, url: string, types: Array<ArtworkImageType>): Promise<AdminChangeQueueInfo> {
		return this.ioService.downloadArtwork(folder.id, url, types, folder.root.id);
	}

	async createByFile(folder: Folder, filename: string, types: Array<ArtworkImageType>): Promise<AdminChangeQueueInfo> {
		return this.ioService.createArtwork(folder.id, filename, types, folder.root.id);
	}

	async upload(artwork: Artwork, filename: string): Promise<AdminChangeQueueInfo> {
		return this.ioService.replaceArtwork(artwork.id, filename, artwork.folder.root.id);
	}

	async rename(artwork: Artwork, newName:string): Promise<AdminChangeQueueInfo> {
		return this.ioService.renameArtwork(artwork.id, newName, artwork.folder.root.id);
	}

	async remove(artwork: Artwork): Promise<AdminChangeQueueInfo> {
		return this.ioService.deleteArtwork(artwork.id, artwork.folder.root.id);
	}

	public async getImage(artwork: Artwork, size: number | undefined, format: string | undefined) {
		return this.imageModule.get(artwork.id, path.join(artwork.path, artwork.name), size, format);
	}
}
