import {Database, DatabaseQuery} from '../../db/db.model';
import {DBObjectType} from '../../db/db.types';
import {JamParameters} from '../../model/jam-rest-params';
import {ensureTrailingPathSeparator} from '../../utils/fs-utils';
import {QueryHelper} from '../base/base.query.helper';
import {BaseStore, SearchQuery, SearchQuerySort} from '../base/base.store';
import {Folder} from './folder.model';

export interface SearchQueryFolder extends SearchQuery {
	rootID?: string;
	rootIDs?: Array<string>;
	parentID?: string;
	parentIDs?: Array<string>;
	path?: string;
	inPath?: string;
	inPaths?: Array<string>;
	artist?: string;
	artists?: Array<string>;
	title?: string;
	album?: string;
	genre?: string;
	level?: number;
	newerThan?: number;
	fromYear?: number;
	toYear?: number;
	mbAlbumID?: string;
	mbArtistID?: string;
	types?: Array<string>;
	sorts?: Array<SearchQuerySort<JamParameters.FolderSortField>>;
}

const sortFieldMap: { [name in JamParameters.FolderSortField]: string } = {
	artist: 'tag.artist',
	album: 'tag.album',
	genre: 'tag.genre',
	created: 'stat.created',
	parent: 'parentID',
	title: 'tag.title',
	year: 'tag.year'
};

export class FolderStore extends BaseStore<Folder, SearchQueryFolder> {

	constructor(db: Database) {
		super(DBObjectType.folder, db);
	}

	protected transformQuery(query: SearchQueryFolder): DatabaseQuery {
		const q = new QueryHelper();
		q.term('path', query.path);
		q.startsWiths('path', query.inPaths ? query.inPaths.map(ensureTrailingPathSeparator) : undefined);
		q.startsWith('path', query.inPath ? ensureTrailingPathSeparator(query.inPath) : undefined);
		q.term('tag.mbAlbumID', query.mbAlbumID);
		q.term('tag.mbArtistID', query.mbArtistID);
		q.term('tag.genre', query.genre);
		q.term('tag.title', query.title);
		q.term('tag.album', query.album);
		q.term('rootID', query.rootID);
		q.terms('rootID', query.rootIDs);
		q.term('parentID', query.parentID);
		q.terms('parentID', query.parentIDs);
		q.term('tag.level', query.level);
		q.term('tag.artist', query.artist);
		q.terms('tag.artist', query.artists);
		q.terms('tag.type', query.types);
		q.range('tag.year', query.toYear, query.fromYear);
		q.range('stat.created', undefined, query.newerThan);
		q.match('tag.title', query.query);
		return q.get(query, sortFieldMap);
	}

}
