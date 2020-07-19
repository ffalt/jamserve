import {Folder, FolderHealth} from './folder';
import {Artwork} from '../artwork/artwork';
import {ArtworkImageType, FolderType} from '../../types/enums';
import path from 'path';
import {Inject, Singleton} from 'typescript-ioc';
import {FolderRulesChecker} from '../health/folder.rule';
import {ImageModule} from '../../modules/image/image.module';
import {OrmService} from '../../modules/engine/services/orm.service';
import {ApiBinaryResult} from '../../modules/rest/builder';

export async function getFolderDisplayArtwork(folder: Folder, orm: OrmService): Promise<Artwork | undefined> {
	await orm.Folder.populate(folder, ['artworks'])
	const search = folder.folderType === FolderType.artist ? ArtworkImageType.artist : ArtworkImageType.front;
	return folder.artworks.getItems().find(a => a.types.includes(search));
}

@Singleton
export class FolderService {
	checker = new FolderRulesChecker();
	@Inject
	private imageModule!: ImageModule;
	@Inject
	public orm!: OrmService;

	async collectFolderPath(folder?: Folder): Promise<Array<Folder>> {
		const result: Array<Folder> = [];
		const collect = async (f?: Folder | null): Promise<void> => {
			if (!f) {
				return;
			}
			result.unshift(f);
			await collect(f.parent);
		}
		await collect(folder);
		return result;
	}

	async getImage(folder: Folder, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const artwork = await getFolderDisplayArtwork(folder, this.orm);
		if (artwork) {
			return this.imageModule.get(artwork.id, path.join(artwork.path, artwork.name), size, format);
		}
	}

	async health(list: Array<Folder>): Promise<Array<FolderHealth>> {
		const folders = list.sort((a, b) => a.path.localeCompare(b.path));
		const result: Array<FolderHealth> = [];
		for (const folder of folders) {
			const parents = await this.collectFolderPath(folder.parent);
			const health = await this.checker.run(this.orm, folder, parents);
			if (health && health.length > 0) {
				result.push({folder, health});
			}
		}
		return result;
	}

}
