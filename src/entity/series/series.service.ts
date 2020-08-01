import {Inject, InRequestScope} from 'typescript-ioc';
import {Series} from './series';
import {ApiBinaryResult} from '../../modules/rest';
import {FolderService} from '../folder/folder.service';
import {Orm} from '../../modules/engine/services/orm.service';
import {FolderType} from '../../types/enums';
import {Folder} from '../folder/folder';

@InRequestScope
export class SeriesService {
	@Inject
	folderService!: FolderService;

	async getImage(orm: Orm, series: Series, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const folders = await series.folders.getItems();
		let p: Folder | undefined = folders[0];
		while (p) {
			if (p.folderType === FolderType.artist) {
				break;
			}
			p = await p.parent.get();
		}
		if (p) {
			return this.folderService.getImage(orm, p, size, format);
		}
		for (const folder of folders) {
			const result = this.folderService.getImage(orm, folder, size, format);
			if (result) {
				return result;
			}
		}
	}

}
