import { EpisodeOrderFields, ListType, PodcastStatus } from '../../types/enums.js';
import { ArgsType, Field, Float, ID, InputType } from 'type-graphql';
import { OrderByArgs, PaginatedFilterArgs } from '../base/base.args.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjParamsType } from '../../modules/rest/decorators/ObjParamsType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';

@ObjParamsType()
export class IncludesEpisodeArgs {
	@ObjField({ nullable: true, description: 'include media information on episode(s)', defaultValue: false, example: false })
	episodeIncMedia?: boolean;

	@ObjField({ nullable: true, description: 'include tag on episode(s)', defaultValue: false, example: false })
	episodeIncTag?: boolean;

	@ObjField({ nullable: true, description: 'include raw tag on episode(s)', defaultValue: false, example: false })
	episodeIncRawTag?: boolean;

	@ObjField({ nullable: true, description: 'include user states (fav,rate) on episode(s)', defaultValue: false, example: false })
	episodeIncState?: boolean;
}

@ObjParamsType()
export class IncludesEpisodeParentArgs {
	@ObjField({ nullable: true, description: 'include parent podcast on episode(s)', defaultValue: false, example: false })
	episodeIncParent?: boolean;
}

@InputType()
@ObjParamsType()
export class EpisodeFilterArgs {
	@Field(() => String, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Search Query', example: 'awesome' })
	query?: string;

	@Field(() => String, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Name', example: 'Awesome Podcast Episode!' })
	name?: string;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Episode Ids', isID: true })
	ids?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Podcast Ids', isID: true })
	podcastIDs?: Array<string>;

	@Field(() => Float, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp })
	since?: number;

	@Field(() => [String], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Authors', example: ['Poddy McPodcastface'] })
	authors?: Array<string>;

	@Field(() => [String], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by GUIDs', example: ['podlove-2018-04-12t11:08:02+00:00-b3bea1e7437bda4'] })
	guids?: Array<string>;

	@Field(() => [PodcastStatus], { nullable: true })
	@ObjField(() => [PodcastStatus], { nullable: true, description: 'filter by Podcast Status', example: [PodcastStatus.downloading] })
	statuses?: Array<PodcastStatus>;
}

@InputType()
export class EpisodeFilterArgsQL extends EpisodeFilterArgs {
}

@InputType()
@ObjParamsType()
export class EpisodeOrderArgs extends OrderByArgs {
	@Field(() => EpisodeOrderFields, { nullable: true })
	@ObjField(() => EpisodeOrderFields, { nullable: true, description: 'order by field' })
	orderBy?: EpisodeOrderFields;
}

@InputType()
export class EpisodeOrderArgsQL extends EpisodeOrderArgs {
}

@ArgsType()
export class EpisodePageArgsQL extends PaginatedFilterArgs(EpisodeFilterArgsQL, EpisodeOrderArgsQL) {
}

@ArgsType()
export class EpisodesArgsQL extends EpisodePageArgsQL {
	@Field(() => ListType, { nullable: true })
	list?: ListType;

	@Field(() => String, { nullable: true })
	seed?: string;
}
