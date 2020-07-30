import {ObjField, ObjParamsType} from '../../modules/rest/decorators';
import {ArgsType, Field, Float, ID, InputType} from 'type-graphql';
import {AlbumType, ListType} from '../../types/enums';
import {DefaultOrderArgs, FilterArgs, PaginatedArgs} from '../base/base.args';
import {examples} from '../../modules/engine/rest/example.consts';

@ObjParamsType()
export class IncludesSeriesArgs {
	@ObjField({nullable: true, description: 'include album ids on artist(s)', defaultValue: false, example: false})
	seriesIncAlbumIDs?: boolean;
	@ObjField({nullable: true, description: 'include album counts on artist(s)', defaultValue: false, example: false})
	seriesIncAlbumCount?: boolean;
	@ObjField({nullable: true, description: 'include user states (fav,rate) on artist(s)', defaultValue: false, example: false})
	seriesIncState?: boolean;
	@ObjField({nullable: true, description: 'include track ids on artist(s)', defaultValue: false, example: false})
	seriesIncTrackIDs?: boolean;
	@ObjField({nullable: true, description: 'include track counts on artist(s)', defaultValue: false, example: false})
	seriesIncTrackCount?: boolean;
	@ObjField({nullable: true, description: 'include extended meta data on artist(s)', defaultValue: false, example: false})
	seriesIncInfo?: boolean;
}

@ObjParamsType()
export class IncludesSeriesChildrenArgs {
	@ObjField({nullable: true, description: 'include albums on series', defaultValue: false, example: false})
	seriesIncAlbums?: boolean;
	@ObjField({nullable: true, description: 'include tracks on artist(s)', defaultValue: false, example: false})
	seriesIncTracks?: boolean;
}

@InputType()
@ObjParamsType()
export class SeriesFilterArgs {
	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Search Query', example: 'awesome'})
	query?: string;

	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Name', example: 'Awesome Series'})
	name?: string;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Series Ids', isID: true})
	ids?: Array<string>;

	@Field(() => [AlbumType], {nullable: true})
	@ObjField(() => [AlbumType], {nullable: true, description: 'filter by Album Types', example: [AlbumType.audiobook]})
	albumTypes?: Array<AlbumType>;

	@Field(() => Float, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp})
	since?: number;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Track Ids', isID: true})
	trackIDs?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Album Ids', isID: true})
	albumIDs?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Artist Ids', isID: true})
	artistIDs?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Root Ids', isID: true})
	rootIDs?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Folder Ids', isID: true})
	folderIDs?: Array<string>;
}

@InputType()
export class SeriesFilterArgsQL extends SeriesFilterArgs {
}

@InputType()
@ObjParamsType()
export class SeriesOrderArgs extends DefaultOrderArgs {
}

@InputType()
export class SeriesOrderArgsQL extends SeriesOrderArgs {
}

@ArgsType()
export class SeriesIndexArgsQL extends FilterArgs(SeriesFilterArgsQL) {
}

@ArgsType()
export class SeriesArgsQL extends PaginatedArgs(SeriesFilterArgsQL, SeriesOrderArgsQL) {
	@Field(() => ListType, {nullable: true})
	list?: ListType;
}
