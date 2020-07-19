import {Base} from '../base/base';
import {Entity, Property} from 'mikro-orm';
import {OrmJsonType} from '../../modules/engine/services/orm.types';

@Entity()
export class Settings extends Base {
	@Property()
	section!: string;

	@Property()
	version!: string;

	@Property({type: OrmJsonType})
	data!: any;
}
