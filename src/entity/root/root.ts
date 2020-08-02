import {Folder, FolderQL} from '../folder/folder';
import {Track, TrackQL} from '../track/track';
import {Album, AlbumQL} from '../album/album';
import {Artist, ArtistQL} from '../artist/artist';
import {Series, SeriesQL} from '../series/series';
import {AlbumOrderFields, ArtistOrderFields, DefaultOrderFields, FolderOrderFields, RootScanStrategy, TrackOrderFields} from '../../types/enums';
import {Field, ObjectType} from 'type-graphql';
import {Base, PaginatedResponse} from '../base/base';
import {Collection, Entity, ManyToMany, OneToMany, Property} from '../../modules/orm';
import {RootStatus} from '../../modules/engine/services/io.types';

@ObjectType()
@Entity()
export class Root extends Base {
	@Field(() => String)
	@Property(() => String)
	name!: string;

	@Field(() => String)
	@Property(() => String)
	path!: string;

	@Field(() => RootScanStrategy)
	@Property(() => RootScanStrategy)
	strategy!: RootScanStrategy;

	@Field(() => [FolderQL])
	@OneToMany<Folder>(() => Folder, folder => folder.root, {order: [{orderBy: FolderOrderFields.default}]})
	folders: Collection<Folder> = new Collection<Folder>(this);

	@Field(() => [TrackQL])
	@OneToMany<Track>(() => Track, track => track.root, {order: [{orderBy: TrackOrderFields.default}]})
	tracks: Collection<Track> = new Collection<Track>(this);

	@Field(() => [AlbumQL])
	@ManyToMany<Album>(() => Album, album => album.roots, {order: [{orderBy: AlbumOrderFields.default}]})
	albums: Collection<Album> = new Collection<Album>(this);

	@Field(() => [ArtistQL])
	@ManyToMany<Artist>(() => Artist, artist => artist.roots, {order: [{orderBy: ArtistOrderFields.default}]})
	artists: Collection<Artist> = new Collection<Artist>(this);

	@Field(() => [SeriesQL])
	@ManyToMany<Series>(() => Series, series => series.roots, {order: [{orderBy: DefaultOrderFields.default}]})
	series: Collection<Series> = new Collection<Series>(this);
}

@ObjectType()
export class RootStatusQL {
	@Field(() => Date, {nullable: true})
	lastScan!: Date;
	@Field(() => Boolean, {nullable: true})
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
