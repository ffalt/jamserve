import { Inject } from 'typescript-ioc';
import { FolderService } from '../folder/folder.service.js';
import { Root } from './root.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { ApiBinaryResult } from '../../modules/deco/express/express-responder.js';

export class RootService {
	@Inject
	folderService!: FolderService;

	async getImage(orm: Orm, root: Root, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const folders = await root.folders.getItems();
		const sorted = folders.sort((a, b) => a.level - b.level);
		const folder = sorted.at(0);
		if (folder) {
			return this.folderService.getImage(orm, folder, size, format);
		}
		return;
	}
}
