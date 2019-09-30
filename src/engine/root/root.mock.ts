import {DBObjectType} from '../../db/db.types';
import {RootScanStrategy} from '../../model/jam-types';
import {mockPath} from '../../utils/testutils.spec';
import {Root} from './root.model';

export function mockRoot(): Root {
	return {
		id: '',
		type: DBObjectType.root,
		name: 'a name',
		path: mockPath('root name'),
		created: 1543495268,
		strategy: RootScanStrategy.auto
	};
}

export function mockRoot2(): Root {
	return {
		id: '',
		type: DBObjectType.root,
		name: 'second name',
		path: mockPath('secondroot name'),
		created: 1443495268,
		strategy: RootScanStrategy.auto
	};
}
