import {MetaDataType} from '../../types/enums';
import {Entity, Property} from '../../modules/orm';
import {Base} from '../base/base';

@Entity()
export class MetaData extends Base {
	@Property(() => String)
	name!: string;

	@Property(() => MetaDataType)
	dataType!: MetaDataType;

	@Property(() => String)
	data!: string;
}
