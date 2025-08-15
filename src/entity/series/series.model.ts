import { Base, Page } from '../base/base.model.js';
import { AlbumType } from '../../types/enums.js';
import { TrackBase } from '../track/track.model.js';
import { AlbumBase } from '../album/album.model.js';
import { ExtendedInfo } from '../metadata/metadata.model.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'Series' })
export class SeriesBase extends Base {
	@ObjectField({ description: 'Series Artist Name', example: 'Lemony Snicket' })
	artist!: string;

	@ObjectField({ description: 'Series Artist Id', isID: true })
	artistID!: string;

	@ObjectField({ nullable: true, description: 'Album Count', min: 0, example: 5 })
	albumCount?: number;

	@ObjectField({ nullable: true, description: 'Track Count', min: 0, example: 55 })
	trackCount?: number;

	@ObjectField(() => [AlbumType], { description: 'Album Types', example: [AlbumType.series] })
	albumTypes!: Array<AlbumType>;

	@ObjectField(() => [String], { nullable: true, description: 'Track Ids', isID: true })
	trackIDs?: Array<string>;

	@ObjectField(() => [String], { nullable: true, description: 'Album Ids', isID: true })
	albumIDs?: Array<string>;

	@ObjectField(() => ExtendedInfo, { nullable: true, description: 'Metadata for the Series (via External Service)' })
	info?: ExtendedInfo;
}

@ResultType({ description: 'Series with Albums & Tracks' })
export class Series extends SeriesBase {
	@ObjectField(() => TrackBase, { nullable: true, description: 'List of Tracks' })
	tracks?: Array<TrackBase>;

	@ObjectField(() => AlbumBase, { nullable: true, description: 'List of Albums' })
	albums?: Array<AlbumBase>;
}

@ResultType({ description: 'Series Page' })
export class SeriesPage extends Page {
	@ObjectField(() => Series, { description: 'List of Series' })
	items!: Array<Series>;
}

@ResultType({ description: 'Series Index Entry' })
export class SeriesIndexEntry {
	@ObjectField({ description: 'ID', isID: true })
	id!: string;

	@ObjectField({ description: 'Name', example: 'A Series of Unfortunate Events' })
	name!: string;

	@ObjectField({ description: 'Album Count', min: 0, example: 5 })
	albumCount!: number;

	@ObjectField({ description: 'Track Count', min: 0, example: 55 })
	trackCount!: number;
}

@ResultType({ description: 'Series Index Group' })
export class SeriesIndexGroup {
	@ObjectField({ description: 'Series Group Name', example: 'A' })
	name!: string;

	@ObjectField(() => [SeriesIndexEntry])
	items!: Array<SeriesIndexEntry>;
}

@ResultType({ description: 'Series Index' })
export class SeriesIndex {
	@ObjectField({ description: 'Last Change Timestamp' })
	lastModified!: number;

	@ObjectField(() => [SeriesIndexGroup], { description: 'Series Index Groups' })
	groups!: Array<SeriesIndexGroup>;
}
