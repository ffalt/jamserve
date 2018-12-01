import {DBObjectType} from '../../types';
import {BaseStore, SearchQuery} from '../base/base.store';
import {QueryHelper} from '../base/base.store';
import {Track} from './track.model';
import {Database, DatabaseQuery} from '../../db/db.model';

export interface SearchQueryTrack extends SearchQuery {
	path?: string;
	inPath?: string;
	inPaths?: Array<string>;
	artist?: string;
	artistID?: string;
	parentID?: string;
	parentIDs?: Array<string>;
	mbTrackID?: string;
	mbTrackIDs?: Array<string>;
	rootID?: string;
	title?: string;
	album?: string;
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
		'artistID': 'artistID',
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
		q.startsWiths('path', query.inPaths);
		q.startsWith('path', query.inPath);
		q.term('tag.genre', query.genre);
		q.term('rootID', query.rootID);
		q.term('parentID', query.parentID);
		q.term('tag.mbTrackID', query.mbTrackID);
		q.terms('tag.mbTrackID', query.mbTrackIDs);
		q.term('tag.artist', query.artist);
		q.term('tag.title', query.title);
		q.match('tag.title', query.query);
		q.term('tag.album', query.album);
		q.term('artistID', query.artistID);
		q.range('tag.year', query.toYear, query.fromYear);
		q.range('stat.created', undefined, query.newerThan);
		return q.get(query, this.fieldMap);
	}

	// async genres(): Promise<Array<string>> {
	// 	return await this.group.distinct('tag.genre');
	// }

}
