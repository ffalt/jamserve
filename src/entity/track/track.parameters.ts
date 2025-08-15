import { ListType, TrackHealthID, TrackOrderFields } from '../../types/enums.js';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { OrderByParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class IncludesTrackParameters {
	@ObjectField({ nullable: true, description: 'include media information on track(s)', defaultValue: false, example: false })
	trackIncMedia?: boolean;

	@ObjectField({ nullable: true, description: 'include tag on track(s)', defaultValue: false, example: false })
	trackIncTag?: boolean;

	@ObjectField({ nullable: true, description: 'include raw tag on track(s)', defaultValue: false, example: false })
	trackIncRawTag?: boolean;

	@ObjectField({ nullable: true, description: 'include genre on track(s)', defaultValue: false, example: false })
	trackIncGenres?: boolean;

	@ObjectField({ nullable: true, description: 'include user states (fav,rate) on track(s)', defaultValue: false, example: false })
	trackIncState?: boolean;
}

@ObjectParametersType()
export class MediaHealthParameters {
	@ObjectField({ nullable: true, description: 'check media file integrity', defaultValue: false, example: false })
	healthMedia?: boolean;
}

@ObjectParametersType()
export class TrackRenameParameters {
	@ObjectField({ description: 'Track Id', isID: true })
	id!: string;

	@ObjectField({ description: 'New track file name', isID: true })
	name!: string;
}

@ObjectParametersType()
export class TrackMoveParameters {
	@ObjectField(() => [String], { description: 'Track Ids', isID: true })
	ids!: Array<string>;

	@ObjectField({ description: 'ID of the destination folder', isID: true })
	folderID!: string;
}

@ObjectParametersType()
export class TrackFixParameters {
	@ObjectField({ description: 'Track Id', isID: true })
	id!: string;

	@ObjectField(() => TrackHealthID, { description: 'Which issue to fix with the track' })
	fixID!: TrackHealthID;
}

@ObjectParametersType()
export class MediaTagRawUpdateParameters {
	@ObjectField({ description: 'Tag Version' })
	version!: number;

	@ObjectField(() => Object, { description: 'Tag Frames', generic: true })
	frames!: any;
}

@ObjectParametersType()
export class RawTagUpdateParameters {
	@ObjectField({ description: 'Track Id', isID: true })
	id!: string;

	@ObjectField(() => MediaTagRawUpdateParameters, { description: 'Raw tag to store in the track (e.g. id3v2/vorbis)' })
	tag!: MediaTagRawUpdateParameters;
}

@InputType()
@ObjectParametersType()
export class TrackFilterParameters {
	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Search Query', example: 'these' })
	query?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Track Title', example: 'These Days' })
	name?: string;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true })
	ids?: Array<string>;

	@Field(() => ID, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter if track is in folder id (or its child folders)', isID: true })
	childOfID?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by artist name', example: 'Nico' })
	artist?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by album name', example: 'Chelsea Girl' })
	album?: string;

	@Field(() => [String], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by genres', example: ['Folk Pop'] })
	genres?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true })
	genreIDs?: Array<string>;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp })
	since?: number;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true })
	seriesIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true })
	albumIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true })
	artistIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Album Artist Ids', isID: true })
	albumArtistIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true })
	rootIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true })
	folderIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Bookmark Ids', isID: true })
	bookmarkIDs?: Array<string>;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by since year', min: 0, example: examples.year })
	fromYear?: number;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by until year', min: 0, example: examples.year })
	toYear?: number;
}

@InputType()
export class TrackFilterParametersQL extends TrackFilterParameters {
}

@InputType()
@ObjectParametersType()
export class TrackOrderParameters extends OrderByParameters {
	@Field(() => TrackOrderFields, { nullable: true })
	@ObjectField(() => TrackOrderFields, { nullable: true, description: 'order by field' })
	orderBy?: TrackOrderFields;
}

@InputType()
export class TrackOrderParametersQL extends TrackOrderParameters {
}

@ArgsType()
export class TrackPageParametersQL extends PaginatedFilterParameters(TrackFilterParametersQL, TrackOrderParametersQL) {
}

@ArgsType()
export class TracksParametersQL extends TrackPageParametersQL {
	@Field(() => ListType, { nullable: true })
	list?: ListType;

	@Field(() => String, { nullable: true })
	seed?: string;
}
