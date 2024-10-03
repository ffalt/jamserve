import { Base, Page } from '../base/base.model.js';
import { AlbumType } from '../../types/enums.js';
import { TrackBase } from '../track/track.model.js';
import { AlbumBase } from '../album/album.model.js';
import { ExtendedInfo } from '../metadata/metadata.model.js';
import {ResultType} from '../../modules/rest/decorators/ResultType.js';
import {ObjField} from '../../modules/rest/decorators/ObjField.js';

@ResultType({ description: 'Series' })
export class SeriesBase extends Base {
	@ObjField({ description: 'Series Artist Name', example: 'Lemony Snicket' })
	artist!: string;

	@ObjField({ description: 'Series Artist Id', isID: true })
	artistID!: string;

	@ObjField({ nullable: true, description: 'Album Count', min: 0, example: 5 })
	albumCount?: number;

	@ObjField({ nullable: true, description: 'Track Count', min: 0, example: 55 })
	trackCount?: number;

	@ObjField(() => [AlbumType], { description: 'Album Types', example: [AlbumType.series] })
	albumTypes!: Array<AlbumType>;

	@ObjField(() => [String], { nullable: true, description: 'Track Ids', isID: true })
	trackIDs?: Array<string>;

	@ObjField(() => [String], { nullable: true, description: 'Album Ids', isID: true })
	albumIDs?: Array<string>;

	@ObjField(() => ExtendedInfo, { nullable: true, description: 'Metadata for the Series (via External Service)' })
	info?: ExtendedInfo;
}

@ResultType({ description: 'Series with Albums & Tracks' })
export class Series extends SeriesBase {
	@ObjField(() => TrackBase, { nullable: true, description: 'List of Tracks' })
	tracks?: Array<TrackBase>;

	@ObjField(() => AlbumBase, { nullable: true, description: 'List of Albums' })
	albums?: Array<AlbumBase>;
}

@ResultType({ description: 'Series Page' })
export class SeriesPage extends Page {
	@ObjField(() => Series, { description: 'List of Series' })
	items!: Array<Series>;
}

@ResultType({ description: 'Series Index Entry' })
export class SeriesIndexEntry {
	@ObjField({ description: 'ID', isID: true })
	id!: string;

	@ObjField({ description: 'Name', example: 'A Series of Unfortunate Events' })
	name!: string;

	@ObjField({ description: 'Album Count', min: 0, example: 5 })
	albumCount!: number;

	@ObjField({ description: 'Track Count', min: 0, example: 55 })
	trackCount!: number;
}

@ResultType({ description: 'Series Index Group' })
export class SeriesIndexGroup {
	@ObjField({ description: 'Series Group Name', example: 'A' })
	name!: string;

	@ObjField(() => [SeriesIndexEntry])
	items!: Array<SeriesIndexEntry>;
}

@ResultType({ description: 'Series Index' })
export class SeriesIndex {
	@ObjField({ description: 'Last Change Timestamp' })
	lastModified!: number;

	@ObjField(() => [SeriesIndexGroup], { description: 'Series Index Groups' })
	groups!: Array<SeriesIndexGroup>;
}
