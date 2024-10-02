import { ObjField, ObjParamsType } from '../../modules/rest/index.js';
import { ArgsType, Field, Float, ID, InputType } from 'type-graphql';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { GenreOrderFields, ListType } from '../../types/enums.js';
import { FilterArgs, OrderByArgs, PaginatedFilterArgs } from '../base/base.args.js';

@ObjParamsType()
export class IncludesGenreArgs {
	@ObjField({ nullable: true, description: 'include state (fav,rate) on genre(s)', defaultValue: false, example: false })
	genreState?: boolean;
}

@InputType()
@ObjParamsType()
export class GenreFilterArgs {
	@Field(() => String, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Search Query', example: 'pink' })
	query?: string;

	@Field(() => String, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Genre Name', example: 'Pop' })
	name?: string;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true })
	ids?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true })
	trackIDs?: Array<string>;
	//
	// @Field(() => [ID], {nullable: true})
	// @ObjField(() => [String], {nullable: true, description: 'filter by Root Ids', isID: true})
	// rootIDs?: Array<string>;
	//
	// @Field(() => [ID], {nullable: true})
	// @ObjField(() => [String], {nullable: true, description: 'filter by Album Ids', isID: true})
	// albumIDs?: Array<string>;
	//
	// @Field(() => [ID], {nullable: true})
	// @ObjField(() => [String], {nullable: true, description: 'filter by Track Ids', isID: true})
	// trackIDs?: Array<string>;
	//
	// @Field(() => [ID], {nullable: true})
	// @ObjField(() => [String], {nullable: true, description: 'filter by Album Track Ids', isID: true})
	// albumTrackIDs?: Array<string>;
	//
	// @Field(() => [ID], {nullable: true})
	// @ObjField(() => [String], {nullable: true, description: 'filter by Series Ids', isID: true})
	// seriesIDs?: Array<string>;
	//
	// @Field(() => [ID], {nullable: true})
	// @ObjField(() => [String], {nullable: true, description: 'filter by Folder Ids', isID: true})
	// folderIDs?: Array<string>;
	//
	// @Field(() => [String], {nullable: true})
	// @ObjField(() => [String], {nullable: true, description: 'filter by Genres', example: examples.genres})
	// genres?: Array<string>;
	//
	// @Field(() => [AlbumType], {nullable: true})
	// @ObjField(() => [AlbumType], {nullable: true, description: 'filter by Album Types', example: [AlbumType.audiobook]})
	// albumTypes?: Array<AlbumType>;
	//
	// @Field(() => [String], {nullable: true})
	// @ObjField(() => [String], {nullable: true, description: 'filter by MusicBrainz Artist Ids', example: [examples.mbArtistID]})
	// mbArtistIDs?: Array<string>;
	//
	// @Field(() => String, {nullable: true})
	// @ObjField(() => String, {nullable: true, description: 'exclude by MusicBrainz Artist Id', example: examples.mbArtistID})
	// notMbArtistID?: string;

	@Field(() => Float, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp })
	since?: number;
}

@InputType()
export class GenreFilterArgsQL extends GenreFilterArgs {
}

@InputType()
@ObjParamsType()
export class GenreOrderArgs extends OrderByArgs {
	@Field(() => GenreOrderFields, { nullable: true })
	@ObjField(() => GenreOrderFields, { nullable: true, description: 'order by field' })
	orderBy?: GenreOrderFields;
}

@InputType()
export class GenreOrderArgsQL extends GenreOrderArgs {
}

@ArgsType()
export class GenreIndexArgsQL extends FilterArgs(GenreFilterArgsQL) {
}

@ArgsType()
export class GenrePageArgsQL extends PaginatedFilterArgs(GenreFilterArgsQL, GenreOrderArgsQL) {
}

@ArgsType()
export class GenresArgsQL extends GenrePageArgsQL {
	@Field(() => ListType, { nullable: true })
	list?: ListType;

	@Field(() => String, { nullable: true })
	seed?: string;
}
