import {ConfigService, ENVConfig, ENVConfigDB} from '../../modules/engine/services/config.service';
import path from 'path';
import {ThirdPartyConfig} from '../../config/thirdparty.config';
import {Container, Scope} from 'typescript-ioc';
import {OrmService} from '../../modules/engine/services/orm.service';

export const DBConfigs: Array<ENVConfigDB> = [
	{dialect: 'sqlite', name: 'jamtest'},
	{dialect: 'postgres', name: 'jamtest', host: 'localhost', port: 5432, user: 'test'}
];

export function bindMockConfig(dataPath: string, db: ENVConfigDB, withAdmin: boolean = true): void {

	class MockConfigService implements ConfigService {
		env: ENVConfig = {
			host: '0.0.0.0',
			port: 4141,
			jwt: {maxAge: 800000, secret: 'secret'},
			session: {proxy: false, maxAge: 800000, secret: 'secret', secure: false, allowedCookieDomains: []},
			db,
			paths: {data: dataPath, frontend: './static/jamberry'}
		};
		firstStart = {
			adminUser: withAdmin ? {
				name: 'admin',
				pass: 'admin',
				mail: 'admin@localhost'
			} : undefined,
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
