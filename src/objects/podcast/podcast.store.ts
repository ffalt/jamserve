import {DBObjectType} from '../../db/db.types';
import {BaseStore, QueryHelper, SearchQuery, SearchQuerySort} from '../base/base.store';
import {Podcast} from './podcast.model';
import {Database, DatabaseQuery} from '../../db/db.model';
import {JamParameters} from '../../model/jam-rest-params';

export interface SearchQueryPodcast extends SearchQuery {
	url?: string;
	title?: string;
	status?: string;
	newerThan?: number;
	sorts?: Array<SearchQuerySort<JamParameters.PodcastSortField>>;
}

const fieldMap: { [name in JamParameters.PodcastSortField]: string } = {
	'title': 'tag.title',
	'created': 'created'
};

export class PodcastStore extends BaseStore<Podcast, SearchQueryPodcast> {

	constructor(db: Database) {
		super(DBObjectType.podcast, db);
	}

	protected transformQuery(query: SearchQueryPodcast): DatabaseQuery {
		const q = new QueryHelper();
		q.term('url', query.url);
		q.term('tag.title', query.title);
		q.term('status', query.status);
		q.range('created', undefined, query.newerThan);
		q.match('tag.title', query.query);
		return q.get(query, fieldMap);
	}

}
