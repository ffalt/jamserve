import winston from 'winston';
import {Table} from 'console-table-printer';

export function configureLogger(level: string): void {
	winston.configure({
		level,
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

export class Logger {
	private readonly name: string;

	constructor(name: string) {
		this.name = name;
	}

	private applyLog(level: string, format: string, ...params: Array<any>): void {
		winston.log(level, `${(new Date()).toISOString()} [${this.name}] ${[format].concat(params).join(' ')}`);
	}

	debug(format: string, ...params: Array<any>): void {
		this.applyLog('debug', format, params);
	}

	info(format: string, ...params: Array<any>): void {
		this.applyLog('info', format, params);
	}

	warn(format: string, ...params: Array<any>): void {
		this.applyLog('warn', format, params);
	}

	error(format: string | Error, ...params: Array<any>): void {
		// console.error(format);
		this.applyLog('error', format.toString(), params);
	}

	table(items: Array<any>, columns?: Array<{ name: string; alignment: 'left' | 'right' }>): void {
		if (winston.level === 'info') {
			const p = new Table({columns});
			p.addRows(items);
			p.printTable();
		}
	}

	access(format: string, ...params: Array<any>): void {
		this.applyLog('debug', format, params);
	}
}

export function logger(name: string): Logger {
	return new Logger(name);
}
