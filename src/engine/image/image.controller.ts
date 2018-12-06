import {JamRequest} from '../../api/jam/api';
import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {IApiBinaryResult} from '../../typings';
import {InvalidParamError, NotFoundError} from '../../api/jam/error';
import {ImageService} from './image.service';
import {Store} from '../store/store';

export class ImageController {
	constructor(
		private store: Store,
		private imageService: ImageService
	) {
	}

	async image(req: JamRequest<JamParameters.Image>): Promise<IApiBinaryResult> {
		const id = req.query.id;
		if (!id || id.length === 0) {
			return Promise.reject(InvalidParamError());
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
}
