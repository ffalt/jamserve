import path from 'path';
import {ElasticsearchConfig} from './db/elasticsearch/db-elastic.types';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface BaseConfig {
	log: { level: LogLevel };
	server: ServerConfig;
	database: DBConfig;
	paths: {
		data: string,
		frontend: string
	};
}

export interface DBConfig {
	use: string;
	options: {
		elasticsearch: ElasticsearchConfig;
		nedb?: {};
	};
}

export interface ServerConfig {
	listen: string;
	port: number;
	session: {
		allowedCookieDomains: Array<string>;
		secret: string;
		cookie: {
			name: string;
			secure: boolean;
			proxy: boolean;
			maxAge: {
				value: number;
				unit: string;
			};
		};
	};
	jwt: {
		secret: string;
		maxAge: {
			value: number;
			unit: string;
		};
	};
}

export interface Config extends BaseConfig {
	firstStart?: {
		adminUser?: {
			name: string;
			pass: string;
			mail: string;
		};
		roots?: Array<{ name: string; path: string; strategy?: string }>;
	};

	getDataPath(parts: Array<string>): string;
}

export function extendConfig(config: BaseConfig): Config {
	const result = config as Config;
	result.getDataPath = (parts: Array<string>): string => {
		return path.resolve(config.paths.data, ...parts);
	};
	return result;
}

declare var __non_webpack_require__: any;

export function loadConfig(configPath?: string): Config {
	configPath = configPath && configPath.length > 0 ? configPath : path.join(process.cwd(), 'config');
	const configFile = path.join(configPath, 'config.js');
	const configFirstStartFile = path.join(configPath, 'firststart.config.js');
	let config: Config;
	if (__non_webpack_require__) {
		config = __non_webpack_require__(configFile);
		config.firstStart = __non_webpack_require__(configFirstStartFile);
	} else {
		config = require(configFile);
		config.firstStart = require(configFirstStartFile);
	}
	return extendConfig(config);
}
