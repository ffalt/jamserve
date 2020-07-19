import {Track} from '../track/track';
import {Episode} from '../episode/episode';
import {EpisodeQL} from '../episode/episode';
import {PlayQueue} from '../playqueue/playqueue';
import {Field, Int, ObjectType} from 'type-graphql';
import {Entity, ManyToOne, OneToOne, Property} from 'mikro-orm';
import {Base} from '../base/base';
import {TrackQL} from '../track/track';
import {PlayQueueQL} from '../playqueue/playqueue';

@ObjectType()
@Entity()
export class PlayQueueEntry extends Base {
	@Field(() => Int)
	@Property()
	position!: number;

	@Field(() => PlayQueueQL)
	@ManyToOne(() => PlayQueue)
	playQueue!: PlayQueue;

	@Field(() => TrackQL, {nullable: true})
	@OneToOne(() => Track)
	track?: Track;

	@Field(() => EpisodeQL, {nullable: true})
	@OneToOne(() => Episode)
	episode?: Episode;
}

@ObjectType()
export class PlayQueueEntryQL extends PlayQueueEntry {
}
