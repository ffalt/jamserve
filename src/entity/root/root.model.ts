import { Base, Page } from '../base/base.model.js';
import { RootScanStrategy, UserRole } from '../../types/enums.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'Root Scan Info' })
export class RootUpdateStatus {
	@ObjectField({ description: 'Last Scan Timestamp' })
	lastScan!: number;

	@ObjectField({ nullable: true, description: 'Last Error (if any)' })
	error?: string;

	@ObjectField({ nullable: true, description: 'Is currently scanning?' })
	scanning?: boolean;
}

@ResultType({ description: 'Root Data' })
export class Root extends Base {
	@ObjectField({ description: 'Root Path', roles: [UserRole.admin] })
	path?: string;

	@ObjectField(() => RootUpdateStatus, { description: 'Root Update Status' })
	status!: RootUpdateStatus;

	@ObjectField(() => RootScanStrategy, { description: 'Root Scan Strategy', example: RootScanStrategy.auto })
	strategy!: RootScanStrategy;
}

@ResultType({ description: 'Roots Page' })
export class RootPage extends Page {
	@ObjectField(() => Root, { description: 'List of Roots' })
	items!: Array<Root>;
}
