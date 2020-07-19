"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = exports.configureLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const console_table_printer_1 = require("console-table-printer");
function configureLogger(level) {
    winston_1.default.configure({
        level,
        transports: [
            new winston_1.default.transports.Console({
                format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
            })
        ]
    });
}
exports.configureLogger = configureLogger;
class Logger {
    constructor(name) {
        this.name = name;
    }
    applyLog(level, format, ...params) {
        winston_1.default.log(level, `${(new Date()).toISOString()} ${this.name}: ${[format].concat(params).join(' ')}`);
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
        if (winston_1.default.level === 'info') {
            const p = new console_table_printer_1.Table({ columns });
            p.addRows(items);
            p.printTable();
        }
    }
}
exports.Logger = Logger;
function logger(name) {
    return new Logger(name);
}
exports.logger = logger;
//# sourceMappingURL=logger.js.map