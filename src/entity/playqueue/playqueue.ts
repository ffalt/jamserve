import {User} from '../user/user';
import {PlayQueueEntry, PlayQueueEntryQL} from '../playqueueentry/playqueue-entry';
import {Field, Int, ObjectType} from 'type-graphql';
import {Collection, Entity, OneToMany, OneToOne, Property, QueryOrder} from 'mikro-orm';
import {Base} from '../base/base';

@ObjectType()
@Entity()
export class PlayQueue extends Base {
	@OneToOne(() => User)
	user!: User;

	@Field(() => Int, {nullable: true})
	@Property()
	current?: number; // current playQueue entry

	@Field(() => Int, {nullable: true})
	@Property()
	position?: number; // position in entry

	@Field(() => Int, {nullable: true})
	@Property()
	duration!: number;

	@Field(() => String)
	@Property()
	changedBy!: string;

	@Field(() => [PlayQueueEntryQL])
	@OneToMany(() => PlayQueueEntry, entry => entry.playQueue, {orderBy: {position: QueryOrder.ASC}})
	entries: Collection<PlayQueueEntry> = new Collection<PlayQueueEntry>(this);
}

@ObjectType()
export class PlayQueueQL extends PlayQueue {
	@Field(() => Int)
	entriesCount!: number;
}
