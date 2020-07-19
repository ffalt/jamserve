import {Artwork, ArtworkQL} from '../artwork/artwork';
import {Root, RootQL} from '../root/root';
import {Track, TrackQL} from '../track/track';
import {Album, AlbumQL} from '../album/album';
import {Artist, ArtistQL} from '../artist/artist';
import {Series, SeriesQL} from '../series/series';
import {AlbumType, FolderType} from '../../types/enums';
import {Field, Int, ObjectType} from 'type-graphql';
import {Cascade, Collection, Entity, Enum, ManyToMany, ManyToOne, OneToMany, Property, QueryOrder} from 'mikro-orm';
import {Base, Index, IndexGroup, PaginatedResponse} from '../base/base';
import {OrmStringListType} from '../../modules/engine/services/orm.types';
import {State, StateQL} from '../state/state';
import {FolderHealthHint} from '../health/health.model';

@ObjectType()
@Entity()
export class Folder extends Base {
	@Field(() => String)
	@Property()
	name!: string;

	@Field(() => String)
	@Property()
	title!: string;

	@Field(() => String)
	@Property()
	path!: string;

	@Field(() => Int)
	@Property()
	statCreated!: number;

	@Field(() => Int)
	@Property()
	statModified!: number;

	@Field(() => Int)
	@Property()
	level!: number;

	@Field(() => String, {nullable: true})
	@Property()
	album?: string;

	@Field(() => String, {nullable: true})
	@Property()
	artist?: string;

	@Field(() => String, {nullable: true})
	@Property()
	artistSort?: string;

	@Field(() => Int, {nullable: true})
	@Property()
	albumTrackCount?: number;

	@Field(() => Int, {nullable: true})
	@Property()
	year?: number;

	@Field(() => String, {nullable: true})
	@Property()
	mbReleaseID?: string;

	@Field(() => String, {nullable: true})
	@Property()
	mbReleaseGroupID?: string;

	@Field(() => String, {nullable: true})
	@Property()
	mbAlbumType?: string;

	@Field(() => String, {nullable: true})
	@Property()
	mbArtistID?: string;

	@Field(() => AlbumType, {nullable: true})
	@Enum(() => AlbumType)
	albumType?: AlbumType;

	@Field(() => FolderType)
	@Enum(() => FolderType)
	folderType!: FolderType;

	@Field(() => [String])
	@Property({type: OrmStringListType})
	genres: Array<string> = [];

	@Field(() => FolderQL, {nullable: true})
	@ManyToOne(() => Folder)
	parent?: Folder;

	@Field(() => [FolderQL])
	@OneToMany({entity: () => Folder, mappedBy: folder => folder.parent, cascade: [Cascade.REMOVE], orderBy: {path: QueryOrder.ASC}})
	children: Collection<Folder> = new Collection<Folder>(this);

	@Field(() => RootQL)
	@ManyToOne(() => Root)
	root!: Root;

	@Field(() => [ArtworkQL])
	@OneToMany({entity: () => Artwork, mappedBy: artwork => artwork.folder, cascade: [Cascade.REMOVE], orderBy: {name: QueryOrder.ASC}})
	artworks: Collection<Artwork> = new Collection<Artwork>(this);

	@Field(() => [TrackQL])
	@OneToMany({entity: () => Track, mappedBy: track => track.folder, cascade: [Cascade.REMOVE], orderBy: { tag: {disc: QueryOrder.ASC, trackNr: QueryOrder.ASC} as any}})
	tracks: Collection<Track> = new Collection<Track>(this);

	@Field(() => [AlbumQL])
	@ManyToMany(() => Album, album => album.folders, {orderBy: {albumType: QueryOrder.ASC, name: QueryOrder.ASC}})
	albums: Collection<Album> = new Collection<Album>(this);

	@Field(() => [ArtistQL])
	@ManyToMany(() => Artist, artist => artist.folders, {orderBy: {nameSort: QueryOrder.ASC}})
	artists: Collection<Artist> = new Collection<Artist>(this);

	@Field(() => [SeriesQL])
	@ManyToMany(() => Series, series => series.folders, {orderBy: {name: QueryOrder.ASC}})
	series: Collection<Series> = new Collection<Series>(this);
}

@ObjectType()
export class FolderQL extends Folder {
	@Field(() => Int)
	childrenCount!: number;

	@Field(() => Int)
	artworksCount!: number;

	@Field(() => Int)
	tracksCount!: number;

	@Field(() => Int)
	albumsCount!: number;

	@Field(() => Int)
	artistsCount!: number;

	@Field(() => Int)
	seriesCount!: number;

	@Field(() => Int)
	rootsCount!: number;

	@Field(() => StateQL)
	state!: State
}

@ObjectType()
export class FolderPageQL extends PaginatedResponse(Folder, FolderQL) {
}

@ObjectType()
export class FolderIndexGroupQL extends IndexGroup(Folder, FolderQL) {
}

@ObjectType()
export class FolderIndexQL extends Index(FolderIndexGroupQL) {
}

@ObjectType()
export class FolderHealth {
	@Field(() => Folder)
	folder!: Folder;
	@Field(() => [FolderHealthHint])
	health!: Array<FolderHealthHint>;
}
