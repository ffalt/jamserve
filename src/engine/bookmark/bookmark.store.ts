import {Database, DatabaseQuery} from '../../db/db.model';
import {DBObjectType} from '../../db/db.types';
import {JamParameters} from '../../model/jam-rest-params';
import {QueryHelper} from '../base/base.query.helper';
import {BaseStore, SearchQuery, SearchQuerySort} from '../base/base.store';
import {Bookmark} from './bookmark.model';

export interface SearchQueryBookmark extends SearchQuery {
	userID?: string;
	destID?: string;
	destIDs?: Array<string>;
	sorts?: Array<SearchQuerySort<JamParameters.BookmarkSortField>>;
}

const fieldMap: { [name in JamParameters.BookmarkSortField]: string } = {
	created: 'created'
};

export class BookmarkStore extends BaseStore<Bookmark, SearchQueryBookmark> {

	constructor(db: Database) {
		super(DBObjectType.bookmark, db);
	}

	protected transformQuery(query: SearchQueryBookmark): DatabaseQuery {
		const q = new QueryHelper();
		q.term('userID', query.userID);
		q.term('destID', query.destID);
		q.terms('destID', query.destIDs);
		return q.get(query, fieldMap);
	}

}
