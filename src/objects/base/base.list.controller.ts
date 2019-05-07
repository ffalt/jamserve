import {InvalidParamError} from '../../api/jam/error';
import {DownloadService} from '../../engine/download/download.service';
import {ImageService} from '../../engine/image/image.service';
import {JamParameters} from '../../model/jam-rest-params';
import {paginate} from '../../utils/paginate';
import {randomItems} from '../../utils/random';
import {StateService} from '../state/state.service';
import {User} from '../user/user.model';
import {BaseController} from './base.controller';
import {BaseListService} from './base.list.service';
import {DBObject} from './base.model';
import {SearchQuery} from './base.store';

export abstract class BaseListController<OBJREQUEST extends JamParameters.ID | INCLUDE, OBJLISTREQUEST extends JamParameters.IDs | INCLUDE, INCLUDE, JAMQUERY extends SearchQuery, S extends JamParameters.SearchQuery | INCLUDE, DBOBJECT extends DBObject, RESULTOBJ extends { id: string }> extends BaseController<OBJREQUEST, OBJLISTREQUEST, INCLUDE, JAMQUERY, S, DBOBJECT, RESULTOBJ> {

	protected constructor(
		protected listService: BaseListService<DBOBJECT, JAMQUERY>,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(listService, stateService, imageService, downloadService);
	}

	async getList(listQuery: JamParameters.List, jamquery: S, includes: INCLUDE, user: User): Promise<Array<RESULTOBJ>> {
		const query = await this.translateQuery(jamquery, user);
		let ids: Array<string> = [];
		switch (listQuery.list) {
			case 'random':
				ids = await this.listService.store.searchIDs({...query, amount: -1, offset: 0});
				ids = randomItems<string>(ids, listQuery.amount || 20);
				break;
			case 'highest':
				ids = await this.listService.getHighestRatedIDs(query, user);
				ids = paginate(ids, listQuery.amount, listQuery.offset);
				break;
			case 'avghighest':
				ids = await this.listService.getAvgHighestIDs(query);
				ids = paginate(ids, listQuery.amount, listQuery.offset);
				break;
			case 'frequent':
				ids = await this.listService.getFrequentlyPlayedIDs(query, user);
				ids = paginate(ids, listQuery.amount, listQuery.offset);
				break;
			case 'faved':
				ids = await this.listService.getFavedIDs(query, user);
				ids = paginate(ids, listQuery.amount, listQuery.offset);
				break;
			case 'recent':
				ids = await this.listService.getRecentlyPlayedIDs(query, user);
				ids = paginate(ids, listQuery.amount, listQuery.offset);
				break;
			default:
				return Promise.reject(InvalidParamError('Unknown List Type'));
		}
		return this.prepareListByIDs(ids, includes, user);
	}

}
