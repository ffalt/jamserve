import {DBObjectType} from '../../types';
import {BaseStore, SearchQuery} from '../base/base.store';
import {QueryHelper} from '../base/base.store';
import {State, States} from './state.model';
import {Database, DatabaseQuery} from '../../db/db.model';

export interface SearchQueryState extends SearchQuery {
	destID?: string;
	destIDs?: Array<string>;
	userID?: string;
	type?: DBObjectType;
	isPlayed?: boolean;
	isFaved?: boolean;
	minRating?: number;
	maxRating?: number;
}

export class StateStore extends BaseStore<State, SearchQueryState> {

	constructor(db: Database) {
		super(DBObjectType.state, db);
	}

	protected transformQuery(query: SearchQueryState): DatabaseQuery {
		const q = new QueryHelper();
		q.term('userID', query.userID);
		q.term('destID', query.destID);
		q.terms('destID', query.destIDs);
		q.term('destType', query.type);
		q.notNull('faved', query.isFaved);
		q.range('rating', query.maxRating, query.minRating);
		q.range('played', undefined, query.isPlayed ? 1 : undefined);
		return q.get(query);
	}

	private emptyState(destID: string, destType: DBObjectType, userID: string): State {
		return {
			id: '',
			type: DBObjectType.state,
			destID,
			destType,
			played: 0,
			lastplayed: 0,
			faved: undefined,
			rated: 0,
			userID
		};
	}

	async findOrCreate(destID: string, userID: string, type: DBObjectType): Promise<State> {
		const state = await this.searchOne({userID, destID, type});
		return state || this.emptyState(destID, type, userID);
	}

	async findOrCreateMulti(destIDs: Array<string>, userID: string, type: DBObjectType): Promise<States> {
		if (!destIDs || destIDs.length === 0) {
			return {};
		}
		const list = await this.search({userID, type, destIDs});
		const result: { [id: string]: State } = {};
		list.forEach((state) => {
			result[state.destID] = state;
		});
		destIDs.forEach((id) => {
			if (!result[id]) {
				result[id] = this.emptyState(id, type, userID);
			}
		});
		return result;
	}

}
