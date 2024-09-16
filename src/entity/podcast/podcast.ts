import {Episode, EpisodeQL} from '../episode/episode.js';
import {EpisodeOrderFields, PodcastStatus} from '../../types/enums.js';
import {Field, Int, ObjectType} from 'type-graphql';
import {Collection, Entity, OneToMany, ORM_DATETIME, Property} from '../../modules/orm/index.js';
import {Base, Index, IndexGroup, PaginatedResponse} from '../base/base.js';
import {State, StateQL} from '../state/state.js';
import {GpodderPodcast, GpodderTag} from '../../modules/audio/clients/gpodder-rest-data.js';

@ObjectType()
@Entity()
export class Podcast extends Base {
	@Field(() => String)
	@Property(() => String)
	name!: string;

	@Field(() => String)
	@Property(() => String)
	url!: string;

	@Property(() => ORM_DATETIME, {nullable: true})
	lastCheck?: Date;

	@Field(() => PodcastStatus)
	@Property(() => PodcastStatus)
	status!: PodcastStatus;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	image?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	errorMessage?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	title?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	language?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	link?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	author?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	description?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	generator?: string;

	@Field(() => [String])
	@Property(() => [String])
	categories!: Array<string>;

	@Field(() => [EpisodeQL])
	@OneToMany<Episode>(() => Episode, episode => episode.podcast, {order: [{orderBy: EpisodeOrderFields.date, orderDesc: true}]})
	episodes: Collection<Episode> = new Collection<Episode>(this);
}

@ObjectType()
export class PodcastQL extends Podcast {
	@Field(() => Int)
	episodesCount!: number;

	@Field(() => Date)
	lastCheck!: Date;

	@Field(() => StateQL)
	state!: State;
}

@ObjectType()
export class PodcastPageQL extends PaginatedResponse(Podcast, PodcastQL) {
}

@ObjectType()
export class PodcastIndexGroupQL extends IndexGroup(Podcast, PodcastQL) {
}

@ObjectType()
export class PodcastIndexQL extends Index(PodcastIndexGroupQL) {
}

@ObjectType()
export class PodcastDiscoverQL implements GpodderPodcast {
	@Field(() => String)
	url!: string;
	@Field(() => String)
	title!: string;
	@Field(() => String)
	author!: string;
	@Field(() => String)
	description!: string;
	@Field(() => Number)
	subscribers!: number;
	@Field(() => Number)
	subscribers_last_week!: number;
	@Field(() => String)
	logo_url!: string;
	@Field(() => String)
	scaled_logo_url!: string;
	@Field(() => String)
	website!: string;
	@Field(() => String)
	mygpo_link!: string;
}

@ObjectType()
export class PodcastDiscoverPageQL extends PaginatedResponse(PodcastDiscoverQL, PodcastDiscoverQL) {
}

@ObjectType()
export class PodcastDiscoverTagQL implements GpodderTag {
	@Field(() => String)
	title!: string;
	@Field(() => String)
	tag!: string;
	@Field(() => Number)
	usage!: number;
}

@ObjectType()
export class PodcastDiscoverTagPageQL extends PaginatedResponse(PodcastDiscoverTagQL, PodcastDiscoverTagQL) {
}
