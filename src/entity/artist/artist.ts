import {Track, TrackQL} from '../track/track';
import {Album, AlbumQL} from '../album/album';
import {Root, RootQL} from '../root/root';
import {Folder, FolderQL} from '../folder/folder';
import {Series, SeriesQL} from '../series/series';
import {AlbumType} from '../../types/enums';
import {Field, Int, ObjectType} from 'type-graphql';
import {Collection, Entity, ManyToMany, OneToMany, Property, QueryOrder} from 'mikro-orm';
import {Base, Index, IndexGroup, PaginatedResponse} from '../base/base';
import {OrmStringListType} from '../../modules/engine/services/orm.types';
import {State, StateQL} from '../state/state';

@ObjectType()
@Entity()
export class Artist extends Base {
	@Field(() => String)
	@Property()
	name!: string;

	@Field(() => String)
	@Property()
	slug!: string;

	@Field(() => String)
	@Property()
	nameSort!: string;

	@Field(() => String, {nullable: true})
	@Property()
	mbArtistID?: string;

	@Field(() => [AlbumType])
	@Property({type: OrmStringListType})
	albumTypes: Array<AlbumType> = [];

	@Field(() => [String])
	@Property({type: OrmStringListType})
	genres: Array<string> = [];

	@Field(() => [TrackQL])
	@OneToMany(() => Track, track => track.artist, {orderBy: {album: {name: QueryOrder.ASC} as any, tag: {disc: QueryOrder.ASC, trackNr: QueryOrder.ASC} as any}})
	tracks: Collection<Track> = new Collection<Track>(this);

	@Field(() => [TrackQL])
	@OneToMany(() => Track, track => track.albumArtist, {orderBy: {album: {name: QueryOrder.ASC} as any, tag: {disc: QueryOrder.ASC, trackNr: QueryOrder.ASC} as any}})
	albumTracks: Collection<Track> = new Collection<Track>(this);

	@Field(() => [AlbumQL])
	@OneToMany(() => Album, album => album.artist, {orderBy: {albumType: QueryOrder.ASC, year: QueryOrder.DESC}})
	albums: Collection<Album> = new Collection<Album>(this);

	@Field(() => [RootQL])
	@ManyToMany(() => Root, root => root.artists, {owner: true, orderBy: {name: QueryOrder.ASC}})
	roots: Collection<Root> = new Collection<Root>(this);

	@Field(() => [FolderQL])
	@ManyToMany(() => Folder, folder => folder.artists, {owner: true, orderBy: {path: QueryOrder.ASC}})
	folders: Collection<Folder> = new Collection<Folder>(this);

	@Field(() => [SeriesQL])
	@OneToMany(() => Series, series => series.artist, {orderBy: {name: QueryOrder.ASC}})
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
