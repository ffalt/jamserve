import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { AlbumType, ListType } from '../../types/enums.js';
import { DefaultOrderParameters, FilterParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class IncludesSeriesParameters {
	@ObjectField({ nullable: true, description: 'include album ids on artist(s)', defaultValue: false, example: false })
	seriesIncAlbumIDs?: boolean;

	@ObjectField({ nullable: true, description: 'include album counts on artist(s)', defaultValue: false, example: false })
	seriesIncAlbumCount?: boolean;

	@ObjectField({ nullable: true, description: 'include user states (fav,rate) on artist(s)', defaultValue: false, example: false })
	seriesIncState?: boolean;

	@ObjectField({ nullable: true, description: 'include track ids on artist(s)', defaultValue: false, example: false })
	seriesIncTrackIDs?: boolean;

	@ObjectField({ nullable: true, description: 'include track counts on artist(s)', defaultValue: false, example: false })
	seriesIncTrackCount?: boolean;

	@ObjectField({ nullable: true, description: 'include extended meta data on artist(s)', defaultValue: false, example: false })
	seriesIncInfo?: boolean;
}

@ObjectParametersType()
export class IncludesSeriesChildrenParameters {
	@ObjectField({ nullable: true, description: 'include albums on series', defaultValue: false, example: false })
	seriesIncAlbums?: boolean;

	@ObjectField({ nullable: true, description: 'include tracks on artist(s)', defaultValue: false, example: false })
	seriesIncTracks?: boolean;
}

@InputType()
@ObjectParametersType()
export class SeriesFilterParameters {
	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Search Query', example: 'awesome' })
	query?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Name', example: 'Awesome Series' })
	name?: string;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true })
	ids?: Array<string>;

	@Field(() => [AlbumType], { nullable: true })
	@ObjectField(() => [AlbumType], { nullable: true, description: 'filter by Album Types', example: [AlbumType.audiobook] })
	albumTypes?: Array<AlbumType>;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp })
	since?: number;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true })
	trackIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true })
	albumIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true })
	artistIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true })
	rootIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true })
	folderIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true })
	genreIDs?: Array<string>;
}

@InputType()
export class SeriesFilterParametersQL extends SeriesFilterParameters {
}

@InputType()
@ObjectParametersType()
export class SeriesOrderParameters extends DefaultOrderParameters {
}

@InputType()
export class SeriesOrderParametersQL extends SeriesOrderParameters {
}

@ArgsType()
export class SeriesIndexParametersQL extends FilterParameters(SeriesFilterParametersQL) {
}

@ArgsType()
export class SeriesPageParametersQL extends PaginatedFilterParameters(SeriesFilterParametersQL, SeriesOrderParametersQL) {
}

@ArgsType()
export class SeriesParametersQL extends SeriesPageParametersQL {
	@Field(() => ListType, { nullable: true })
	list?: ListType;

	@Field(() => String, { nullable: true })
	seed?: string;
}
