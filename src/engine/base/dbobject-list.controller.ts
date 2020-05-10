import {JamRequest} from '../../api/jam/api';
import {JamParameters} from '../../model/jam-rest-params';
import {ApiBinaryResult} from '../../typings';
import {DownloadService} from '../download/download.service';
import {ImageService} from '../image/image.service';
import {StateService} from '../state/state.service';
import {User} from '../user/user.model';
import {DBObject} from './base.model';
import {SearchQuery} from './base.store';
import {BaseListService} from './dbobject-list.service';
import {BaseController} from './dbobject.controller';
import {ListResult} from './list-result';

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

	private async getList(listQuery: JamParameters.List, jamquery: SEARCHQUERY, includes: INCLUDE, user: User): Promise<ListResult<RESULTOBJ>> {
		const query = await this.translateQuery(jamquery, user);
		const list = await this.listService.getListIDs(listQuery, query, user);
		const result = await this.prepareListByIDs(list.items, includes, user);
		return {...list, items: result};
	}

	async list(req: JamRequest<LISTQUERY>): Promise<ListResult<RESULTOBJ>> {
		return this.getList(req.query as JamParameters.List, req.query as SEARCHQUERY, req.query as INCLUDE, req.user);
	}

	async download(req: JamRequest<JamParameters.Download>): Promise<ApiBinaryResult> {
		const item = await this.byID(req.query.id);
		return this.downloadService.getObjDownload(item, req.query.format, req.user);
	}
}
