import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { ListType } from '../../types/enums.js';
import { DefaultOrderParameters, FilterParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class IncludesPlaylistParameters {
	@ObjectField({ nullable: true, description: 'include entries on playlist', defaultValue: false, example: false })
	playlistIncEntries?: boolean;

	@ObjectField({ nullable: true, description: 'include entry ids on playlist', defaultValue: false, example: false })
	playlistIncEntriesIDs?: boolean;

	@ObjectField({ nullable: true, description: 'include user state on playlist', defaultValue: false, example: false })
	playlistIncState?: boolean;
}

@ObjectParametersType()
export class PlaylistMutateParameters {
	@ObjectField({ nullable: true, description: 'Playlist Name' })
	name?: string;

	@ObjectField({ nullable: true, description: 'Comment', example: 'Awesome!' })
	comment?: string;

	@ObjectField({ nullable: true, description: 'Playlist is public?', example: false })
	isPublic?: boolean;

	@ObjectField(() => [String], { nullable: true, description: 'Track/Episode IDs of the playlist, may include duplicates', isID: true })
	mediaIDs?: Array<string>;
}

@InputType()
@ObjectParametersType()
export class PlaylistFilterParameters {
	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Search Query', example: 'awesome' })
	query?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Name', example: 'Awesome Playlist' })
	name?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Comment', example: 'Awesome Comment' })
	comment?: string;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Playlist Ids', isID: true })
	ids?: Array<string>;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp })
	since?: number;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by User Ids', isID: true })
	userIDs?: Array<string>;

	@Field(() => Boolean, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by isPublic Flag', example: true })
	isPublic?: boolean;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by since Playlist duration', min: 0, example: examples.timestamp })
	durationFrom?: number;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by until Playlist duration', min: 0, example: examples.timestamp })
	durationTo?: number;
}

@InputType()
export class PlaylistFilterParametersQL extends PlaylistFilterParameters {
}

@InputType()
@ObjectParametersType()
export class PlaylistOrderParameters extends DefaultOrderParameters {
}

@InputType()
export class PlaylistOrderParametersQL extends PlaylistOrderParameters {
}

@ArgsType()
export class PlaylistIndexParameters extends FilterParameters(PlaylistFilterParametersQL) {
}

@ArgsType()
export class PlaylistPageParametersQL extends PaginatedFilterParameters(PlaylistFilterParametersQL, PlaylistOrderParametersQL) {
}

@ArgsType()
export class PlaylistsParameters extends PlaylistPageParametersQL {
	@Field(() => ListType, { nullable: true })
	list?: ListType;

	@Field(() => String, { nullable: true })
	seed?: string;
}
