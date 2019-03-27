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

export class TrackController extends BaseListController<JamParameters.Track, JamParameters.Tracks, JamParameters.IncludesTrack, SearchQueryTrack, JamParameters.TrackSearch, Track, Jam.Track> {

	constructor(
		private trackService: TrackService,
		private folderService: FolderService,
		private audioModule: AudioModule,
		private bookmarkService: BookmarkService,
		private metaService: MetaDataService,
		private streamController: StreamController,
		private ioService: IoService,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(trackService, stateService, imageService, downloadService);
	}

	defaultSort(tracks: Array<Track>): Array<Track> {
		return tracks.sort((a, b) => {
				if (a.tag.disc !== undefined && b.tag.disc !== undefined) {
					const res = a.tag.disc - b.tag.disc;
					if (res !== 0) {
						return res;
					}
				}
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

	async rawTagUpdate(req: JamRequest<JamParameters.RawTagUpdate>): Promise<void> {
		const track = await this.byID(req.query.id);
		await this.audioModule.writeRawTag(path.join(track.path, track.name), req.query.tag);
		this.ioService.refreshTrack(track);
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

	async nameUpdate(req: JamRequest<JamParameters.TrackEditName>): Promise<void> {
		const track = await this.byID(req.query.id);
		await this.trackService.renameTrack(track, req.query.name);
	}

	async parentUpdate(req: JamRequest<JamParameters.TrackMoveParent>): Promise<void> {
		const folder = await this.folderService.store.byId(req.query.folderID);
		if (!folder) {
			return Promise.reject(NotFoundError());
		}
		const refreshFolders = [{folderIDs: [folder.id], rootID: folder.rootID}];
		const tracks = await this.byIDs(req.query.ids);
		for (const track of tracks) {
			const f = refreshFolders.find(refreshFolder => refreshFolder.rootID === track.rootID);
			if (!f) {
				refreshFolders.push({folderIDs: [track.parentID], rootID: track.rootID});
			} else if (f.folderIDs.indexOf(track.parentID) < 0) {
				f.folderIDs.push(track.parentID);
			}
		}
		await this.trackService.moveTracks(tracks, folder);
		for (const f of refreshFolders) {
			this.ioService.refreshFolders(f.folderIDs, f.rootID);
		}
	}
}
