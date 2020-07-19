import {User} from '../user/user';
import {PlaylistEntry, PlaylistEntryQL} from '../playlistentry/playlist-entry';
import {Field, ID, Int, ObjectType} from 'type-graphql';
import {Collection, Entity, ManyToOne, OneToMany, Property, QueryOrder} from 'mikro-orm';
import {Base, Index, IndexGroup, PaginatedResponse} from '../base/base';
import {State, StateQL} from '../state/state';

@ObjectType()
@Entity()
export class Playlist extends Base {
	@Field(() => String)
	@Property()
	name!: string;

	@ManyToOne(() => User)
	user!: User;

	@Field(() => String, {nullable: true})
	@Property()
	comment?: string;

	@Property()
	coverArt?: string;

	@Field(() => Boolean)
	@Property()
	isPublic: boolean = false;

	@Field(() => Int)
	@Property()
	duration: number = 0;

	@Field(() => [PlaylistEntryQL])
	@OneToMany(() => PlaylistEntry, entry => entry.playlist, {orderBy: {position: QueryOrder.ASC}})
	entries: Collection<PlaylistEntry> = new Collection<PlaylistEntry>(this);
}

@ObjectType()
export class PlaylistQL extends Playlist {
	@Field(() => ID)
	userID!: string;
	@Field(() => String)
	userName!: string;
	@Field(() => Int)
	entriesCount!: number;
	@Field(() => StateQL)
	state!: State;
}

@ObjectType()
export class PlaylistPageQL extends PaginatedResponse(Playlist, PlaylistQL) {
}

@ObjectType()
export class PlaylistIndexGroupQL extends IndexGroup(Playlist, PlaylistQL) {
}

@ObjectType()
export class PlaylistIndexQL extends Index(PlaylistIndexGroupQL) {
}
