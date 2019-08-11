import {JamRequest} from '../../api/jam/api';
import {InvalidParamError, NotFoundError} from '../../api/jam/error';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {ApiBinaryResult} from '../../typings';
import {DownloadService} from '../download/download.service';
import {ImageService} from '../image/image.service';
import {formatState, formatStates} from '../state/state.format';
import {StateService} from '../state/state.service';
import {User} from '../user/user.model';
import {DBObject} from './base.model';
import {BaseStoreService} from './base.service';
import {SearchQuery} from './base.store';
import {ListResult} from './list-result';

export abstract class BaseController<OBJREQUEST extends JamParameters.ID | INCLUDE,
	OBJLISTREQUEST extends JamParameters.IDs | INCLUDE,
	INCLUDE,
	JAMQUERY extends SearchQuery,
	SEARCHQUERY extends JamParameters.SearchQuery | INCLUDE,
	DBOBJECT extends DBObject,
	RESULTOBJ extends { id: string }> {

	protected constructor(
		public service: BaseStoreService<DBOBJECT, JAMQUERY>,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
	}

	abstract async prepare(item: DBOBJECT, includes: INCLUDE, user: User): Promise<RESULTOBJ>;

	abstract translateQuery(query: SEARCHQUERY, user: User): Promise<JAMQUERY>;

	abstract defaultSort(items: Array<DBOBJECT>): Array<DBOBJECT>;

	async byID(id?: string): Promise<DBOBJECT> {
		if (!id) {
			return Promise.reject(InvalidParamError());
		}
		const obj = await this.service.store.byId(id);
		if (!obj) {
			return Promise.reject(NotFoundError());
		}
		return obj;
	}

	async byIDs(ids: Array<string>): Promise<Array<DBOBJECT>> {
		if (!ids) {
			return Promise.reject(InvalidParamError());
		}
		return this.service.store.byIds(ids);
	}

	async prepareList(list: Array<DBOBJECT>, includes: INCLUDE, user: User, sort?: (a: DBOBJECT, b: DBOBJECT) => number): Promise<Array<RESULTOBJ>> {
		const items: Array<RESULTOBJ> = [];
		if (sort) {
			list = list.sort(sort);
		}
		for (const item of list) {
			const r = await this.prepare(item, includes, user);
			items.push(r);
		}
		return items;
	}

	async prepareListByIDs(ids: Array<string>, includes: INCLUDE, user: User, sort?: (a: DBOBJECT, b: DBOBJECT) => number): Promise<Array<RESULTOBJ>> {
		const list = await this.service.store.byIds(ids);
		let result = await this.prepareList(list, includes, user, sort);
		if (!sort) {
			result = result.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
		}
		return result;
	}

	async prepareByID(id: string, includes: INCLUDE, user: User): Promise<RESULTOBJ> {
		const o = await this.byID(id);
		return this.prepare(o, includes, user);
	}

	async prepareByQuery(query: JAMQUERY, includes: INCLUDE, user: User): Promise<ListResult<RESULTOBJ>> {
		const list = await this.service.store.search(query);
		list.items = this.defaultSort(list.items);
		return {
			total: list.total,
			amount: list.amount,
			offset: list.offset,
			items: await this.prepareList(list.items, includes, user)
		};
	}

	async id(req: JamRequest<OBJREQUEST>): Promise<RESULTOBJ> {
		return this.prepareByID((req.query as JamParameters.ID).id, req.query as INCLUDE, req.user);
	}

	async ids(req: JamRequest<OBJLISTREQUEST>): Promise<Array<RESULTOBJ>> {
		const items = await this.byIDs((req.query as JamParameters.IDs).ids);
		return this.prepareList(items, req.query as INCLUDE, req.user);
	}

	async state(req: JamRequest<JamParameters.ID>): Promise<Jam.State> {
		const item = await this.byID(req.query.id);
		const state = await this.stateService.findOrCreate(item.id, req.user.id, this.service.store.type);
		return formatState(state);
	}

	async states(req: JamRequest<JamParameters.IDs>): Promise<Jam.States> {
		const list = await this.byIDs(req.query.ids);
		const states = await this.stateService.findOrCreateMany(list.map(item => item.id), req.user.id, this.service.store.type);
		return formatStates(states);
	}

	async favUpdate(req: JamRequest<JamParameters.Fav>): Promise<Jam.State> {
		const item = await this.byID(req.query.id);
		const state = await this.stateService.fav(item.id, this.service.store.type, req.user.id, req.query.remove ? req.query.remove : false);
		return formatState(state);
	}

	async rateUpdate(req: JamRequest<JamParameters.Rate>): Promise<Jam.State> {
		const rating = req.query.rating || 0;
		if ((rating < 0) || (rating > 5)) {
			return Promise.reject(InvalidParamError());
		}
		const item = await this.byID(req.query.id);
		const state = await this.stateService.rate(item.id, this.service.store.type, req.user.id, rating);
		return formatState(state);
	}

	async search(req: JamRequest<SEARCHQUERY>): Promise<ListResult<RESULTOBJ>> {
		const list = await this.service.store.search(await this.translateQuery(req.query, req.user));
		return {
			total: list.total,
			amount: list.amount,
			offset: list.offset,
			items: await this.prepareList(list.items, req.query as INCLUDE, req.user)
		};
	}

	async image(req: JamRequest<JamParameters.Image>): Promise<ApiBinaryResult> {
		const item = await this.byID(req.query.id);
		return this.imageService.getObjImage(item, req.query.size, req.query.format);
	}

}
