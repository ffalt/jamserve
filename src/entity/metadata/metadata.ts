import { MetadataType } from '../../types/enums.js';
import { Entity, Property } from '../../modules/orm/index.js';
import { Base } from '../base/base.js';

@Entity()
export class Metadata extends Base {
	@Property(() => String)
	name!: string;

	@Property(() => MetadataType)
	dataType!: MetadataType;

	@Property(() => String)
	data!: string;
}
