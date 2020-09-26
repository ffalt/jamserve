import {InRequestScope} from 'typescript-ioc';
import {Orm} from '../../modules/engine/services/orm.service';
import {BaseTransformService} from '../base/base.transform';
import {Radio as ORMRadio} from './radio';
import {IncludesRadioArgs} from './radio.args';
import {User} from '../user/user';
import {Radio, RadioIndex} from './radio.model';
import {DBObjectType} from '../../types/enums';
import {IndexResult, IndexResultGroup} from '../base/base';

@InRequestScope
export class RadioTransformService extends BaseTransformService {

	async radio(orm: Orm, o: ORMRadio, radioArgs: IncludesRadioArgs, user: User): Promise<Radio> {
		return {
			id: o.id,
			name: o.name,
			url: o.url,
			homepage: o.homepage,
			created: o.createdAt.valueOf(),
			changed: o.updatedAt.valueOf(),
			state: radioArgs.radioState ? await this.state(orm, o.id, DBObjectType.radio, user.id) : undefined
		};
	}

	async radioIndex(orm: Orm, result: IndexResult<IndexResultGroup<ORMRadio>>): Promise<RadioIndex> {
		return this.index(result, async (item) => {
			return {
				id: item.id,
				name: item.name,
				url: item.url
			};
		});
	}

}
