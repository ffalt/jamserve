import {ApiBinaryResult} from '../../modules/rest/';
import {Inject} from 'typescript-ioc';
import {FolderService} from '../folder/folder.service';
import {Root} from './root';
import {Orm} from '../../modules/engine/services/orm.service';

export class RootService {
	@Inject
	folderService!: FolderService;

	async getImage(orm: Orm, root: Root, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const folders = await root.folders.getItems();
		const folder = folders.sort((a, b) => b.level - a.level)[0];
		if (folder) {
			return this.folderService.getImage(orm, folder, size, format);
		}
	}
}
