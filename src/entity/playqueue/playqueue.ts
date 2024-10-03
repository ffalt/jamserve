import { User } from '../user/user.js';
import { PlayQueueEntry, PlayQueueEntryQL } from '../playqueueentry/playqueue-entry.js';
import { Field, Float, Int, ObjectType } from 'type-graphql';
import { Collection, Entity, OneToMany, OneToOne, ORM_INT, Property, Reference } from '../../modules/orm/index.js';
import { Base } from '../base/base.js';
import { PlayQueueEntryOrderFields } from '../../types/enums.js';

@ObjectType()
@Entity()
export class PlayQueue extends Base {
	@Field(() => Int, { nullable: true })
	@Property(() => ORM_INT, { nullable: true })
	current?: number; // current playQueue entry

	@Field(() => Float, { nullable: true })
	@Property(() => ORM_INT, { nullable: true })
	position?: number; // position in entry

	@Field(() => Float, { nullable: true })
	@Property(() => ORM_INT, { nullable: true })
	duration!: number;

	@Field(() => String)
	@Property(() => String)
	changedBy!: string;

	@OneToOne<User>(() => User, user => user.playQueue, { owner: true })
	user = new Reference<User>(this);

	@Field(() => [PlayQueueEntryQL])
	@OneToMany<PlayQueueEntry>(() => PlayQueueEntry, entry => entry.playQueue, { order: [{ orderBy: PlayQueueEntryOrderFields.position }] })
	entries: Collection<PlayQueueEntry> = new Collection<PlayQueueEntry>(this);
}

@ObjectType()
export class PlayQueueQL extends PlayQueue {
	@Field(() => Int)
	entriesCount!: number;
}
