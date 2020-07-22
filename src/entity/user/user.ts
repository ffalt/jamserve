import {Session, SessionQL} from '../session/session';
import {Bookmark, BookmarkQL} from '../bookmark/bookmark';
import {PlayQueue, PlayQueueQL} from '../playqueue/playqueue';
import {Field, Int, ObjectType} from 'type-graphql';
import {State} from '../state/state';
import {Collection, Entity, OneToMany, OneToOne, ORM_INT, Property, QueryOrder, Reference} from '../../modules/orm';
import {Base, Index, IndexGroup, PaginatedResponse} from '../base/base';
import {UserRole} from '../../types/enums';
import {Playlist, PlaylistQL} from '../playlist/playlist';

@ObjectType()
@Entity()
export class User extends Base {
	@Field(() => String)
	@Property(() => String)
	name!: string;

	@Property(() => String)
	salt!: string;

	@Property(() => String)
	hash!: string;

	@Field(() => String)
	@Property(() => String)
	email!: string;

	@Field(() => Int, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	maxBitRate?: number;

	@Property(() => Boolean)
	roleAdmin!: boolean;

	@Property(() => Boolean)
	roleStream!: boolean;

	@Property(() => Boolean)
	roleUpload!: boolean;

	@Property(() => Boolean)
	rolePodcast!: boolean;

	@Field(() => [SessionQL])
	@OneToMany<Session>(() => Session, session => session.user, {orderBy: {expires: QueryOrder.ASC}})
	sessions: Collection<Session> = new Collection<Session>(this);

	@Field(() => [BookmarkQL])
	@OneToMany<Bookmark>(() => Bookmark, bookmark => bookmark.user, {
		orderBy: {
			track: {path: QueryOrder.ASC, tag: {disc: QueryOrder.ASC, trackNr: QueryOrder.ASC}},
			episode: {path: QueryOrder.ASC, tag: {disc: QueryOrder.ASC, trackNr: QueryOrder.ASC}},
			position: QueryOrder.ASC
		}
	})
	bookmarks: Collection<Bookmark> = new Collection<Bookmark>(this);

	@Field(() => PlayQueueQL, {nullable: true})
	@OneToOne<PlayQueue>(() => PlayQueue, playQueue => playQueue.user, {nullable: true})
	playQueue: Reference<PlayQueue> = new Reference<PlayQueue>(this);

	@Field(() => [PlaylistQL])
	@OneToMany<Playlist>(() => Playlist, playlist => playlist.user)
	playlists: Collection<Playlist> = new Collection<Playlist>(this);

	@OneToMany<State>(() => State, state => state.user, {orderBy: {destType: QueryOrder.ASC}})
	states: Collection<State> = new Collection<State>(this);
}

@ObjectType()
export class UserQL extends User {
	@Field(() => [UserRole])
	roles!: Array<UserRole>;
}

@ObjectType()
export class UserPageQL extends PaginatedResponse(User, UserQL) {
}

@ObjectType()
export class UserIndexGroupQL extends IndexGroup(User, UserQL) {
}

@ObjectType()
export class UserIndexQL extends Index(UserIndexGroupQL) {
}
