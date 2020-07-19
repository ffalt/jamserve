import express from 'express';
import {buildRestMeta} from '../../rest/builder/builder';
import {UserRole} from '../../../types/enums';
import {buildRestRouter, RestOptions} from '../../rest/builder/express';
import {Inject, Singleton} from 'typescript-ioc';
import {logger} from '../../../utils/logger';
import {User} from '../../../entity/user/user';
import {RestControllers} from '../../engine/rest/controllers';
import {registerRestEnums} from '../../engine/rest/enum-registration';
import {ConfigService} from '../../engine/services/config.service';

const log = logger('REST');

@Singleton
export class RestMiddleware {
	@Inject
	configService!: ConfigService;

	middleware(): express.Router {
		const api = express.Router();
		registerRestEnums();
		buildRestMeta(RestControllers());
		const options: RestOptions = {
			tmpPath: this.configService.getDataPath(['cache', 'uploads']),
			validateRoles: (user, roles) => {
				const u = user as User;
				if (roles.length > 0) {
					if (!user) {
						return false;
					}
					if (roles.includes(UserRole.stream) && !u.roleStream) {
						return false;
					}
					if (roles.includes(UserRole.admin) && !u.roleAdmin) {
						return false;
					}
					if (roles.includes(UserRole.podcast) && !u.rolePodcast) {
						return false;
					}
					if (roles.includes(UserRole.upload) && !u.roleUpload) {
						return false;
					}
				}
				return true;
			}
		}

		const routeInfos = buildRestRouter(api, options);
		log.table(routeInfos, [
			{name: 'method', alignment: 'right'},
			{name: 'endpoint', alignment: 'left'},
			{name: 'role', alignment: 'right'},
			{name: 'format', alignment: 'left'}
		]);

		api.use((req, res) => {
			res.status(404).send('Api Path not found');
		});
		return api;
	}
}
