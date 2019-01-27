import {DBObject} from '../../objects/base/base.model';

export interface RuleResult {
	details?: string;
}

export interface Rule<T extends DBObject> {
	id: string;
	name: string;

	run(obj: T): Promise<RuleResult | undefined>;
}

