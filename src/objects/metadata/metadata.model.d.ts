import {DBObject} from '../base/base.model';
import {MetaDataType} from './metadata.types';

export interface MetaData extends DBObject {
	date: number;
	name: string;
	dataType: MetaDataType;
	data: any;
}
