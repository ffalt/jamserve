import {Inject, InRequestScope} from 'typescript-ioc';
import {Series} from './series';
import {ApiBinaryResult} from '../../modules/rest/builder/express-responder';
import {FolderService} from '../folder/folder.service';
import {Orm} from '../../modules/engine/services/orm.service';

@InRequestScope
export class SeriesService {
	@Inject
	folderService!: FolderService;

	async getImage(orm: Orm, series: Series, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const folders = (await series.folders.getItems()).sort((a, b) => b.level - a.level);
		for (const folder of folders) {
			const result = this.folderService.getImage(orm, folder, size, format);
			if (result) {
				return result;
			}
		}
	}

}
