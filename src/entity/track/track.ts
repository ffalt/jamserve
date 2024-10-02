import { Root, RootQL } from '../root/root.js';
import { Folder, FolderQL } from '../folder/folder.js';
import { Series, SeriesQL } from '../series/series.js';
import { Album, AlbumQL } from '../album/album.js';
import { Artist, ArtistQL } from '../artist/artist.js';
import { MediaTagRawQL, Tag, TagQL } from '../tag/tag.js';
import { Bookmark, BookmarkQL } from '../bookmark/bookmark.js';
import { Field, Float, Int, ObjectType } from 'type-graphql';
import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, ORM_DATETIME, ORM_INT, Property, Reference } from '../../modules/orm/index.js';
import { Base, PaginatedResponse } from '../base/base.js';
import { State, StateQL } from '../state/state.js';
import { Waveform, WaveformQL } from '../waveform/waveform.js';
import { TrackHealthHint } from '../health/health.model.js';
import { MediaTagRaw } from '../tag/tag.model.js';
import { TrackLyrics } from './track.model.js';
import { PlayQueueEntry } from '../playqueueentry/playqueue-entry.js';
import { PlaylistEntry } from '../playlistentry/playlist-entry.js';
import { BookmarkOrderFields } from '../../types/enums.js';
import { Genre, GenreQL } from '../genre/genre.js';

@ObjectType()
@Entity()
export class Track extends Base {
	@Field(() => String)
	@Property(() => String)
	name!: string;

	@Field(() => String)
	@Property(() => String)
	fileName!: string;

	@Field(() => String)
	@Property(() => String)
	path!: string;

	@Property(() => ORM_DATETIME)
	statCreated!: Date;

	@Property(() => ORM_DATETIME)
	statModified!: Date;

	@Field(() => Float)
	@Property(() => ORM_INT)
	fileSize!: number;

	@Field(() => SeriesQL, { nullable: true })
	@ManyToOne<Series>(() => Series, series => series.tracks)
	series = new Reference<Series>(this);

	@Field(() => AlbumQL, { nullable: true })
	@ManyToOne<Album>(() => Album, album => album.tracks, { nullable: true })
	album = new Reference<Album>(this);

	@Field(() => FolderQL)
	@ManyToOne<Folder>(() => Folder, folder => folder.tracks)
	folder = new Reference<Folder>(this);

	@Field(() => ArtistQL, { nullable: true })
	@ManyToOne<Artist>(() => Artist, artist => artist.tracks, { nullable: true })
	artist = new Reference<Artist>(this);

	@Field(() => ArtistQL, { nullable: true })
	@ManyToOne<Artist>(() => Artist, artist => artist.albumTracks, { nullable: true })
	albumArtist = new Reference<Artist>(this);

	@Field(() => [GenreQL])
	@ManyToMany<Genre>(() => Genre, genre => genre.tracks)
	genres: Collection<Genre> = new Collection<Genre>(this);

	@Field(() => RootQL)
	@ManyToOne<Root>(() => Root, root => root.tracks)
	root = new Reference<Root>(this);

	@Field(() => [BookmarkQL])
	@OneToMany<Bookmark>(() => Bookmark, bookmark => bookmark.track, { order: [{ orderBy: BookmarkOrderFields.default }], onDelete: 'cascade' })
	bookmarks: Collection<Bookmark> = new Collection<Bookmark>(this);

	@OneToMany<PlayQueueEntry>(() => PlayQueueEntry, playqueueEntry => playqueueEntry.track)
	playqueueEntries: Collection<PlayQueueEntry> = new Collection<PlayQueueEntry>(this);

	@OneToMany<PlaylistEntry>(() => PlaylistEntry, playlistEntry => playlistEntry.track)
	playlistEntries: Collection<PlaylistEntry> = new Collection<PlaylistEntry>(this);

	@Field(() => TagQL, { nullable: true })
	@OneToOne<Tag>(() => Tag, tag => tag.track, { owner: true, nullable: true })
	tag: Reference<Tag> = new Reference<Tag>(this);
}

@ObjectType()
export class TrackLyricsQL {
	@Field(() => String, { nullable: true })
	lyrics?: string;

	@Field(() => String, { nullable: true })
	source?: string;
}

@ObjectType()
export class TrackQL extends Track {
	@Field(() => StateQL)
	state!: State;

	@Field(() => WaveformQL)
	waveform!: Waveform;

	@Field(() => MediaTagRawQL)
	rawTag!: MediaTagRaw;

	@Field(() => TrackLyricsQL)
	lyrics!: TrackLyrics;

	@Field(() => Int)
	bookmarksCount!: number;

	@Field(() => Date)
	fileCreated!: Date;

	@Field(() => Date)
	fileModified!: Date;
}

@ObjectType()
export class TrackHealthHintQL extends TrackHealthHint {
}

@ObjectType()
export class TrackPageQL extends PaginatedResponse(Track, TrackQL) {
}

@ObjectType()
export class TrackHealth {
	@Field(() => TrackQL)
	track!: Track;

	@Field(() => [TrackHealthHintQL])
	health!: Array<TrackHealthHint>;
}
