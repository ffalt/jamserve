import { examples } from '../../modules/engine/rest/example.consts.js';
import { PodcastStatus } from '../../types/enums.js';
import { Base, Page } from '../base/base.model.js';
import { EpisodeBase } from '../episode/episode.model.js';
import { GpodderPodcast, GpodderTag } from '../../modules/audio/clients/gpodder-rest-data.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'Podcast Base' })
export class PodcastBase extends Base {
	@ObjectField({ description: 'Podcast Feed URL', example: 'https://podcast.example.com/feed.xml' })
	url!: string;

	@ObjectField(() => PodcastStatus, { description: 'Podcast Status', example: PodcastStatus.downloading })
	status!: PodcastStatus;

	@ObjectField({ nullable: true, description: 'Last Check Timestamp', example: examples.timestamp })
	lastCheck?: number;

	@ObjectField({ nullable: true, description: 'Podcast Download Error (if any)', example: 'URL not found' })
	error?: string;

	@ObjectField({ nullable: true, description: 'Podcast Summary', example: 'Best Podcast ever!' })
	description?: string;

	@ObjectField(() => [String], { nullable: true, description: 'List of Episode Ids', isID: true })
	episodeIDs?: Array<string>;

	@ObjectField({ nullable: true, description: 'Number of Episode', min: 0, example: 5 })
	episodeCount?: number;
}

@ResultType({ description: 'Podcast' })
export class Podcast extends PodcastBase {
	@ObjectField(() => [EpisodeBase], { nullable: true, description: 'List of Episodes' })
	episodes?: Array<EpisodeBase>;
}

@ResultType({ description: 'Podcast Page' })
export class PodcastPage extends Page {
	@ObjectField(() => Podcast, { description: 'List of Podcasts' })
	items!: Array<Podcast>;
}

@ResultType({ description: 'Podcast Status Data' })
export class PodcastUpdateStatus {
	@ObjectField(() => PodcastStatus, { description: 'Podcast Status', example: PodcastStatus.downloading })
	status!: PodcastStatus;

	@ObjectField({ nullable: true, description: 'Feed Download Error (if any)', example: 'Not a feed' })
	error?: string;

	@ObjectField({ nullable: true, description: 'Last Check Timestamp', example: examples.timestamp })
	lastCheck?: number;
}

@ResultType({ description: 'Podcast Index Entry' })
export class PodcastIndexEntry {
	@ObjectField({ description: 'ID', isID: true })
	id!: string;

	@ObjectField({ description: 'Name', example: 'Mars Volta' })
	name!: string;

	@ObjectField({ description: 'Episode Count', min: 0, example: 55 })
	episodeCount!: number;
}

@ResultType({ description: 'Podcast Index Group' })
export class PodcastIndexGroup {
	@ObjectField({ description: 'Podcast Group Name', example: 'P' })
	name!: string;

	@ObjectField(() => [PodcastIndexEntry])
	items!: Array<PodcastIndexEntry>;
}

@ResultType({ description: 'Podcast Index' })
export class PodcastIndex {
	@ObjectField({ description: 'Last Change Timestamp' })
	lastModified!: number;

	@ObjectField(() => [PodcastIndexGroup], { description: 'Podcast Index Groups' })
	groups!: Array<PodcastIndexGroup>;
}

@ResultType({ description: 'Podcast Discover Result' })
export class PodcastDiscover implements GpodderPodcast {
	@ObjectField()
	url!: string;

	@ObjectField()
	title!: string;

	@ObjectField()
	author!: string;

	@ObjectField()
	description!: string;

	@ObjectField()
	subscribers!: number;

	@ObjectField()
	subscribers_last_week!: number;

	@ObjectField()
	logo_url!: string;

	@ObjectField()
	scaled_logo_url!: string;

	@ObjectField()
	website!: string;

	@ObjectField()
	mygpo_link!: string;
}

@ResultType({ description: 'Podcast Discover Page' })
export class PodcastDiscoverPage extends Page {
	@ObjectField(() => PodcastDiscover, { description: 'List of Podcasts' })
	items!: Array<PodcastDiscover>;
}

@ResultType({ description: 'Podcast Discover Tag' })
export class PodcastDiscoverTag implements GpodderTag {
	@ObjectField()
	title!: string;

	@ObjectField()
	tag!: string;

	@ObjectField()
	usage!: number;
}

@ResultType({ description: 'Podcast Discover Tags Page' })
export class PodcastDiscoverTagPage extends Page {
	@ObjectField(() => PodcastDiscoverTag, { description: 'List of Podcast Tags' })
	items!: Array<PodcastDiscoverTag>;
}
