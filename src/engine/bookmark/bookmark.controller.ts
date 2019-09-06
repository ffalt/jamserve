import {JamRequest} from '../../api/jam/api';
// import {SearchQueryBookmark} from './bookmark.store';
import {InvalidParamError, NotFoundError} from '../../api/jam/error';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {ListResult} from '../base/list-result';
import {TrackController} from '../track/track.controller';
import {User} from '../user/user.model';
import {formatBookmark} from './bookmark.format';
import {Bookmark} from './bookmark.model';
import {BookmarkService} from './bookmark.service';

export class BookmarkController {

	constructor(public bookmarkService: BookmarkService, private trackController: TrackController) {
	}

	// defaultSort(items: Array<Bookmark>): Array<Bookmark> {
	// 	return items.sort((a, b) => b.changed - a.changed);
	// }

	// translateQuery(query: JamParameters.BookmarkSearch, user: User): SearchQueryBookmark {
	// 	return {
	// 		query: query.query,
	// 		userID: query.userID,
	// 		destID: query.trackID,
	// 		offset: query.offset,
	// 		amount: query.amount,
	// 		sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
	// 	};
	// }

	async prepare(bookmark: Bookmark, includes: JamParameters.IncludesBookmark, user: User): Promise<Jam.Bookmark> {
		const result = formatBookmark(bookmark);
		if (includes.bookmarkTrack) {
			result.track = await this.trackController.prepareByID(bookmark.destID, includes, user);
		}
		return result;
	}

	async prepareList(list: ListResult<Bookmark>, includes: JamParameters.IncludesBookmark, user: User): Promise<Jam.BookmarkList> {
		const items = list.items.map(bookmark => formatBookmark(bookmark));
		if (includes.bookmarkTrack) {
			const ids: Array<string> = [];
			for (const item of list.items) {
				if (!ids.includes(item.destID)) {
					ids.push(item.destID);
				}
			}
			const tracks = await this.trackController.prepareListByIDs(ids, includes, user);
			items.forEach(bookmark => {
				bookmark.track = tracks.find(t => t.id === bookmark.trackID);
			});
		}
		return {total: list.total, offset: list.offset, amount: list.amount, items};
	}

	async id(req: JamRequest<JamParameters.Bookmark>): Promise<Jam.Bookmark> {
		if (!req.query.id) {
			return Promise.reject(InvalidParamError());
		}
		const bookmark = await this.bookmarkService.byID(req.query.id, req.user.id);
		if (!bookmark) {
			return Promise.reject(NotFoundError());
		}
		return this.prepare(bookmark, req.query, req.user);
	}

	async ids(req: JamRequest<JamParameters.Bookmarks>): Promise<Jam.BookmarkList> {
		if (!req.query.ids || req.query.ids.length === 0) {
			return Promise.reject(InvalidParamError());
		}
		return this.prepareList(
			await this.bookmarkService.byIDs(req.query.ids, req.user.id, req.query.amount, req.query.offset),
			req.query, req.user
		);
	}

	async create(req: JamRequest<JamParameters.BookmarkCreate>): Promise<Jam.Bookmark> {
		const track = await this.trackController.byID(req.query.trackID);
		const bookmark = await this.bookmarkService.create(track.id, req.user.id, req.query.position || 0, req.query.comment);
		return this.prepare(bookmark, {}, req.user);
	}

	async delete(req: JamRequest<JamParameters.BookmarkDelete>): Promise<void> {
		await this.bookmarkService.remove(req.query.id, req.user.id);
	}

	async byTrackDelete(req: JamRequest<JamParameters.BookmarkTrackDelete>): Promise<void> {
		await this.bookmarkService.removeByTrack(req.query.trackID, req.user.id);
	}

	async list(req: JamRequest<JamParameters.BookmarkList>): Promise<ListResult<Jam.Bookmark>> {
		return this.prepareList(
			await this.bookmarkService.byUser(req.user.id, req.query.amount, req.query.offset),
			req.query, req.user);
	}

	async byTrackList(req: JamRequest<JamParameters.BookmarkListByTrack>): Promise<ListResult<Jam.Bookmark>> {
		return this.prepareList(
			await this.bookmarkService.byTrack(req.query.trackID, req.user.id),
			{}, req.user);
	}

}
