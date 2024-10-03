import { MetaDataType } from '../../types/enums.js';
import { Entity, Property } from '../../modules/orm/index.js';
import { Base } from '../base/base.js';

@Entity()
export class MetaData extends Base {
	@Property(() => String)
	name!: string;

	@Property(() => MetaDataType)
	dataType!: MetaDataType;

	@Property(() => String)
	data!: string;
}
