import express from 'express';
import {Inject, InRequestScope} from 'typescript-ioc';
import {logger} from '../../../utils/logger.js';
import {ConfigService} from '../../engine/services/config.service.js';
import {subsonicRouter} from '../../subsonic/builder/express.js';
import {UserRole} from '../../../types/enums.js';
import {buildSubsonicMeta} from '../../subsonic/metadata/builder.js';
import {SubsonicApi} from '../../subsonic/api/api.js';
import {RestOptions} from '../../deco/express/express-method.js';
import {getMetadataStorage} from '../../rest/metadata/getMetadataStorage.js';
import {ApiResponder} from '../../subsonic/response.js';

const log = logger('SUBSONIC');

@InRequestScope
export class SubsonicMiddleware {
	@Inject
	configService!: ConfigService;
	api = new SubsonicApi();

	middleware(): express.Router {
		const router = express.Router();
		buildSubsonicMeta();
		const metadata = getMetadataStorage();
		const options: RestOptions = {
			enums: metadata.enums,
			resultTypes: metadata.resultTypes,
			responder: new ApiResponder(),
			tmpPath: this.configService.getDataPath(['cache', 'uploads']),
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

		const routeInfos = subsonicRouter(router, options);
		if (process.env.NODE_ENV !== 'production') {
			log.table(routeInfos, [
				{name: 'method', alignment: 'right'},
				{name: 'endpoint', alignment: 'left'},
				{name: 'role', alignment: 'right'},
				{name: 'format', alignment: 'left'}
			]);
		}
		router.use((req, res) => {
			res.status(404).send('Subsonic Api Path not found');
		});
		return router;
	}
}
