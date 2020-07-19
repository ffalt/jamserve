import {TrackBase} from '../track/track.model';
import {ObjField, ResultType} from '../../modules/rest/decorators';
import {EpisodeBase} from '../episode/episode.model';
import {Page} from '../base/base.model';

@ResultType({description: 'Now Playing Data'})
export class NowPlaying {
	@ObjField({description: 'User Name', example: 'user'})
	userName!: string;
	@ObjField({description: 'User Id', isID: true})
	userID!: string;
	@ObjField({description: 'Minutes ago', example: 3})
	minutesAgo!: number;
	@ObjField(() => TrackBase, {nullable: true, description: 'The played track'})
	track?: TrackBase;
	@ObjField({nullable: true, description: 'The played track id'})
	trackID?: string;
	@ObjField(() => EpisodeBase, {nullable: true, description: 'The played episode'})
	episode?: EpisodeBase;
	@ObjField({nullable: true, description: 'The played episode id'})
	episodeID?: string;
}

@ResultType({description: 'Now Playing Page'})
export class NowPlayingPage extends Page {
	@ObjField(() => NowPlaying, {description: 'List of Now Playing Data'})
	items!: Array<NowPlaying>;
}
