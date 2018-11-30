import {DBObjectType} from '../../types';
import {BaseStore, SearchQuery} from '../base/base.store';
import {QueryHelper} from '../base/base.store';
import {Episode} from './episode.model';
import {Database, DatabaseQuery} from '../../db/db.model';

export interface SearchQueryEpisode extends SearchQuery {
	podcastID?: string;
	podcastIDs?: Array<string>;
	title?: string;
	status?: string;
	newerThan?: number;
}

export class EpisodeStore extends BaseStore<Episode, SearchQueryEpisode> {
	fieldMap: { [name: string]: string } = {
		'podcastIDs': 'podcastID',
		'podcastID': 'podcastID',
		'status': 'status',
		'date': 'date',
		'title': 'title',
		'created': 'stat.created'
	};

	constructor(db: Database) {
		super(DBObjectType.episode, db);
	}

	protected transformQuery(query: SearchQueryEpisode): DatabaseQuery {
		const q = new QueryHelper();
		q.terms('podcastID', query.podcastIDs);
		q.term('podcastID', query.podcastID);
		q.term('status', query.status);
		q.term('title', query.title);
		q.range('date', undefined, query.newerThan);
		q.match('title', query.query);
		return q.get(query, this.fieldMap);
	}

}
