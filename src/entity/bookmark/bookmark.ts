import {User} from '../user/user';
import {Track, TrackQL} from '../track/track';
import {Episode, EpisodeQL} from '../episode/episode';
import {Field, Float, ObjectType} from 'type-graphql';
import {Entity, ManyToOne, ORM_INT, Property, Reference} from '../../modules/orm';
import {Base, PaginatedResponse} from '../base/base';

@ObjectType()
@Entity()
export class Bookmark extends Base {
	@Field(() => Float)
	@Property(() => ORM_INT)
	position!: number;

	@Field(() => TrackQL, {nullable: true})
	@ManyToOne<Track>(() => Track, track => track.bookmarks, {nullable: true})
	track: Reference<Track> = new Reference<Track>(this);

	@Field(() => EpisodeQL, {nullable: true})
	@ManyToOne<Episode>(() => Episode, episode => episode.bookmarks, {nullable: true})
	episode: Reference<Episode> = new Reference<Episode>(this);

	@ManyToOne<User>(() => User, user => user.bookmarks)
	user: Reference<User> = new Reference<User>(this);

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	comment?: string;
}

@ObjectType()
export class BookmarkQL extends Bookmark {
}

@ObjectType()
export class BookmarkPageQL extends PaginatedResponse(Bookmark, BookmarkQL) {
}
