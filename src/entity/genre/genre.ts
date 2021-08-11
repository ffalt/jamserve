import {Field, Int, ObjectType} from 'type-graphql';
import {Base, Index, IndexGroup, PaginatedResponse} from '../base/base';
import {Entity, ManyToMany, Property} from '../../modules/orm/decorators';
import {Collection} from '../../modules/orm';
import {Track, TrackQL} from '../track/track';
import {Album, AlbumQL} from '../album/album';
import {Artist, ArtistQL} from '../artist/artist';
import {Folder, FolderQL} from '../folder/folder';
import {Series, SeriesQL} from '../series/series';

@Entity()
@ObjectType()
export class Genre extends Base {
	@Field(() => String)
	@Property(() => String)
	name!: string;
	@Field(() => [TrackQL])
	@ManyToMany<Track>(() => Track, track => track.genres, {owner: true})
	tracks: Collection<Track> = new Collection<Track>(this);
	@Field(() => [AlbumQL])
	@ManyToMany<Track>(() => Album, album => album.genres, {owner: true})
	albums: Collection<Album> = new Collection<Album>(this);
	@Field(() => [ArtistQL])
	@ManyToMany<Artist>(() => Artist, artist => artist.genres, {owner: true})
	artists: Collection<Artist> = new Collection<Artist>(this);
	@Field(() => [FolderQL])
	@ManyToMany<Folder>(() => Folder, folder => folder.genres, {owner: true})
	folders: Collection<Folder> = new Collection<Folder>(this);
	@Field(() => [SeriesQL])
	@ManyToMany<Series>(() => Series, series => series.genres, {owner: true})
	series: Collection<Series> = new Collection<Series>(this);
}

@ObjectType()
export class GenreQL extends Genre {
	@Field(() => Int)
	trackCount!: number;
	@Field(() => Int)
	albumCount!: number;
	@Field(() => Int)
	artistCount!: number;
	@Field(() => Int)
	folderCount!: number;
}

@ObjectType()
export class GenrePageQL extends PaginatedResponse(Genre, GenreQL) {
}

@ObjectType()
export class GenreIndexGroupQL extends IndexGroup(GenreQL, GenreQL) {
}

@ObjectType()
export class GenreIndexQL extends Index(GenreIndexGroupQL) {
}
