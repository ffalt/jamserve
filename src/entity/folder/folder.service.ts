import { Folder, FolderHealth } from './folder.js';
import { Artwork } from '../artwork/artwork.js';
import { ArtworkImageType, FolderType } from '../../types/enums.js';
import path from 'path';
import { Inject, InRequestScope } from 'typescript-ioc';
import { FolderRulesChecker } from '../health/folder.rule.js';
import { ImageModule } from '../../modules/image/image.module.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { ApiBinaryResult } from '../../modules/deco/express/express-responder.js';

export async function getFolderDisplayArtwork(orm: Orm, folder: Folder): Promise<Artwork | undefined> {
	const search = folder.folderType === FolderType.artist ? ArtworkImageType.artist : ArtworkImageType.front;
	return (await folder.artworks.getItems()).find(a => a.types.includes(search));
}

@InRequestScope
export class FolderService {
	checker = new FolderRulesChecker();
	@Inject
	private imageModule!: ImageModule;

	async collectFolderPath(folder?: Folder): Promise<Array<Folder>> {
		const result: Array<Folder> = [];
		const collect = async (f?: Folder): Promise<void> => {
			if (!f) {
				return;
			}
			result.unshift(f);
			await collect(await f.parent.get());
		};
		await collect(folder);
		return result;
	}

	async getImage(orm: Orm, folder: Folder, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const artwork = await getFolderDisplayArtwork(orm, folder);
		if (artwork) {
			return this.imageModule.get(artwork.id, path.join(artwork.path, artwork.name), size, format);
		}
		return;
	}

	async health(orm: Orm, list: Array<Folder>): Promise<Array<FolderHealth>> {
		const folders = list.sort((a, b) => a.path.localeCompare(b.path));
		const result: Array<FolderHealth> = [];
		for (const folder of folders) {
			const parents = await this.collectFolderPath(await folder.parent.get());
			const health = await this.checker.run(orm, folder, parents);
			if (health && health.length > 0) {
				result.push({ folder, health });
			}
		}
		return result;
	}
}
