import {Bookmark, BookmarkPage} from './bookmark.model.js';
import {UserRole} from '../../types/enums.js';
import {IncludesTrackArgs} from '../track/track.args.js';
import {BookmarkCreateArgs, BookmarkFilterArgs, BookmarkOrderArgs, IncludesBookmarkChildrenArgs} from './bookmark.args.js';
import {IncludesEpisodeArgs} from '../episode/episode.args.js';
import {PageArgs} from '../base/base.args.js';
import {Context} from '../../modules/engine/rest/context.js';
import {Controller} from '../../modules/rest/decorators/Controller.js';
import {Get} from '../../modules/rest/decorators/Get.js';
import {QueryParam} from '../../modules/rest/decorators/QueryParam.js';
import {QueryParams} from '../../modules/rest/decorators/QueryParams.js';
import {Ctx} from '../../modules/rest/decorators/Ctx.js';
import {Post} from '../../modules/rest/decorators/Post.js';
import {BodyParams} from '../../modules/rest/decorators/BodyParams.js';
import {BodyParam} from '../../modules/rest/decorators/BodyParam.js';

@Controller('/bookmark', {tags: ['Bookmark'], roles: [UserRole.stream]})
export class BookmarkController {
	@Get('/id',
		() => Bookmark,
		{description: 'Get a Bookmark by Id', summary: 'Get Bookmark'}
	)
	async id(
		@QueryParam('id', {description: 'Bookmark Id', isID: true}) id: string,
		@QueryParams() bookmarkChildrenArgs: IncludesBookmarkChildrenArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() episodeArgs: IncludesEpisodeArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<Bookmark> {
		return engine.transform.bookmark(
			orm, await orm.Bookmark.oneOrFail(user.roleAdmin ? {where: {id}} : {where: {id, user: user.id}}),
			bookmarkChildrenArgs, trackArgs, episodeArgs, user
		);
	}

	@Get(
		'/search',
		() => BookmarkPage,
		{description: 'Search Bookmarks'}
	)
	async search(
		@QueryParams() page: PageArgs,
		@QueryParams() bookmarkChildrenArgs: IncludesBookmarkChildrenArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() episodeArgs: IncludesEpisodeArgs,
		@QueryParams() filter: BookmarkFilterArgs,
		@QueryParams() order: BookmarkOrderArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<BookmarkPage> {
		return await orm.Bookmark.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.bookmark(orm, o, bookmarkChildrenArgs, trackArgs, episodeArgs, user)
		);
	}

	@Post(
		'/create',
		() => Bookmark,
		{description: 'Create a Bookmark', summary: 'Create Bookmark'}
	)
	async create(
		@BodyParams() createArgs: BookmarkCreateArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<Bookmark> {
		return await engine.transform.bookmark(
			orm, await engine.bookmark.create(orm, createArgs.mediaID, user, createArgs.position, createArgs.comment),
			{}, {}, {}, user
		);
	}

	@Post(
		'/remove',
		{description: 'Remove a Bookmark by Id', summary: 'Remove Bookmark'}
	)
	async remove(
		@BodyParam('id', {description: 'Bookmark Id', isID: true}) id: string,
		@Ctx() {orm, engine, user}: Context
	): Promise<void> {
		await engine.bookmark.remove(orm, id, user.id);
	}

	@Post(
		'/removeByMedia',
		{description: 'Remove Bookmarks by Media Id [Track/Episode]', summary: 'Remove Bookmarks'}
	)
	async removeByMedia(
		@BodyParam('id', {description: 'Track or Episode Id', isID: true}) id: string,
		@Ctx() {orm, engine, user}: Context
	): Promise<void> {
		await engine.bookmark.removeByDest(orm, id, user.id);
	}
}
