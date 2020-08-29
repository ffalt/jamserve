import {Episode, EpisodeQL} from '../episode/episode';
import {EpisodeOrderFields, PodcastStatus} from '../../types/enums';
import {Field, Int, ObjectType} from 'type-graphql';
import {Collection, Entity, OneToMany, ORM_DATETIME, Property} from '../../modules/orm';
import {Base, Index, IndexGroup, PaginatedResponse} from '../base/base';
import {State, StateQL} from '../state/state';

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
	state!: State
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
