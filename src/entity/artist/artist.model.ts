import { Base, Page } from '../base/base.model.js';
import { AlbumType } from '../../types/enums.js';
import { TrackBase } from '../track/track.model.js';
import { SeriesBase } from '../series/series.model.js';
import { AlbumBase } from '../album/album.model.js';
import { ExtendedInfo } from '../metadata/metadata.model.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { GenreBase } from '../genre/genre.model.js';
import {ResultType} from '../../modules/rest/decorators/ResultType.js';
import {ObjField} from '../../modules/rest/decorators/ObjField.js';

@ResultType({ description: 'Artist' })
export class ArtistBase extends Base {
	@ObjField(() => [AlbumType], { description: 'List of Album Type', example: [AlbumType.album, AlbumType.compilation] })
	albumTypes!: Array<AlbumType>;

	@ObjField(() => [GenreBase], { nullable: true, description: 'Genres' })
	genres?: Array<GenreBase>;

	@ObjField({ nullable: true, description: 'MusicBrainz Artist Id', example: examples.mbArtistID })
	mbArtistID?: string;

	@ObjField({ nullable: true, description: 'Number of Albums', min: 0, example: 5 })
	albumCount?: number;

	@ObjField(() => [String], { nullable: true, description: 'List of Album Ids', isID: true })
	albumIDs?: Array<string>;

	@ObjField({ nullable: true, description: 'Number of Series', min: 0, example: 5 })
	seriesCount?: number;

	@ObjField(() => [String], { nullable: true, description: 'List of Series Ids', isID: true })
	seriesIDs?: Array<string>;

	@ObjField({ nullable: true, description: 'Number of Tracks', min: 0, example: 5 })
	trackCount?: number;

	@ObjField(() => [String], { nullable: true, description: 'List of Track Ids', isID: true })
	trackIDs?: Array<string>;

	@ObjField(() => ExtendedInfo, { nullable: true, description: 'Metadata for the Artist (via External Service)' })
	info?: ExtendedInfo;
}

@ResultType({ description: 'Artist with Albums,...' })
export class Artist extends ArtistBase {
	@ObjField(() => ArtistBase, { nullable: true, description: 'List of similar Artists (via External Service)' })
	similar?: Array<ArtistBase>;

	@ObjField(() => SeriesBase, { nullable: true, description: 'List of Series' })
	series?: Array<SeriesBase>;

	@ObjField(() => AlbumBase, { nullable: true, description: 'List of Albums' })
	albums?: Array<AlbumBase>;

	@ObjField(() => TrackBase, { nullable: true, description: 'List of Tracks' })
	tracks?: Array<TrackBase>;
}

@ResultType({ description: 'Artist Page' })
export class ArtistPage extends Page {
	@ObjField(() => Artist, { description: 'List of Artists' })
	items!: Array<Artist>;
}

@ResultType({ description: 'Artist Index Entry' })
export class ArtistIndexEntry {
	@ObjField({ description: 'ID', isID: true })
	id!: string;

	@ObjField({ description: 'Name', example: 'Mars Volta' })
	name!: string;

	@ObjField({ description: 'Album Count', min: 0, example: 5 })
	albumCount!: number;

	@ObjField({ description: 'Track Count', min: 0, example: 55 })
	trackCount!: number;
}

@ResultType({ description: 'Artist Index Group' })
export class ArtistIndexGroup {
	@ObjField({ description: 'Artist Group Name', example: 'P' })
	name!: string;

	@ObjField(() => [ArtistIndexEntry])
	items!: Array<ArtistIndexEntry>;
}

@ResultType({ description: 'Artist Index' })
export class ArtistIndex {
	@ObjField({ description: 'Last Change Timestamp' })
	lastModified!: number;

	@ObjField(() => [ArtistIndexGroup], { description: 'Artist Index Groups' })
	groups!: Array<ArtistIndexGroup>;
}
