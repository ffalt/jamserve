"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthenticatedCors = exports.registerPublicCORS = void 0;
const cors_1 = __importDefault(require("cors"));
function registerPublicCORS(_) {
    return cors_1.default({
        preflightContinue: false,
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        origin: true,
        methods: ['GET', 'POST']
    });
}
exports.registerPublicCORS = registerPublicCORS;
function useAuthenticatedCors(configService) {
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
    return cors_1.default(corsOptionsDelegate);
}
exports.useAuthenticatedCors = useAuthenticatedCors;
//# sourceMappingURL=cors.middleware.js.map