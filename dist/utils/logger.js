import winston from 'winston';
import { Table } from 'console-table-printer';
import { createStream } from 'rotating-file-stream';
import TransportStream from 'winston-transport';
import { MESSAGE } from 'triple-beam';
export class WinstonRotatingFile extends TransportStream {
    constructor(options) {
        super(options);
        this.stream = createStream(options.filename, options.rfsOptions);
    }
    close() {
        this.stream.end();
    }
    log(info, done) {
        this.stream.write(info[MESSAGE] + '\n', done);
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
    applyLog(level, format, ...params) {
        winston.log(level, `${(new Date()).toISOString()} [${this.name}] ${[format].concat(params).join(' ')}`);
    }
    debug(format, ...params) {
        this.applyLog('debug', format, params);
    }
    info(format, ...params) {
        this.applyLog('info', format, params);
    }
    warn(format, ...params) {
        this.applyLog('warn', format, params);
    }
    error(format, ...params) {
        this.applyLog('error', format.toString(), params);
    }
    table(items, columns) {
        if (winston.level === 'info') {
            const p = new Table({ columns });
            p.addRows(items);
            p.printTable();
        }
    }
    access(format, ...params) {
        this.applyLog('debug', format, params);
    }
}
export function logger(name) {
    return new Logger(name);
}
//# sourceMappingURL=logger.js.map