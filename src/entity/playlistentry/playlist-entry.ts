import {Track, TrackQL} from '../track/track';
import {Episode, EpisodeQL} from '../episode/episode';
import {Playlist, PlaylistQL} from '../playlist/playlist';
import {Field, Int, ObjectType} from 'type-graphql';
import {Base} from '../base/base';
import {Entity, ManyToOne, OneToOne, Property} from 'mikro-orm';

@ObjectType()
@Entity()
export class PlaylistEntry extends Base {
	@Field(() => Int)
	@Property()
	position!: number;

	@Field(() => PlaylistQL)
	@ManyToOne(() => Playlist)
	playlist!: Playlist;

	@Field(() => TrackQL)
	@OneToOne(() => Track)
	track?: Track;

	@Field(() => EpisodeQL)
	@OneToOne(() => Episode)
	episode?: Episode;
}

@ObjectType()
export class PlaylistEntryQL extends PlaylistEntry {
}
