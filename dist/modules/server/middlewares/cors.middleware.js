import cors from 'cors';
export function registerPublicCORS(_) {
    return cors({
        preflightContinue: false,
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        origin: true,
        methods: ['GET', 'POST']
    });
}
export function useAuthenticatedCors(configService) {
    const origins = configService.env.session.allowedCookieDomains || [];
    const corsOptionsDelegate = (req, callback) => {
        const corsOptions = {
            preflightContinue: false,
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization'],
            origin(origin, cb) {
                if (!origin || origins.includes(origin)) {
                    cb(null, true);
                }
                else {
                    if (req.method === 'OPTIONS' || req.query.jwt) {
                        cb(null, true);
                    }
                    else {
                        cb(new Error('Not allowed by CORS'));
                    }
                }
            },
            methods: ['GET', 'POST']
        };
        callback(null, corsOptions);
    };
    return cors(corsOptionsDelegate);
}
//# sourceMappingURL=cors.middleware.js.map