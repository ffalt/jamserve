import {JamRequest} from '../../api/jam/api';
import {UnauthError} from '../../api/jam/error';
import {DBObjectType} from '../../db/db.types';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {paginate} from '../../utils/paginate';
import {BaseListController} from '../base/dbobject-list.controller';
import {ListResult} from '../base/list-result';
import {DownloadService} from '../download/download.service';
import {ImageService} from '../image/image.service';
import {formatState} from '../state/state.format';
import {StateService} from '../state/state.service';
import {TrackController} from '../track/track.controller';
import {User} from '../user/user.model';
import {formatPlaylist} from './playlist.format';
import {Playlist} from './playlist.model';
import {PlaylistService} from './playlist.service';
import {SearchQueryPlaylist} from './playlist.store';

export class PlaylistController extends BaseListController<JamParameters.Playlist,
	JamParameters.Playlists,
	JamParameters.IncludesPlaylist,
	SearchQueryPlaylist,
	JamParameters.PlaylistSearch,
	Playlist,
	Jam.Playlist,
	JamParameters.PlaylistList> {

	constructor(
		private playlistService: PlaylistService,
		private trackController: TrackController,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(playlistService, stateService, imageService, downloadService);
	}

	// TODO: filter none public playlist in base api functions?

	defaultSort(items: Array<Playlist>): Array<Playlist> {
		return items.sort((a, b) => a.name.localeCompare(b.name));
	}

	async prepare(playlist: Playlist, includes: JamParameters.IncludesPlaylist, user: User): Promise<Jam.Playlist> {
		const result = formatPlaylist(playlist, includes);
		if (includes.playlistState) {
			const state = await this.stateService.findOrCreate(playlist.id, user.id, DBObjectType.artist);
			result.state = formatState(state);
		}
		if (includes.playlistTracks) {
			result.tracks = await this.trackController.prepareListByIDs(playlist.trackIDs, includes, user);
		}
		return result;
	}

	async translateQuery(query: JamParameters.PlaylistSearch, user: User): Promise<SearchQueryPlaylist> {
		return {
			query: query.query,
			id: query.id,
			ids: query.ids,
			name: query.name,
			userID: user.id,
			isPublic: query.isPublic,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async create(req: JamRequest<JamParameters.PlaylistNew>): Promise<Jam.Playlist> {
		const playlist = await this.playlistService.create(req.query.name, req.query.comment, req.query.isPublic === undefined ? false : req.query.isPublic, req.user.id, req.query.trackIDs || []);
		return this.prepare(playlist, {playlistTrackIDs: true, playlistState: true}, req.user);
	}

	async update(req: JamRequest<JamParameters.PlaylistUpdate>): Promise<void> {
		const playlist = await this.byID(req.query.id);
		if (playlist.userID !== req.user.id) {
			return Promise.reject(UnauthError());
		}
		playlist.name = req.query.name || playlist.name;
		playlist.comment = req.query.comment || playlist.comment;
		playlist.isPublic = req.query.isPublic === undefined ? playlist.isPublic : req.query.isPublic;
		playlist.changed = Date.now();
		playlist.trackIDs = req.query.trackIDs || [];
		await this.playlistService.update(playlist);
	}

	async tracks(req: JamRequest<JamParameters.PlaylistTracks>): Promise<ListResult<Jam.Track>> {
		let playlists = await this.byIDs(req.query.ids);
		playlists = playlists.filter(playlist => playlist.userID === req.user.id);
		let trackIDs: Array<string> = [];
		playlists.forEach(playlist => {
			trackIDs = trackIDs.concat(playlist.trackIDs);
		});
		const list = paginate(trackIDs, req.query.amount, req.query.offset);
		return {
			total: list.total,
			amount: list.amount,
			offset: list.offset,
			items: await this.trackController.prepareListByIDs(list.items, req.query, req.user)
		};
	}

	async delete(req: JamRequest<JamParameters.ID>): Promise<void> {
		const playlist = await this.byID(req.query.id);
		if (playlist.userID !== req.user.id) {
			return Promise.reject(UnauthError());
		}
		await this.playlistService.remove(playlist);
	}

}
