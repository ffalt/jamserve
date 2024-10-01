import { logger } from '../../../utils/logger.js';
const log = logger('Api');
export function useLogMiddleware() {
    return (req, _res, next) => {
        let info = '';
        if (req.originalUrl === '/graphql') {
            const query = `${req.body?.query}`.slice(0, 50);
            info = query.slice(0, query.indexOf('{'));
        }
        log.access(`${req.ip} ${req.method} ${req.originalUrl} ${info}`);
        next();
    };
}
//# sourceMappingURL=log.middleware.js.map