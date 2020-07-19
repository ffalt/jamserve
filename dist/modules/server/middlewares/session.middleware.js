"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSessionMiddleware = void 0;
const express_session_1 = __importDefault(require("express-session"));
const session_store_1 = require("./session-store");
function useSessionMiddleware(configService) {
    return express_session_1.default({
        name: 'jam.sid',
        secret: configService.env.session.secret,
        store: new session_store_1.ExpressSessionStore(),
        resave: false,
        proxy: configService.env.session.proxy,
        saveUninitialized: false,
        cookie: {
            secure: !!configService.env.session.secure,
            path: '/',
            maxAge: configService.env.session.maxAge > 0 ? configService.env.session.maxAge : undefined
        }
    });
}
exports.useSessionMiddleware = useSessionMiddleware;
//# sourceMappingURL=session.middleware.js.map