import {Session} from '../session/session';
import {Bookmark} from '../bookmark/bookmark';
import {PlayQueue, PlayQueueQL} from '../playqueue/playqueue';
import {Field, Int, ObjectType} from 'type-graphql';
import {State} from '../state/state';
import {Collection, Entity, OneToMany, OneToOne, ORM_INT, Property, Reference} from '../../modules/orm';
import {Base, Index, IndexGroup, PaginatedResponse} from '../base/base';
import {BookmarkOrderFields, SessionOrderFields, UserRole} from '../../types/enums';
import {Playlist} from '../playlist/playlist';
import {UserStatsQL} from '../stats/stats';

@ObjectType()
@Entity()
export class User extends Base {
	@Field(() => String)
	@Property(() => String)
	name!: string;

	@Property(() => String)
	hash!: string; // bcrypt hash (with concatenated salt & version)

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

	@OneToMany<Session>(() => 'Session', session => session.user, {order: [{orderBy: SessionOrderFields.expires}]})
	sessions: Collection<Session> = new Collection<Session>(this);

	@Field(() => PlayQueueQL, {nullable: true})
	@OneToOne<PlayQueue>(() => 'PlayQueue', playQueue => playQueue.user, {nullable: true})
	playQueue: Reference<PlayQueue> = new Reference<PlayQueue>(this);

	@OneToMany<Bookmark>(() => 'Bookmark', bookmark => bookmark.user, {order: [{orderBy: BookmarkOrderFields.media}, {orderBy: BookmarkOrderFields.position}]})
	bookmarks: Collection<Bookmark> = new Collection<Bookmark>(this);

	@OneToMany<Playlist>(() => 'Playlist', playlist => playlist.user)
	playlists: Collection<Playlist> = new Collection<Playlist>(this);

	@OneToMany<State>(() => 'State', state => state.user)
	states: Collection<State> = new Collection<State>(this);
}

@ObjectType()
export class UserFavoritesQL {
}

@ObjectType()
export class UserQL extends User {
	@Field(() => [UserRole])
	roles!: Array<UserRole>;
	@Field(() => UserFavoritesQL)
	favorites!: UserFavoritesQL;
	@Field(() => UserStatsQL)
	stats!: UserStatsQL;
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
