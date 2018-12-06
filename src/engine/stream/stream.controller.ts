import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {IApiBinaryResult} from '../../typings';
import {InvalidParamError, NotFoundError} from '../../api/jam/error';
import {JamRequest} from '../../api/jam/api';
import {StreamService} from './stream.service';
import {Store} from '../store/store';

export class StreamController {

	constructor(private streamService: StreamService, private store: Store) {

	}

	async stream(req: JamRequest<JamParameters.PathStream>): Promise<IApiBinaryResult> {
		const id = req.query.id;
		if (!id || id.length === 0) {
			return Promise.reject(InvalidParamError());
		}
		const obj = await this.store.findInAll(id);
		if (!obj) {
			return Promise.reject(NotFoundError());
		}
		const result = await this.streamService.getObjStream(obj, req.query.format, undefined, req.user);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return result;
	}
}
