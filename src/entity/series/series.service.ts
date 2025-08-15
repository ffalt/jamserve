import { Inject, InRequestScope } from 'typescript-ioc';
import { Series } from './series.js';
import { FolderService } from '../folder/folder.service.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { FolderType } from '../../types/enums.js';
import { ApiBinaryResult } from '../../modules/deco/express/express-responder.js';

@InRequestScope
export class SeriesService {
	@Inject
	folderService!: FolderService;

	async getImage(orm: Orm, series: Series, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const folders = await series.folders.getItems();
		let folder = folders.at(0);
		while (folder) {
			if (folder.folderType === FolderType.artist) {
				break;
			}
			folder = await folder.parent.get();
		}
		if (folder) {
			return this.folderService.getImage(orm, folder, size, format);
		}
		for (const entry of folders) {
			const result = await this.folderService.getImage(orm, entry, size, format);
			if (result) {
				return result;
			}
		}
		return;
	}
}
