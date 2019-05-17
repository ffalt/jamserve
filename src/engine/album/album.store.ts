import {Database, DatabaseQuery} from '../../db/db.model';
import {DBObjectType} from '../../db/db.types';
import {JamParameters} from '../../model/jam-rest-params';
import {QueryHelper} from '../base/base.query.helper';
import {BaseStore, SearchQuery, SearchQuerySort} from '../base/base.store';
import {Album} from './album.model';

export interface SearchQueryAlbum extends SearchQuery {
	name?: string;
	slug?: string;
	rootID?: string;
	rootIDs?: Array<string>;
	artist?: string;
	artistID?: string;
	trackID?: string;
	trackIDs?: Array<string>;
	albumType?: string;
	albumTypes?: Array<string>;
	mbAlbumID?: string;
	mbArtistID?: string;
	genre?: string;
	newerThan?: number;
	fromYear?: number;
	toYear?: number;
	sorts?: Array<SearchQuerySort<JamParameters.AlbumSortField>>;
}

const fieldMap: { [name in JamParameters.AlbumSortField]: string } = {
	name: 'name',
	artist: 'artist',
	genre: 'genre',
	year: 'year',
	created: 'created'
};

export class AlbumStore extends BaseStore<Album, SearchQueryAlbum> {

	constructor(db: Database) {
		super(DBObjectType.album, db);
	}

	protected transformQuery(query: SearchQueryAlbum): DatabaseQuery {
		const q = new QueryHelper();
		q.term('rootIDs', query.rootID);
		q.terms('rootIDs', query.rootIDs);
		q.term('trackIDs', query.trackID);
		q.terms('trackIDs', query.trackIDs);
		q.term('albumType', query.albumType);
		q.terms('albumType', query.albumTypes);
		q.term('artistID', query.artistID);
		q.term('genre', query.genre);
		q.term('mbAlbumID', query.mbAlbumID);
		q.term('mbArtistID', query.mbArtistID);
		q.term('artist', query.artist);
		q.term('name', query.name);
		q.term('slug', query.slug);
		q.range('year', query.toYear, query.fromYear);
		q.range('created', undefined, query.newerThan);
		q.match('name', query.query);
		return q.get(query, fieldMap);
	}

}
