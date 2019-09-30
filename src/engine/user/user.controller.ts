import {JamRequest} from '../../api/jam/api';
import {GenericError, InvalidParamError, NotFoundError, UnauthError} from '../../api/jam/error';
import {DBObjectType} from '../../db/db.types';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {hashAndSaltSHA512} from '../../utils/hash';
import {randomString} from '../../utils/random';
import {BaseController} from '../base/dbobject.controller';
import {DownloadService} from '../download/download.service';
import {ImageService} from '../image/image.service';
import {SessionService} from '../session/session.service';
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
		protected downloadService: DownloadService,
		protected sessionService: SessionService
	) {
		super(userService, stateService, imageService, downloadService);
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
		const admin = await this.userService.auth(req.user.name, req.query.password);
		if (!admin) {
			return Promise.reject(UnauthError());
		}
		const pass = randomString(10);
		const pw = hashAndSaltSHA512(pass);
		const u: User = {
			id: '',
			name: req.query.name || '',
			salt: pw.salt,
			hash: pw.hash,
			email: '',
			type: DBObjectType.user,
			created: Date.now(),
			scrobblingEnabled: false,
			roles: {
				admin: req.query.roleAdmin !== undefined ? req.query.roleAdmin : false,
				stream: req.query.roleStream !== undefined ? req.query.roleStream : true,
				upload: req.query.roleUpload !== undefined ? req.query.roleUpload : false,
				podcast: req.query.rolePodcast !== undefined ? req.query.rolePodcast : false
			}
		};
		u.id = await this.userService.create(u);
		return this.prepare(u, {}, req.user);
	}

	async update(req: JamRequest<JamParameters.UserUpdate>): Promise<Jam.User> {
		const u = await this.checkUserAccess(req.query.id, req.query.password, req.user);
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
		await this.sessionService.clearCache();
	}

	async imageRandom(req: JamRequest<JamParameters.UserImageRandom>): Promise<void> {
		let user = req.user;
		if (req.query.id) {
			if (user.roles.admin) {
				user = await this.byID(req.query.id);
			} else {
				return Promise.reject(UnauthError());
			}
		}
		await this.userService.generateAvatar(user, req.query.seed || randomString(42));
	}

	async imageUploadUpdate(req: JamRequest<JamParameters.ID>): Promise<void> {
		if (!req.file) {
			return Promise.reject(InvalidParamError('Image upload failed'));
		}
		const u = await this.byID(req.query.id);
		if (u.id === req.user.id || req.user.roles.admin) {
			return this.userService.setUserImage(u, req.file, req.fileType);
		}
		return Promise.reject(UnauthError());
	}

	private async checkUserAccess(userID: string, password: string, user: User): Promise<User> {
		const u = await this.byID(userID);
		if (u.id === user.id || user.roles.admin) {
			const result = await this.userService.auth(user.name, password);
			if (result) {
				return u;
			}
		}
		return Promise.reject(UnauthError());
	}

	async passwordUpdate(req: JamRequest<JamParameters.UserPasswordUpdate>): Promise<void> {
		const user = await this.checkUserAccess(req.query.id, req.query.password, req.user);
		return this.userService.setUserPassword(user, req.query.newPassword);
	}

	async emailUpdate(req: JamRequest<JamParameters.UserEmailUpdate>): Promise<void> {
		const user = await this.checkUserAccess(req.query.id, req.query.password, req.user);
		return this.userService.setUserEmail(user, req.query.email);
	}

	async subsonicView(req: JamRequest<JamParameters.SubsonicToken>): Promise<Jam.SubsonicToken> {
		const user = await this.checkUserAccess(req.query.id, req.query.password, req.user);
		const session = await this.sessionService.subsonicByUser(user.id);
		return {token: session ? session.subsonic : undefined};
	}

	async subsonicGenerate(req: JamRequest<JamParameters.SubsonicToken>): Promise<Jam.SubsonicToken> {
		const user = await this.checkUserAccess(req.query.id, req.query.password, req.user);
		const session = await this.sessionService.createSubsonic(user.id);
		if (!session) {
			return Promise.reject(NotFoundError());
		}
		return {token: session.subsonic};
	}

}
