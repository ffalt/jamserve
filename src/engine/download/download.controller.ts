import {JamRequest} from '../../api/jam/api';
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
		const pathParameter = (req.query.pathParameter || '').trim();
		if (!pathParameter || pathParameter.length === 0) {
			return Promise.reject(InvalidParamError('parameters are missing'));
		}
		const split = pathParameter.split('.');
		const id = split[0];
		const format = split[1] || DefaultDownloadFormat;
		if (!DownloadFormats.includes(format)) {
			return Promise.reject(InvalidParamError('parameter format is invalid'));
		}
		return this.download({query: {id, format: format as JamParameters.DownloadFormatType}, user: req.user});
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
