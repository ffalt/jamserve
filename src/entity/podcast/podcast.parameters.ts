import { examples } from '../../modules/engine/rest/example.consts.js';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { ListType, PodcastOrderFields, PodcastStatus } from '../../types/enums.js';
import { FilterParameters, OrderByParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class IncludesPodcastParameters {
	@ObjectField({ nullable: true, description: 'include state (fav,rate) on podcast(s)', defaultValue: false, example: false })
	podcastIncState?: boolean;

	@ObjectField({ nullable: true, description: 'include episodes id on podcast(s)', defaultValue: false, example: false })
	podcastIncEpisodeIDs?: boolean;

	@ObjectField({ nullable: true, description: 'include episode count on podcast(s)', defaultValue: false, example: false })
	podcastIncEpisodeCount?: boolean;
}

@ObjectParametersType()
export class IncludesPodcastChildrenParameters {
	@ObjectField({ nullable: true, description: 'include episodes on podcast(s)', defaultValue: false, example: false })
	podcastIncEpisodes?: boolean;
}

@ObjectParametersType()
export class PodcastCreateParameters {
	@ObjectField({ description: 'Podcast Feed URL', example: 'https://podcast.example.com/feed.xml' })
	url!: string;
}

@ObjectParametersType()
export class PodcastRefreshParameters {
	@ObjectField({ nullable: true, description: 'Podcast ID to refresh (empty for refreshing all)', isID: true })
	id?: string;
}

@InputType()
@ObjectParametersType()
export class PodcastFilterParameters {
	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Search Query', example: 'awesome' })
	query?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Name', example: 'Awesome Podcast' })
	name?: string;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Podcast Ids', isID: true })
	ids?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Episode Ids', isID: true })
	episodeIDs?: Array<string>;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp })
	since?: number;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by URL', example: 'https://podcast.example.com/feed.xml' })
	url?: string;

	@Field(() => [PodcastStatus], { nullable: true })
	@ObjectField(() => [PodcastStatus], { nullable: true, description: 'filter by Podcast Status', example: [PodcastStatus.downloading] })
	statuses?: Array<PodcastStatus>;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by since Last Check timestamp', min: 0, example: examples.timestamp })
	lastCheckFrom?: number;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by until Last Check timestamp', min: 0, example: examples.timestamp })
	lastCheckTo?: number;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Title', example: 'Awesome Podcast' })
	title?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Author', example: 'Poddy McPodcastface' })
	author?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Title', example: 'Awesome Topic' })
	description?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Title', example: 'Awesome Feed Generator' })
	generator?: string;

	@Field(() => [String!], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Podcast Category', example: ['Awesome'] })
	categories?: Array<string>;
}

@InputType()
export class PodcastFilterParametersQL {
	@Field(() => String, { nullable: true })
	query?: string;

	@Field(() => String, { nullable: true })
	name?: string;

	@Field(() => [ID], { nullable: true })
	ids?: Array<string>;

	@Field(() => [ID], { nullable: true })
	episodeIDs?: Array<string>;

	@Field(() => Int, { nullable: true })
	since?: number;

	@Field(() => String, { nullable: true })
	url?: string;

	@Field(() => [PodcastStatus], { nullable: true })
	statuses?: Array<PodcastStatus>;

	@Field(() => Int, { nullable: true })
	lastCheckFrom?: number;

	@Field(() => Int, { nullable: true })
	lastCheckTo?: number;

	@Field(() => String, { nullable: true })
	title?: string;

	@Field(() => String, { nullable: true })
	author?: string;

	@Field(() => String, { nullable: true })
	description?: string;

	@Field(() => String, { nullable: true })
	generator?: string;

	@Field(() => [String], { nullable: true })
	categories?: Array<string>;
}

@InputType()
@ObjectParametersType()
export class PodcastOrderParameters extends OrderByParameters {
	@Field(() => PodcastOrderFields, { nullable: true })
	@ObjectField(() => PodcastOrderFields, { nullable: true, description: 'order by field' })
	orderBy?: PodcastOrderFields;
}

@InputType()
export class PodcastOrderParametersQL extends PodcastOrderParameters {
}

@ArgsType()
export class PodcastIndexParametersQL extends FilterParameters(PodcastFilterParametersQL) {
}

@ArgsType()
export class PodcastPageParametersQL extends PaginatedFilterParameters(PodcastFilterParametersQL, PodcastOrderParametersQL) {
}

@ArgsType()
export class PodcastsParametersQL extends PodcastPageParametersQL {
	@Field(() => ListType, { nullable: true })
	list?: ListType;

	@Field(() => String, { nullable: true })
	seed?: string;
}

@ArgsType()
@ObjectParametersType()
export class PodcastDiscoverParameters {
	@Field(() => String)
	@ObjectField({ description: 'Search Podcast by Name', example: 'awesome' })
	query!: string;
}

@ArgsType()
export class PodcastDiscoverParametersQL extends PodcastDiscoverParameters {
}

@ArgsType()
@ObjectParametersType()
export class PodcastDiscoverByTagParameters {
	@Field(() => String)
	@ObjectField({ description: 'Search Podcast by Tag', example: 'awesome' })
	tag!: string;
}

@ArgsType()
export class PodcastDiscoverByTagParametersQL extends PodcastDiscoverByTagParameters {
}
