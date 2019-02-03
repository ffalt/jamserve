import {Root} from './root.model';
import {DBObjectType} from '../../db/db.types';
import {mockPath} from '../../utils/testutils.spec';
import {RootScanStrategy} from '../../model/jam-types';

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
