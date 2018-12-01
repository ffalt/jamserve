import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {InvalidParamError} from '../../api/jam/error';
import {randomItems} from '../../utils/random';
import {paginate} from '../../utils/paginate';
import {BaseController} from './base.controller';
import {BaseStore, SearchQuery} from './base.store';
import {DBObjectType} from '../../types';
import {StateStore} from '../state/state.store';
import {StateService} from '../state/state.service';
import {ImageService} from '../../engine/image/image.service';
import {DownloadService} from '../../engine/download/download.service';
import {ListService} from '../../engine/list/list.service';
import {DBObject} from './base.model';
import {User} from '../user/user.model';

export abstract class BaseListController<OBJREQUEST extends JamParameters.ID | INCLUDE, OBJLISTREQUEST extends JamParameters.IDs | INCLUDE, INCLUDE, JAMQUERY extends SearchQuery, S extends JamParameters.SearchQuery | INCLUDE, DBOBJECT extends DBObject, RESULTOBJ extends { id: string }> extends BaseController<OBJREQUEST, OBJLISTREQUEST, INCLUDE, JAMQUERY, S, DBOBJECT, RESULTOBJ> {

	protected constructor(
		protected objstore: BaseStore<DBOBJECT, SearchQuery>,
		protected type: DBObjectType,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService,
		protected listService: ListService
	) {
		super(objstore, type, stateService, imageService, downloadService);
	}

	async getList(listQuery: JamParameters.List, jamquery: S, includes: INCLUDE, user: User): Promise<Array<RESULTOBJ>> {
		const query = this.translateQuery(jamquery, user);
		let ids: Array<string> = [];
		switch (listQuery.list) {
			case 'random':
				ids = await this.objstore.searchIDs(Object.assign(query, {amount: -1, offset: 0}));
				ids = randomItems<string>(ids, listQuery.amount || 20);
				break;
			case 'highest':
				ids = await this.listService.getFilteredListHighestRated(this.type, query, user, this.objstore);
				ids = paginate(ids, listQuery.amount, listQuery.offset);
				break;
			case 'avghighest':
				ids = await this.listService.getFilteredListAvgHighest(this.type, query, user, this.objstore);
				ids = paginate(ids, listQuery.amount, listQuery.offset);
				break;
			case 'frequent':
				ids = await this.listService.getFilteredListFrequentlyPlayed(this.type, query, user, this.objstore);
				ids = paginate(ids, listQuery.amount, listQuery.offset);
				break;
			case 'faved':
				ids = await this.listService.getFilteredListFaved(this.type, query, user, this.objstore);
				ids = paginate(ids, listQuery.amount, listQuery.offset);
				break;
			case 'recent':
				ids = await this.listService.getFilteredListRecentlyPlayed(this.type, query, user, this.objstore);
				ids = paginate(ids, listQuery.amount, listQuery.offset);
				break;
			default:
				return Promise.reject(InvalidParamError('Unknown List Type'));
		}
		return this.prepareListByIDs(ids, includes, user);
	}

}
