import { Base } from '../base/base.js';
import { Entity, Property } from '../../modules/orm/index.js';

@Entity()
export class Settings extends Base {
	@Property(() => String)
	section!: string;

	@Property(() => String)
	version!: string;

	@Property(() => String)
	data!: string;
}
