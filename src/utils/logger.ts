import winston from 'winston';
import { Table } from 'console-table-printer';
import { createStream, Generator, Options, RotatingFileStream } from 'rotating-file-stream';
import TransportStream from 'winston-transport';
import { MESSAGE } from 'triple-beam';

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

	public log(info: any, done: () => void): any {
		this.stream.write(info[MESSAGE] + '\n', done);
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
			const p = new Table({ columns });
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
