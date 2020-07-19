import {ApiBinaryResult} from '../../modules/rest/builder/express-responder';
import {Inject} from 'typescript-ioc';
import {FolderService} from '../folder/folder.service';
import {Root} from './root';

export class RootService {
	@Inject
	folderService!: FolderService;

	async getImage(root: Root, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const folders = root.folders.getItems().sort((a, b) => b.level - a.level);
		if (folders.length > 0) {
			return this.folderService.getImage(folders[0], size, format);
		}
	}
}
