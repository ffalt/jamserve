import {ObjField, ObjParamsType} from '../../modules/rest/decorators';
import {examples} from '../../modules/engine/rest/example.consts';
import {ArgsType, Field, ID, InputType, Int} from 'type-graphql';
import {ListType, PodcastOrderFields, PodcastStatus} from '../../types/enums';
import {FilterArgs, OrderByArgs, PaginatedArgs} from '../base/base.args';

@ObjParamsType()
export class IncludesPodcastArgs {
	@ObjField({nullable: true, description: 'include state (fav,rate) on podcast(s)', defaultValue: false, example: false})
	podcastIncState?: boolean;
	@ObjField({nullable: true, description: 'include episodes id on podcast(s)', defaultValue: false, example: false})
	podcastIncEpisodeIDs?: boolean;
	@ObjField({nullable: true, description: 'include episode count on podcast(s)', defaultValue: false, example: false})
	podcastIncEpisodeCount?: boolean;
}

@ObjParamsType()
export class IncludesPodcastChildrenArgs {
	@ObjField({nullable: true, description: 'include episodes on podcast(s)', defaultValue: false, example: false})
	podcastIncEpisodes?: boolean;
}

@ObjParamsType()
export class PodcastCreateArgs {
	@ObjField({description: 'Podcast Feed URL', example: 'https://podcast.example.com/feed.xml'})
	url!: string;
}

@ObjParamsType()
export class PodcastRefreshArgs {
	@ObjField({nullable: true, description: 'Podcast ID to refresh (empty for refreshing all)', isID: true})
	id?: string;
}

@InputType()
@ObjParamsType()
export class PodcastFilterArgs {
	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Search Query', example: 'awesome'})
	query?: string;

	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Name', example: 'Awesome Podcast'})
	name?: string;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Podcast Ids', isID: true})
	ids?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Episode Ids', isID: true})
	episodeIDs?: Array<string>;

	@Field(() => Int, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp})
	since?: number;

	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by URL', example: 'https://podcast.example.com/feed.xml'})
	url?: string;

	@Field(() => [PodcastStatus], {nullable: true})
	@ObjField(() => [PodcastStatus], {nullable: true, description: 'filter by Podcast Status', example: [PodcastStatus.downloading]})
	statuses?: Array<PodcastStatus>;

	@Field(() => Int, {nullable: true})
	@ObjField({nullable: true, description: 'filter by since Last Check timestamp', min: 0, example: examples.timestamp})
	lastCheckFrom?: number;

	@Field(() => Int, {nullable: true})
	@ObjField({nullable: true, description: 'filter by until Last Check timestamp', min: 0, example: examples.timestamp})
	lastCheckTo?: number;

	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Title', example: 'Awesome Podcast'})
	title?: string;

	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Author', example: 'Poddy McPodcastface'})
	author?: string;

	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Title', example: 'Awesome Topic'})
	description?: string;

	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Title', example: 'Awesome Feed Generator'})
	generator?: string;

	@Field(() => [String!], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Podcast Category', example: ['Awesome']})
	categories?: Array<string>;
}

@InputType()
export class PodcastFilterArgsQL {
	@Field(() => String, {nullable: true})
	query?: string;

	@Field(() => String, {nullable: true})
	name?: string;

	@Field(() => [ID], {nullable: true})
	ids?: Array<string>;

	@Field(() => [ID], {nullable: true})
	episodeIDs?: Array<string>;

	@Field(() => Int, {nullable: true})
	since?: number;

	@Field(() => String, {nullable: true})
	url?: string;

	@Field(() => [PodcastStatus], {nullable: true})
	statuses?: Array<PodcastStatus>;

	@Field(() => Int, {nullable: true})
	lastCheckFrom?: number;

	@Field(() => Int, {nullable: true})
	lastCheckTo?: number;

	@Field(() => String, {nullable: true})
	title?: string;

	@Field(() => String, {nullable: true})
	author?: string;

	@Field(() => String, {nullable: true})
	description?: string;

	@Field(() => String, {nullable: true})
	generator?: string;

	@Field(() => [String], {nullable: true})
	categories?: Array<string>;
}

@InputType()
@ObjParamsType()
export class PodcastOrderArgs extends OrderByArgs {
	@Field(() => PodcastOrderFields, {nullable: true})
	@ObjField(() => PodcastOrderFields, {nullable: true, description: 'order by field'})
	orderBy?: PodcastOrderFields;
}

@InputType()
export class PodcastOrderArgsQL extends PodcastOrderArgs {
}

@ArgsType()
export class PodcastIndexArgsQL extends FilterArgs(PodcastFilterArgsQL) {
}

@ArgsType()
export class PodcastsArgsQL extends PaginatedArgs(PodcastFilterArgsQL, PodcastOrderArgsQL) {
	@Field(() => ListType, {nullable: true})
	list?: ListType;
}
