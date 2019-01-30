import {Root} from './root.model';
import {DBObjectType} from '../../db/db.types';
import {mockPath} from '../../utils/testutils.spec';

export function mockRoot(): Root {
	return {
		id: '',
		type: DBObjectType.root,
		name: 'a name',
		path: mockPath('root name'),
		created: 1543495268
	};
}

export function mockRoot2(): Root {
	return {
		id: '',
		type: DBObjectType.root,
		name: 'second name',
		path: mockPath('secondroot name'),
		created: 1443495268
	};
}
