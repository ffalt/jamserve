import {ObjField, ResultType} from '../../modules/rest/index.js';
import {examples} from '../../modules/engine/rest/example.consts.js';
import {PodcastStatus} from '../../types/enums.js';
import {MediaBase} from '../tag/tag.model.js';
import {PodcastBase} from '../podcast/podcast.model.js';
import {Page} from '../base/base.model.js';

@ResultType({description: 'Episode Chapter'})
export class EpisodeChapter {
	@ObjField({description: 'Chapter Start Time', min: 0, example: 12345})
	start!: number;
	@ObjField({description: 'Chapter Title', example: 'Topic: Awesomeness'})
	title!: string;
}

@ResultType({description: 'Episode'})
export class EpisodeBase extends MediaBase {
	@ObjField({description: 'Podcast Id', isID: true})
	podcastID!: string;
	@ObjField({description: 'Podcast Name', example: 'Awesome Podcast'})
	podcastName!: string;
	@ObjField(() => PodcastStatus, {description: 'Episode Status', example: PodcastStatus.downloading})
	status!: PodcastStatus;
	@ObjField({description: 'Published Timestamp', min: 0, example: examples.timestamp})
	date!: number;
	@ObjField({nullable: true, description: 'Episode Summary', example: 'Best Episode ever!'})
	summary?: string;
	@ObjField({nullable: true, description: 'Episode GUID', example: 'podlove-2018-04-12t11:08:02+00:00-b3bea1e7437bda4'})
	guid?: string;
	@ObjField({nullable: true, description: 'Episode Author', example: 'Poddy McPodcastface'})
	author?: string;
	@ObjField({nullable: true, description: 'Episode Link', example: 'https://podcast.example.com/epsiodes/episode001.html'})
	link?: string;
	@ObjField({nullable: true, description: 'Episode File Link', example: 'https://podcast.example.com/epsiodes/episode001.mp3'})
	url?: string;
	@ObjField({nullable: true, description: 'Episode Download Error (if any)', example: 'URL not found'})
	error?: string;
	@ObjField(() => EpisodeChapter, {nullable: true, description: 'Episode Chapters'})
	chapters?: Array<EpisodeChapter>;
}

@ResultType({description: 'Episode'})
export class Episode extends EpisodeBase {
	@ObjField(() => PodcastBase, {nullable: true, description: 'Podcast', isID: true})
	podcast?: PodcastBase;
}

@ResultType({description: 'Episodes Page'})
export class EpisodePage extends Page {
	@ObjField(() => Episode, {description: 'List of Episodes'})
	items!: Array<Episode>;
}

@ResultType({description: 'Episode Status Data'})
export class EpisodeUpdateStatus {
	@ObjField(() => PodcastStatus, {description: 'Episode Status', example: PodcastStatus.downloading})
	status!: PodcastStatus;
	@ObjField({nullable: true, description: 'Episode Download Error (if any)', example: 'URL not found'})
	error?: string;
}
