import {Artwork, ArtworkQL} from '../artwork/artwork';
import {Root, RootQL} from '../root/root';
import {Track, TrackQL} from '../track/track';
import {Album, AlbumQL} from '../album/album';
import {Artist, ArtistQL} from '../artist/artist';
import {Series, SeriesQL} from '../series/series';
import {AlbumOrderFields, AlbumType, ArtistOrderFields, DefaultOrderFields, FolderOrderFields, FolderType, TrackOrderFields} from '../../types/enums';
import {Field, Int, ObjectType} from 'type-graphql';
import {Collection, Entity, ManyToMany, ManyToOne, OneToMany, ORM_INT, ORM_TIMESTAMP, Property, Reference} from '../../modules/orm';
import {Base, Index, IndexGroup, PaginatedResponse} from '../base/base';
import {State, StateQL} from '../state/state';
import {FolderHealthHint} from '../health/health.model';

@ObjectType()
@Entity()
export class Folder extends Base {
	@Field(() => String)
	@Property(() => String)
	name!: string;

	@Field(() => String)
	@Property(() => String)
	title!: string;

	@Field(() => String)
	@Property(() => String)
	path!: string;

	@Field(() => Date)
	@Property(() => ORM_TIMESTAMP)
	statCreated!: number;

	@Field(() => Date)
	@Property(() => ORM_TIMESTAMP)
	statModified!: number;

	@Field(() => Int)
	@Property(() => ORM_INT)
	level!: number;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	album?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	artist?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	artistSort?: string;

	@Field(() => Int, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	albumTrackCount?: number;

	@Field(() => Int, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	year?: number;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	mbReleaseID?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	mbReleaseGroupID?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	mbAlbumType?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	mbArtistID?: string;

	@Field(() => AlbumType, {nullable: true})
	@Property(() => AlbumType, {nullable: true})
	albumType?: AlbumType;

	@Field(() => FolderType)
	@Property(() => FolderType)
	folderType!: FolderType;

	@Field(() => [String])
	@Property(() => [String])
	genres: Array<string> = [];

	@Field(() => FolderQL, {nullable: true})
	@ManyToOne<Folder>(() => Folder, folder => folder.children, {nullable: true})
	parent: Reference<Folder> = new Reference<Folder>(this);

	@Field(() => [FolderQL])
	@OneToMany<Folder>(() => Folder, folder => folder.parent, {order: [{orderBy: FolderOrderFields.name}]})
	children: Collection<Folder> = new Collection<Folder>(this);

	@Field(() => RootQL)
	@ManyToOne<Root>(() => Root, root => root.folders)
	root: Reference<Root> = new Reference<Root>(this);

	@Field(() => [ArtworkQL])
	@OneToMany<Artwork>(() => Artwork, artwork => artwork.folder, {order: [{orderBy: DefaultOrderFields.default}]})
	artworks: Collection<Artwork> = new Collection<Artwork>(this);

	@Field(() => [TrackQL])
	@OneToMany<Track>(() => Track, track => track.folder, {order: [{orderBy: TrackOrderFields.default}]})
	tracks: Collection<Track> = new Collection<Track>(this);

	@Field(() => [AlbumQL])
	@ManyToMany<Album>(() => Album, album => album.folders, {order: [{orderBy: AlbumOrderFields.default}]})
	albums: Collection<Album> = new Collection<Album>(this);

	@Field(() => [ArtistQL])
	@ManyToMany<Artist>(() => Artist, artist => artist.folders, {order: [{orderBy: ArtistOrderFields.default}]})
	artists: Collection<Artist> = new Collection<Artist>(this);

	@Field(() => [SeriesQL])
	@ManyToMany<Series>(() => Series, series => series.folders, {order: [{orderBy: DefaultOrderFields.default}]})
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
