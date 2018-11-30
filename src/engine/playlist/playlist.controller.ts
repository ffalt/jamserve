import {BaseController} from '../base/base.controller';
import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {DBObjectType} from '../../types';
import {UnauthError} from '../../api/jam/error';
import {JamRequest} from '../../api/jam/api';
import {TrackController} from '../track/track.controller';
import {formatState} from '../state/state.format';
import {formatPlaylist} from './playlist.format';
import {StateStore} from '../state/state.store';
import {StateService} from '../state/state.service';
import {ImageService} from '../image/image.service';
import {DownloadService} from '../download/download.service';
import {TrackStore} from '../track/track.store';
import {PlaylistStore, SearchQueryPlaylist} from './playlist.store';
import {PlaylistService} from './playlist.service';
import {Playlist} from './playlist.model';
import {User} from '../user/user.model';

export class PlaylistController extends BaseController<JamParameters.Playlist, JamParameters.Playlists, JamParameters.IncludesPlaylist, SearchQueryPlaylist, JamParameters.PlaylistSearch, Playlist, Jam.Playlist> {

	constructor(
		private playlistStore: PlaylistStore,
		private playlistService: PlaylistService,
		private trackController: TrackController,
		private trackStore: TrackStore,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(playlistStore, DBObjectType.playlist, stateService, imageService, downloadService);
	}

	// TODO: filter none public playlist in base api functions?

	async prepare(playlist: Playlist, includes: JamParameters.IncludesPlaylist, user: User): Promise<Jam.Playlist> {
		const result = formatPlaylist(playlist, includes);
		if (includes.playlistState) {
			const state = await this.stateService.findOrCreate(playlist.id, user.id, DBObjectType.artist);
			result.state = formatState(state);
		}
		if (includes.playlistTracks) {
			const tracks = await this.trackStore.byIds(playlist.trackIDs);
			result.tracks = await this.trackController.prepareList(tracks, includes, user);
		}
		return result;
	}

	translateQuery(query: JamParameters.PlaylistSearch, user: User): SearchQueryPlaylist {
		return {
			query: query.query,
			name: query.name,
			userID: user.id,
			isPublic: query.isPublic,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async create(req: JamRequest<JamParameters.PlaylistNew>): Promise<Jam.Playlist> {
		const playlist = await this.playlistService.createPlaylist(req.query.name, req.query.comment, req.query.isPublic === undefined ? false : req.query.isPublic, req.user.id, req.query.trackIDs || []);
		return this.prepare(playlist, {playlistTracksIDs: true, playlistState: true}, req.user);
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
		await this.playlistService.updatePlaylist(playlist);
	}

	async tracks(req: JamRequest<JamParameters.Tracks>): Promise<Array<Jam.Track>> {
		let playlists = await this.byIDs(req.query.ids);
		playlists = playlists.filter(playlist => playlist.userID === req.user.id);
		let trackIDs: Array<string> = [];
		playlists.forEach(playlist => {
			trackIDs = trackIDs.concat(playlist.trackIDs);
		});
		return this.trackController.prepareListByIDs(trackIDs, req.query, req.user);
	}

	async delete(req: JamRequest<JamParameters.ID>): Promise<void> {
		const playlist = await this.byID(req.query.id);
		if (playlist.userID !== req.user.id) {
			return Promise.reject(UnauthError());
		}
		await this.playlistService.removePlaylist(playlist);
	}

}
