import path from 'path';
import {ArtworkImageType, FolderType} from '../../model/jam-types';
import {ImageModule} from '../../modules/image/image.module';
import {ApiBinaryResult} from '../../typings';
import {BaseListService} from '../base/dbobject-list.service';
import {StateService} from '../state/state.service';
import {TrackStore} from '../track/track.store';
import {Artwork, Folder} from './folder.model';
import {FolderStore, SearchQueryFolder} from './folder.store';

export async function getFolderDisplayImage(folder: Folder): Promise<Artwork | undefined> {
	if (!folder.tag || !folder.tag.artworks) {
		return;
	}
	if (folder.tag.type === FolderType.artist) {
		return folder.tag.artworks.find(a => a.types.includes(ArtworkImageType.artist));
	}
	return folder.tag.artworks.find(a => a.types.includes(ArtworkImageType.front));
}

export class FolderService extends BaseListService<Folder, SearchQueryFolder> {

	constructor(public folderStore: FolderStore, private trackStore: TrackStore, stateService: StateService, public imageModule: ImageModule) {
		super(folderStore, stateService);
	}

	async collectFolderPath(folderId: string | undefined, cachedFolders?: Array<Folder>): Promise<Array<Folder>> {
		const result: Array<Folder> = [];
		const store = this.folderStore;

		async function collect(id?: string): Promise<void> {
			if (!id) {
				return;
			}
			let folder: Folder | undefined;
			if (cachedFolders) {
				folder = cachedFolders.find(f => f.id === id);
			}
			if (!folder) {
				folder = await store.byId(id);
				if (cachedFolders && folder) {
					cachedFolders.push(folder);
				}
			}
			if (folder) {
				result.unshift(folder);
				await collect(folder.parentID);
			}
		}

		await collect(folderId);
		return result;
	}

	async getFolderImage(folder: Folder, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const artwork = await getFolderDisplayImage(folder);
		if (artwork) {
			return this.getArtworkImage(folder, artwork, size, format);
		}
	}

	async getArtworkImage(folder: Folder, artwork: Artwork, size?: number, format?: string): Promise<ApiBinaryResult> {
		return this.imageModule.get(artwork.id, path.join(folder.path, artwork.name), size, format);
	}

}
