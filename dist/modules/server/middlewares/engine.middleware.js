export function useEngineMiddleware(engine) {
    return (req, res, next) => {
        req.engine = engine;
        req.orm = engine.orm.fork();
        next();
    };
}
//# sourceMappingURL=engine.middleware.js.map