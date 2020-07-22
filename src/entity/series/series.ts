import {Track, TrackQL} from '../track/track';
import {Album, AlbumQL} from '../album/album';
import {Artist, ArtistQL} from '../artist/artist';
import {Root, RootQL} from '../root/root';
import {Folder, FolderQL} from '../folder/folder';
import {AlbumType} from '../../types/enums';
import {Field, Int, ObjectType} from 'type-graphql';
import {Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property, QueryOrder, Reference} from '../../modules/orm';
import {Base, Index, IndexGroup, PaginatedResponse} from '../base/base';
import {State, StateQL} from '../state/state';

@ObjectType()
@Entity()
export class Series extends Base {
	@Field(() => String)
	@Property(() => String)
	name!: string;

	@Field(() => [AlbumType])
	@Property(() => [AlbumType])
	albumTypes!: Array<AlbumType>;

	@Field(() => ArtistQL)
	@ManyToOne<Artist>(() => Artist, artist => artist.series)
	artist: Reference<Artist> = new Reference<Artist>(this);

	@Field(() => [TrackQL])
	@OneToMany<Track>(() => Track, track => track.series, {orderBy: {tag: {seriesNr: QueryOrder.ASC, disc: QueryOrder.ASC, trackNr: QueryOrder.ASC, title: QueryOrder.ASC} as any}})
	tracks: Collection<Track> = new Collection<Track>(this);

	@Field(() => [AlbumQL])
	@OneToMany<Album>(() => Album, album => album.series, {orderBy: {seriesNr: QueryOrder.ASC, name: QueryOrder.ASC}})
	albums: Collection<Album> = new Collection<Album>(this);

	@Field(() => [RootQL])
	@ManyToMany<Root>(() => Root, root => root.series, {owner: true, orderBy: {name: QueryOrder.ASC}})
	roots: Collection<Root> = new Collection<Root>(this);

	@Field(() => [FolderQL])
	@ManyToMany<Folder>(() => Folder, folder => folder.series, {owner: true, orderBy: {path: QueryOrder.ASC}})
	folders: Collection<Folder> = new Collection<Folder>(this);
}

@ObjectType()
export class SeriesQL extends Series {
	@Field(() => Int)
	rootsCount!: number;

	@Field(() => Int)
	foldersCount!: number;

	@Field(() => Int)
	tracksCount!: number;

	@Field(() => Int)
	albumsCount!: number;

	@Field(() => StateQL)
	state!: State
}

@ObjectType()
export class SeriesPageQL extends PaginatedResponse(Series, SeriesQL) {
}

@ObjectType()
export class SeriesIndexGroupQL extends IndexGroup(Series, SeriesQL) {
}

@ObjectType()
export class SeriesIndexQL extends Index(SeriesIndexGroupQL) {
}
