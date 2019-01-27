import path from 'path';
import {AppConfig} from './config/app.config';
import {ElasticsearchConfig} from './db/elasticsearch/config-elastic';

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

export interface ChatConfig {
	maxMsgs: number;
	maxAge: {
		value: number;
		unit: string;
	};
}

export interface IndexConfig {
	ignore: Array<string>;
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
			secure: boolean
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
	app: {
		chat: ChatConfig;
		index: IndexConfig;
	};
	firstStart?: {
		adminUser?: {
			name: string;
			pass: string;
			mail: string;
		};
		roots?: Array<{ name: string; path: string; }>;
	};

	getDataPath(parts: Array<string>): string;
}

export function extendConfig(config: BaseConfig): Config {
	const result = <Config>config;
	result.app = AppConfig;
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
