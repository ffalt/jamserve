import {JamRequest} from '../../api/jam/api';
import {InvalidParamError} from '../../api/jam/error';
import {JamParameters} from '../../model/jam-rest-params';
import {ApiBinaryResult} from '../../typings';
import {paginate} from '../../utils/paginate';
import {randomItems} from '../../utils/random';
import {DownloadService} from '../download/download.service';
import {ImageService} from '../image/image.service';
import {StateService} from '../state/state.service';
import {User} from '../user/user.model';
import {DBObject} from './base.model';
import {SearchQuery} from './base.store';
import {BaseListService} from './dbobject-list.service';
import {BaseController} from './dbobject.controller';

export abstract class BaseListController<OBJREQUEST extends JamParameters.ID | INCLUDE,
	OBJLISTREQUEST extends JamParameters.IDs | INCLUDE,
	INCLUDE,
	JAMQUERY extends SearchQuery,
	SEARCHQUERY extends JamParameters.SearchQuery | INCLUDE,
	DBOBJECT extends DBObject,
	RESULTOBJ extends { id: string },
	LISTQUERY extends JamParameters.List | INCLUDE | SEARCHQUERY>
	extends BaseController<OBJREQUEST, OBJLISTREQUEST, INCLUDE, JAMQUERY, SEARCHQUERY, DBOBJECT, RESULTOBJ> {

	protected constructor(
		public listService: BaseListService<DBOBJECT, JAMQUERY>,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(listService, stateService, imageService, downloadService);
	}

	private async getList(listQuery: JamParameters.List, jamquery: SEARCHQUERY, includes: INCLUDE, user: User): Promise<Array<RESULTOBJ>> {
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

	async list(req: JamRequest<LISTQUERY>): Promise<Array<RESULTOBJ>> {
		return this.getList(req.query as JamParameters.List, req.query as SEARCHQUERY, req.query as INCLUDE, req.user);
	}

	async download(req: JamRequest<JamParameters.Download>): Promise<ApiBinaryResult> {
		const item = await this.byID(req.query.id);
		return this.downloadService.getObjDownload(item, req.query.format, req.user);
	}
}
