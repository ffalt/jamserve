import { Base, Page } from '../base/base.model.js';
import { AlbumType } from '../../types/enums.js';
import { TrackBase } from '../track/track.model.js';
import { ExtendedInfo } from '../metadata/metadata.model.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ArtistBase } from '../artist/artist.model.js';
import { GenreBase } from '../genre/genre.model.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';

@ResultType({ description: 'Album' })
export class AlbumBase extends Base {
	@ObjectField(() => AlbumType, { description: 'Album Type', example: AlbumType.compilation })
	albumType!: AlbumType;

	@ObjectField({ description: 'Album Play Duration', example: 12_345 })
	duration!: number;

	@ObjectField({ description: 'Album Artist Id', isID: true })
	artistID!: string;

	@ObjectField({ description: 'Album Artist', example: 'Pink Floyd' })
	artistName!: string;

	@ObjectField({ nullable: true, description: 'Number of Tracks', min: 0, example: 5 })
	trackCount?: number;

	@ObjectField(() => [String], { nullable: true, description: 'List of Track Ids', isID: true })
	trackIDs?: Array<string>;

	@ObjectField(() => [GenreBase], { nullable: true, description: 'Genres' })
	genres?: Array<GenreBase>;

	@ObjectField({ nullable: true, description: 'Album Release Year', example: examples.year })
	year?: number;

	@ObjectField({ nullable: true, description: 'MusicBrainz Artist Id', example: examples.mbArtistID })
	mbArtistID?: string;

	@ObjectField({ nullable: true, description: 'MusicBrainz Release Id', example: examples.mbReleaseID })
	mbReleaseID?: string;

	@ObjectField({ nullable: true, description: 'Series Name', example: 'A Series of Unfortunate Events' })
	series?: string;

	@ObjectField({ nullable: true, description: 'Series Id', isID: true })
	seriesID?: string;

	@ObjectField({ nullable: true, description: 'Series Nr', example: '001' })
	seriesNr?: string;

	@ObjectField(() => ExtendedInfo, { nullable: true, description: 'Metadata for the Album (via External Service)' })
	info?: ExtendedInfo;
}

@ResultType({ description: 'Album with tracks' })
export class Album extends AlbumBase {
	@ObjectField(() => [TrackBase], { nullable: true, description: 'List of Tracks' })
	tracks?: Array<TrackBase>;

	@ObjectField(() => ArtistBase, { nullable: true, description: 'Album Artist' })
	artist?: ArtistBase;
}

@ResultType({ description: 'Album Page' })
export class AlbumPage extends Page {
	@ObjectField(() => Album, { description: 'List of Albums' })
	items!: Array<Album>;
}

@ResultType({ description: 'Album Index Entry' })
export class AlbumIndexEntry {
	@ObjectField({ description: 'ID', isID: true })
	id!: string;

	@ObjectField({ description: 'Name', example: 'Awesome' })
	name!: string;

	@ObjectField({ description: 'Artist', example: 'Primus' })
	artist!: string;

	@ObjectField({ description: 'Artist Id', isID: true })
	artistID!: string;

	@ObjectField({ description: 'Track Count', min: 0, example: 5 })
	trackCount!: number;
}

@ResultType({ description: 'Album Index Group' })
export class AlbumIndexGroup {
	@ObjectField({ description: 'Index Group Name', example: 'P' })
	name!: string;

	@ObjectField(() => [AlbumIndexEntry])
	items!: Array<AlbumIndexEntry>;
}

@ResultType({ description: 'Album Index' })
export class AlbumIndex {
	@ObjectField({ description: 'Last Change Timestamp' })
	lastModified!: number;

	@ObjectField(() => [AlbumIndexGroup], { description: 'Album Index Groups' })
	groups!: Array<AlbumIndexGroup>;
}
