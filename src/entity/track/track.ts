import {Root, RootQL} from '../root/root';
import {Folder, FolderQL} from '../folder/folder';
import {Series, SeriesQL} from '../series/series';
import {Album, AlbumQL} from '../album/album';
import {Artist, ArtistQL} from '../artist/artist';
import {MediaTagRawQL, Tag, TagQL} from '../tag/tag';
import {Bookmark, BookmarkQL} from '../bookmark/bookmark';
import {Field, Float, Int, ObjectType} from 'type-graphql';
import {Collection, Entity, ManyToOne, OneToMany, OneToOne, ORM_INT, ORM_TIMESTAMP, Property, QueryOrder, Reference} from '../../modules/orm';
import {Base, PaginatedResponse} from '../base/base';
import {State, StateQL} from '../state/state';
import {Waveform, WaveformQL} from '../waveform/waveform';
import {TrackHealthHint} from '../health/health.model';
import {MediaTagRaw} from '../tag/tag.model';
import {TrackLyrics} from './track.model';
import {PlayQueueEntry} from '../playqueueentry/playqueue-entry';
import {PlaylistEntry} from '../playlistentry/playlist-entry';
import {BookmarkOrderFields} from '../../types/enums';

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

	@Property(() => ORM_TIMESTAMP)
	statCreated!: number;

	@Property(() => ORM_TIMESTAMP)
	statModified!: number;

	@Field(() => Float)
	@Property(() => ORM_INT)
	fileSize!: number;

	@Field(() => SeriesQL, {nullable: true})
	@ManyToOne<Series>(() => Series, series => series.tracks)
	series = new Reference<Series>(this);

	@Field(() => AlbumQL, {nullable: true})
	@ManyToOne<Album>(() => Album, album => album.tracks, {nullable: true})
	album = new Reference<Album>(this);

	@Field(() => FolderQL)
	@ManyToOne<Folder>(() => Folder, folder => folder.tracks)
	folder = new Reference<Folder>(this);

	@Field(() => ArtistQL, {nullable: true})
	@ManyToOne<Artist>(() => Artist, artist => artist.tracks, {nullable: true})
	artist = new Reference<Artist>(this);

	@Field(() => ArtistQL, {nullable: true})
	@ManyToOne<Artist>(() => Artist, artist => artist.albumTracks, {nullable: true})
	albumArtist = new Reference<Artist>(this);

	@Field(() => RootQL)
	@ManyToOne<Root>(() => Root, root => root.tracks)
	root = new Reference<Root>(this);

	@Field(() => [BookmarkQL])
	@OneToMany<Bookmark>(() => Bookmark, bookmark => bookmark.track, {order: [{orderBy: BookmarkOrderFields.default}], onDelete: 'cascade'})
	bookmarks: Collection<Bookmark> = new Collection<Bookmark>(this);

	@OneToMany<PlayQueueEntry>(() => PlayQueueEntry, playqueueEntry => playqueueEntry.track)
	playqueueEntries: Collection<PlayQueueEntry> = new Collection<PlayQueueEntry>(this);

	@OneToMany<PlaylistEntry>(() => PlaylistEntry, playlistEntry => playlistEntry.track)
	playlistEntries: Collection<PlaylistEntry> = new Collection<PlaylistEntry>(this);

	@Field(() => TagQL, {nullable: true})
	@OneToOne<Tag>(() => Tag, tag => tag.track, {owner: true, nullable: true})
	tag: Reference<Tag> = new Reference<Tag>(this);
}

@ObjectType()
export class TrackLyricsQL {
	@Field(() => String, {nullable: true})
	lyrics?: string;
	@Field(() => String, {nullable: true})
	source?: string;
}

@ObjectType()
export class TrackQL extends Track {
	@Field(() => StateQL)
	state!: State

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
