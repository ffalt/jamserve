import { Track, TrackQL } from '../track/track.js';
import { Episode, EpisodeQL } from '../episode/episode.js';
import { Playlist, PlaylistQL } from '../playlist/playlist.js';
import { Field, Int, ObjectType } from 'type-graphql';
import { Base } from '../base/base.js';
import { Entity, ManyToOne, ORM_INT, Property, Reference } from '../../modules/orm/index.js';

@ObjectType()
@Entity()
export class PlaylistEntry extends Base {
	@Field(() => Int)
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
