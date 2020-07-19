import {Session, SessionQL} from '../session/session';
import {Bookmark, BookmarkQL} from '../bookmark/bookmark';
import {PlayQueue, PlayQueueQL} from '../playqueue/playqueue';
import {Field, Int, ObjectType} from 'type-graphql';
import {State} from '../state/state';
import {Cascade, Collection, Entity, OneToMany, OneToOne, Property, QueryOrder} from 'mikro-orm';
import {Base, Index, IndexGroup, PaginatedResponse} from '../base/base';
import {UserRole} from '../../types/enums';

@ObjectType()
@Entity()
export class User extends Base {
	@Field(() => String)
	@Property()
	name!: string;

	@Property()
	salt!: string;

	@Property()
	hash!: string;

	@Field(() => String)
	@Property()
	email!: string;

	@Field(() => Int, {nullable: true})
	@Property()
	maxBitRate?: number;

	@Property()
	roleAdmin!: boolean;

	@Property()
	roleStream!: boolean;

	@Property()
	roleUpload!: boolean;

	@Property()
	rolePodcast!: boolean;

	@Field(() => [SessionQL])
	@OneToMany(() => Session, session => session.user, {orderBy: {expires: QueryOrder.ASC}})
	sessions: Collection<Session> = new Collection<Session>(this);

	@Field(() => [BookmarkQL])
	@OneToMany(() => Bookmark, bookmark => bookmark.user, {
		orderBy: {
			track: {path: QueryOrder.ASC, tag: {disc: QueryOrder.ASC, trackNr: QueryOrder.ASC}} as any,
			episode: {path: QueryOrder.ASC, tag: {disc: QueryOrder.ASC, trackNr: QueryOrder.ASC}} as any,
			position: QueryOrder.ASC
		}
	})
	bookmarks: Collection<Bookmark> = new Collection<Bookmark>(this);

	@Field(() => PlayQueueQL, {nullable: true})
	@OneToOne(() => PlayQueue)
	playQueue?: PlayQueue;

	@OneToMany(() => State, state => state.user, {cascade: [Cascade.REMOVE], orderBy: {destType: QueryOrder.ASC}})
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
