import { examples } from '../../modules/engine/rest/example.consts.js';
import { PodcastStatus } from '../../types/enums.js';
import { MediaBase } from '../tag/tag.model.js';
import { PodcastBase } from '../podcast/podcast.model.js';
import { Page } from '../base/base.model.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'Episode Chapter' })
export class EpisodeChapter {
	@ObjectField({ description: 'Chapter Start Time', min: 0, example: 12_345 })
	start!: number;

	@ObjectField({ description: 'Chapter Title', example: 'Topic: Awesomeness' })
	title!: string;
}

@ResultType({ description: 'Episode' })
export class EpisodeBase extends MediaBase {
	@ObjectField({ description: 'Podcast Id', isID: true })
	podcastID!: string;

	@ObjectField({ description: 'Podcast Name', example: 'Awesome Podcast' })
	podcastName!: string;

	@ObjectField(() => PodcastStatus, { description: 'Episode Status', example: PodcastStatus.downloading })
	status!: PodcastStatus;

	@ObjectField({ description: 'Published Timestamp', min: 0, example: examples.timestamp })
	date!: number;

	@ObjectField({ nullable: true, description: 'Episode Summary', example: 'Best Episode ever!' })
	summary?: string;

	@ObjectField({ nullable: true, description: 'Episode GUID', example: 'podlove-2018-04-12t11:08:02+00:00-b3bea1e7437bda4' })
	guid?: string;

	@ObjectField({ nullable: true, description: 'Episode Author', example: 'Poddy McPodcastface' })
	author?: string;

	@ObjectField({ nullable: true, description: 'Episode Link', example: 'https://podcast.example.com/epsiodes/episode001.html' })
	link?: string;

	@ObjectField({ nullable: true, description: 'Episode File Link', example: 'https://podcast.example.com/epsiodes/episode001.mp3' })
	url?: string;

	@ObjectField({ nullable: true, description: 'Episode Download Error (if any)', example: 'URL not found' })
	error?: string;

	@ObjectField(() => EpisodeChapter, { nullable: true, description: 'Episode Chapters' })
	chapters?: Array<EpisodeChapter>;
}

@ResultType({ description: 'Episode' })
export class Episode extends EpisodeBase {
	@ObjectField(() => PodcastBase, { nullable: true, description: 'Podcast', isID: true })
	podcast?: PodcastBase;
}

@ResultType({ description: 'Episodes Page' })
export class EpisodePage extends Page {
	@ObjectField(() => Episode, { description: 'List of Episodes' })
	items!: Array<Episode>;
}

@ResultType({ description: 'Episode Status Data' })
export class EpisodeUpdateStatus {
	@ObjectField(() => PodcastStatus, { description: 'Episode Status', example: PodcastStatus.downloading })
	status!: PodcastStatus;

	@ObjectField({ nullable: true, description: 'Episode Download Error (if any)', example: 'URL not found' })
	error?: string;
}
