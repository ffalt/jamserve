import {User} from '../user/user';
import {Track, TrackQL} from '../track/track';
import {Episode, EpisodeQL} from '../episode/episode';
import {Field, Int, ObjectType} from 'type-graphql';
import {Entity, ManyToOne, Property} from 'mikro-orm';
import {Base, PaginatedResponse} from '../base/base';

@ObjectType()
@Entity()
export class Bookmark extends Base {
	@Field(() => Int)
	@Property()
	position!: number;

	@Field(() => TrackQL, {nullable: true})
	@ManyToOne(() => Track)
	track?: Track;

	@Field(() => EpisodeQL, {nullable: true})
	@ManyToOne(() => Episode)
	episode?: Episode;

	@ManyToOne(() => User)
	user!: User;

	@Field(() => String, {nullable: true})
	@Property()
	comment?: string;
}

@ObjectType()
export class BookmarkQL extends Bookmark {
}

@ObjectType()
export class BookmarkPageQL extends PaginatedResponse(Bookmark, BookmarkQL) {
}
