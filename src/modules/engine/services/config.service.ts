import {ThirdPartyConfig, ThirdpartyToolsConfig} from '../../../config/thirdparty.config';
import {InRequestScope} from 'typescript-ioc';
import path from 'path';
import {FirstStartConfig} from '../../../config/firststart.config';
import {getMaxAge} from '../../../utils/max-age';

@InRequestScope
export class ConfigService {
	env = {
		host: process.env.JAM_HOST || '127.0.0.1',
		port: Number(process.env.JAM_PORT) || 4040,
		jwt: {
			secret: process.env.JAM_JWT_SECRET || 'keyboard cat is sad because no secret has been set',
			maxAge: getMaxAge(process.env.JAM_JWT_MAXAGE),
		},
		session: {
			secure: process.env.JAM_SESSION_COOKIE_SECURE === 'true',
			proxy: process.env.JAM_SESSION_TRUST_PROXY === 'true',
			secret: process.env.JAM_SESSION_SECRET || 'keyboard cat is sad because no secret has been set',
			allowedCookieDomains: (process.env.JAM_ALLOWED_COOKIE_DOMAINS || '').split(','),
			maxAge: getMaxAge(process.env.JAM_SESSION_MAXAGE)
		},
		paths: {
			data: process.env.JAM_DATA_PATH || './data/',
			frontend: process.env.JAM_FRONTEND_PATH || './static/jamberry/'
		}
	}
	getDataPath = (parts: Array<string>): string => path.resolve(this.env.paths.data, ...parts)
	tools: ThirdpartyToolsConfig = ThirdPartyConfig;
	firstStart?: FirstStartConfig;

	constructor() {
		const configFirstStartFile = path.resolve(this.getDataPath(['config']), 'firststart.config.js');
		try {
			this.firstStart = require(configFirstStartFile);
		} catch (e) {
			this.firstStart = {
				adminUser: undefined,
				roots: []
			}
		}
	}

}
