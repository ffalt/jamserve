import {User} from '../user/user';
import {PlaylistEntry, PlaylistEntryQL} from '../playlistentry/playlist-entry';
import {Field, Float, ID, Int, ObjectType} from 'type-graphql';
import {Collection, Entity, ManyToOne, OneToMany, ORM_INT, Property, QueryOrder, Reference} from '../../modules/orm';
import {Base, Index, IndexGroup, PaginatedResponse} from '../base/base';
import {State, StateQL} from '../state/state';

@ObjectType()
@Entity()
export class Playlist extends Base {
	@Field(() => String)
	@Property(() => String)
	name!: string;

	@ManyToOne<User>(() => User, user => user.playlists)
	user: Reference<User> = new Reference<User>(this);

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	comment?: string;

	@Property(() => String, {nullable: true})
	coverArt?: string;

	@Field(() => Boolean)
	@Property(() => Boolean)
	isPublic: boolean = false;

	@Field(() => Float)
	@Property(() => ORM_INT)
	duration: number = 0;

	@Field(() => [PlaylistEntryQL])
	@OneToMany<PlaylistEntry>(() => PlaylistEntry, entry => entry.playlist, {orderBy: {position: QueryOrder.ASC}})
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
