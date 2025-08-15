import { AlbumOrderFields, AlbumType, ListType } from '../../types/enums.js';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { FilterParameters, OrderByParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class IncludesAlbumParameters {
	@ObjectField({ nullable: true, description: 'include track ids on album(s)', defaultValue: false, example: false })
	albumIncTrackIDs?: boolean;

	@ObjectField({ nullable: true, description: 'include track count on album(s)', defaultValue: false, example: false })
	albumIncTrackCount?: boolean;

	@ObjectField({ nullable: true, description: 'include user states (fav,rate) on album(s)', defaultValue: false, example: false })
	albumIncState?: boolean;

	@ObjectField({ nullable: true, description: 'include extended meta data on album(s)', defaultValue: false, example: false })
	albumIncInfo?: boolean;

	@ObjectField({ nullable: true, description: 'include genre on album(s)', defaultValue: false, example: false })
	albumIncGenres?: boolean;
}

@ObjectParametersType()
export class IncludesAlbumChildrenParameters {
	@ObjectField({ nullable: true, description: 'include tracks on album(s)', defaultValue: false, example: false })
	albumIncTracks?: boolean;

	@ObjectField({ nullable: true, description: 'include artist on album(s)', defaultValue: false, example: false })
	albumIncArtist?: boolean;
}

@InputType()
@ObjectParametersType()
export class AlbumFilterParameters {
	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Search Query', example: 'balkan' })
	query?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Album Name', example: 'Balkan Beat Box' })
	name?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Album Slug', example: 'balkanbeatbox' })
	slug?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Artist Name', example: 'Balkan Beat Box' })
	artist?: string;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true })
	ids?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true })
	rootIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true })
	artistIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true })
	trackIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true })
	folderIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true })
	seriesIDs?: Array<string>;

	@Field(() => [AlbumType!], { nullable: true })
	@ObjectField(() => [AlbumType], { nullable: true, description: 'filter by Album Types', example: [AlbumType.audiobook] })
	albumTypes?: Array<AlbumType>;

	@Field(() => [String], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by MusicBrainz Release Ids', example: [examples.mbReleaseID] })
	mbReleaseIDs?: Array<string>;

	@Field(() => [String], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by MusicBrainz Artist Ids', example: [examples.mbArtistID] })
	mbArtistIDs?: Array<string>;

	@Field(() => String, { nullable: true })
	@ObjectField(() => String, { nullable: true, description: 'exclude by MusicBrainz Artist Id', example: examples.mbArtistID })
	notMbArtistID?: string;

	@Field(() => [String], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Genres', example: examples.genres })
	genres?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true })
	genreIDs?: Array<string>;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp })
	since?: number;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by since year', min: 0, example: examples.year })
	fromYear?: number;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by until year', min: 0, example: examples.year })
	toYear?: number;
}

@InputType()
export class AlbumFilterParametersQL extends AlbumFilterParameters {
}

@InputType()
@ObjectParametersType()
export class AlbumOrderParameters extends OrderByParameters {
	@Field(() => AlbumOrderFields, { nullable: true })
	@ObjectField(() => AlbumOrderFields, { nullable: true, description: 'order by field' })
	orderBy?: AlbumOrderFields;
}

@InputType()
export class AlbumOrderParametersQL extends AlbumOrderParameters {
}

@ArgsType()
export class AlbumIndexParametersQL extends FilterParameters(AlbumFilterParametersQL) {
}

@ArgsType()
export class AlbumPageParametersQL extends PaginatedFilterParameters(AlbumFilterParametersQL, AlbumOrderParametersQL) {
}

@ArgsType()
export class AlbumsParametersQL extends AlbumPageParametersQL {
	@Field(() => ListType, { nullable: true })
	list?: ListType;

	@Field(() => String, { nullable: true })
	seed?: string;
}
