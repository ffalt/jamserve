"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLogMiddleware = void 0;
const logger_1 = require("../../../utils/logger");
const log = logger_1.logger('Jam.Api');
function useLogMiddleware() {
    return (req, res, next) => {
        log.info(`${req.method} ${req.originalUrl}`);
        next();
    };
}
exports.useLogMiddleware = useLogMiddleware;
//# sourceMappingURL=log.middleware.js.map