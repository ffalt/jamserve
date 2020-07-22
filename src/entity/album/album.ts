import {Track, TrackQL} from '../track/track';
import {Root, RootQL} from '../root/root';
import {Folder, FolderQL} from '../folder/folder';
import {Series, SeriesQL} from '../series/series';
import {Artist, ArtistQL} from '../artist/artist';
import {AlbumType} from '../../types/enums';
import {Field, Int, ObjectType} from 'type-graphql';
import {Base, Index, IndexGroup, PaginatedResponse} from '../base/base';
import {State, StateQL} from '../state/state';
import {Collection, Entity, ManyToMany, ManyToOne, OneToMany, ORM_INT, Property, QueryOrder, Reference} from '../../modules/orm';

@ObjectType()
@Entity()
export class Album extends Base {
	@Field(() => String)
	@Property(() => String)
	name!: string;

	@Field(() => String)
	@Property(() => String)
	slug!: string;

	@Field(() => AlbumType)
	@Property(() => AlbumType)
	albumType: AlbumType = AlbumType.unknown;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	seriesNr?: string;

	@Field(() => Int, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	year?: number;

	@Field(() => Int, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	duration!: number;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	mbArtistID?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	mbReleaseID?: string;

	@Field(() => [String])
	@Property(() => [String])
	genres: Array<string> = [];

	@Field(() => [TrackQL])
	@OneToMany<Track>(() => Track, track => track.album, {orderBy: {tag: {disc: QueryOrder.ASC, trackNr: QueryOrder.ASC, title: QueryOrder.ASC}}})
	tracks: Collection<Track> = new Collection<Track>(this);

	@Field(() => [RootQL])
	@ManyToMany<Root>(() => Root, root => root.albums, {owner: true, orderBy: {name: QueryOrder.ASC}})
	roots: Collection<Root> = new Collection<Root>(this);

	@Field(() => [FolderQL])
	@ManyToMany<Folder>(() => Folder, folder => folder.albums, {owner: true, orderBy: {path: QueryOrder.ASC}})
	folders: Collection<Folder> = new Collection<Folder>(this);

	@Field(() => [SeriesQL], {nullable: true})
	@ManyToOne<Series>(() => Series, series => series.albums, {nullable: true})
	series: Reference<Series> = new Reference<Series>(this);

	@Field(() => ArtistQL)
	@ManyToOne<Artist>(() => Artist, artist => artist.albums)
	artist: Reference<Artist> = new Reference<Artist>(this);
}

@ObjectType()
export class AlbumQL extends Album {
	@Field(() => Int)
	tracksCount!: number;

	@Field(() => Int)
	rootsCount!: number;

	@Field(() => Int)
	foldersCount!: number;

	@Field(() => StateQL)
	state!: State;
}

@ObjectType()
export class AlbumPageQL extends PaginatedResponse(Album, AlbumQL) {
}

@ObjectType()
export class AlbumIndexGroupQL extends IndexGroup(Album, AlbumQL) {
}

@ObjectType()
export class AlbumIndexQL extends Index(AlbumIndexGroupQL) {
}
