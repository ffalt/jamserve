import {Track, TrackQL} from '../track/track.js';
import {Episode, EpisodeQL} from '../episode/episode.js';
import {PlayQueue, PlayQueueQL} from '../playqueue/playqueue.js';
import {Field, Int, ObjectType} from 'type-graphql';
import {Entity, ManyToOne, ORM_INT, Property, Reference} from '../../modules/orm/index.js';
import {Base} from '../base/base.js';

@ObjectType()
@Entity()
export class PlayQueueEntry extends Base {
	@Field(() => Int)
	@Property(() => ORM_INT)
	position!: number;

	@Field(() => PlayQueueQL)
	@ManyToOne<PlayQueue>(() => PlayQueue, playQueue => playQueue.entries)
	playQueue: Reference<PlayQueue> = new Reference<PlayQueue>(this);

	@Field(() => TrackQL, {nullable: true})
	@ManyToOne<Track>(() => Track, track => track.playqueueEntries, {nullable: true})
	track = new Reference<Track>(this);

	@Field(() => EpisodeQL, {nullable: true})
	@ManyToOne<Episode>(() => Episode, episode => episode.playqueueEntries, {nullable: true})
	episode = new Reference<Episode>(this);
}

@ObjectType()
export class PlayQueueEntryQL extends PlayQueueEntry {
}
