import { ThirdPartyConfig, ThirdpartyToolsConfig } from '../../../config/thirdparty.config.js';
import { InRequestScope } from 'typescript-ioc';
import path from 'node:path';
import { FirstStartConfig } from '../../../config/firststart.config.js';
import { getMaxAge } from '../../../utils/max-age.js';
import { Dialect } from 'sequelize';
import fse from 'fs-extra';
import { logger } from '../../../utils/logger.js';

const log = logger('ConfigService');

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
	minPasswordLength: number;
	jwt: {
		secret: string;
		maxAge: number;
	};
	session: {
		secure: boolean;
		proxy: boolean;
		secret: string;
		allowedCookieDomains?: Array<string>;
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
		domain: process.env.JAM_DOMAIN ?? 'http://localhost',
		host: process.env.JAM_HOST ?? '127.0.0.1',
		port: Number(process.env.JAM_PORT ?? 4040),
		minPasswordLength: Number(process.env.JAM_MIN_PASSWORD_LENGTH ?? 10),
		jwt: {
			secret: process.env.JAM_JWT_SECRET ?? 'keyboard cat is sad because no secret has been set',
			maxAge: getMaxAge(process.env.JAM_JWT_MAXAGE)
		},
		session: {
			secure: process.env.JAM_SESSION_COOKIE_SECURE !== 'false',
			proxy: process.env.JAM_SESSION_TRUST_PROXY === 'true',
			secret: process.env.JAM_SESSION_SECRET ?? 'keyboard cat is sad because no secret has been set',
			allowedCookieDomains: (process.env.JAM_ALLOWED_COOKIE_DOMAINS ?? '').split(',').filter(Boolean),
			maxAge: getMaxAge(process.env.JAM_SESSION_MAXAGE)
		},
		paths: {
			data: process.env.JAM_DATA_PATH ?? './data/',
			frontend: process.env.JAM_FRONTEND_PATH ?? './static/jamberry/'
		},
		db: {
			dialect: (process.env.JAM_DB_DIALECT as Dialect | undefined) ?? 'sqlite',
			name: process.env.JAM_DB_NAME ?? 'jam',
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
			windowMs: 15 * 60 * 1000, // 15 minutes
			limit: 100 // 100 requests per window
		},
		api: {
			windowMs: 15 * 60 * 1000, // 15 minutes
			limit: 1000 // 1000 requests per window
		},
		subsonic: {
			windowMs: 15 * 60 * 1000, // 15 minutes
			limit: 1000 // 1000 requests per window
		},
		docs: {
			windowMs: 10 * 60 * 1000, // 10 minutes
			limit: 100 // max 100 requests per window
		},
		graphlql: {
			windowMs: 10 * 60 * 1000, // 10 minutes
			limit: 100 // 100 requests per window
		},
		login: {
			windowMs: 15 * 60 * 1000, // 15 minutes
			limit: 5 // max 5 login attempts per 15 minutes
		}
	};

	constructor() {
		this.validateSecrets();
		this.validateSessionCookieSecure();

		const configFirstStartFile = path.resolve(this.getDataPath(['config']), 'firststart.config.json');
		try {
			this.firstStart = fse.readJSONSync(configFirstStartFile);
		} catch (error: unknown) {
			console.error('Error loading first start config', error);
			this.firstStart = {
				adminUser: undefined,
				roots: []
			};
		}
	}

	validateSecrets(): void {
		// List of weak/default secrets to reject
		const weakSecrets = [
			'keyboard cat is dancing',
			'keyboard cat is sad because no secret has been set',
			'your-secret-key',
			'change-me',
			'secret',
			'password'
		];

		this.validateSecret('JAM_SESSION_SECRET', this.env.session.secret, weakSecrets);
		this.validateSecret('JAM_JWT_SECRET', this.env.jwt.secret, weakSecrets);
	}

	validateSecret(envName: string, secret: string, weakSecrets: Array<string>): void {
		if (weakSecrets.includes(secret.toLowerCase())) {
			throw new Error(
				`CRITICAL: ${envName} contains a default/weak value. ` +
				'Please generate a strong random secret:\n' +
				'node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
			);
		}

		if (secret.length < 32) {
			throw new Error(
				`CRITICAL: ${envName} must be at least 32 characters long. ` +
				`Current length: ${secret.length}. ` +
				'Generate a strong secret:\n' +
				'node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
			);
		}
	}

	validateSessionCookieSecure(): void {
		if (!this.env.session.secure) {
			const domain = this.env.domain.toLowerCase();
			const isLocalhost = domain.includes('localhost') || domain.includes('127.0.0.1');
			if (!isLocalhost) {
				log.warn(
					'WARNING: Session cookie "secure" flag is disabled (JAM_SESSION_COOKIE_SECURE=false). ' +
					'Cookies will be sent over plain HTTP, which may expose sessions to hijacking. ' +
					'Set JAM_SESSION_COOKIE_SECURE to "true" or remove it (defaults to true) for production deployments.'
				);
			}
		}
	}
}
