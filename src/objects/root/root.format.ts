import {Jam} from '../../model/jam-rest-data';
import {Root, RootStatus} from './root.model';

export function formatRoot(root: Root, rootState: RootStatus): Jam.Root {
	return {
		id: root.id,
		name: root.name,
		created: root.created,
		path: root.path,
		status: rootState
	};
}
