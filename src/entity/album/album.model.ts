import { Base, Page } from '../base/base.model.js';
import { AlbumType } from '../../types/enums.js';
import { TrackBase } from '../track/track.model.js';
import { ExtendedInfo } from '../metadata/metadata.model.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ArtistBase } from '../artist/artist.model.js';
import { GenreBase } from '../genre/genre.model.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
import { ResultType } from '../../modules/rest/decorators/ResultType.js';

@ResultType({ description: 'Album' })
export class AlbumBase extends Base {
	@ObjField(() => AlbumType, { description: 'Album Type', example: AlbumType.compilation })
	albumType!: AlbumType;

	@ObjField({ description: 'Album Play Duration', example: 12_345 })
	duration!: number;

	@ObjField({ description: 'Album Artist Id', isID: true })
	artistID!: string;

	@ObjField({ description: 'Album Artist', example: 'Pink Floyd' })
	artistName!: string;

	@ObjField({ nullable: true, description: 'Number of Tracks', min: 0, example: 5 })
	trackCount?: number;

	@ObjField(() => [String], { nullable: true, description: 'List of Track Ids', isID: true })
	trackIDs?: Array<string>;

	@ObjField(() => [GenreBase], { nullable: true, description: 'Genres' })
	genres?: Array<GenreBase>;

	@ObjField({ nullable: true, description: 'Album Release Year', example: examples.year })
	year?: number;

	@ObjField({ nullable: true, description: 'MusicBrainz Artist Id', example: examples.mbArtistID })
	mbArtistID?: string;

	@ObjField({ nullable: true, description: 'MusicBrainz Release Id', example: examples.mbReleaseID })
	mbReleaseID?: string;

	@ObjField({ nullable: true, description: 'Series Name', example: 'A Series of Unfortunate Events' })
	series?: string;

	@ObjField({ nullable: true, description: 'Series Id', isID: true })
	seriesID?: string;

	@ObjField({ nullable: true, description: 'Series Nr', example: '001' })
	seriesNr?: string;

	@ObjField(() => ExtendedInfo, { nullable: true, description: 'Metadata for the Album (via External Service)' })
	info?: ExtendedInfo;
}

@ResultType({ description: 'Album with tracks' })
export class Album extends AlbumBase {
	@ObjField(() => [TrackBase], { nullable: true, description: 'List of Tracks' })
	tracks?: Array<TrackBase>;

	@ObjField(() => ArtistBase, { nullable: true, description: 'Album Artist' })
	artist?: ArtistBase;
}

@ResultType({ description: 'Album Page' })
export class AlbumPage extends Page {
	@ObjField(() => Album, { description: 'List of Albums' })
	items!: Array<Album>;
}

@ResultType({ description: 'Album Index Entry' })
export class AlbumIndexEntry {
	@ObjField({ description: 'ID', isID: true })
	id!: string;

	@ObjField({ description: 'Name', example: 'Awesome' })
	name!: string;

	@ObjField({ description: 'Artist', example: 'Primus' })
	artist!: string;

	@ObjField({ description: 'Artist Id', isID: true })
	artistID!: string;

	@ObjField({ description: 'Track Count', min: 0, example: 5 })
	trackCount!: number;
}

@ResultType({ description: 'Album Index Group' })
export class AlbumIndexGroup {
	@ObjField({ description: 'Index Group Name', example: 'P' })
	name!: string;

	@ObjField(() => [AlbumIndexEntry])
	items!: Array<AlbumIndexEntry>;
}

@ResultType({ description: 'Album Index' })
export class AlbumIndex {
	@ObjField({ description: 'Last Change Timestamp' })
	lastModified!: number;

	@ObjField(() => [AlbumIndexGroup], { description: 'Album Index Groups' })
	groups!: Array<AlbumIndexGroup>;
}
