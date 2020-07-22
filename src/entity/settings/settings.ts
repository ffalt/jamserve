import {Base} from '../base/base';
import {Entity, Property} from '../../modules/orm';

@Entity()
export class Settings extends Base {
	@Property(() => String)
	section!: string;

	@Property(() => String)
	version!: string;

	@Property(() => String)
	data!: string;
}
