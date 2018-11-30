import {BaseController} from '../base/base.controller';
import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {DBObjectType} from '../../types';
import {GenericError, InvalidParamError, UnauthError} from '../../api/jam/error';
import {JamRequest} from '../../api/jam/api';
import {TrackController} from '../track/track.controller';
import {formatUser} from './user.format';
import {formatPlayQueue} from '../playqueue/playqueue.format';
import {StateStore} from '../state/state.store';
import {StateService} from '../state/state.service';
import {ImageService} from '../image/image.service';
import {DownloadService} from '../download/download.service';
import {SearchQueryUser, UserStore} from './user.store';
import {UserService} from './user.service';
import {TrackStore} from '../track/track.store';
import {PlayqueueService} from '../playqueue/playqueue.service';
import {User} from './user.model';

export class UserController extends BaseController<JamParameters.ID, JamParameters.IDs, {}, SearchQueryUser, JamParameters.UserSearch, User, Jam.User> {

	constructor(
		private userStore: UserStore,
		private trackStore: TrackStore,
		private userService: UserService,
		private trackController: TrackController,
		private playqueueService: PlayqueueService,
		protected stateStore: StateStore,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(userStore, DBObjectType.user, stateStore, stateService, imageService, downloadService);
	}

	async prepare(item: User, includes: {}, user: User): Promise<Jam.User> {
		return formatUser(item);
	}

	translateQuery(query: JamParameters.UserSearch, user: User): SearchQueryUser {
		return {
			query: query.query,
			name: query.name,
			isAdmin: query.isAdmin,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async create(req: JamRequest<JamParameters.UserNew>): Promise<Jam.User> {
		const u: User = {
			id: '',
			name: req.query.name || '',
			pass: '',
			email: '',
			type: DBObjectType.user,
			created: Date.now(),
			// ldapAuthenticated: false,
			scrobblingEnabled: false,
			roles: {
				adminRole: req.query.roleAdmin !== undefined ? req.query.roleAdmin : false,
				streamRole: req.query.roleStream !== undefined ? req.query.roleStream : true,
				uploadRole: req.query.roleUpload !== undefined ? req.query.roleUpload : false,
				podcastRole: req.query.rolePodcast !== undefined ? req.query.rolePodcast : false,
				// settingsRole: false,
				// jukeboxRole: false,
				// downloadRole: false,
				// playlistRole: false,
				// coverArtRole: false,
				// commentRole: false,
				// shareRole: false,
				// videoConversionRole: false
			}
		};
		u.id = await this.userService.createUser(u);
		return this.prepare(u, {}, req.user);
	}


	async update(req: JamRequest<JamParameters.UserUpdate>): Promise<Jam.User> {
		const u = await this.byID(req.query.id);
		if (req.query.name) {
			if (req.query.name !== u.name) {
				const u2 = await this.userService.get(req.query.name);
				if (u2) {
					return Promise.reject(GenericError('Username already exists'));
				}
			}
			u.name = req.query.name.trim();
		}
		if (req.query.email) {
			u.email = req.query.email.trim();
		}
		if (req.query.roleAdmin !== undefined) {
			u.roles.adminRole = req.query.roleAdmin;
		}
		if (req.query.rolePodcast !== undefined) {
			u.roles.podcastRole = req.query.rolePodcast;
		}
		if (req.query.roleStream !== undefined) {
			u.roles.streamRole = req.query.roleStream;
		}
		if (req.query.roleUpload !== undefined) {
			u.roles.uploadRole = req.query.roleUpload;
		}
		await this.userService.updateUser(u);
		return this.prepare(u, {}, req.user);
	}

	async playqueueUpdate(req: JamRequest<JamParameters.PlayQueueSet>): Promise<void> {
		await this.playqueueService.saveQueue(req.user.id, req.query.trackIDs, req.query.currentID, req.query.position, req.client);
	}

	async playqueue(req: JamRequest<JamParameters.IncludesPlayQueue>): Promise<Jam.PlayQueue> {
		const playQueue = await this.playqueueService.getQueueOrCreate(req.user.id, req.client);
		const result = formatPlayQueue(playQueue, req.query);
		if (req.query.playQueueTracks) {
			const entries = await this.trackStore.byIds(playQueue.trackIDs);
			result.tracks = await this.trackController.prepareList(entries, req.query, req.user);
		}
		return result;
	}

	async delete(req: JamRequest<JamParameters.ID>): Promise<void> {
		const u = await this.byID(req.query.id);
		await this.userService.deleteUser(u);
	}

	async imageUploadUpdate(req: JamRequest<JamParameters.ID>): Promise<void> {
		if (!req.file) {
			return Promise.reject(InvalidParamError('Image upload failed'));
		}
		const u = await this.byID(req.query.id);
		if (u.id !== req.user.id && !req.user.roles.adminRole) {
			return Promise.reject(UnauthError());
		}
		await this.userService.setUserImage(u, req.file);
	}

}
