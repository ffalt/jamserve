import {Jam} from '../../model/jam-rest-data-0.1.0';
import {Bookmark} from './bookmark.model';

export function formatBookmark(bookmark: Bookmark): Jam.Bookmark {
	return {
		id: bookmark.id,
		trackID: bookmark.destID,
		comment: bookmark.comment,
		created: bookmark.created,
		changed: bookmark.changed,
		position: bookmark.position
	};
}
