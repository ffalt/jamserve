import winston from 'winston';
import { Table } from 'console-table-printer';
import { createStream, Generator, Options, RotatingFileStream } from 'rotating-file-stream';
import TransportStream from 'winston-transport';
import { MESSAGE } from 'triple-beam';
import { errorToString } from './error.js';
import { Dictionary } from 'console-table-printer/dist/src/models/common.js';

export interface WinstonRotatingFileOptions extends TransportStream.TransportStreamOptions {
	filename: string | Generator;
	rfsOptions?: Options;
}

export class WinstonRotatingFile extends TransportStream {
	public stream: RotatingFileStream;

	public constructor(options: WinstonRotatingFileOptions) {
		super(options);

		this.stream = createStream(options.filename, options.rfsOptions);
	}

	public close(): void {
		this.stream.end();
	}

	public log(info: Record<symbol, string>, done: () => void): any {
		this.stream.write(`${info[MESSAGE]}\n`, done);
	}
}

export function configureLogger(level: string, logfile?: string): void {
	const console_logger = new winston.transports.Console({
		format:
			winston.format.combine(
				// winston.format.timestamp(),
				winston.format.colorize(),
				winston.format.simple()
				// winston.format.json()
			)
	});
	const transports: Array<TransportStream> = [console_logger];
	if (logfile) {
		transports.push(new WinstonRotatingFile({
			filename: logfile,
			level: 'info',
			format: winston.format.combine(
				winston.format.simple()
			),
			rfsOptions: {
				size: '10M', // rotate every 10 MegaBytes written
				interval: '1d', // rotate daily
				compress: 'gzip' // compress rotated files
			}
		}));
	}
	winston.configure({ level, transports });
}

export class Logger {
	private readonly name: string;

	constructor(name: string) {
		this.name = name;
	}

	private applyLog(level: string, format: string, ...parameters: Array<string>): void {
		winston.log(level, `${(new Date()).toISOString()} [${this.name}] ${[format, ...parameters].join(' ')}`);
	}

	debug(format: string, ...parameters: Array<string>): void {
		this.applyLog('debug', format, ...parameters);
	}

	info(format: string, ...parameters: Array<string>): void {
		this.applyLog('info', format, ...parameters);
	}

	warn(format: string, ...parameters: Array<string>): void {
		this.applyLog('warn', format, ...parameters);
	}

	error(format: unknown, ...parameters: Array<string>): void {
		this.applyLog('error', errorToString(format), ...parameters);
	}

	table(items: Array<Dictionary>, columns?: Array<{ name: string; alignment: 'left' | 'right' }>): void {
		if (winston.level === 'info') {
			const p = new Table({ columns });
			p.addRows(items);
			p.printTable();
		}
	}

	access(format: string, ...parameters: Array<string>): void {
		this.applyLog('debug', format, ...parameters);
	}
}

export function logger(name: string): Logger {
	return new Logger(name);
}
