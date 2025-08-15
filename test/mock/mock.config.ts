import { ConfigService, ENVConfig, ENVConfigDB } from '../../src/modules/engine/services/config.service.js';
import path from 'node:path';
import { ThirdPartyConfig } from '../../src/config/thirdparty.config.js';
import { Container, Scope } from 'typescript-ioc';
import { OrmService } from '../../src/modules/engine/services/orm.service.js';

export const DBConfigs: Array<ENVConfigDB> = [
	{ dialect: 'sqlite', name: 'jamtest' }
];

if (!process.env.DISABLE_POSTGRES_TEST) {
	DBConfigs.push({ dialect: 'postgres', name: 'jamtest', host: process.env.JAM_DB_HOST || 'localhost', port: 5432, user: 'test', password: 'test' });
}

export function bindMockConfig(dataPath: string, db: ENVConfigDB, withAdmin: boolean = true): void {
	class MockConfigService implements ConfigService {
		env: ENVConfig = {
			domain: 'http://localhost:4141',
			host: '0.0.0.0',
			port: 4141,
			jwt: { maxAge: 800_000, secret: 'secret' },
			session: { proxy: false, maxAge: 800_000, secret: 'secret', secure: false, allowedCookieDomains: [] },
			db,
			paths: { data: dataPath, frontend: './static/jamberry' }
		};

		rateLimits = {
			frontend: {
				windowMs: 60 * 60 * 1000, // 60 minutes
				limit: 60_000 // max 60000 requests per windowMs
			},
			docs: {
				windowMs: 60 * 60 * 1000, // 60 minutes
				limit: 60_000 // max 60000 requests per windowMs
			},
			graphlql: {
				windowMs: 60 * 60 * 1000, // 60 minutes
				limit: 60_000 // max 60000 requests per windowMs
			}
		};

		firstStart = {
			adminUser: withAdmin ? { name: 'admin', pass: 'admin', mail: 'admin@localhost' } : undefined,
			roots: []
		};

		tools = ThirdPartyConfig;

		getDataPath(parts: Array<string>): string {
			return path.join(this.env.paths.data, ...parts);
		}
	}

	Container.bind(ConfigService).to(MockConfigService);
	Container.bind(OrmService).scope(Scope.Request);
}
