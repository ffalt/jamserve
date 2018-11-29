import path from 'path';
import {AppConfig} from './config/app.config';
import {ThirdPartyConfig} from './config/thirdparty.config';
import {ElasticsearchConfig} from './db/elasticsearch/config-elastic';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface BaseConfig {
	log: { level: LogLevel };
	server: {
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
		}
	};
	database: {
		use: string;
		options: {
			elasticsearch: ElasticsearchConfig;
			nedb?: {};
		}
	};
	paths: {
		data: string,
		jamberry: string
	};
}

export interface Config extends BaseConfig {
	app: {
		chat: {
			maxMsgs: number;
			maxAge: {
				value: number;
				unit: string;
			};
		};
		index: {
			ignore: Array<string>;
		};
	};
	tools: {
		acoustid: {
			apiKey: string;
			userAgent: string;
		};
		lastfm: {
			apiKey: string;
			userAgent: string;
		};
		musicbrainz: {
			userAgent: string;
		};
		chartlyrics: {
			userAgent: string;
		};
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
	result.tools = ThirdPartyConfig;
	result.app = AppConfig;
	result.getDataPath = (parts: Array<string>): string => {
		return path.resolve(config.paths.data, ...parts);
	};
	return result;
}

export function loadConfig(): Config {
	const config: Config = require('../config/config.js');
	config.firstStart = require('../config/firststart.config.js');
	return extendConfig(config);
}
