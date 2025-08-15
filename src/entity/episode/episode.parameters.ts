import { EpisodeOrderFields, ListType, PodcastStatus } from '../../types/enums.js';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { OrderByParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class IncludesEpisodeParameters {
	@ObjectField({ nullable: true, description: 'include media information on episode(s)', defaultValue: false, example: false })
	episodeIncMedia?: boolean;

	@ObjectField({ nullable: true, description: 'include tag on episode(s)', defaultValue: false, example: false })
	episodeIncTag?: boolean;

	@ObjectField({ nullable: true, description: 'include raw tag on episode(s)', defaultValue: false, example: false })
	episodeIncRawTag?: boolean;

	@ObjectField({ nullable: true, description: 'include user states (fav,rate) on episode(s)', defaultValue: false, example: false })
	episodeIncState?: boolean;
}

@ObjectParametersType()
export class IncludesEpisodeParentParameters {
	@ObjectField({ nullable: true, description: 'include parent podcast on episode(s)', defaultValue: false, example: false })
	episodeIncParent?: boolean;
}

@InputType()
@ObjectParametersType()
export class EpisodeFilterParameters {
	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Search Query', example: 'awesome' })
	query?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Name', example: 'Awesome Podcast Episode!' })
	name?: string;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Episode Ids', isID: true })
	ids?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Podcast Ids', isID: true })
	podcastIDs?: Array<string>;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp })
	since?: number;

	@Field(() => [String], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Authors', example: ['Poddy McPodcastface'] })
	authors?: Array<string>;

	@Field(() => [String], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by GUIDs', example: ['podlove-2018-04-12t11:08:02+00:00-b3bea1e7437bda4'] })
	guids?: Array<string>;

	@Field(() => [PodcastStatus], { nullable: true })
	@ObjectField(() => [PodcastStatus], { nullable: true, description: 'filter by Podcast Status', example: [PodcastStatus.downloading] })
	statuses?: Array<PodcastStatus>;
}

@InputType()
export class EpisodeFilterParametersQL extends EpisodeFilterParameters {
}

@InputType()
@ObjectParametersType()
export class EpisodeOrderParameters extends OrderByParameters {
	@Field(() => EpisodeOrderFields, { nullable: true })
	@ObjectField(() => EpisodeOrderFields, { nullable: true, description: 'order by field' })
	orderBy?: EpisodeOrderFields;
}

@InputType()
export class EpisodeOrderParametersQL extends EpisodeOrderParameters {
}

@ArgsType()
export class EpisodePageParametersQL extends PaginatedFilterParameters(EpisodeFilterParametersQL, EpisodeOrderParametersQL) {
}

@ArgsType()
export class EpisodesParametersQL extends EpisodePageParametersQL {
	@Field(() => ListType, { nullable: true })
	list?: ListType;

	@Field(() => String, { nullable: true })
	seed?: string;
}
