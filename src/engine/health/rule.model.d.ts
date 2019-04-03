import {DBObject} from '../../objects/base/base.model';
import {Folder} from '../../objects/folder/folder.model';
import {Root} from '../../objects/root/root.model';

export interface RuleResult {
	details?: string;
}

export interface Rule<T extends DBObject> {
	id: string;
	name: string;

	run(obj: T, parents: Array<Folder>, root: Root): Promise<RuleResult | undefined>;
}

