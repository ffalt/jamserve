import {Track, TrackQL} from '../track/track';
import {Album, AlbumQL} from '../album/album';
import {Root, RootQL} from '../root/root';
import {Folder, FolderQL} from '../folder/folder';
import {Series, SeriesQL} from '../series/series';
import {AlbumOrderFields, AlbumType, DefaultOrderFields, FolderOrderFields, TrackOrderFields} from '../../types/enums';
import {Field, Int, ObjectType} from 'type-graphql';
import {Collection, Entity, ManyToMany, OneToMany, Property} from '../../modules/orm';
import {Base, Index, IndexGroup, PaginatedResponse} from '../base/base';
import {State, StateQL} from '../state/state';

@ObjectType()
@Entity()
export class Artist extends Base {
	@Field(() => String)
	@Property(() => String)
	name!: string;

	@Field(() => String)
	@Property(() => String)
	slug!: string;

	@Field(() => String)
	@Property(() => String)
	nameSort!: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	mbArtistID?: string;

	@Field(() => [AlbumType])
	@Property(() => [AlbumType])
	albumTypes: Array<AlbumType> = [];

	@Field(() => [String])
	@Property(() => [String])
	genres: Array<string> = [];

	@Field(() => [TrackQL])
	@OneToMany<Track>(() => Track, track => track.artist, {order: [{orderBy: TrackOrderFields.album}, {orderBy: TrackOrderFields.default}]})
	tracks: Collection<Track> = new Collection<Track>(this);

	@Field(() => [TrackQL])
	@OneToMany<Track>(() => Track, track => track.albumArtist, {order: [{orderBy: TrackOrderFields.album}, {orderBy: TrackOrderFields.default}]})
	albumTracks: Collection<Track> = new Collection<Track>(this);

	@Field(() => [AlbumQL])
	@OneToMany<Album>(() => Album, album => album.artist, {order: [{orderBy: AlbumOrderFields.default}]})
	albums: Collection<Album> = new Collection<Album>(this);

	@Field(() => [RootQL])
	@ManyToMany<Root>(() => Root, root => root.artists, {owner: true, order: [{orderBy: DefaultOrderFields.default}]})
	roots: Collection<Root> = new Collection<Root>(this);

	@Field(() => [FolderQL])
	@ManyToMany<Folder>(() => Folder, folder => folder.artists, {owner: true, order: [{orderBy: FolderOrderFields.default}]})
	folders: Collection<Folder> = new Collection<Folder>(this);

	@Field(() => [SeriesQL])
	@OneToMany<Series>(() => Series, series => series.artist, {order: [{orderBy: DefaultOrderFields.default}]})
	series: Collection<Series> = new Collection<Series>(this);
}

@ObjectType()
export class ArtistQL extends Artist {
	@Field(() => Int)
	tracksCount!: number;

	@Field(() => Int)
	albumsCount!: number;

	@Field(() => Int)
	rootsCount!: number;

	@Field(() => Int)
	foldersCount!: number;

	@Field(() => Int)
	seriesCount!: number;

	@Field(() => StateQL)
	state!: State
}

@ObjectType()
export class ArtistPageQL extends PaginatedResponse(Artist, ArtistQL) {
}

@ObjectType()
export class ArtistIndexGroupQL extends IndexGroup(Artist, ArtistQL) {
}

@ObjectType()
export class ArtistIndexQL extends Index(ArtistIndexGroupQL) {
}
