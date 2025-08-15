import { examples } from '../../modules/engine/rest/example.consts.js';
import { MediaBase } from '../tag/tag.model.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'PlayQueue' })
export class PlayQueueBase {
	@ObjectField({ description: 'User Name', example: 'user' })
	userName!: string;

	@ObjectField({ description: 'User Id', isID: true })
	userID!: string;

	@ObjectField({ description: 'Number of Entries', min: 0, example: 5 })
	entriesCount!: number;

	@ObjectField(() => [String], { nullable: true, description: 'List of Media IDs' })
	entriesIDs?: Array<string>;

	@ObjectField({ nullable: true, description: 'Current Entry Index in PlayQueue', min: 0, example: 1 })
	currentIndex?: number;

	@ObjectField({ nullable: true, description: 'Position in Current Entry', min: 0, example: 12_345 })
	mediaPosition?: number;

	@ObjectField({ description: 'Created Timestamp', min: 0, example: examples.timestamp })
	created!: number;

	@ObjectField({ description: 'Changed Timestamp', min: 0, example: examples.timestamp })
	changed!: number;

	@ObjectField({ description: 'Last Changed by Client', example: 'Jamberry v1' })
	changedBy!: string;
}

@ResultType({ description: 'PlayQueue' })
export class PlayQueue extends PlayQueueBase {
	@ObjectField(() => [MediaBase], { nullable: true, description: 'List of Media Entries' })
	entries?: Array<MediaBase>;
}
