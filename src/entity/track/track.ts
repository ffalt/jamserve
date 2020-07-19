import {Root, RootQL} from '../root/root';
import {Folder, FolderQL} from '../folder/folder';
import {Series, SeriesQL} from '../series/series';
import {Album, AlbumQL} from '../album/album';
import {Artist, ArtistQL} from '../artist/artist';
import {MediaTagRawQL, Tag, TagQL} from '../tag/tag';
import {Bookmark, BookmarkQL} from '../bookmark/bookmark';
import {Field, Int, ObjectType} from 'type-graphql';
import {Cascade, Collection, Entity, ManyToOne, OneToMany, OneToOne, Property, QueryOrder} from 'mikro-orm';
import {Base, PaginatedResponse} from '../base/base';
import {State, StateQL} from '../state/state';
import {Waveform, WaveformQL} from '../waveform/waveform';
import {TrackHealthHint} from '../health/health.model';
import {MediaTagRaw} from '../tag/tag.model';
import {TrackLyrics} from './track.model';

@ObjectType()
@Entity()
export class Track extends Base {
	@Field(() => String)
	@Property()
	name!: string;

	@Field(() => String)
	@Property()
	fileName!: string;

	@Field(() => String)
	@Property()
	path!: string;

	@Property()
	statCreated!: number;

	@Property()
	statModified!: number;

	@Field(() => Int)
	@Property()
	fileSize!: number;

	@Field(() => SeriesQL, {nullable: true})
	@ManyToOne(() => Series)
	series?: Series;

	@Field(() => AlbumQL, {nullable: true})
	@ManyToOne(() => Album, {nullable: true})
	album?: Album;

	@Field(() => FolderQL)
	@ManyToOne(() => Folder)
	folder!: Folder;

	@Field(() => ArtistQL, {nullable: true})
	@ManyToOne(() => Artist)
	artist?: Artist;

	@Field(() => ArtistQL, {nullable: true})
	@ManyToOne(() => Artist)
	albumArtist?: Artist;

	@Field(() => RootQL)
	@ManyToOne(() => Root)
	root!: Root;

	@Field(() => [BookmarkQL])
	@OneToMany({entity: () => Bookmark, mappedBy: bookmark => bookmark.track, cascade: [Cascade.REMOVE], orderBy: {position: QueryOrder.ASC}})
	bookmarks: Collection<Bookmark> = new Collection<Bookmark>(this);

	@Field(() => TagQL, {nullable: true})
	@OneToOne({entity: () => Tag, nullable: true, cascade: [Cascade.REMOVE]})
	tag?: Tag;
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
