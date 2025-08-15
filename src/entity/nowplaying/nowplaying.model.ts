import { TrackBase } from '../track/track.model.js';
import { EpisodeBase } from '../episode/episode.model.js';
import { Page } from '../base/base.model.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'Now Playing Data' })
export class NowPlaying {
	@ObjectField({ description: 'User Name', example: 'user' })
	userName!: string;

	@ObjectField({ description: 'User Id', isID: true })
	userID!: string;

	@ObjectField({ description: 'Minutes ago', example: 3 })
	minutesAgo!: number;

	@ObjectField(() => TrackBase, { nullable: true, description: 'The played track' })
	track?: TrackBase;

	@ObjectField({ nullable: true, description: 'The played track id' })
	trackID?: string;

	@ObjectField(() => EpisodeBase, { nullable: true, description: 'The played episode' })
	episode?: EpisodeBase;

	@ObjectField({ nullable: true, description: 'The played episode id' })
	episodeID?: string;
}

@ResultType({ description: 'Now Playing Page' })
export class NowPlayingPage extends Page {
	@ObjectField(() => NowPlaying, { description: 'List of Now Playing Data' })
	items!: Array<NowPlaying>;
}
