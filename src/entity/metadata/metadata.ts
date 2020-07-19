import {MetaDataType} from '../../types/enums';
import {Entity, Enum, Property} from 'mikro-orm';
import {Base} from '../base/base';

@Entity()
export class MetaData extends Base {
	@Property()
	name!: string;

	@Enum(() => MetaDataType)
	dataType!: MetaDataType;

	@Property({type: 'json'})
	data!: any;
}
