import {Database, DatabaseQuery} from '../../db/db.model';
import {DBObjectType} from '../../db/db.types';
import {JamParameters} from '../../model/jam-rest-params';
import {QueryHelper} from '../base/base.query.helper';
import {BaseStore, SearchQuery, SearchQuerySort} from '../base/base.store';
import {Artist} from './artist.model';

export interface SearchQueryArtist extends SearchQuery {
	name?: string;
	slug?: string;
	names?: Array<string>;
	id?: string;
	ids?: Array<string>;
	trackID?: string;
	trackIDs?: Array<string>;
	rootID?: string;
	mbArtistID?: string;
	albumID?: string;
	albumType?: string;
	albumTypes?: Array<string>;
	newerThan?: number;
	sorts?: Array<SearchQuerySort<JamParameters.ArtistSortField>>;
}

const fieldMap: { [name in JamParameters.ArtistSortField]: string } = {
	name: 'name',
	created: 'created'
};

export class ArtistStore extends BaseStore<Artist, SearchQueryArtist> {

	constructor(db: Database) {
		super(DBObjectType.artist, db);
	}

	protected transformQuery(query: SearchQueryArtist): DatabaseQuery {
		const q = new QueryHelper();
		q.terms('trackIDs', query.trackIDs);
		q.terms('name', query.names);
		q.term('rootIDs', query.rootID);
		q.term('albumIDs', query.albumID);
		q.term('trackIDs', query.trackID);
		q.term('name', query.name);
		q.term('albumTypes', query.albumType);
		q.terms('albumTypes', query.albumTypes);
		q.term('slug', query.slug);
		// q.term('genre', query.genre);
		q.term('mbArtistID', query.mbArtistID);
		// q.range('year', query.toYear, query.fromYear);
		q.range('created', undefined, query.newerThan);
		q.match('name', query.query);
		return q.get(query, fieldMap);
	}

}
