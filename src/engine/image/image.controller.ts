import {JamRequest} from '../../api/jam/api';
import {InvalidParamError, NotFoundError} from '../../api/jam/error';
import {JamParameters} from '../../model/jam-rest-params';
import {ApiBinaryResult} from '../../typings';
import {SupportedWriteImageFormat} from '../../utils/filetype';
import {Store} from '../store/store';
import {ImageService} from './image.service';

export class ImageController {
	constructor(
		private store: Store,
		private imageService: ImageService
	) {
	}

	async image(req: JamRequest<JamParameters.Image>): Promise<ApiBinaryResult> {
		const id = req.query.id;
		if (!id || id.length === 0) {
			return Promise.reject(InvalidParamError('parameter id is missing'));
		}
		const obj = await this.store.findInAll(id);
		if (!obj) {
			return Promise.reject(NotFoundError());
		}
		const result = await this.imageService.getObjImage(obj, req.query.size, req.query.format);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return result;
	}

	public async imageByPathParameter(req: JamRequest<{ pathParameter: string }>): Promise<ApiBinaryResult> {
		const pathParameter = (req.query.pathParameter || '').trim();
		if (!pathParameter || pathParameter.length === 0) {
			return Promise.reject(InvalidParamError('parameters are missing'));
		}
		const split = pathParameter.split('.');
		const idsplit = split[0].split('-');
		const id = idsplit[0];
		if (!id || id.length === 0) {
			return Promise.reject(InvalidParamError());
		}
		const size = idsplit[1] !== undefined ? Number(idsplit[1]) : undefined;
		if (size !== undefined) {
			if (isNaN(size)) {
				return Promise.reject(InvalidParamError('parameter size is invalid'));
			}
			if (size < 16 || size > 1024) {
				return Promise.reject(InvalidParamError('parameter size not in allowed range'));
			}
		}
		const format = split[1];
		if (format !== undefined && !SupportedWriteImageFormat.includes(format)) {
			return Promise.reject(InvalidParamError('parameter format is invalid'));
		}
		return this.image({query: {id, size, format: format as JamParameters.ImageFormatType}, user: req.user});
	}
}
