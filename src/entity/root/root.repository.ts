import {QueryOrder, Repository} from 'mikro-orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {Root} from './root';
import {QBFilterQuery} from 'mikro-orm/dist/typings';
import {QHelper} from '../base/base';
import {DefaultOrderArgs} from '../base/base.args';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {User} from '../user/user';
import {RootFilterArgs, RootOrderArgs} from './root.args';

@Repository(Root)
export class RootRepository extends BaseRepository<Root, RootFilterArgs, RootOrderArgs> {
	objType = DBObjectType.root;
	indexProperty = 'name';

	public applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: 	DefaultOrderArgs): void {
		this.applyDefaultOrderByEntry(result, direction, order?.orderBy);
	}

	async buildFilter(filter?: RootFilterArgs, user?: User): Promise<QBFilterQuery<Root>> {
		return filter ? QHelper.buildQuery<Root>(
			[
				{id: filter.ids},
				{name: QHelper.like(filter.query)},
				{name: QHelper.eq(filter.name)},
				{createdAt: QHelper.gte(filter.since)},
				{strategy: QHelper.inOrEqual(filter.strategies)},
				{tracks: QHelper.foreignKeys(filter.trackIDs)},
				{folders: QHelper.foreignKeys(filter.folderIDs)},
				{albums: QHelper.foreignKeys(filter.albumIDs)},
				{artists: QHelper.foreignKeys(filter.artistIDs)},
				{series: QHelper.foreignKeys(filter.seriesIDs)}
			]
		) : {};
	}

}
