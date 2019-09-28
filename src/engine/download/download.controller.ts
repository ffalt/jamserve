import {JamRequest} from '../../api/jam/api';
import {validatePathParameterIDFormat} from '../../api/jam/check';
import {InvalidParamError, NotFoundError} from '../../api/jam/error';
import {JamParameters} from '../../model/jam-rest-params';
import {DefaultDownloadFormat, DownloadFormats} from '../../model/jam-types';
import {ApiBinaryResult} from '../../typings';
import {Store} from '../store/store';
import {DownloadService} from './download.service';

export class DownloadController {

	constructor(
		private store: Store,
		private downloadService: DownloadService
	) {
	}

	async downloadByPathParameter(req: JamRequest<{ pathParameter: string }>): Promise<ApiBinaryResult> {
		const {id, format} = await validatePathParameterIDFormat(req.query.pathParameter, DownloadFormats, DefaultDownloadFormat);
		return this.download({query: {id, format: format as JamParameters.DownloadFormatType}, user: req.user});
	}

	async download(req: JamRequest<JamParameters.Download>): Promise<ApiBinaryResult> {
		const id = req.query.id;
		if (!id || id.length === 0) {
			return Promise.reject(InvalidParamError());
		}
		const obj = await this.store.findInStores(id, this.store.downloadStores());
		if (obj) {
			const result = await this.downloadService.getObjDownload(obj, req.query.format, req.user);
			if (result) {
				return result;
			}
		}
		return Promise.reject(NotFoundError());
	}
}
