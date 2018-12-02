import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {DBObjectType} from '../../types';
import {JamRequest} from '../../api/jam/api';
import {BaseController} from '../base/base.controller';
import {StateService} from '../state/state.service';
import {ImageService} from '../../engine/image/image.service';
import {DownloadService} from '../../engine/download/download.service';
import {User} from '../user/user.model';
import {Bookmark} from './bookmark.model';
import {BookmarkStore, SearchQueryBookmark} from './bookmark.store';
import {TrackController} from '../track/track.controller';
import {formatBookmark} from './bookmark.format';
import {BookmarkService} from './bookmark.service';

export class BookmarkController extends BaseController<JamParameters.Bookmark, JamParameters.Bookmarks, JamParameters.IncludesBookmark, SearchQueryBookmark, JamParameters.BookmarkSearch, Bookmark, Jam.Bookmark> {

	constructor(
		private bookmarkStore: BookmarkStore,
		private bookmarkService: BookmarkService,
		private trackController: TrackController,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(bookmarkStore, DBObjectType.bookmark, stateService, imageService, downloadService);
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

	async delete(req: JamRequest<JamParameters.ID>): Promise<void> {
		await this.bookmarkService.remove(req.query.id, req.user);
	}

	async list(req: JamRequest<JamParameters.BookmarkList>): Promise<Array<Jam.Bookmark>> {
		const bookmarks = await this.bookmarkService.getAll(req.user.id);
		const result = bookmarks.map(bookmark => formatBookmark(bookmark));
		if (req.query.bookmarkTrack) {
			const tracks = await this.trackController.prepareListByIDs(bookmarks.map(b => b.destID), req.query, req.user);
			result.forEach(bookmark => {
				bookmark.track = tracks.find(t => t.id === bookmark.trackID);
			});
		}
		return result;
	}

}
