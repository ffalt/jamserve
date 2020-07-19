import {ConfigService} from '../../modules/engine/services/config.service';
import path from 'path';
import {ThirdPartyConfig} from '../../config/thirdparty.config';
import {Container} from 'typescript-ioc';

export const mockEnv = {
	port: 4141,
	jwt: {maxAge: 800000, secret: 'secret'},
	session: {proxy: false, maxAge: 800000, secret: 'secret', secure: false, allowedCookieDomains: []},
	host: '0.0.0.0'
}

export function bindMockConfig(dataPath: string, withAdmin: boolean = true): void {

	class MockConfigService implements ConfigService {
		public env = {...mockEnv, paths: {data: dataPath, frontend: './static/jamberry'}};

		firstStart = {
			adminUser: withAdmin ? {
				name: 'admin',
				pass: 'admin',
				mail: 'admin@localhost'
			} : undefined,
			roots: []
		};

		public getDataPath(parts: Array<string>): string {
			return path.join(this.env.paths.data, ...parts);
		}

		public tools = ThirdPartyConfig;
	}

	Container.bind(ConfigService).to(MockConfigService)
}
