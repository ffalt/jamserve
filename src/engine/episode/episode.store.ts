import {DBObjectType} from '../../types';
import {BaseStore, SearchQuery} from '../base/base.store';
import {QueryHelper} from '../base/base.store';
import {Episode} from './episode.model';
import {Database, DatabaseQuery} from '../../db/db.model';

export interface SearchQueryPodcastEpisode extends SearchQuery {
	podcastID?: string;
	podcastIDs?: Array<string>;
	title?: string;
	status?: string;
}

export class EpisodeStore extends BaseStore<Episode, SearchQueryPodcastEpisode> {
	fieldMap: { [name: string]: string } = {
		'podcastIDs': 'podcastID',
		'podcastID': 'podcastID',
		'status': 'status',
		'date': 'date',
		'title': 'tag.title',
		'created': 'stat.created'
	};

	constructor(db: Database) {
		super(DBObjectType.episode, db);
	}

	protected transformQuery(query: SearchQueryPodcastEpisode): DatabaseQuery {
		const q = new QueryHelper();
		q.terms('podcastID', query.podcastIDs);
		q.term('podcastID', query.podcastID);
		q.term('status', query.status);
		q.term('tag.title', query.title);
		q.match('tag.title', query.query);
		return q.get(query, this.fieldMap);
	}

}
