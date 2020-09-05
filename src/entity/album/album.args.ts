import {ObjField, ObjParamsType} from '../../modules/rest/decorators';
import {AlbumOrderFields, AlbumType, ListType} from '../../types/enums';
import {ArgsType, Field, Float, ID, InputType, Int} from 'type-graphql';
import {FilterArgs, OrderByArgs, PaginatedFilterArgs} from '../base/base.args';
import {examples} from '../../modules/engine/rest/example.consts';

@ObjParamsType()
export class IncludesAlbumArgs {
	@ObjField({nullable: true, description: 'include track ids on album(s)', defaultValue: false, example: false})
	albumIncTrackIDs?: boolean;
	@ObjField({nullable: true, description: 'include track count on album(s)', defaultValue: false, example: false})
	albumIncTrackCount?: boolean;
	@ObjField({nullable: true, description: 'include user states (fav,rate) on album(s)', defaultValue: false, example: false})
	albumIncState?: boolean;
	@ObjField({nullable: true, description: 'include extended meta data on album(s)', defaultValue: false, example: false})
	albumIncInfo?: boolean;
}

@ObjParamsType()
export class IncludesAlbumChildrenArgs {
	@ObjField({nullable: true, description: 'include tracks on album(s)', defaultValue: false, example: false})
	albumIncTracks?: boolean;
	@ObjField({nullable: true, description: 'include artist on album(s)', defaultValue: false, example: false})
	albumIncArtist?: boolean;
}

@InputType()
@ObjParamsType()
export class AlbumFilterArgs {
	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Search Query', example: 'balkan'})
	query?: string;

	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Album Name', example: 'Balkan Beat Box'})
	name?: string;

	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Album Slug', example: 'balkanbeatbox'})
	slug?: string;

	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Artist Name', example: 'Balkan Beat Box'})
	artist?: string;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Album Ids', isID: true})
	ids?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Root Ids', isID: true})
	rootIDs?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Artist Ids', isID: true})
	artistIDs?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Track Ids', isID: true})
	trackIDs?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Folder Ids', isID: true})
	folderIDs?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Series Ids', isID: true})
	seriesIDs?: Array<string>;

	@Field(() => [AlbumType!], {nullable: true})
	@ObjField(() => [AlbumType], {nullable: true, description: 'filter by Album Types', example: [AlbumType.audiobook]})
	albumTypes?: Array<AlbumType>;

	@Field(() => [String], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by MusicBrainz Release Ids', example: [examples.mbReleaseID]})
	mbReleaseIDs?: Array<string>;

	@Field(() => [String], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by MusicBrainz Artist Ids', example: [examples.mbArtistID]})
	mbArtistIDs?: Array<string>;

	@Field(() => [String], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Genres', example: examples.genres})
	genres?: Array<string>;

	@Field(() => Float, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp})
	since?: number;

	@Field(() => Int, {nullable: true})
	@ObjField({nullable: true, description: 'filter by since year', min: 0, example: examples.year})
	fromYear?: number;

	@Field(() => Int, {nullable: true})
	@ObjField({nullable: true, description: 'filter by until year', min: 0, example: examples.year})
	toYear?: number;
}

@InputType()
export class AlbumFilterArgsQL extends AlbumFilterArgs {
}

@InputType()
@ObjParamsType()
export class AlbumOrderArgs extends OrderByArgs {
	@Field(() => AlbumOrderFields, {nullable: true})
	@ObjField(() => AlbumOrderFields, {nullable: true, description: 'order by field'})
	orderBy?: AlbumOrderFields;
}

@InputType()
export class AlbumOrderArgsQL extends AlbumOrderArgs {
}

@ArgsType()
export class AlbumIndexArgsQL extends FilterArgs(AlbumFilterArgsQL) {
}

@ArgsType()
export class AlbumPageArgsQL extends PaginatedFilterArgs(AlbumFilterArgsQL, AlbumOrderArgsQL) {
}

@ArgsType()
export class AlbumsArgsQL extends AlbumPageArgsQL {
	@Field(() => ListType, {nullable: true})
	list?: ListType;
}
