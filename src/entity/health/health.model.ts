import {ObjField, ResultType} from '../../modules/rest/index.js';
import {FolderHealthID, TrackHealthID} from '../../types/enums.js';

@ResultType({description: 'Health Hint Detail'})
export class HealthHintDetail {
	@ObjField({description: 'Hint Description'})
	reason!: string;
	@ObjField({nullable: true, description: 'Expected Value'})
	expected?: string;
	@ObjField({nullable: true, description: 'Actual Value'})
	actual?: string;
}

@ResultType({description: 'Health Hint'})
export class HealthHint {
	@ObjField({description: 'Health Hint Name'})
	name!: string;
	@ObjField(() => [HealthHintDetail], {nullable: true, description: 'List of Health Hints'})
	details?: Array<HealthHintDetail>;
}

@ResultType({description: 'Folder Health Hint'})
export class FolderHealthHint extends HealthHint {
	@ObjField(() => FolderHealthID, {description: 'Folder Health Hint ID'})
	id!: FolderHealthID;
}

@ResultType({description: 'Track Health Hint'})
	export class TrackHealthHint extends HealthHint {
	@ObjField(() => TrackHealthID, {description: 'Track Health Hint ID'})
	id!: TrackHealthID;
}
