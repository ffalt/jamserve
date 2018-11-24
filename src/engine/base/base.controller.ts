import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {BaseStore, SearchQuery} from './base.store';
import {DBObjectType} from '../../types';
import {InvalidParamError, NotFoundError} from '../../api/jam/error';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {IApiBinaryResult} from '../../typings';
import {JamRequest} from '../../api/jam/api';
import {formatState, formatStates} from '../state/state.format';
import {StateStore} from '../state/state.store';
import {StateService} from '../state/state.service';
import {ImageService} from '../image/image.service';
import {DownloadService} from '../download/download.service';
import {DBObject} from './base.model';
import {User} from '../user/user.model';

export abstract class BaseController<OBJREQUEST extends JamParameters.ID | INCLUDE, OBJLISTREQUEST extends JamParameters.IDs | INCLUDE, INCLUDE, JAMQUERY extends SearchQuery, S extends JamParameters.SearchQuery | INCLUDE, DBOBJECT extends DBObject, RESULTOBJ extends { id: string }> {

	protected constructor(
		protected objstore: BaseStore<DBOBJECT, SearchQuery>,
		protected type: DBObjectType,
		protected stateStore: StateStore,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
	}

	abstract async prepare(item: DBOBJECT, includes: INCLUDE, user: User): Promise<RESULTOBJ>;

	abstract translateQuery(query: S, user: User): JAMQUERY;

	async byID(id?: string): Promise<DBOBJECT> {
		if (!id) {
			return Promise.reject(InvalidParamError());
		}
		const obj = await this.objstore.byId(id);
		if (!obj) {
			return Promise.reject(NotFoundError());
		}
		return obj;
	}

	async byIDs(ids: Array<string>): Promise<Array<DBOBJECT>> {
		if (!ids) {
			return Promise.reject(InvalidParamError());
		}
		return await this.objstore.byIds(ids);
	}

	async prepareList(items: Array<DBOBJECT>, includes: INCLUDE, user: User): Promise<Array<RESULTOBJ>> {
		const result: Array<RESULTOBJ> = [];
		for (const item of items) {
			const r = await this.prepare(item, includes, user);
			result.push(r);
		}
		return result;
	}

	async prepareListByIDs(ids: Array<string>, includes: INCLUDE, user: User): Promise<Array<RESULTOBJ>> {
		const list = await this.objstore.byIds(ids);
		const result = await this.prepareList(list, includes, user);
		return result.sort((a, b) => {
			return ids.indexOf(a.id) - ids.indexOf(b.id);
		});
	}

	async id(req: JamRequest<OBJREQUEST>): Promise<RESULTOBJ> {
		const item = await this.byID((<JamParameters.ID>req.query).id);
		return this.prepare(item, <INCLUDE>req.query, req.user);
	}

	async ids(req: JamRequest<OBJLISTREQUEST>): Promise<Array<RESULTOBJ>> {
		const items = await this.byIDs((<JamParameters.IDs>req.query).ids);
		return this.prepareList(items, <INCLUDE>req.query, req.user);
	}

	async state(req: JamRequest<JamParameters.ID>): Promise<Jam.State> {
		const item = await this.byID(req.query.id);
		const state = await this.stateStore.findOrCreate(item.id, req.user.id, this.type);
		return formatState(state);
	}

	async states(req: JamRequest<JamParameters.IDs>): Promise<Jam.States> {
		const items = await this.byIDs(req.query.ids);
		const states = await this.stateStore.findOrCreateMulti(items.map(item => item.id), req.user.id, this.type);
		return formatStates(states);
	}

	async favUpdate(req: JamRequest<JamParameters.Fav>): Promise<Jam.State> {
		const item = await this.byID(req.query.id);
		const state = await this.stateService.fav(item.id, this.type, req.user.id, req.query.remove ? req.query.remove : false);
		return formatState(state);
	}

	async rateUpdate(req: JamRequest<JamParameters.Rate>): Promise<Jam.State> {
		const rating = req.query.rating || 0;
		if ((rating < 0) || (rating > 5)) {
			return Promise.reject(InvalidParamError());
		}
		const item = await this.byID(req.query.id);
		const state = await this.stateService.rate(item.id, this.type, req.user.id, rating);
		return formatState(state);
	}

	async search(req: JamRequest<S>): Promise<Array<RESULTOBJ>> {
		const list = await this.objstore.search(this.translateQuery(req.query, req.user));
		return this.prepareList(list, <INCLUDE>req.query, req.user);
	}

	async image(req: JamRequest<JamParameters.Image>): Promise<IApiBinaryResult> {
		const item = await this.byID(req.query.id);
		return await this.imageService.getObjImage(item, req.query.size, req.query.format);
	}

	async download(req: JamRequest<JamParameters.Download>): Promise<IApiBinaryResult> {
		const item = await this.byID(req.query.id);
		return await this.downloadService.getObjDownload(item, req.query.format, req.user);
	}

}
