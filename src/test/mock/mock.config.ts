import { ConfigService, ENVConfig, ENVConfigDB } from '../../modules/engine/services/config.service.js';
import path from 'path';
import { ThirdPartyConfig } from '../../config/thirdparty.config';
import { Container, Scope } from 'typescript-ioc';
import { OrmService } from '../../modules/engine/services/orm.service.js';

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
			jwt: { maxAge: 800000, secret: 'secret' },
			session: { proxy: false, maxAge: 800000, secret: 'secret', secure: false, allowedCookieDomains: [] },
			db,
			paths: { data: dataPath, frontend: './static/jamberry' }
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
