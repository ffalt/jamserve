import { Entity, ORM_INT, Property } from '../../modules/orm/index.js';
import { Base } from '../base/base.js';

@Entity()
export class Subsonic extends Base {
	@Property(() => String)
	jamID!: string;

	@Property(() => ORM_INT)
	subsonicID!: number;
}
