import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {DBObjectType} from '../../types';
import path from 'path';
import {NotFoundError} from '../../api/jam/error';
import {IApiBinaryResult} from '../../typings';
import {paginate} from '../../utils/paginate';
import {JamRequest} from '../../api/jam/api';
import {BaseListController} from '../list/base.list.controller';
import {formatTrack} from './track.format';
import {SearchQueryTrack, TrackStore} from './track.store';
import {AudioService} from '../audio/audio.service';
import {StateStore} from '../state/state.store';
import {RootService} from '../root/root.service';
import {BookmarkService} from '../bookmark/bookmark.service';
import {BookmarkStore} from '../bookmark/bookmark.store';
import {MetaDataService} from '../metadata/metadata.service';
import {StreamService} from '../stream/stream.service';
import {formatState} from '../state/state.format';
import {formatBookmark} from '../bookmark/bookmark.format';
import {StateService} from '../state/state.service';
import {ImageService} from '../image/image.service';
import {DownloadService} from '../download/download.service';
import {ListService} from '../list/list.service';
import {Track} from './track.model';
import {Bookmark} from '../bookmark/bookmark.model';
import {User} from '../user/user.model';

export function defaultTrackSort(tracks: Array<Track>): Array<Track> {
	return tracks.sort((a, b) => {
			if (a.tag.track !== undefined && b.tag.track !== undefined) {
				const res = a.tag.track - b.tag.track;
				if (res !== 0) {
					return res;
				}
			}
			return a.name.localeCompare(b.name);
		}
	);
}

export class TrackController extends BaseListController<JamParameters.Track, JamParameters.Tracks, JamParameters.IncludesTrack, SearchQueryTrack, JamParameters.TrackSearch, Track, Jam.Track> {

	constructor(
		private trackStore: TrackStore,
		private audioService: AudioService,
		private bookmarkService: BookmarkService,
		private metaService: MetaDataService,
		private streamService: StreamService,
		private rootService: RootService,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService,
		protected listService: ListService
	) {
		super(trackStore, DBObjectType.track, stateService, imageService, downloadService, listService);
	}

	async prepare(track: Track, includes: JamParameters.IncludesTrack, user: User): Promise<Jam.Track> {
		const result = formatTrack(track, includes);
		if (includes.trackID3) {
			result.tagID3 = await this.audioService.readID3v2(path.join(track.path, track.name));
		}
		if (includes.trackState) {
			const state = await this.stateService.findOrCreate(track.id, user.id, DBObjectType.track);
			result.state = formatState(state);
		}
		return result;
	}

	translateQuery(query: JamParameters.TrackSearch, user: User): SearchQueryTrack {
		return {
			query: query.query,
			rootID: query.rootID,
			parentID: query.parentID,
			artist: query.artist,
			title: query.title,
			album: query.album,
			genre: query.genre,
			newerThan: query.newerThan,
			fromYear: query.fromYear,
			toYear: query.toYear,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	// more track api

	async tagID3(req: JamRequest<JamParameters.ID>): Promise<Jam.ID3Tag> {
		const track = await this.byID(req.query.id);
		return this.audioService.readID3v2(path.join(track.path, track.name));
	}

	async tagID3s(req: JamRequest<JamParameters.IDs>): Promise<Jam.ID3Tags> {
		let tracks = await this.byIDs(req.query.ids);
		tracks = defaultTrackSort(tracks);
		const result: Jam.ID3Tags = {};
		for (const track of tracks) {
			result[track.id] = await this.audioService.readID3v2(path.join(track.path, track.name));
		}
		return result;
	}

	async tagID3Update(req: JamRequest<JamParameters.TagID3Update>): Promise<void> {
		const track = await this.byID(req.query.id);
		await this.audioService.saveID3v2(path.join(track.path, track.name), req.query.tag);
		this.rootService.refreshTracks([track]); // do not wait
	}

	async tagID3sUpdate(req: JamRequest<JamParameters.TagID3sUpdate>): Promise<void> {
		const tracks = await this.byIDs(req.query.tagID3s.map(tagID3 => tagID3.id));
		const list: Array<{ track?: Track; tag: Jam.ID3Tag }> = req.query.tagID3s.map(tagID3 => {
			return {track: tracks.find(t => t.id === tagID3.id), tag: tagID3.tag};
		});
		for (const item of list) {
			if (!item.track) {
				return Promise.reject(NotFoundError());
			}
			await this.audioService.saveID3v2(path.join(item.track.path, item.track.name), item.tag);
		}
		this.rootService.refreshTracks(tracks); // do not wait
	}

	async prepareBookmark(bookmark: Bookmark, includes: JamParameters.IncludesBookmark, user: User): Promise<Jam.TrackBookmark> {
		const result = formatBookmark(bookmark);
		if (includes.bookmarkTrack && bookmark.destID) {
			const track = await this.trackStore.byId(bookmark.destID);
			if (track) {
				result.track = await this.prepare(track, includes, user);
			}
		}
		return result;
	}


	async bookmarkCreate(req: JamRequest<JamParameters.BookmarkCreate>): Promise<Jam.TrackBookmark> {
		const track = await this.byID(req.query.id);
		const bookmark = await this.bookmarkService.create(track, req.user, req.query.position || 0, req.query.comment);
		return this.prepareBookmark(bookmark, {}, req.user);
	}

	async bookmarkDelete(req: JamRequest<JamParameters.ID>): Promise<void> {
		await this.bookmarkService.remove(req.query.id, req.user);
	}

	async bookmarkList(req: JamRequest<JamParameters.BookmarkList>): Promise<Array<Jam.TrackBookmark>> {
		const bookmarks = await this.bookmarkService.getAll(req.user.id);
		const result = bookmarks.map(bookmark => formatBookmark(bookmark));
		if (req.query.bookmarkTrack) {
			const entries = await this.trackStore.byIds(bookmarks.map(b => b.destID));
			const tracks = await this.prepareList(entries, req.query, req.user);
			result.forEach(bookmark => {
				bookmark.track = tracks.find(t => t.id === bookmark.trackID);
			});
		}
		return result;
	}

	async stream(req: JamRequest<JamParameters.Stream>): Promise<IApiBinaryResult> {
		const track = await this.byID(req.query.id);
		return await this.streamService.getObjStream(track, req.query.format, req.query.maxBitRate, req.user);
	}

	async similar(req: JamRequest<JamParameters.SimilarTracks>): Promise<Array<Jam.Track>> {
		const track = await this.byID(req.query.id);
		const tracks = await this.metaService.getTrackSimilarTracks(track);
		return this.prepareList(paginate(tracks, req.query.amount, req.query.offset), req.query, req.user);
	}

	async list(req: JamRequest<JamParameters.TrackList>): Promise<Array<Jam.Track>> {
		return this.getList(req.query, req.query, req.query, req.user);
	}

}
