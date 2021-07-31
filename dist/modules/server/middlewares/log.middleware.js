import { logger } from '../../../utils/logger';
const log = logger('Api');
export function useLogMiddleware() {
    return (req, res, next) => {
        let info = '';
        if (req.originalUrl === '/graphql') {
            const query = `${req.body?.query}`.slice(0, 50);
            info = query.slice(0, query.indexOf('{'));
        }
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        log.access(`${ip} ${req.method} ${req.originalUrl} ${info}`);
        next();
    };
}
//# sourceMappingURL=log.middleware.js.map