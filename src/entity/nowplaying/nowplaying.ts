import { Track, TrackQL } from '../track/track.js';
import { Episode, EpisodeQL } from '../episode/episode.js';
import { User } from '../user/user.js';
import { Field, ID, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class NowPlaying {
	@Field(() => Int)
	time!: number;

	@Field(() => TrackQL, { nullable: true })
	track?: Track;

	@Field(() => EpisodeQL, { nullable: true })
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
