import path from 'path';
import {FirstStartConfig} from './firststart.config';
import {JamServeConfig} from './jamserve.config';

export interface Config extends JamServeConfig {
	firstStart?: FirstStartConfig;

	getDataPath(parts: Array<string>): string;
}

export function validateConfig(config: Config): void {
	// TODO: validate full config with a json schema
	if (!config.server) {
		throw new Error('JamServe Config: Missing server settings');
	}
	if (!config.database) {
		throw new Error('JamServe Config: Missing database settings');
	}
	if (!config.server.limit) {
		console.error('JamServe Config: Missing server limit settings, using default values');
		config.server.limit = {login: {max: 5, window: 60}, api: {max: 100, window: 60}};
	}
}

export function extendConfig(jamServe: JamServeConfig, firstStart: FirstStartConfig): Config {
	return {...jamServe, firstStart, getDataPath: (parts: Array<string>): string => path.resolve(jamServe.paths.data, ...parts)};
}

declare var __non_webpack_require__: any;

export function loadConfig(configPath?: string): Config {
	configPath = configPath && configPath.length > 0 ? configPath : path.join(process.cwd(), 'config');
	const configFile = path.join(configPath, 'config.js');
	const configFirstStartFile = path.join(configPath, 'firststart.config.js');
	let jamServe: JamServeConfig;
	let firstStart: FirstStartConfig;
	if (__non_webpack_require__) {
		jamServe = __non_webpack_require__(configFile);
		firstStart = __non_webpack_require__(configFirstStartFile);
	} else {
		jamServe = require(configFile);
		firstStart = require(configFirstStartFile);
	}
	const result = extendConfig(jamServe, firstStart);
	validateConfig(result);
	return result;
}
