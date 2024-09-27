import {AlbumType, ArtistOrderFields, ListType} from '../../types/enums.js';
import {ArgsType, Field, Float, ID, InputType} from 'type-graphql';
import {FilterArgs, OrderByArgs, PaginatedFilterArgs} from '../base/base.args.js';
import {examples} from '../../modules/engine/rest/example.consts.js';
import {ObjParamsType} from '../../modules/rest/decorators/ObjParamsType.js';
import {ObjField} from '../../modules/rest/decorators/ObjField.js';

@ObjParamsType()
export class IncludesArtistArgs {
	@ObjField({nullable: true, description: 'include album ids on artist(s)', defaultValue: false, example: false})
	artistIncAlbumIDs?: boolean;
	@ObjField({nullable: true, description: 'include album count on artist(s)', defaultValue: false, example: false})
	artistIncAlbumCount?: boolean;
	@ObjField({nullable: true, description: 'include user states (fav,rate) on artist(s)', defaultValue: false, example: false})
	artistIncState?: boolean;
	@ObjField({nullable: true, description: 'include track ids on artist(s)', defaultValue: false, example: false})
	artistIncTrackIDs?: boolean;
	@ObjField({nullable: true, description: 'include track count on artist(s)', defaultValue: false, example: false})
	artistIncTrackCount?: boolean;
	@ObjField({nullable: true, description: 'include series ids on artist(s)', defaultValue: false, example: false})
	artistIncSeriesIDs?: boolean;
	@ObjField({nullable: true, description: 'include series count on artist(s)', defaultValue: false, example: false})
	artistIncSeriesCount?: boolean;
	@ObjField({nullable: true, description: 'include extended meta data on artist(s)', defaultValue: false, example: false})
	artistIncInfo?: boolean;
	@ObjField({nullable: true, description: 'include genre on artist(s)', defaultValue: false, example: false})
	artistIncGenres?: boolean;
}

@ObjParamsType()
export class IncludesArtistChildrenArgs {
	@ObjField({nullable: true, description: 'include albums on artist(s)', defaultValue: false, example: false})
	artistIncAlbums?: boolean;
	@ObjField({nullable: true, description: 'include tracks on artist(s)', defaultValue: false, example: false})
	artistIncTracks?: boolean;
	@ObjField({nullable: true, description: 'include series on artist(s)', defaultValue: false, example: false})
	artistIncSeries?: boolean;
	@ObjField({nullable: true, description: 'include similar artists on artist(s)', defaultValue: false, example: false})
	artistIncSimilar?: boolean;
}

@InputType()
@ObjParamsType()
export class ArtistFilterArgs {
	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Search Query', example: 'pink'})
	query?: string;

	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Artist Name', example: 'Pink Floyd'})
	name?: string;

	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Artist Slug', example: 'pinkfloyd'})
	slug?: string;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Artist Ids', isID: true})
	ids?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Root Ids', isID: true})
	rootIDs?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Album Ids', isID: true})
	albumIDs?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Track Ids', isID: true})
	trackIDs?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Album Track Ids', isID: true})
	albumTrackIDs?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Series Ids', isID: true})
	seriesIDs?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Folder Ids', isID: true})
	folderIDs?: Array<string>;

	@Field(() => [String], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Genres', example: examples.genres})
	genres?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Genre Ids', isID: true})
	genreIDs?: Array<string>;

	@Field(() => [AlbumType], {nullable: true})
	@ObjField(() => [AlbumType], {nullable: true, description: 'filter by Album Types', example: [AlbumType.audiobook]})
	albumTypes?: Array<AlbumType>;

	@Field(() => [String], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by MusicBrainz Artist Ids', example: [examples.mbArtistID]})
	mbArtistIDs?: Array<string>;

	@Field(() => String, {nullable: true})
	@ObjField(() => String, {nullable: true, description: 'exclude by MusicBrainz Artist Id', example: examples.mbArtistID})
	notMbArtistID?: string;

	@Field(() => Float, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp})
	since?: number;
}

@InputType()
export class ArtistFilterArgsQL extends ArtistFilterArgs {
}

@InputType()
@ObjParamsType()
export class ArtistOrderArgs extends OrderByArgs {
	@Field(() => ArtistOrderFields, {nullable: true})
	@ObjField(() => ArtistOrderFields, {nullable: true, description: 'order by field'})
	orderBy?: ArtistOrderFields;
}

@InputType()
export class ArtistOrderArgsQL extends ArtistOrderArgs {
}

@ArgsType()
export class ArtistIndexArgsQL extends FilterArgs(ArtistFilterArgsQL) {
}

@ArgsType()
export class ArtistPageArgsQL extends PaginatedFilterArgs(ArtistFilterArgsQL, ArtistOrderArgsQL) {
}

@ArgsType()
export class ArtistsArgsQL extends ArtistPageArgsQL {
	@Field(() => ListType, {nullable: true})
	list?: ListType;
	@Field(() => String, {nullable: true})
	seed?: string;
}
