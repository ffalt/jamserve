import {JamRequest} from '../../api/jam/api';
import {GenericError, InvalidParamError, UnauthError} from '../../api/jam/error';
import {DBObjectType} from '../../db/db.types';
import {DownloadService} from '../download/download.service';
import {ImageService} from '../image/image.service';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {randomString} from '../../utils/random';
import {hashSaltPassword} from '../../utils/salthash';
import {BaseController} from '../base/dbobject.controller';
import {StateService} from '../state/state.service';
import {formatUser} from './user.format';
import {User} from './user.model';
import {UserService} from './user.service';
import {SearchQueryUser} from './user.store';

export class UserController extends BaseController<JamParameters.ID, JamParameters.IDs, {}, SearchQueryUser, JamParameters.UserSearch, User, Jam.User> {

	constructor(
		public userService: UserService,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(userService, stateService, imageService, downloadService);
	}

	defaultSort(items: Array<User>): Array<User> {
		return items.sort((a, b) => a.name.localeCompare(b.name));
	}

	async prepare(item: User, includes: {}, user: User): Promise<Jam.User> {
		return formatUser(item);
	}

	async translateQuery(query: JamParameters.UserSearch, user: User): Promise<SearchQueryUser> {
		return {
			query: query.query,
			id: query.id,
			ids: query.ids,
			name: query.name,
			isAdmin: query.isAdmin,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async create(req: JamRequest<JamParameters.UserNew>): Promise<Jam.User> {
		const pass = randomString(10);
		const pw = hashSaltPassword(pass);
		const u: User = {
			id: '',
			name: req.query.name || '',
			salt: pw.salt,
			hash: pw.hash,
			email: '',
			subsonic_pass: randomString(10),
			type: DBObjectType.user,
			created: Date.now(),
			// ldapAuthenticated: false,
			scrobblingEnabled: false,
			roles: {
				admin: req.query.roleAdmin !== undefined ? req.query.roleAdmin : false,
				stream: req.query.roleStream !== undefined ? req.query.roleStream : true,
				upload: req.query.roleUpload !== undefined ? req.query.roleUpload : false,
				podcast: req.query.rolePodcast !== undefined ? req.query.rolePodcast : false
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
		u.id = await this.userService.create(u);
		return this.prepare(u, {}, req.user);
	}

	async update(req: JamRequest<JamParameters.UserUpdate>): Promise<Jam.User> {
		const u = await this.byID(req.query.id);
		if (req.query.name) {
			if (req.query.name !== u.name) {
				const u2 = await this.userService.getByName(req.query.name);
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
			u.roles.admin = req.query.roleAdmin;
		}
		if (req.query.rolePodcast !== undefined) {
			u.roles.podcast = req.query.rolePodcast;
		}
		if (req.query.roleStream !== undefined) {
			u.roles.stream = req.query.roleStream;
		}
		if (req.query.roleUpload !== undefined) {
			u.roles.upload = req.query.roleUpload;
		}
		await this.userService.update(u);
		return this.prepare(u, {}, req.user);
	}

	async delete(req: JamRequest<JamParameters.ID>): Promise<void> {
		const u = await this.byID(req.query.id);
		await this.userService.remove(u);
	}

	async imageUploadUpdate(req: JamRequest<JamParameters.ID>): Promise<void> {
		if (!req.file) {
			return Promise.reject(InvalidParamError('Image upload failed'));
		}
		const u = await this.byID(req.query.id);
		if (u.id === req.user.id || req.user.roles.admin) {
			return this.userService.setUserImage(u, req.file);
		}
		return Promise.reject(UnauthError());
	}

	async passwordUpdate(req: JamRequest<JamParameters.UserPasswordUpdate>): Promise<void> {
		const u = await this.byID(req.query.id);
		if (u.id === req.user.id || req.user.roles.admin) {
			return this.userService.setUserPassword(u, req.query.password);
		}
		return Promise.reject(UnauthError());
	}

	async emailUpdate(req: JamRequest<JamParameters.UserEmailUpdate>): Promise<void> {
		const u = await this.byID(req.query.id);
		if (u.id === req.user.id || req.user.roles.admin) {
			return this.userService.setUserEmail(u, req.query.email);
		}
		return Promise.reject(UnauthError());
	}
}
