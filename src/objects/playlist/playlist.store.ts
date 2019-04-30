import {DBObjectType} from '../../db/db.types';
import {BaseStore, QueryHelper, SearchQuery, SearchQuerySort} from '../base/base.store';
import {Playlist} from './playlist.model';
import {Database, DatabaseQuery} from '../../db/db.model';
import {JamParameters} from '../../model/jam-rest-params';

export interface SearchQueryPlaylist extends SearchQuery {
	name?: string;
	userID?: string;
	isPublic?: boolean;
	trackID?: string;
	trackIDs?: Array<string>;
	newerThan?: number;
	sorts?: Array<SearchQuerySort<JamParameters.PlaylistSortField>>;
}

const fieldMap: { [name in JamParameters.PlaylistSortField]: string } = {
	'name': 'name',
	'created': 'created'
};

export class PlaylistStore extends BaseStore<Playlist, SearchQueryPlaylist> {

	constructor(db: Database) {
		super(DBObjectType.playlist, db);
	}

	protected transformQuery(query: SearchQueryPlaylist): DatabaseQuery {
		const q = new QueryHelper();
		q.term('trackIDs', query.trackID);
		q.terms('trackIDs', query.trackIDs);
		q.term('userID', query.userID);
		q.term('name', query.name);
		q.bool('isPublic', query.isPublic);
		q.match('name', query.query);
		q.range('created', undefined, query.newerThan);
		return q.get(query, fieldMap);
	}

}
