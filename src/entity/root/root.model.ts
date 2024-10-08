import { Base, Page } from '../base/base.model.js';
import { RootScanStrategy, UserRole } from '../../types/enums.js';
import { ResultType } from '../../modules/rest/decorators/ResultType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';

@ResultType({ description: 'Root Scan Info' })
export class RootUpdateStatus {
	@ObjField({ description: 'Last Scan Timestamp' })
	lastScan!: number;

	@ObjField({ nullable: true, description: 'Last Error (if any)' })
	error?: string;

	@ObjField({ nullable: true, description: 'Is currently scanning?' })
	scanning?: boolean;
}

@ResultType({ description: 'Root Data' })
export class Root extends Base {
	@ObjField({ description: 'Root Path', roles: [UserRole.admin] })
	path?: string;

	@ObjField(() => RootUpdateStatus, { description: 'Root Update Status' })
	status!: RootUpdateStatus;

	@ObjField(() => RootScanStrategy, { description: 'Root Scan Strategy', example: RootScanStrategy.auto })
	strategy!: RootScanStrategy;
}

@ResultType({ description: 'Roots Page' })
export class RootPage extends Page {
	@ObjField(() => Root, { description: 'List of Roots' })
	items!: Array<Root>;
}
