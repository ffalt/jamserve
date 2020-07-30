import {ObjField, ObjParamsType} from '../../modules/rest/decorators';
import {BookmarkOrderFields} from '../../types/enums';
import {ArgsType, Field, Float, ID, InputType} from 'type-graphql';
import {OrderByArgs, PaginatedArgs} from '../base/base.args';
import {examples} from '../../modules/engine/rest/example.consts';

@ObjParamsType()
export class IncludesBookmarkChildrenArgs {
	@ObjField({nullable: true, description: 'include track on bookmarks(s)', defaultValue: false, example: false})
	bookmarkIncTrack?: boolean;
}

@ObjParamsType()
export class BookmarkCreateArgs {
	@ObjField({description: 'a track or episode id', isID: true})
	mediaID!: string;
	@ObjField({description: 'the position of the bookmark (in ms)', min: 0, example: 5555})
	position!: number;
	@ObjField({description: 'a comment', example: 'Awesome!'})
	comment?: string;
}

@InputType()
@ObjParamsType()
export class BookmarkFilterArgs {
	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Search Query', example: 'awesome position'})
	query?: string;

	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Comment', example: 'This Awesome Position!'})
	comment?: string;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Bookmark Ids', isID: true})
	ids?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Track Ids', isID: true})
	trackIDs?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Episode Ids', isID: true})
	episodeIDs?: Array<string>;

	@Field(() => Float, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp})
	since?: number;
}

@InputType()
export class BookmarkFilterArgsQL extends BookmarkFilterArgs {
}

@InputType()
@ObjParamsType()
export class BookmarkOrderArgs extends OrderByArgs {
	@Field(() => BookmarkOrderFields, {nullable: true})
	@ObjField(() => BookmarkOrderFields, {nullable: true, description: 'order by field'})
	orderBy?: BookmarkOrderFields;
}

@InputType()
export class BookmarkOrderArgsQL extends BookmarkOrderArgs {
}

@ArgsType()
export class BookmarksArgs extends PaginatedArgs(BookmarkFilterArgsQL, BookmarkOrderArgsQL) {
}
