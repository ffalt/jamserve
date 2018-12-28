import {DBObjectType} from '../../model/jam-types';
import {BaseStore, QueryHelper, SearchQuery} from '../base/base.store';
import {Bookmark} from './bookmark.model';
import {Database, DatabaseQuery} from '../../db/db.model';

export interface SearchQueryBookmark extends SearchQuery {
	userID?: string;
	destID?: string;
	destIDs?: Array<string>;
}

export class BookmarkStore extends BaseStore<Bookmark, SearchQueryBookmark> {

	constructor(db: Database) {
		super(DBObjectType.bookmark, db);
	}

	protected transformQuery(query: SearchQueryBookmark): DatabaseQuery {
		const q = new QueryHelper();
		q.term('userID', query.userID);
		q.term('destID', query.destID);
		q.terms('destID', query.destIDs);
		return q.get(query);
	}

}
