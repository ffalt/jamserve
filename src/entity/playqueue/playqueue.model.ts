import { examples } from '../../modules/engine/rest/example.consts.js';
import { MediaBase } from '../tag/tag.model.js';
import {ResultType} from '../../modules/rest/decorators/ResultType.js';
import {ObjField} from '../../modules/rest/decorators/ObjField.js';

@ResultType({ description: 'PlayQueue' })
export class PlayQueueBase {
	@ObjField({ description: 'User Name', example: 'user' })
	userName!: string;

	@ObjField({ description: 'User Id', isID: true })
	userID!: string;

	@ObjField({ description: 'Number of Entries', min: 0, example: 5 })
	entriesCount!: number;

	@ObjField(() => [String], { nullable: true, description: 'List of Media IDs' })
	entriesIDs?: Array<string>;

	@ObjField({ nullable: true, description: 'Current Entry Index in PlayQueue', min: 0, example: 1 })
	currentIndex?: number;

	@ObjField({ nullable: true, description: 'Position in Current Entry', min: 0, example: 12345 })
	mediaPosition?: number;

	@ObjField({ description: 'Created Timestamp', min: 0, example: examples.timestamp })
	created!: number;

	@ObjField({ description: 'Changed Timestamp', min: 0, example: examples.timestamp })
	changed!: number;

	@ObjField({ description: 'Last Changed by Client', example: 'Jamberry v1' })
	changedBy!: string;
}

@ResultType({ description: 'PlayQueue' })
export class PlayQueue extends PlayQueueBase {
	@ObjField(() => [MediaBase], { nullable: true, description: 'List of Media Entries' })
	entries?: Array<MediaBase>;
}
