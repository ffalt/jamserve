import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class IncludesPlayQueueParameters {
	@ObjectField({ nullable: true, description: 'include entries on play queue', defaultValue: false, example: false })
	playQueueEntries?: boolean;

	@ObjectField({ nullable: true, description: 'include entry ids on play queue', defaultValue: false, example: false })
	playQueueEntriesIDs?: boolean;
}

@ObjectParametersType()
export class PlayQueueSetParameters {
	@ObjectField(() => [String], { nullable: true, description: 'Media Ids of the play queue' })
	mediaIDs?: Array<string>;

	@ObjectField({ nullable: true, description: 'Current Media Id' })
	currentID?: string;

	@ObjectField({ nullable: true, description: 'Position in Current Media', min: 0 })
	position?: number;
}
