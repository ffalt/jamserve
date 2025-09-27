export function useEngineMiddleware(engine) {
    return (req, _res, next) => {
        req.engine = engine;
        req.orm = engine.orm.fork();
        next();
    };
}
//# sourceMappingURL=engine.middleware.js.map