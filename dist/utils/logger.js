import winston from 'winston';
import { Table } from 'console-table-printer';
export function configureLogger(level) {
    winston.configure({
        level,
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(winston.format.colorize(), winston.format.simple())
            })
        ]
    });
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