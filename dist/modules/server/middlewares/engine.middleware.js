"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEngineMiddleware = void 0;
function useEngineMiddleware(engine) {
    return (req, res, next) => {
        req.engine = engine;
        req.orm = engine.orm.fork();
        next();
    };
}
exports.useEngineMiddleware = useEngineMiddleware;
//# sourceMappingURL=engine.middleware.js.map