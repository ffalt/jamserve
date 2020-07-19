import {ObjField, ResultType} from '../../modules/rest/decorators';
import {examples} from '../../modules/engine/rest/example.consts';
import {MediaBase} from '../tag/tag.model';
//
// @ResultType({description: 'PlayQueue Entry Data'})
// export class PlayQueueEntry {
// 	@ObjField({nullable: true, description: 'Track Id', isID: true})
// 	trackID?: string;
// 	@ObjField({nullable: true, description: 'Track'})
// 	track?: TrackBase;
// 	@ObjField({nullable: true, description: 'Episode Id', isID: true})
// 	episodeID?: string;
// 	@ObjField({nullable: true, description: 'Episode'})
// 	episode?: EpisodeBase;
// }

@ResultType({description: 'PlayQueue Data'})
export class PlayQueue {
	@ObjField({description: 'User Name', example: 'user'})
	userName!: string;
	@ObjField({description: 'User Id', isID: true})
	userID!: string;
	@ObjField({description: 'Number of Entries', min: 0, example: 5})
	entriesCount!: number;
	@ObjField(() => [String], {nullable: true, description: 'List of Media IDs'})
	entriesIDs?: Array<string>;
	@ObjField(() => [MediaBase], {nullable: true, description: 'List of Media Entries'})
	entries?: Array<MediaBase>;
	@ObjField({nullable: true, description: 'Current Entry Index in PlayQueue', min: 0, example: 1})
	currentIndex?: number;
	@ObjField({nullable: true, description: 'Position in Current Entry', min: 0, example: 12345})
	mediaPosition?: number;
	@ObjField({description: 'Created Timestamp', min: 0, example: examples.timestamp})
	created!: number;
	@ObjField({description: 'Changed Timestamp', min: 0, example: examples.timestamp})
	changed!: number;
	@ObjField({description: 'Last Changed by Client', example: 'Jamberry v1'})
	changedBy!: string;
}
