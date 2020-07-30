import {Track, TrackQL} from '../track/track';
import {Episode, EpisodeQL} from '../episode/episode';
import {Playlist, PlaylistQL} from '../playlist/playlist';
import {Field, Float, ObjectType} from 'type-graphql';
import {Base} from '../base/base';
import {Entity, ManyToOne, ORM_INT, Property, Reference} from '../../modules/orm';

@ObjectType()
@Entity()
export class PlaylistEntry extends Base {
	@Field(() => Float)
	@Property(() => ORM_INT)
	position!: number;

	@Field(() => PlaylistQL)
	@ManyToOne<Playlist>(() => Playlist, playlist => playlist.entries)
	playlist: Reference<Playlist> = new Reference<Playlist>(this);

	@Field(() => TrackQL)
	@ManyToOne<Track>(() => Track, track => track.playlistEntries)
	track: Reference<Track> = new Reference<Track>(this);

	@Field(() => EpisodeQL)
	@ManyToOne<Episode>(() => Episode, episode => episode.playlistEntries)
	episode: Reference<Episode> = new Reference<Episode>(this);
}

@ObjectType()
export class PlaylistEntryQL extends PlaylistEntry {
}
