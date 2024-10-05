import { ObjParamsType } from '../../modules/rest/decorators/ObjParamsType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';

@ObjParamsType()
export class IncludesPlayQueueArgs {
	@ObjField({ nullable: true, description: 'include entries on play queue', defaultValue: false, example: false })
	playQueueEntries?: boolean;

	@ObjField({ nullable: true, description: 'include entry ids on play queue', defaultValue: false, example: false })
	playQueueEntriesIDs?: boolean;
}

@ObjParamsType()
export class PlayQueueSetArgs {
	@ObjField(() => [String], { nullable: true, description: 'Media Ids of the play queue' })
	mediaIDs?: Array<string>;

	@ObjField({ nullable: true, description: 'Current Media Id' })
	currentID?: string;

	@ObjField({ nullable: true, description: 'Position in Current Media', min: 0 })
	position?: number;
}
