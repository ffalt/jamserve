import {JamParameters} from '../../model/jam-rest-params';
import {Jam} from '../../model/jam-rest-data';
import {DBObjectType} from '../../db/db.types';
import path from 'path';
import {IApiBinaryResult} from '../../typings';
import {paginate} from '../../utils/paginate';
import {JamRequest} from '../../api/jam/api';
import {BaseListController} from '../base/base.list.controller';
import {formatTrack} from './track.format';
import {SearchQueryTrack} from './track.store';
import {AudioModule} from '../../modules/audio/audio.module';
import {BookmarkService} from '../bookmark/bookmark.service';
import {MetaDataService} from '../metadata/metadata.service';
import {formatState} from '../state/state.format';
import {StateService} from '../state/state.service';
import {ImageService} from '../../engine/image/image.service';
import {DownloadService} from '../../engine/download/download.service';
import {Track} from './track.model';
import {User} from '../user/user.model';
import {IoService} from '../../engine/io/io.service';
import {StreamController} from '../../engine/stream/stream.controller';
import {TrackService} from './track.service';
import {FolderService} from '../folder/folder.service';
import {NotFoundError} from '../../api/jam/error';
import {trackTagToRawTag} from '../../modules/audio/metadata';
import {TrackRulesChecker} from '../../engine/health/track.rule';
import {Root} from '../root/root.model';
import {RootService} from '../root/root.service';
import {Folder} from '../folder/folder.model';

export class TrackController extends BaseListController<JamParameters.Track, JamParameters.Tracks, JamParameters.IncludesTrack, SearchQueryTrack, JamParameters.TrackSearch, Track, Jam.Track> {
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

	defaultCompare(a: Track, b: Track): number {
		let res = a.path.localeCompare(b.path);
		if (res !== 0) {
			return res;
		}
		if (a.tag.disc !== undefined && b.tag.disc !== undefined) {
			res = a.tag.disc - b.tag.disc;
			if (res !== 0) {
				return res;
			}
		}
		if (a.tag.track !== undefined && b.tag.track !== undefined) {
			res = a.tag.track - b.tag.track;
			if (res !== 0) {
				return res;
			}
		}
		return a.name.localeCompare(b.name);
	}

	defaultSort(tracks: Array<Track>): Array<Track> {
		return tracks.sort(this.defaultCompare);
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
			rootID: query.rootID,
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
		tracks = this.defaultSort(tracks);
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
		return await this.ioService.writeRawTag(track.id, req.query.tag, track.rootID);
	}

	async stream(req: JamRequest<JamParameters.Stream>): Promise<IApiBinaryResult> {
		const track = await this.byID(req.query.id);
		return await this.streamController.streamTrack(track, req.query.format, req.query.maxBitRate, req.user);
	}

	async similar(req: JamRequest<JamParameters.SimilarTracks>): Promise<Array<Jam.Track>> {
		const track = await this.byID(req.query.id);
		const tracks = await this.metaService.getTrackSimilarTracks(track);
		return this.prepareList(paginate(tracks, req.query.amount, req.query.offset), req.query, req.user);
	}

	async list(req: JamRequest<JamParameters.TrackList>): Promise<Array<Jam.Track>> {
		return this.getList(req.query, req.query, req.query, req.user);
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
		return this.ioService.fixTrack(track.id, req.query.fixID, track.rootID);
	}

	async health(req: JamRequest<JamParameters.TrackHealth>): Promise<Array<Jam.TrackHealth>> {
		let list = await this.service.store.search(await this.translateQuery(req.query, req.user));
		list = list.sort(this.defaultCompare);
		const result: Array<Jam.TrackHealth> = [];
		const roots: Array<Root> = [];
		const folders: Array<Folder> = [];
		for (const track of list) {
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
					if (folder && health && health.length > 0) {
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

}
