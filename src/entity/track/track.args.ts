import { ListType, TrackHealthID, TrackOrderFields } from '../../types/enums.js';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { OrderByArgs, PaginatedFilterArgs } from '../base/base.args.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjParamsType } from '../../modules/rest/decorators/ObjParamsType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';

@ObjParamsType()
export class IncludesTrackArgs {
	@ObjField({ nullable: true, description: 'include media information on track(s)', defaultValue: false, example: false })
	trackIncMedia?: boolean;

	@ObjField({ nullable: true, description: 'include tag on track(s)', defaultValue: false, example: false })
	trackIncTag?: boolean;

	@ObjField({ nullable: true, description: 'include raw tag on track(s)', defaultValue: false, example: false })
	trackIncRawTag?: boolean;

	@ObjField({ nullable: true, description: 'include genre on track(s)', defaultValue: false, example: false })
	trackIncGenres?: boolean;

	@ObjField({ nullable: true, description: 'include user states (fav,rate) on track(s)', defaultValue: false, example: false })
	trackIncState?: boolean;
}

@ObjParamsType()
export class MediaHealthArgs {
	@ObjField({ nullable: true, description: 'check media file integrity', defaultValue: false, example: false })
	healthMedia?: boolean;
}

@ObjParamsType()
export class TrackRenameArgs {
	@ObjField({ description: 'Track Id', isID: true })
	id!: string;

	@ObjField({ description: 'New track file name', isID: true })
	name!: string;
}

@ObjParamsType()
export class TrackMoveArgs {
	@ObjField(() => [String], { description: 'Track Ids', isID: true })
	ids!: Array<string>;

	@ObjField({ description: 'ID of the destination folder', isID: true })
	folderID!: string;
}

@ObjParamsType()
export class TrackFixArgs {
	@ObjField({ description: 'Track Id', isID: true })
	id!: string;

	@ObjField(() => TrackHealthID, { description: 'Which issue to fix with the track' })
	fixID!: TrackHealthID;
}

@ObjParamsType()
export class MediaTagRawUpdateArgs {
	@ObjField({ description: 'Tag Version' })
	version!: number;

	@ObjField(() => Object, { description: 'Tag Frames', generic: true })
	frames!: any;
}

@ObjParamsType()
export class RawTagUpdateArgs {
	@ObjField({ description: 'Track Id', isID: true })
	id!: string;

	@ObjField(() => MediaTagRawUpdateArgs, { description: 'Raw tag to store in the track (e.g. id3v2/vorbis)' })
	tag!: MediaTagRawUpdateArgs;
}

@InputType()
@ObjParamsType()
export class TrackFilterArgs {
	@Field(() => String, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Search Query', example: 'these' })
	query?: string;

	@Field(() => String, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Track Title', example: 'These Days' })
	name?: string;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true })
	ids?: Array<string>;

	@Field(() => ID, { nullable: true })
	@ObjField({ nullable: true, description: 'filter if track is in folder id (or its child folders)', isID: true })
	childOfID?: string;

	@Field(() => String, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by artist name', example: 'Nico' })
	artist?: string;

	@Field(() => String, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by album name', example: 'Chelsea Girl' })
	album?: string;

	@Field(() => [String], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by genres', example: ['Folk Pop'] })
	genres?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true })
	genreIDs?: Array<string>;

	@Field(() => Int, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp })
	since?: number;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true })
	seriesIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true })
	albumIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true })
	artistIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Album Artist Ids', isID: true })
	albumArtistIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true })
	rootIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true })
	folderIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Bookmark Ids', isID: true })
	bookmarkIDs?: Array<string>;

	@Field(() => Int, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by since year', min: 0, example: examples.year })
	fromYear?: number;

	@Field(() => Int, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by until year', min: 0, example: examples.year })
	toYear?: number;
}

@InputType()
export class TrackFilterArgsQL extends TrackFilterArgs {
}

@InputType()
@ObjParamsType()
export class TrackOrderArgs extends OrderByArgs {
	@Field(() => TrackOrderFields, { nullable: true })
	@ObjField(() => TrackOrderFields, { nullable: true, description: 'order by field' })
	orderBy?: TrackOrderFields;
}

@InputType()
export class TrackOrderArgsQL extends TrackOrderArgs {
}

@ArgsType()
export class TrackPageArgsQL extends PaginatedFilterArgs(TrackFilterArgsQL, TrackOrderArgsQL) {
}

@ArgsType()
export class TracksArgsQL extends TrackPageArgsQL {
	@Field(() => ListType, { nullable: true })
	list?: ListType;

	@Field(() => String, { nullable: true })
	seed?: string;
}
