import {Root} from './root.model';
import {DBObjectType} from '../../model/jam-types';

export function mockRoot(): Root {
	return {
		id: '',
		type: DBObjectType.root,
		name: 'a name',
		path: '/var/media/root name',
		created: 1543495268
	};
}

export function mockRoot2(): Root {
	return {
		id: '',
		type: DBObjectType.root,
		name: 'second name',
		path: '/var/media/second root name',
		created: 1443495268
	};
}
