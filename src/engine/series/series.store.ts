import {Database, DatabaseQuery} from '../../db/db.model';
import {DBObjectType} from '../../db/db.types';
import {JamParameters} from '../../model/jam-rest-params';
import {QueryHelper} from '../base/base.query.helper';
import {BaseStore, SearchQuery, SearchQuerySort} from '../base/base.store';
import {Series} from './series.model';

export interface SearchQuerySeries extends SearchQuery {
	name?: string;
	rootID?: string;
	rootIDs?: Array<string>;
	artistID?: string;
	trackID?: string;
	trackIDs?: Array<string>;
	folderID?: string;
	folderIDs?: Array<string>;
	albumID?: string;
	albumIDs?: Array<string>;
	albumType?: string;
	albumTypes?: Array<string>;
	newerThan?: number;
	sorts?: Array<SearchQuerySort<JamParameters.SeriesSortField>>;
}

const fieldMap: { [name in JamParameters.SeriesSortField]: string } = {
	name: 'name',
	created: 'created'
};

export class SeriesStore extends BaseStore<Series, SearchQuerySeries> {

	constructor(db: Database) {
		super(DBObjectType.series, db);
	}

	protected transformQuery(query: SearchQuerySeries): DatabaseQuery {
		const q = new QueryHelper();
		q.term('rootIDs', query.rootID);
		q.terms('rootIDs', query.rootIDs);
		q.term('trackIDs', query.trackID);
		q.terms('trackIDs', query.trackIDs);
		q.term('folderIDs', query.folderID);
		q.terms('folderIDs', query.folderIDs);
		q.term('albumIDs', query.albumID);
		q.terms('albumIDs', query.albumIDs);
		q.term('albumTypes', query.albumType);
		q.terms('albumTypes', query.albumTypes);
		q.term('artistID', query.artistID);
		q.term('name', query.name);
		q.range('created', undefined, query.newerThan);
		q.match('name', query.query);
		return q.get(query, fieldMap);
	}

}
