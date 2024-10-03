import { TrackBase } from '../track/track.model.js';
import { EpisodeBase } from '../episode/episode.model.js';
import { Page } from '../base/base.model.js';
import { ResultType } from '../../modules/rest/decorators/ResultType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';

@ResultType({ description: 'Now Playing Data' })
export class NowPlaying {
	@ObjField({ description: 'User Name', example: 'user' })
	userName!: string;

	@ObjField({ description: 'User Id', isID: true })
	userID!: string;

	@ObjField({ description: 'Minutes ago', example: 3 })
	minutesAgo!: number;

	@ObjField(() => TrackBase, { nullable: true, description: 'The played track' })
	track?: TrackBase;

	@ObjField({ nullable: true, description: 'The played track id' })
	trackID?: string;

	@ObjField(() => EpisodeBase, { nullable: true, description: 'The played episode' })
	episode?: EpisodeBase;

	@ObjField({ nullable: true, description: 'The played episode id' })
	episodeID?: string;
}

@ResultType({ description: 'Now Playing Page' })
export class NowPlayingPage extends Page {
	@ObjField(() => NowPlaying, { description: 'List of Now Playing Data' })
	items!: Array<NowPlaying>;
}
