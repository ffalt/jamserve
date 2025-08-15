import { AlbumType, ArtistOrderFields, ListType } from '../../types/enums.js';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { FilterParameters, OrderByParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class IncludesArtistParameters {
	@ObjectField({ nullable: true, description: 'include album ids on artist(s)', defaultValue: false, example: false })
	artistIncAlbumIDs?: boolean;

	@ObjectField({ nullable: true, description: 'include album count on artist(s)', defaultValue: false, example: false })
	artistIncAlbumCount?: boolean;

	@ObjectField({ nullable: true, description: 'include user states (fav,rate) on artist(s)', defaultValue: false, example: false })
	artistIncState?: boolean;

	@ObjectField({ nullable: true, description: 'include track ids on artist(s)', defaultValue: false, example: false })
	artistIncTrackIDs?: boolean;

	@ObjectField({ nullable: true, description: 'include track count on artist(s)', defaultValue: false, example: false })
	artistIncTrackCount?: boolean;

	@ObjectField({ nullable: true, description: 'include series ids on artist(s)', defaultValue: false, example: false })
	artistIncSeriesIDs?: boolean;

	@ObjectField({ nullable: true, description: 'include series count on artist(s)', defaultValue: false, example: false })
	artistIncSeriesCount?: boolean;

	@ObjectField({ nullable: true, description: 'include extended meta data on artist(s)', defaultValue: false, example: false })
	artistIncInfo?: boolean;

	@ObjectField({ nullable: true, description: 'include genre on artist(s)', defaultValue: false, example: false })
	artistIncGenres?: boolean;
}

@ObjectParametersType()
export class IncludesArtistChildrenParameters {
	@ObjectField({ nullable: true, description: 'include albums on artist(s)', defaultValue: false, example: false })
	artistIncAlbums?: boolean;

	@ObjectField({ nullable: true, description: 'include tracks on artist(s)', defaultValue: false, example: false })
	artistIncTracks?: boolean;

	@ObjectField({ nullable: true, description: 'include series on artist(s)', defaultValue: false, example: false })
	artistIncSeries?: boolean;

	@ObjectField({ nullable: true, description: 'include similar artists on artist(s)', defaultValue: false, example: false })
	artistIncSimilar?: boolean;
}

@InputType()
@ObjectParametersType()
export class ArtistFilterParameters {
	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Search Query', example: 'pink' })
	query?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Artist Name', example: 'Pink Floyd' })
	name?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Artist Slug', example: 'pinkfloyd' })
	slug?: string;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true })
	ids?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true })
	rootIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true })
	albumIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true })
	trackIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Album Track Ids', isID: true })
	albumTrackIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true })
	seriesIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true })
	folderIDs?: Array<string>;

	@Field(() => [String], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Genres', example: examples.genres })
	genres?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true })
	genreIDs?: Array<string>;

	@Field(() => [AlbumType], { nullable: true })
	@ObjectField(() => [AlbumType], { nullable: true, description: 'filter by Album Types', example: [AlbumType.audiobook] })
	albumTypes?: Array<AlbumType>;

	@Field(() => [String], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by MusicBrainz Artist Ids', example: [examples.mbArtistID] })
	mbArtistIDs?: Array<string>;

	@Field(() => String, { nullable: true })
	@ObjectField(() => String, { nullable: true, description: 'exclude by MusicBrainz Artist Id', example: examples.mbArtistID })
	notMbArtistID?: string;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp })
	since?: number;
}

@InputType()
export class ArtistFilterParametersQL extends ArtistFilterParameters {
}

@InputType()
@ObjectParametersType()
export class ArtistOrderParameters extends OrderByParameters {
	@Field(() => ArtistOrderFields, { nullable: true })
	@ObjectField(() => ArtistOrderFields, { nullable: true, description: 'order by field' })
	orderBy?: ArtistOrderFields;
}

@InputType()
export class ArtistOrderParametersQL extends ArtistOrderParameters {
}

@ArgsType()
export class ArtistIndexParametersQL extends FilterParameters(ArtistFilterParametersQL) {
}

@ArgsType()
export class ArtistPageParametersQL extends PaginatedFilterParameters(ArtistFilterParametersQL, ArtistOrderParametersQL) {
}

@ArgsType()
export class ArtistsParametersQL extends ArtistPageParametersQL {
	@Field(() => ListType, { nullable: true })
	list?: ListType;

	@Field(() => String, { nullable: true })
	seed?: string;
}
