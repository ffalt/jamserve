import { Bookmark, BookmarkPage } from './bookmark.model.js';
import { UserRole } from '../../types/enums.js';
import { IncludesTrackParameters } from '../track/track.parameters.js';
import { BookmarkCreateParameters, BookmarkFilterParameters, BookmarkOrderParameters, IncludesBookmarkChildrenParameters } from './bookmark.parameters.js';
import { IncludesEpisodeParameters } from '../episode/episode.parameters.js';
import { PageParameters } from '../base/base.parameters.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';

@Controller('/bookmark', { tags: ['Bookmark'], roles: [UserRole.stream] })
export class BookmarkController {
	@Get('/id',
		() => Bookmark,
		{ description: 'Get a Bookmark by Id', summary: 'Get Bookmark' }
	)
	async id(
		@QueryParameter('id', { description: 'Bookmark Id', isID: true }) id: string,
		@QueryParameters() childrenParameters: IncludesBookmarkChildrenParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@QueryParameters() episodeParameters: IncludesEpisodeParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Bookmark> {
		return engine.transform.bookmark(
			orm, await orm.Bookmark.oneOrFail(user.roleAdmin ? { where: { id } } : { where: { id, user: user.id } }),
			childrenParameters, trackParameters, episodeParameters, user
		);
	}

	@Get(
		'/search',
		() => BookmarkPage,
		{ description: 'Search Bookmarks' }
	)
	async search(
		@QueryParameters() page: PageParameters,
		@QueryParameters() childrenParameters: IncludesBookmarkChildrenParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@QueryParameters() episodeParameters: IncludesEpisodeParameters,
		@QueryParameters() filter: BookmarkFilterParameters,
		@QueryParameters() order: BookmarkOrderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<BookmarkPage> {
		return await orm.Bookmark.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.bookmark(orm, o, childrenParameters, trackParameters, episodeParameters, user)
		);
	}

	@Post(
		'/create',
		() => Bookmark,
		{ description: 'Create a Bookmark', summary: 'Create Bookmark' }
	)
	async create(
		@BodyParameters() parameters: BookmarkCreateParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Bookmark> {
		return await engine.transform.bookmark(
			orm, await engine.bookmark.create(orm, parameters.mediaID, user, parameters.position, parameters.comment),
			{}, {}, {}, user
		);
	}

	@Post(
		'/remove',
		{ description: 'Remove a Bookmark by Id', summary: 'Remove Bookmark' }
	)
	async remove(
		@BodyParameter('id', { description: 'Bookmark Id', isID: true }) id: string,
		@RestContext() { orm, engine, user }: Context
	): Promise<void> {
		await engine.bookmark.remove(orm, id, user.id);
	}

	@Post(
		'/removeByMedia',
		{ description: 'Remove Bookmarks by Media Id [Track/Episode]', summary: 'Remove Bookmarks' }
	)
	async removeByMedia(
		@BodyParameter('id', { description: 'Track or Episode Id', isID: true }) id: string,
		@RestContext() { orm, engine, user }: Context
	): Promise<void> {
		await engine.bookmark.removeByDest(orm, id, user.id);
	}
}
