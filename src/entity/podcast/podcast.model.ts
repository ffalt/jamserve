import {ObjField, ResultType} from '../../modules/rest/decorators';
import {examples} from '../../modules/engine/rest/example.consts';
import {PodcastStatus} from '../../types/enums';
import {Base, Page} from '../base/base.model';
import {EpisodeBase} from '../episode/episode.model';

@ResultType({description: 'Podcast Base'})
export class PodcastBase extends Base {
	@ObjField({description: 'Podcast Feed URL', example: 'https://podcast.example.com/feed.xml'})
	url!: string;
	@ObjField(() => PodcastStatus, {description: 'Podcast Status', example: PodcastStatus.downloading})
	status!: PodcastStatus;
	@ObjField({nullable: true, description: 'Last Check Timestamp', example: examples.timestamp})
	lastCheck?: number;
	@ObjField({nullable: true, description: 'Podcast Download Error (if any)', example: 'URL not found'})
	error?: string;
	@ObjField({nullable: true, description: 'Podcast Summary', example: 'Best Podcast ever!'})
	description?: string;
	@ObjField(() => [String], {nullable: true, description: 'List of Episode Ids', isID: true})
	episodeIDs?: Array<string>;
	@ObjField({nullable: true, description: 'Number of Episode', min: 0, example: 5})
	episodeCount?: number;
}

@ResultType({description: 'Podcast'})
export class Podcast extends PodcastBase {
	@ObjField(() => [EpisodeBase], {nullable: true, description: 'List of Episodes'})
	episodes?: Array<EpisodeBase>;
}

@ResultType({description: 'Podcast Page'})
export class PodcastPage extends Page {
	@ObjField(() => Podcast, {description: 'List of Podcasts'})
	items!: Array<Podcast>;
}

@ResultType({description: 'Podcast Status Data'})
export class PodcastUpdateStatus {
	@ObjField(() => PodcastStatus, {description: 'Podcast Status', example: PodcastStatus.downloading})
	status!: PodcastStatus;
	@ObjField({nullable: true, description: 'Feed Download Error (if any)', example: 'Not a feed'})
	error?: string;
	@ObjField({nullable: true, description: 'Last Check Timestamp', example: examples.timestamp})
	lastCheck?: number;
}

@ResultType({description: 'Podcast Index Entry'})
export class PodcastIndexEntry {
	@ObjField({description: 'ID', isID: true})
	id!: string;
	@ObjField({description: 'Name', example: 'Mars Volta'})
	name!: string;
	@ObjField({description: 'Episode Count', min: 0, example: 55})
	episodeCount!: number;
}

@ResultType({description: 'Podcast Index Group'})
export class PodcastIndexGroup {
	@ObjField({description: 'Podcast Group Name', example: 'P'})
	name!: string;
	@ObjField(() => [PodcastIndexEntry])
	items!: Array<PodcastIndexEntry>;
}

@ResultType({description: 'Podcast Index'})
export class PodcastIndex {
	@ObjField({description: 'Last Change Timestamp'})
	lastModified!: number;
	@ObjField(() => [PodcastIndexGroup], {description: 'Podcast Index Groups'})
	groups!: Array<PodcastIndexGroup>;
}
