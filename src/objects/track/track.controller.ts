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
		if (includes.trackID3) {
			result.tagID3 = await this.audioModule.readID3v2(path.join(track.path, track.name));
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

	async tagID3(req: JamRequest<JamParameters.ID>): Promise<Jam.ID3Tag> {
		const track = await this.byID(req.query.id);
		return this.audioModule.readID3v2(path.join(track.path, track.name));
	}

	async tagID3s(req: JamRequest<JamParameters.IDs>): Promise<Jam.ID3Tags> {
		let tracks = await this.byIDs(req.query.ids);
		tracks = this.defaultSort(tracks);
		const result: Jam.ID3Tags = {};
		for (const track of tracks) {
			result[track.id] = await this.audioModule.readID3v2(path.join(track.path, track.name));
		}
		return result;
	}

	async tagID3Update(req: JamRequest<JamParameters.TagID3Update>): Promise<void> {
		const track = await this.byID(req.query.id);
		await this.audioModule.saveID3v2(path.join(track.path, track.name), req.query.tag);
		this.ioService.refreshTrack(track);
	}

	// async tagID3sUpdate(req: JamRequest<JamParameters.TagID3sUpdate>): Promise<void> {
	// 	const tracks = await this.byIDs(req.query.tagID3s.map(tagID3 => tagID3.id));
	// 	const list: Array<{ track?: Track; tag: Jam.ID3Tag }> = req.query.tagID3s.map(tagID3 => {
	// 		return {track: tracks.find(t => t.id === tagID3.id), tag: tagID3.tag};
	// 	});
	// 	for (const item of list) {
	// 		if (!item.track) {
	// 			return Promise.reject(NotFoundError());
	// 		}
	// 		await this.audioModule.saveID3v2(path.join(item.track.path, item.track.name), item.tag);
	// 	}
	// 	this.ioService.refreshTracks(tracks);
	// }

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
}
