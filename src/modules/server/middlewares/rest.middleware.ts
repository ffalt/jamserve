import express from 'express';
import { buildRestMeta, restRouter, RestOptions } from '../../rest/index.js';
import { UserRole } from '../../../types/enums.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { logger } from '../../../utils/logger.js';
import { RestControllers } from '../../engine/rest/controllers.js';
import { ConfigService } from '../../engine/services/config.service.js';
import { registerRestEnums } from '../../engine/rest/enum-registration.js';

const log = logger('REST');

registerRestEnums();

@InRequestScope
export class RestMiddleware {
	@Inject
	configService!: ConfigService;

	middleware(): express.Router {
		const api = express.Router();
		buildRestMeta();
		const options: RestOptions = {
			tmpPath: this.configService.getDataPath(['cache', 'uploads']),
			controllers: RestControllers(),
			validateRoles: (user, roles) => {
				if (roles.length > 0) {
					if (!user) {
						return false;
					}
					if (roles.includes(UserRole.stream) && !user.roleStream) {
						return false;
					}
					if (roles.includes(UserRole.admin) && !user.roleAdmin) {
						return false;
					}
					if (roles.includes(UserRole.podcast) && !user.rolePodcast) {
						return false;
					}
					if (roles.includes(UserRole.upload) && !user.roleUpload) {
						return false;
					}
				}
				return true;
			}
		};

		const routeInfos = restRouter(api, options);
		if (process.env.NODE_ENV !== 'production') {
			log.table(routeInfos, [
				{ name: 'method', alignment: 'right' },
				{ name: 'endpoint', alignment: 'left' },
				{ name: 'role', alignment: 'right' },
				{ name: 'format', alignment: 'left' }
			]);
		}

		api.use((req, res) => {
			res.status(404).send('Api Path not found');
		});
		return api;
	}
}
