import {Folder, FolderQL} from '../folder/folder';
import {Track, TrackQL} from '../track/track';
import {Album, AlbumQL} from '../album/album';
import {Artist, ArtistQL} from '../artist/artist';
import {Series, SeriesQL} from '../series/series';
import {RootScanStrategy} from '../../types/enums';
import {Field, Int, ObjectType} from 'type-graphql';
import {Base, PaginatedResponse} from '../base/base';
import {Collection, Entity, Enum, ManyToMany, OneToMany, Property, QueryOrder} from 'mikro-orm';
import {RootStatus} from '../../modules/engine/services/io.types';

@ObjectType()
@Entity()
export class Root extends Base {
	@Field(() => String)
	@Property()
	name!: string;

	@Field(() => String)
	@Property()
	path!: string;

	@Field(() => RootScanStrategy)
	@Enum(() => RootScanStrategy)
	strategy!: RootScanStrategy;

	@Field(() => [FolderQL])
	@OneToMany(() => Folder, folder => folder.root, {orderBy: {path: QueryOrder.ASC}})
	folders: Collection<Folder> = new Collection<Folder>(this);

	@Field(() => [TrackQL])
	@OneToMany(() => Track, track => track.root, {orderBy: {path: QueryOrder.ASC, tag: {disc: QueryOrder.ASC, trackNr: QueryOrder.ASC} as any}})
	tracks: Collection<Track> = new Collection<Track>(this);

	@Field(() => [AlbumQL])
	@ManyToMany(() => Album, album => album.roots, {orderBy: {artist: {nameSort: QueryOrder.ASC} as any, albumType: QueryOrder.ASC, name: QueryOrder.ASC}})
	albums: Collection<Album> = new Collection<Album>(this);

	@Field(() => [ArtistQL])
	@ManyToMany(() => Artist, artist => artist.roots, {orderBy: {nameSort: QueryOrder.ASC}})
	artists: Collection<Artist> = new Collection<Artist>(this);

	@Field(() => [SeriesQL])
	@ManyToMany(() => Series, series => series.roots, {orderBy: {name: QueryOrder.ASC}})
	series: Collection<Series> = new Collection<Series>(this);
}

@ObjectType()
export class RootStatusQL {
	@Field(() => Date, {nullable: true})
	lastScan!: Date;
	@Field(() => Boolean)
	scanning!: boolean;
	@Field(() => String, {nullable: true})
	error?: string;
}

@ObjectType()
export class RootQL extends Root {
	@Field(() => RootStatusQL)
	status!: RootStatus;
}

@ObjectType()
export class RootPageQL extends PaginatedResponse(Root, RootQL) {
}
