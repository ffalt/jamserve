import cors from 'cors';
export function useAuthenticatedCors(configService) {
    const origins = configService.env.session.allowedCookieDomains ?? [];
    const corsOptionsDelegate = (_req, callback) => {
        const corsOptions = {
            preflightContinue: false,
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization'],
            origin(origin, originCallback) {
                if (!origin || origins.includes(origin)) {
                    originCallback(null, true);
                }
                else {
                    originCallback(new Error('Not allowed by CORS'));
                }
            },
            methods: ['GET', 'POST']
        };
        callback(null, corsOptions);
    };
    return cors(corsOptionsDelegate);
}
//# sourceMappingURL=cors.middleware.js.map