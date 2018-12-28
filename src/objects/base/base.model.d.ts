import {DBObjectType} from '../../model/jam-types';

export interface DBObject {
	id: string;
	type: DBObjectType;
}
