import path from 'path';
import {JamRequest} from '../../api/jam/api';
import {NotFoundError} from '../../api/jam/error';
import {DBObjectType} from '../../db/db.types';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {TrackHealthID} from '../../model/jam-types';
import {AudioModule} from '../../modules/audio/audio.module';
import {trackTagToRawTag} from '../../modules/audio/metadata';
import {ApiBinaryResult} from '../../typings';
import {logger} from '../../utils/logger';
import {paginate} from '../../utils/paginate';
import {BaseListController} from '../base/dbobject-list.controller';
import {ListResult} from '../base/list-result';
import {BookmarkService} from '../bookmark/bookmark.service';
import {DownloadService} from '../download/download.service';
import {Folder} from '../folder/folder.model';
import {FolderService} from '../folder/folder.service';
import {TrackRulesChecker} from '../health/track.rule';
import {ImageService} from '../image/image.service';
import {IoService} from '../io/io.service';
import {MetaDataService} from '../metadata/metadata.service';
import {Root} from '../root/root.model';
import {RootService} from '../root/root.service';
import {formatState} from '../state/state.format';
import {StateService} from '../state/state.service';
import {StreamController} from '../stream/stream.controller';
import {User} from '../user/user.model';
import {formatTrack} from './track.format';
import {Track} from './track.model';
import {TrackService} from './track.service';
import {SearchQueryTrack} from './track.store';

const log = logger('TrackController');

