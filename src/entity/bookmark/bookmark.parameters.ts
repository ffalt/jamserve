import { BookmarkOrderFields } from '../../types/enums.js';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { OrderByParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class IncludesBookmarkChildrenParameters {
	@ObjectField({ nullable: true, description: 'include track on bookmarks(s)', defaultValue: false, example: false })
	bookmarkIncTrack?: boolean;
}

@ObjectParametersType()
export class BookmarkCreateParameters {
	@ObjectField({ description: 'a track or episode id', isID: true })
	mediaID!: string;

	@ObjectField({ description: 'the position of the bookmark (in ms)', min: 0, example: 5555 })
	position!: number;

	@ObjectField({ description: 'a comment', example: 'Awesome!' })
	comment?: string;
}

@InputType()
@ObjectParametersType()
export class BookmarkFilterParameters {
	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Search Query', example: 'awesome position' })
	query?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Comment', example: 'This Awesome Position!' })
	comment?: string;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Bookmark Ids', isID: true })
	ids?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true })
	trackIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Episode Ids', isID: true })
	episodeIDs?: Array<string>;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp })
	since?: number;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by User Ids', isID: true })
	userIDs?: Array<string>;
}

@InputType()
export class BookmarkFilterParametersQL extends BookmarkFilterParameters {
}

@InputType()
@ObjectParametersType()
export class BookmarkOrderParameters extends OrderByParameters {
	@Field(() => BookmarkOrderFields, { nullable: true })
	@ObjectField(() => BookmarkOrderFields, { nullable: true, description: 'order by field' })
	orderBy?: BookmarkOrderFields;
}

@InputType()
export class BookmarkOrderParametersQL extends BookmarkOrderParameters {
}

@ArgsType()
export class BookmarksPageParametersQL extends PaginatedFilterParameters(BookmarkFilterParametersQL, BookmarkOrderParametersQL) {
}

@ArgsType()
export class BookmarksParameters extends BookmarksPageParametersQL {
}
