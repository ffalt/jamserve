import {Inject, Singleton} from 'typescript-ioc';
import {Series} from './series';
import {ApiBinaryResult} from '../../modules/rest/builder/express-responder';
import {FolderService} from '../folder/folder.service';

@Singleton
export class SeriesService {
	@Inject
	folderService!: FolderService;

	async getImage(series: Series, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const folders = series.folders.getItems().sort((a, b) => b.level - a.level);
		for (const folder of folders) {
			const result = this.folderService.getImage(folder, size, format);
			if (result) {
				return result;
			}
		}
	}

}
