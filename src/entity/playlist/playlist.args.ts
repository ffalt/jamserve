import { ArgsType, Field, Float, ID, InputType } from 'type-graphql';
import { ListType } from '../../types/enums.js';
import { DefaultOrderArgs, FilterArgs, PaginatedFilterArgs } from '../base/base.args.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import {ObjParamsType} from '../../modules/rest/decorators/ObjParamsType.js';
import {ObjField} from '../../modules/rest/decorators/ObjField.js';

@ObjParamsType()
export class IncludesPlaylistArgs {
	@ObjField({ nullable: true, description: 'include entries on playlist', defaultValue: false, example: false })
	playlistIncEntries?: boolean;

	@ObjField({ nullable: true, description: 'include entry ids on playlist', defaultValue: false, example: false })
	playlistIncEntriesIDs?: boolean;

	@ObjField({ nullable: true, description: 'include user state on playlist', defaultValue: false, example: false })
	playlistIncState?: boolean;
}

@ObjParamsType()
export class PlaylistMutateArgs {
	@ObjField({ nullable: true, description: 'Playlist Name' })
	name?: string;

	@ObjField({ nullable: true, description: 'Comment', example: 'Awesome!' })
	comment?: string;

	@ObjField({ nullable: true, description: 'Playlist is public?', example: false })
	isPublic?: boolean;

	@ObjField(() => [String], { nullable: true, description: 'Track/Episode IDs of the playlist, may include duplicates', isID: true })
	mediaIDs?: Array<string>;
}

@InputType()
@ObjParamsType()
export class PlaylistFilterArgs {
	@Field(() => String, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Search Query', example: 'awesome' })
	query?: string;

	@Field(() => String, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Name', example: 'Awesome Playlist' })
	name?: string;

	@Field(() => String, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Comment', example: 'Awesome Comment' })
	comment?: string;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Playlist Ids', isID: true })
	ids?: Array<string>;

	@Field(() => Float, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp })
	since?: number;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by User Ids', isID: true })
	userIDs?: Array<string>;

	@Field(() => Boolean, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by isPublic Flag', example: true })
	isPublic?: boolean;

	@Field(() => Float, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by since Playlist duration', min: 0, example: examples.timestamp })
	durationFrom?: number;

	@Field(() => Float, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by until Playlist duration', min: 0, example: examples.timestamp })
	durationTo?: number;
}

@InputType()
export class PlaylistFilterArgsQL extends PlaylistFilterArgs {
}

@InputType()
@ObjParamsType()
export class PlaylistOrderArgs extends DefaultOrderArgs {
}

@InputType()
export class PlaylistOrderArgsQL extends PlaylistOrderArgs {
}

@ArgsType()
export class PlaylistIndexArgs extends FilterArgs(PlaylistFilterArgsQL) {
}

@ArgsType()
export class PlaylistPageArgsQL extends PaginatedFilterArgs(PlaylistFilterArgsQL, PlaylistOrderArgsQL) {
}

@ArgsType()
export class PlaylistsArgs extends PlaylistPageArgsQL {
	@Field(() => ListType, { nullable: true })
	list?: ListType;

	@Field(() => String, { nullable: true })
	seed?: string;
}
