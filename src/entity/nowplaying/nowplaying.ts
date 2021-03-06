import {Track, TrackQL} from '../track/track';
import {Episode, EpisodeQL} from '../episode/episode';
import {User} from '../user/user';
import {Field, Float, ID, ObjectType} from 'type-graphql';

@ObjectType()
export class NowPlaying {
	@Field(() => Float)
	time!: number;
	@Field(() => TrackQL, {nullable: true})
	track?: Track;
	@Field(() => EpisodeQL, {nullable: true})
	episode?: Episode;
	user!: User;
}

@ObjectType()
export class NowPlayingQL extends NowPlaying {
	@Field(() => String)
	userName!: string;
	@Field(() => ID)
	userID!: string;
}
