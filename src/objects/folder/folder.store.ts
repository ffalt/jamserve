import {DBObjectType} from '../../db/db.types';
import {BaseStore, QueryHelper, SearchQuery} from '../base/base.store';
import {Folder} from './folder.model';
import {Database, DatabaseQuery} from '../../db/db.model';
import {ensureTrailingPathSeparator} from '../../utils/fs-utils';

export interface SearchQueryFolder extends SearchQuery {
	rootID?: string;
	parentID?: string;
	path?: string;
	inPath?: string;
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
}

export class FolderStore extends BaseStore<Folder, SearchQueryFolder> {
	fieldMap: { [name: string]: string } = {
		'parentID': 'parentID',
		'rootID': 'rootID',
		'artist': 'tag.artist',
		'title': 'tag.title',
		'type': 'tag.type',
		'year': 'tag.year',
		'created': 'stat.created',
		'album': 'tag.album',
		'path': 'path',
		'level': 'tag.level',
		'genre': 'tag.genre'
	};

	constructor(db: Database) {
		super(DBObjectType.folder, db);
	}

	protected transformQuery(query: SearchQueryFolder): DatabaseQuery {
		const q = new QueryHelper();
		q.term('path', query.path);
		q.startsWith('path', query.inPath ? ensureTrailingPathSeparator(query.inPath) : undefined);
		q.term('tag.mbAlbumID', query.mbAlbumID);
		q.term('tag.mbArtistID', query.mbArtistID);
		q.term('tag.genre', query.genre);
		q.term('tag.title', query.title);
		q.term('tag.album', query.album);
		q.term('rootID', query.rootID);
		q.term('parentID', query.parentID);
		q.term('tag.level', query.level);
		q.term('tag.artist', query.artist);
		q.terms('tag.artist', query.artists);
		q.terms('tag.type', query.types);
		q.range('tag.year', query.toYear, query.fromYear);
		q.range('stat.created', undefined, query.newerThan);
		q.match('tag.title', query.query);
		return q.get(query, this.fieldMap);
	}

}
