import {Bookmark, BookmarkPage} from './bookmark.model';
import {Inject, InRequestScope} from 'typescript-ioc';
import {TransformService} from '../../modules/engine/services/transform.service';
import {BodyParam, BodyParams, Controller, Ctx, Get, Post, QueryParam, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {IncludesTrackArgs} from '../track/track.args';
import {BookmarkCreateArgs, BookmarkFilterArgs, BookmarkOrderArgs, IncludesBookmarkChildrenArgs} from './bookmark.args';
import {IncludesEpisodeArgs} from '../episode/episode.args';
import {BookmarkService} from './bookmark.service';
import {PageArgs} from '../base/base.args';
import {Context} from '../../modules/engine/rest/context';

@InRequestScope
@Controller('/bookmark', {tags: ['Bookmark'], roles: [UserRole.stream]})
export class BookmarkController {
	@Inject
	private transform!: TransformService;
	@Inject
	private bookmarkService!: BookmarkService;

	@Get('/id',
		() => Bookmark,
		{description: 'Get a Bookmark by Id', summary: 'Get Bookmark'}
	)
	async id(
		@QueryParam('id', {description: 'Bookmark Id', isID: true}) id: string,
		@QueryParams() bookmarkChildrenArgs: IncludesBookmarkChildrenArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() episodeArgs: IncludesEpisodeArgs,
		@Ctx() {orm, user}: Context
	): Promise<Bookmark> {
		return this.transform.bookmark(
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
		@Ctx() {orm, user}: Context
	): Promise<BookmarkPage> {
		return await orm.Bookmark.searchTransformFilter(
			filter, [order], page, user,
			o => this.transform.bookmark(orm, o, bookmarkChildrenArgs, trackArgs, episodeArgs, user)
		);
	}

	@Post(
		'/create',
		() => Bookmark,
		{description: 'Create a Bookmark', summary: 'Create Bookmark'}
	)
	async create(
		@BodyParams() createArgs: BookmarkCreateArgs,
		@Ctx() {orm, user}: Context
	): Promise<Bookmark> {
		return await this.transform.bookmark(
			orm, await this.bookmarkService.create(orm, createArgs.mediaID, user, createArgs.position, createArgs.comment),
			{}, {}, {}, user
		);
	}

	@Post(
		'/remove',
		{description: 'Remove a Bookmark by Id', summary: 'Remove Bookmark'}
	)
	async remove(
		@BodyParam('id', {description: 'Bookmark Id', isID: true}) id: string,
		@Ctx() {orm, user}: Context
	): Promise<void> {
		await this.bookmarkService.remove(orm, id, user.id);
	}

	@Post(
		'/removeByMedia',
		{description: 'Remove Bookmarks by Media Id [Track/Episode]', summary: 'Remove Bookmarks'}
	)
	async removeByMedia(
		@BodyParam('id', {description: 'Track or Episode Id', isID: true}) id: string,
		@Ctx() {orm, user}: Context
	): Promise<void> {
		await this.bookmarkService.removeByDest(orm, id, user.id);
	}
}