export class TrackController extends BaseListController<JamParameters.Track,
	JamParameters.Tracks,
	JamParameters.IncludesTrack,
	SearchQueryTrack,
	JamParameters.TrackSearch,
	Track,
	Jam.Track,
	JamParameters.TrackList> {
	checker = new TrackRulesChecker();

	constructor(
		public trackService: TrackService,
		private folderService: FolderService,
		private audioModule: AudioModule,
		private bookmarkService: BookmarkService,
		private metaService: MetaDataService,
		private streamController: StreamController,
		private ioService: IoService,
		private rootService: RootService,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(trackService, stateService, imageService, downloadService);
	}

	async prepare(track: Track, includes: JamParameters.IncludesTrack, user: User): Promise<Jam.Track> {
		const result = formatTrack(track, includes);
		if (includes.trackRawTag) {
			result.tagRaw = await this.getRawTag(track);
		}
		if (includes.trackState) {
			const state = await this.stateService.findOrCreate(track.id, user.id, DBObjectType.track);
			result.state = formatState(state);
		}
		return result;
	}

	async translateQuery(query: JamParameters.TrackSearch, user: User): Promise<SearchQueryTrack> {
		let inPath: string | undefined;
		if (query.childOfID) {
			const folder = await this.folderService.folderStore.byId(query.childOfID);
			if (folder) {
				inPath = folder.path;
			}
		}
		return {
			query: query.query,
			id: query.id,
			ids: query.ids,
			rootID: query.rootID,
			rootIDs: query.rootIDs,
			parentID: query.parentID,
			parentIDs: query.parentIDs,
			inPath,
			artist: query.artist,
			title: query.title,
			album: query.album,
			artistID: query.artistID,
			albumArtistID: query.albumArtistID,
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

	private async getRawTag(track: Track): Promise<Jam.RawTag | undefined> {
		try {
			const result = await this.audioModule.readRawTag(path.join(track.path, track.name));
			if (!result) {
				return trackTagToRawTag(track.tag);
			}
			return result;
		} catch (e) {
			return trackTagToRawTag(track.tag);
		}
	}

	async rawTag(req: JamRequest<JamParameters.ID>): Promise<Jam.RawTag> {
		const track = await this.byID(req.query.id);
		const result = await this.getRawTag(track);
		if (!result) {
			return Promise.reject(Error('Unsupported audio file'));
		}
		return result;
	}

	async rawTags(req: JamRequest<JamParameters.IDs>): Promise<Jam.RawTags> {
		let tracks = await this.byIDs(req.query.ids);
		tracks = this.service.defaultSort(tracks);
		const result: Jam.RawTags = {};
		for (const track of tracks) {
			const tag = await this.getRawTag(track);
			if (tag) {
				result[track.id] = tag;
			}
		}
		return result;
	}

	async rawTagUpdate(req: JamRequest<JamParameters.RawTagUpdate>): Promise<Jam.AdminChangeQueueInfo> {
		const track = await this.byID(req.query.id);
		return this.ioService.writeRawTag(track.id, req.query.tag, track.rootID);
	}

	async stream(req: JamRequest<JamParameters.Stream>): Promise<ApiBinaryResult> {
		const track = await this.byID(req.query.id);
		return this.streamController.streamTrack(track, req.query.format, req.query.maxBitRate, req.user);
	}

	async similar(req: JamRequest<JamParameters.SimilarTracks>): Promise<ListResult<Jam.Track>> {
		const track = await this.byID(req.query.id);
		const tracks = await this.metaService.similarTracks.byTrack(track);
		const list = paginate(tracks, req.query.amount, req.query.offset);
		return {
			total: list.total,
			amount: list.amount,
			offset: list.offset,
			items: await this.prepareList(list.items, req.query, req.user)
		};
	}

	async nameUpdate(req: JamRequest<JamParameters.TrackEditName>): Promise<Jam.AdminChangeQueueInfo> {
		const track = await this.byID(req.query.id);
		return this.ioService.renameTrack(track.id, req.query.name, track.rootID);
	}

	async parentUpdate(req: JamRequest<JamParameters.TrackMoveParent>): Promise<Jam.AdminChangeQueueInfo> {
		const folder = await this.folderService.store.byId(req.query.folderID);
		if (!folder) {
			return Promise.reject(NotFoundError());
		}
		return this.ioService.moveTracks(req.query.ids, folder.id, folder.rootID);
	}

	async delete(req: JamRequest<JamParameters.ID>): Promise<Jam.AdminChangeQueueInfo> {
		const track = await this.byID(req.query.id);
		return this.ioService.removeTrack(track.id, track.rootID);
	}

	async fix(req: JamRequest<JamParameters.TrackFix>): Promise<Jam.AdminChangeQueueInfo> {
		const track = await this.byID(req.query.id);
		return this.ioService.fixTrack(track.id, req.query.fixID as TrackHealthID, track.rootID);
	}

	async health(req: JamRequest<JamParameters.TrackHealth>): Promise<Array<Jam.TrackHealth>> {
		const list = await this.service.store.search(await this.translateQuery(req.query, req.user));
		list.items = this.service.defaultSort(list.items);
		const result: Array<Jam.TrackHealth> = [];
		const roots: Array<Root> = [];
		const folders: Array<Folder> = [];
		for (const track of list.items) {
			let root = roots.find(r => r.id === track.rootID);
			if (!root) {
				root = await this.rootService.rootStore.byId(track.rootID);
				if (root) {
					roots.push(root);
				}
			}
			if (root) {
				let folder = folders.find(f => f.id === track.parentID);
				if (!folder) {
					folder = await this.folderService.folderStore.byId(track.parentID);
					if (folder) {
						folders.push(folder);
					}

				}
				if (folder) {
					const health = await this.checker.run(track, folder, root, !!req.query.media);
					if (health && health.length > 0) {
						result.push({
							track: await this.prepare(track, req.query, req.user),
							health
						});
					}
				}
			}
		}
		return result;
	}

	async lyrics(req: JamRequest<JamParameters.ID>): Promise<Jam.TrackLyrics> {
		const track = await this.byID(req.query.id);
		if (track.tag.lyrics) {
			return {lyrics: track.tag.lyrics};
		}
		const song = track.tag.title;
		if (!song) {
			return {};
		}
		try {
			let result: Jam.TrackLyrics | undefined;
			if (track.tag.artist) {
				result = await this.metaService.lyrics(track.tag.artist, song);
			}
			if ((!result || !result.lyrics) && track.tag.albumArtist && (track.tag.artist !== track.tag.albumArtist)) {
				result = await this.metaService.lyrics(track.tag.albumArtist, song);
			}
			return result || {};
		} catch (e) {
			log.error(e);
			return {};
		}
	}
}
