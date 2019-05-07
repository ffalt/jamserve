import {JamRequest} from '../../api/jam/api';
import {InvalidParamError, NotFoundError} from '../../api/jam/error';
import {JamParameters} from '../../model/jam-rest-params';
import {ApiBinaryResult} from '../../typings';
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
