import { Base, Page } from '../base/base.model.js';
import { AlbumType } from '../../types/enums.js';
import { TrackBase } from '../track/track.model.js';
import { SeriesBase } from '../series/series.model.js';
import { AlbumBase } from '../album/album.model.js';
import { ExtendedInfo } from '../metadata/metadata.model.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { GenreBase } from '../genre/genre.model.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'Artist' })
export class ArtistBase extends Base {
	@ObjectField(() => [AlbumType], { description: 'List of Album Type', example: [AlbumType.album, AlbumType.compilation] })
	albumTypes!: Array<AlbumType>;

	@ObjectField(() => [GenreBase], { nullable: true, description: 'Genres' })
	genres?: Array<GenreBase>;

	@ObjectField({ nullable: true, description: 'MusicBrainz Artist Id', example: examples.mbArtistID })
	mbArtistID?: string;

	@ObjectField({ nullable: true, description: 'Number of Albums', min: 0, example: 5 })
	albumCount?: number;

	@ObjectField(() => [String], { nullable: true, description: 'List of Album Ids', isID: true })
	albumIDs?: Array<string>;

	@ObjectField({ nullable: true, description: 'Number of Series', min: 0, example: 5 })
	seriesCount?: number;

	@ObjectField(() => [String], { nullable: true, description: 'List of Series Ids', isID: true })
	seriesIDs?: Array<string>;

	@ObjectField({ nullable: true, description: 'Number of Tracks', min: 0, example: 5 })
	trackCount?: number;

	@ObjectField(() => [String], { nullable: true, description: 'List of Track Ids', isID: true })
	trackIDs?: Array<string>;

	@ObjectField(() => ExtendedInfo, { nullable: true, description: 'Metadata for the Artist (via External Service)' })
	info?: ExtendedInfo;
}

@ResultType({ description: 'Artist with Albums,...' })
export class Artist extends ArtistBase {
	@ObjectField(() => ArtistBase, { nullable: true, description: 'List of similar Artists (via External Service)' })
	similar?: Array<ArtistBase>;

	@ObjectField(() => SeriesBase, { nullable: true, description: 'List of Series' })
	series?: Array<SeriesBase>;

	@ObjectField(() => AlbumBase, { nullable: true, description: 'List of Albums' })
	albums?: Array<AlbumBase>;

	@ObjectField(() => TrackBase, { nullable: true, description: 'List of Tracks' })
	tracks?: Array<TrackBase>;
}

@ResultType({ description: 'Artist Page' })
export class ArtistPage extends Page {
	@ObjectField(() => Artist, { description: 'List of Artists' })
	items!: Array<Artist>;
}

@ResultType({ description: 'Artist Index Entry' })
export class ArtistIndexEntry {
	@ObjectField({ description: 'ID', isID: true })
	id!: string;

	@ObjectField({ description: 'Name', example: 'Mars Volta' })
	name!: string;

	@ObjectField({ description: 'Album Count', min: 0, example: 5 })
	albumCount!: number;

	@ObjectField({ description: 'Track Count', min: 0, example: 55 })
	trackCount!: number;
}

@ResultType({ description: 'Artist Index Group' })
export class ArtistIndexGroup {
	@ObjectField({ description: 'Artist Group Name', example: 'P' })
	name!: string;

	@ObjectField(() => [ArtistIndexEntry])
	items!: Array<ArtistIndexEntry>;
}

@ResultType({ description: 'Artist Index' })
export class ArtistIndex {
	@ObjectField({ description: 'Last Change Timestamp' })
	lastModified!: number;

	@ObjectField(() => [ArtistIndexGroup], { description: 'Artist Index Groups' })
	groups!: Array<ArtistIndexGroup>;
}
