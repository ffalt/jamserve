import {JamRequest} from '../../api/jam/api';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {ListResult} from '../base/list-result';
import {TrackController} from '../track/track.controller';
import {User} from '../user/user.model';
import {formatBookmark} from './bookmark.format';
import {Bookmark} from './bookmark.model';
import {BookmarkService} from './bookmark.service';
import {SearchQueryBookmark} from './bookmark.store';

export class BookmarkController {

	constructor(
		public bookmarkService: BookmarkService,
		private trackController: TrackController
	) {
	}

	defaultSort(items: Array<Bookmark>): Array<Bookmark> {
		return items.sort((a, b) => b.changed - a.changed);
	}

	async prepare(bookmark: Bookmark, includes: JamParameters.IncludesBookmark, user: User): Promise<Jam.Bookmark> {
		const result = formatBookmark(bookmark);
		if (includes.bookmarkTrack) {
			result.track = await this.trackController.prepareByID(bookmark.id, includes, user);
		}
		return result;
	}

	translateQuery(query: JamParameters.BookmarkSearch, user: User): SearchQueryBookmark {
		return {
			query: query.query,
			userID: query.userID,
			destID: query.trackID,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
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
		const list = await this.bookmarkService.byUser(req.user.id, req.query.amount, req.query.offset);
		const result: ListResult<Jam.Bookmark> = {
			total: list.total,
			offset: list.offset,
			amount: list.amount,
			items: list.items.map(bookmark => formatBookmark(bookmark))
		};
		if (req.query.bookmarkTrack) {
			const tracks = await this.trackController.prepareListByIDs(list.items.map(b => b.destID), req.query, req.user);
			result.items.forEach(bookmark => {
				bookmark.track = tracks.find(t => t.id === bookmark.trackID);
			});
		}
		return result;
	}

	async byTrackList(req: JamRequest<JamParameters.BookmarkListByTrack>): Promise<ListResult<Jam.Bookmark>> {
		const list = await this.bookmarkService.byTrack(req.query.trackID, req.user.id);
		const result: ListResult<Jam.Bookmark> = {
			total: list.total,
			offset: list.offset,
			amount: list.amount,
			items: list.items.map(bookmark => formatBookmark(bookmark))
		};
		return result;
	}
}
