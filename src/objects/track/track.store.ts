import {DBObjectType} from '../../db/db.types';
import {BaseStore, QueryHelper, SearchQuery} from '../base/base.store';
import {Track} from './track.model';
import {Database, DatabaseQuery} from '../../db/db.model';
import {ensureTrailingPathSeparator} from '../../utils/fs-utils';

export interface SearchQueryTrack extends SearchQuery {
	path?: string;
	inPath?: string;
	inPaths?: Array<string>;
	artist?: string;
	artistID?: string;
	artistIDs?: Array<string>;
	albumArtistID?: string;
	albumArtistIDs?: Array<string>;
	parentID?: string;
	parentIDs?: Array<string>;
	mbTrackID?: string;
	mbTrackIDs?: Array<string>;
	rootID?: string;
	rootIDs?: Array<string>;
	title?: string;
	album?: string;
	albumID?: string;
	albumIDs?: Array<string>;
	genre?: string;
	newerThan?: number;
	fromYear?: number;
	toYear?: number;
}

export class TrackStore extends BaseStore<Track, SearchQueryTrack> {
	fieldMap: { [name: string]: string } = {
		'path': 'path',
		'parentID': 'parentID',
		'parentIDs': 'parentID',
		'rootID': 'rootID',
		'rootIDs': 'rootID',
		'artistID': 'artistID',
		'artistIDs': 'artistID',
		'albumArtistID': 'albumArtistID',
		'albumArtistIDs': 'albumArtistID',
		'albumID': 'albumID',
		'albumIDs': 'albumID',
		'artist': 'tag.artist',
		'mbTrackID': 'tag.mbTrackID',
		'title': 'tag.title',
		'album': 'tag.album',
		'year': 'tag.year',
		'genre': 'tag.genre',
		'created': 'stat.created'
	};

	constructor(db: Database) {
		super(DBObjectType.track, db);
	}

	protected transformQuery(query: SearchQueryTrack): DatabaseQuery {
		const q = new QueryHelper();
		q.terms('parentID', query.parentIDs);
		q.term('path', query.path);
		q.startsWiths('path', query.inPaths ? query.inPaths.map(s => ensureTrailingPathSeparator(s)) : undefined);
		q.startsWith('path', query.inPath ? ensureTrailingPathSeparator(query.inPath) : undefined);
		q.term('tag.genre', query.genre);
		q.term('rootID', query.rootID);
		q.terms('rootID', query.rootIDs);
		q.term('parentID', query.parentID);
		q.term('tag.mbTrackID', query.mbTrackID);
		q.terms('tag.mbTrackID', query.mbTrackIDs);
		q.term('tag.artist', query.artist);
		q.term('tag.title', query.title);
		q.match('tag.title', query.query);
		q.term('tag.album', query.album);
		q.term('artistID', query.artistID);
		q.terms('artistID', query.artistIDs);
		q.term('albumArtistID', query.albumArtistID);
		q.terms('albumArtistID', query.albumArtistIDs);
		q.term('albumID', query.albumID);
		q.terms('albumID', query.albumIDs);
		q.range('tag.year', query.toYear, query.fromYear);
		q.range('stat.created', undefined, query.newerThan);
		return q.get(query, this.fieldMap);
	}

	// async genres(): Promise<Array<string>> {
	// 	return await this.group.distinct('tag.genre');
	// }

}
