import winston from 'winston';
import {Config} from '../config';

require('winston-timer')(winston);

export function configureLogger(config: Config) {
	winston.configure({
		level: config.log.level,
		transports: [
			new winston.transports.Console({
				format:
					winston.format.combine(
						// winston.format.timestamp(),
						winston.format.colorize(),
						winston.format.simple()
						// winston.format.json()
					)
			})
		]
	});
}

class Logger {
	private name: string;

	constructor(name: string) {
		this.name = name;
	}

	private applyLog(level: string, format: string, ...params: any[]) {
		winston.log.apply(this, [level, (new Date()).toISOString() + ' ' + this.name + ': ' + [format].concat(params).join(' ')]);
	}

	debug(format: string, ...params: any[]) {
		this.applyLog('debug', format, params);
	}

	info(format: string, ...params: any[]) {
		this.applyLog('info', format, params);
	}

	warn(format: string, ...params: any[]) {
		this.applyLog('warn', format, params);
	}

	error(format: string | Error, ...params: any[]) {
		this.applyLog('error', format.toString(), params);
	}

	time(name: string) {
		(<any>winston).start_log(name, 'debug');
	}

	timeEnd(name: string) {
		(<any>winston).stop_log(name, 'debug');
	}
}

function logger(name: string) {
	return new Logger(name);
}

export default logger;
