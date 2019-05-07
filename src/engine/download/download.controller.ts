import {JamRequest} from '../../api/jam/api';
import {InvalidParamError, NotFoundError} from '../../api/jam/error';
import {JamParameters} from '../../model/jam-rest-params';
import {ApiBinaryResult} from '../../typings';
import {Store} from '../store/store';
import {DownloadService} from './download.service';

export class DownloadController {

	constructor(
		private store: Store,
		private downloadService: DownloadService
	) {
	}

	async download(req: JamRequest<JamParameters.Download>): Promise<ApiBinaryResult> {
		const id = req.query.id;
		if (!id || id.length === 0) {
			return Promise.reject(InvalidParamError());
		}
		const obj = await this.store.findInAll(id);
		if (!obj) {
			return Promise.reject(NotFoundError());
		}
		const result = await this.downloadService.getObjDownload(obj, req.query.format, req.user);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return result;
	}
}
