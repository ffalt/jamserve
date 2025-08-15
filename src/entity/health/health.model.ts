import { FolderHealthID, TrackHealthID } from '../../types/enums.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'Health Hint Detail' })
export class HealthHintDetail {
	@ObjectField({ description: 'Hint Description' })
	reason!: string;

	@ObjectField({ nullable: true, description: 'Expected Value' })
	expected?: string;

	@ObjectField({ nullable: true, description: 'Actual Value' })
	actual?: string;
}

@ResultType({ description: 'Health Hint' })
export class HealthHint {
	@ObjectField({ description: 'Health Hint Name' })
	name!: string;

	@ObjectField(() => [HealthHintDetail], { nullable: true, description: 'List of Health Hints' })
	details?: Array<HealthHintDetail>;
}

@ResultType({ description: 'Folder Health Hint' })
export class FolderHealthHint extends HealthHint {
	@ObjectField(() => FolderHealthID, { description: 'Folder Health Hint ID' })
	id!: FolderHealthID;
}

@ResultType({ description: 'Track Health Hint' })
export class TrackHealthHint extends HealthHint {
	@ObjectField(() => TrackHealthID, { description: 'Track Health Hint ID' })
	id!: TrackHealthID;
}
