import path from 'path';
import {ArtworkImageType, FolderType} from '../../model/jam-types';
import {ImageModule} from '../../modules/image/image.module';
import {ApiBinaryResult} from '../../typings';
import {BaseListService} from '../base/dbobject-list.service';
import {StateService} from '../state/state.service';
import {TrackStore} from '../track/track.store';
import {Artwork, Folder} from './folder.model';
import {FolderStore, SearchQueryFolder} from './folder.store';
import {Jam} from '../../model/jam-rest-data';
import {Root} from '../root/root.model';
import {RootService} from '../root/root.service';
import {FolderRulesChecker} from '../health/folder.rule';

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
	checker = new FolderRulesChecker();

	constructor(public folderStore: FolderStore, private trackStore: TrackStore, private rootService: RootService, stateService: StateService, public imageModule: ImageModule) {
		super(folderStore, stateService);
	}

	defaultSort(items: Array<Folder>): Array<Folder> {
		return items.sort((a, b) => (a.tag && a.tag.title ? a.tag.title : path.basename(a.path)).localeCompare((b.tag && b.tag.title ? b.tag.title : path.basename(b.path))));
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

	async getImage(folder: Folder, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const artwork = await getFolderDisplayImage(folder);
		if (artwork) {
			return this.getArtworkImage(folder, artwork, size, format);
		}
	}

	async getArtworkImage(folder: Folder, artwork: Artwork, size?: number, format?: string): Promise<ApiBinaryResult> {
		return this.imageModule.get(artwork.id, path.join(folder.path, artwork.name), size, format);
	}

	async health(query: SearchQueryFolder): Promise<Array<{
		folder: Folder;
		health: Array<Jam.HealthHint>;
	}>> {
		const list = await this.store.search(query);
		list.items = list.items.sort((a, b) => a.path.localeCompare(b.path));
		const result: Array<{
			folder: Folder;
			health: Array<Jam.HealthHint>;
		}> = [];
		const roots: Array<Root> = [];
		const cachedFolders = list.items.slice(0);
		for (const folder of list.items) {
			let root = roots.find(r => r.id === folder.rootID);
			if (!root) {
				root = await this.rootService.rootStore.byId(folder.rootID);
				if (root) {
					roots.push(root);
				}
			}
			if (root) {
				const parents = await this.collectFolderPath(folder.parentID, cachedFolders);
				const health = await this.checker.run(folder, parents, root);
				if (health && health.length > 0) {
					result.push({folder, health});
				}
			}

		}
		return result;
	}


}
