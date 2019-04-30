import {DBObjectType} from '../../db/db.types';
import {BaseStore, QueryHelper, SearchQuery, SearchQuerySort} from '../base/base.store';
import {Episode} from './episode.model';
import {Database, DatabaseQuery} from '../../db/db.model';
import {JamParameters} from '../../model/jam-rest-params';

export interface SearchQueryEpisode extends SearchQuery {
	podcastID?: string;
	podcastIDs?: Array<string>;
	name?: string;
	status?: string;
	newerThan?: number;
	sorts?: Array<SearchQuerySort<JamParameters.EpisodeSortField>>;
}

const fieldMap: { [name in JamParameters.EpisodeSortField]: string } = {
	'podcast': 'podcastID',
	'date': 'date',
	'name': 'name',
	'created': 'created'
};

export class EpisodeStore extends BaseStore<Episode, SearchQueryEpisode> {

	constructor(db: Database) {
		super(DBObjectType.episode, db);
	}

	protected transformQuery(query: SearchQueryEpisode): DatabaseQuery {
		const q = new QueryHelper();
		q.terms('podcastID', query.podcastIDs);
		q.term('podcastID', query.podcastID);
		q.term('status', query.status);
		q.term('name', query.name);
		q.range('date', undefined, query.newerThan);
		q.match('name', query.query);
		return q.get(query, fieldMap);
	}

}
