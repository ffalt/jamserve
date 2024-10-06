import { ThirdPartyConfig, ThirdpartyToolsConfig } from '../../../config/thirdparty.config.js';
import { InRequestScope } from 'typescript-ioc';
import path from 'path';
import { FirstStartConfig } from '../../../config/firststart.config.js';
import { getMaxAge } from '../../../utils/max-age.js';
import { Dialect } from 'sequelize';
import fse from 'fs-extra';

export interface ENVConfigDB {
	dialect: Dialect;
	name: string;
	user?: string;
	password?: string;
	host?: string;
	socket?: string;
	port?: number;
}

export interface ENVConfig {
	domain: string;
	host: string;
	port: number;
	jwt: {
		secret: string;
		maxAge: number;
	};
	session: {
		secure: boolean;
		proxy: boolean;
		secret: string;
		allowedCookieDomains: Array<string>;
		maxAge: number;
	};
	paths: {
		data: string;
		frontend: string;
	};
	db: ENVConfigDB;
}

@InRequestScope
export class ConfigService {
	env: ENVConfig = {
		domain: process.env.JAM_DOMAIN || 'http://localhost',
		host: process.env.JAM_HOST || '127.0.0.1',
		port: Number(process.env.JAM_PORT) || 4040,
		jwt: {
			secret: process.env.JAM_JWT_SECRET || 'keyboard cat is sad because no secret has been set',
			maxAge: getMaxAge(process.env.JAM_JWT_MAXAGE)
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
		},
		db: {
			dialect: (process.env.JAM_DB_DIALECT as Dialect) || 'sqlite',
			name: process.env.JAM_DB_NAME || 'jam',
			user: process.env.JAM_DB_USER,
			password: process.env.JAM_DB_PASSWORD,
			socket: process.env.JAM_DB_SOCKET,
			host: process.env.JAM_DB_HOST,
			port: Number(process.env.JAM_DB_PORT) || undefined
		}
	};

	getDataPath = (parts: Array<string>): string => path.resolve(this.env.paths.data, ...parts);
	tools: ThirdpartyToolsConfig = ThirdPartyConfig;
	firstStart?: FirstStartConfig;
	rateLimits = {
		frontend: {
			windowMs: 10 * 60 * 1000, // 10 minutes
			limit: 1000 // max 1000 requests per windowMs
		},
		docs: {
			windowMs: 10 * 60 * 1000, // 10 minutes
			limit: 100 // max 100 requests per windowMs
		},
		graphlql: {
			windowMs: 10 * 60 * 1000, // 10 minutes
			limit: 1000 // max 1000 requests per windowMs
		}
	};

	constructor() {
		const configFirstStartFile = path.resolve(this.getDataPath(['config']), 'firststart.config.json');
		try {
			this.firstStart = fse.readJSONSync(configFirstStartFile);
		} catch (e: any) {
			console.error('Error loading first start config', e);
			this.firstStart = {
				adminUser: undefined,
				roots: []
			};
		}
	}
}
