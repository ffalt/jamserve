import {Episode, EpisodeQL} from '../episode/episode';
import {PodcastStatus} from '../../types/enums';
import {Field, Int, ObjectType} from 'type-graphql';
import {Collection, Entity, Enum, OneToMany, Property, QueryOrder} from 'mikro-orm';
import {Base, Index, IndexGroup, PaginatedResponse} from '../base/base';
import {OrmStringListType} from '../../modules/engine/services/orm.types';
import {State, StateQL} from '../state/state';

@ObjectType()
@Entity()
export class Podcast extends Base {
	@Field(() => String)
	@Property()
	name!: string;

	@Field(() => String)
	@Property()
	url!: string;

	@Property()
	lastCheck!: number;

	@Field(() => PodcastStatus)
	@Enum(() => PodcastStatus)
	status!: PodcastStatus;

	@Field(() => String, {nullable: true})
	@Property()
	image?: string;

	@Field(() => String, {nullable: true})
	@Property()
	errorMessage?: string;

	@Field(() => String, {nullable: true})
	@Property()
	title?: string;

	@Field(() => String, {nullable: true})
	@Property()
	language?: string;

	@Field(() => String, {nullable: true})
	@Property()
	link?: string;

	@Field(() => String, {nullable: true})
	@Property()
	author?: string;

	@Field(() => String, {nullable: true})
	@Property()
	description?: string;

	@Field(() => String, {nullable: true})
	@Property()
	generator?: string;

	@Field(() => [String])
	@Property({type: OrmStringListType})
	categories!: Array<string>;

	@Field(() => [EpisodeQL])
	@OneToMany({entity: () => Episode, mappedBy: episode => episode.podcast, orderBy: {date: QueryOrder.DESC}})
	episodes: Collection<Episode> = new Collection<Episode>(this);
}

@ObjectType()
export class PodcastQL extends Podcast {
	@Field(() => Int)
	episodesCount!: number;

	@Field(() => Date)
	lastCheck!: number;

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
