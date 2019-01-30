import {DBObjectType} from '../../db/db.types';
import {BaseStore, QueryHelper, SearchQuery} from '../base/base.store';
import {Podcast} from './podcast.model';
import {Database, DatabaseQuery} from '../../db/db.model';

export interface SearchQueryPodcast extends SearchQuery {
	url?: string;
	title?: string;
	status?: string;
	newerThan?: number;
}

export class PodcastStore extends BaseStore<Podcast, SearchQueryPodcast> {
	fieldMap: { [name: string]: string } = {
		'url': 'url',
		'title': 'tag.title',
		'status': 'status',
		'query': 'tag.title',
		'created': 'created'
	};

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
		return q.get(query, this.fieldMap);
	}

}
