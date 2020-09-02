"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLogMiddleware = void 0;
const logger_1 = require("../../../utils/logger");
const log = logger_1.logger('Api');
function useLogMiddleware() {
    return (req, res, next) => {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        log.access(`${ip} ${req.method} ${req.originalUrl}`);
        next();
    };
}
exports.useLogMiddleware = useLogMiddleware;
//# sourceMappingURL=log.middleware.js.map