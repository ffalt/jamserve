import {DBObjectType} from '../../db/db.types';

export interface DBObject {
	id: string;
	type: DBObjectType;
}
