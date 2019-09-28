import {JamRequest} from '../../api/jam/api';
import {validatePathParameterIDSizeFormat} from '../../api/jam/check';
import {InvalidParamError, NotFoundError} from '../../api/jam/error';
import {JamParameters} from '../../model/jam-rest-params';
import {ApiBinaryResult} from '../../typings';
import {SupportedWriteImageFormat} from '../../utils/filetype';
import {DBObject} from '../base/base.model';
import {Store} from '../store/store';
import {ImageService} from './image.service';

export class ImageController {
	constructor(
		private store: Store,
		private imageService: ImageService
	) {
	}

	async image(req: JamRequest<JamParameters.Image>): Promise<ApiBinaryResult> {
		if (req.query.format !== undefined && !SupportedWriteImageFormat.includes(req.query.format)) {
			return Promise.reject(InvalidParamError());
		}
		const obj = await this.byID(req.query.id);
		const result = await this.imageService.getObjImage(obj, req.query.size, req.query.format);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return result;
	}

	public async imageByPathParameter(req: JamRequest<{ pathParameter: string }>): Promise<ApiBinaryResult> {
		const {id, size, format} = await validatePathParameterIDSizeFormat(req.query.pathParameter, SupportedWriteImageFormat, undefined, 16, 1024);
		return this.image({query: {id, size, format: format as JamParameters.ImageFormatType}, user: req.user});
	}

	private async byID(id: string): Promise<DBObject> {
		if (!id || id.length === 0) {
			return Promise.reject(InvalidParamError());
		}
		const obj = await this.store.findInAll(id);
		if (!obj) {
			return Promise.reject(NotFoundError());
		}
		return obj;
	}
}
