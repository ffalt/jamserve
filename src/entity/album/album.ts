import {Track, TrackQL} from '../track/track';
import {Root, RootQL} from '../root/root';
import {Folder, FolderQL} from '../folder/folder';
import {Series, SeriesQL} from '../series/series';
import {Artist, ArtistQL} from '../artist/artist';
import {AlbumType} from '../../types/enums';
import {Field, Int, ObjectType} from 'type-graphql';
import {Base, Index, IndexGroup, PaginatedResponse} from '../base/base';
import {Collection, Entity, Enum, ManyToMany, ManyToOne, OneToMany, Property, QueryOrder} from 'mikro-orm';
import {OrmStringListType} from '../../modules/engine/services/orm.types';
import {State, StateQL} from '../state/state';

@ObjectType()
@Entity()
export class Album extends Base {
	@Field(() => String)
	@Property()
	name!: string;

	@Field(() => String)
	@Property()
	slug!: string;

	@Field(() => AlbumType)
	@Enum(() => AlbumType)
	albumType: AlbumType = AlbumType.unknown;

	@Field(() => String, {nullable: true})
	@Property()
	seriesNr?: string;

	@Field(() => Int, {nullable: true})
	@Property()
	year?: number;

	@Field(() => Int, {nullable: true})
	@Property()
	duration!: number;

	@Field(() => String, {nullable: true})
	@Property()
	mbArtistID?: string;

	@Field(() => String, {nullable: true})
	@Property()
	mbReleaseID?: string;

	@Field(() => [String])
	@Property({type: OrmStringListType})
	genres: Array<string> = [];

	@Field(() => [TrackQL])
	@OneToMany(() => Track, track => track.album, {orderBy: {tag: {disc: QueryOrder.ASC, trackNr: QueryOrder.ASC, title: QueryOrder.ASC} as any}})
	tracks: Collection<Track> = new Collection<Track>(this);

	@Field(() => [RootQL])
	@ManyToMany(() => Root, root => root.albums, {owner: true, orderBy: {name: QueryOrder.ASC}})
	roots: Collection<Root> = new Collection<Root>(this);

	@Field(() => [FolderQL])
	@ManyToMany(() => Folder, folder => folder.albums, {owner: true, orderBy: {path: QueryOrder.ASC}})
	folders: Collection<Folder> = new Collection<Folder>(this);

	@Field(() => [SeriesQL], {nullable: true})
	@ManyToOne(() => Series)
	series?: Series;

	@Field(() => ArtistQL)
	@ManyToOne(() => Artist)
	artist!: Artist;
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
