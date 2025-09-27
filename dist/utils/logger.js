import winston from 'winston';
import { Table } from 'console-table-printer';
import { createStream } from 'rotating-file-stream';
import TransportStream from 'winston-transport';
import { MESSAGE } from 'triple-beam';
import { errorToString } from './error.js';
export class WinstonRotatingFile extends TransportStream {
    constructor(options) {
        super(options);
        this.stream = createStream(options.filename, options.rfsOptions);
    }
    close() {
        this.stream.end();
    }
    log(info, done) {
        this.stream.write(`${info[MESSAGE]}\n`, done);
    }
}
export function configureLogger(level, logfile) {
    const console_logger = new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    });
    const transports = [console_logger];
    if (logfile) {
        transports.push(new WinstonRotatingFile({
            filename: logfile,
            level: 'info',
            format: winston.format.combine(winston.format.simple()),
            rfsOptions: {
                size: '10M',
                interval: '1d',
                compress: 'gzip'
            }
        }));
    }
    winston.configure({ level, transports });
}
export class Logger {
    constructor(name) {
        this.name = name;
    }
    applyLog(level, format, ...parameters) {
        winston.log(level, `${(new Date()).toISOString()} [${this.name}] ${[format, ...parameters].join(' ')}`);
    }
    debug(format, ...parameters) {
        this.applyLog('debug', format, ...parameters);
    }
    info(format, ...parameters) {
        this.applyLog('info', format, ...parameters);
    }
    warn(format, ...parameters) {
        this.applyLog('warn', format, ...parameters);
    }
    error(format, ...parameters) {
        this.applyLog('error', errorToString(format), ...parameters);
    }
    table(items, columns) {
        if (winston.level === 'info') {
            const p = new Table({ columns });
            p.addRows(items);
            p.printTable();
        }
    }
    access(format, ...parameters) {
        this.applyLog('debug', format, ...parameters);
    }
}
export function logger(name) {
    return new Logger(name);
}
//# sourceMappingURL=logger.js.map