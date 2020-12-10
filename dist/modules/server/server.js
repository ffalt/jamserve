"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const engine_service_1 = require("../engine/services/engine.service");
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const engine_middleware_1 = require("./middlewares/engine.middleware");
const config_service_1 = require("../engine/services/config.service");
const logger_1 = require("../../utils/logger");
const apollo_middleware_1 = require("./middlewares/apollo.middleware");
const session_middleware_1 = require("./middlewares/session.middleware");
const log_middleware_1 = require("./middlewares/log.middleware");
const rest_middleware_1 = require("./middlewares/rest.middleware");
const passport_middleware_1 = require("./middlewares/passport.middleware");
const version_1 = require("../engine/rest/version");
const docs_middleware_1 = require("./middlewares/docs.middleware");
const cors_middleware_1 = require("./middlewares/cors.middleware");
const session_service_1 = require("../../entity/session/session.service");
const csp_middleware_1 = require("./middlewares/csp.middleware");
const log = logger_1.logger('Server');
let Server = class Server {
    async init() {
        const app = express_1.default();
        log.debug(`registering express standard middleware`);
        app.use(body_parser_1.default.urlencoded({ extended: true, limit: '10mb' }));
        app.use(body_parser_1.default.json({ limit: '10mb' }));
        app.use(body_parser_1.default.json({ type: 'application/json', limit: '10mb' }));
        app.use(body_parser_1.default.json({ type: 'application/vnd.api+json', limit: '10mb' }));
        app.use(body_parser_1.default.json({ type: 'application/csp-report', limit: '10mb' }));
        app.use(helmet_1.default());
        app.use(csp_middleware_1.useCSPMiddleware());
        if (this.configService.env.session.proxy) {
            app.enable('trust proxy');
        }
        app.use(log_middleware_1.useLogMiddleware());
        app.post('/csp/report-violation', async (req, res) => {
            log.error('CSP', req.body ? JSON.stringify(req.body) : 'No data');
            res.status(204).end();
        });
        app.use(engine_middleware_1.useEngineMiddleware(this.engine));
        app.use(session_middleware_1.useSessionMiddleware(this.configService, this.sessionService));
        app.use(passport_middleware_1.usePassPortMiddleWare(app, this.engine));
        app.use(cors_middleware_1.useAuthenticatedCors(this.configService));
        log.debug(`registering jam api middleware`);
        app.use(`/jam/${version_1.JAMAPI_URL_VERSION}`, this.rest.middleware());
        log.debug(`registering graphql playground`);
        app.use('/graphql/playground', await this.apollo.playground());
        log.debug(`registering graphql middleware`);
        app.use('/graphql', await this.apollo.middleware());
        log.debug(`registering docs middleware`);
        app.use('/docs', await this.docs.middleware());
        log.debug(`registering static middleware`);
        const jamberry_config = `document.jamberry_config = ${JSON.stringify({ name: 'Jam', fixed: { server: this.configService.env.domain } })}`;
        app.get('/assets/config/config.js', (req, res) => {
            res.type('text/javascript');
            res.send(jamberry_config);
        });
        app.get('/*', express_1.default.static(path_1.default.resolve(this.configService.env.paths.frontend)));
        app.get('/*', express_1.default.static(path_1.default.resolve(this.configService.env.paths.frontend, 'index.html')));
        this.app = app;
    }
    getURL() {
        return `http://${this.configService.env.host === '127.0.0.1' ? 'localhost' :
            this.configService.env.host}:${this.configService.env.port}`;
    }
    getDomain() {
        return this.configService.env.domain || this.getDomain();
    }
    async start() {
        log.debug(`starting express on ${this.getURL()}`);
        this.server = this.app.listen(this.configService.env.port, this.configService.env.host);
        this.server.setTimeout(4 * 60000);
        const domain = this.getDomain();
        log.table([
            { Content: 'Frontend', URL: `${domain}` },
            { Content: 'GraphQl Api', URL: `${domain}/graphql` },
            { Content: 'GraphQl Playground', URL: `${domain}/graphql/playground` },
            { Content: 'REST Api', URL: `${domain}/jam/${version_1.JAMAPI_URL_VERSION}/ping` },
            { Content: 'REST Documentation', URL: `${domain}/docs` },
            { Content: 'OpenApi Spec', URL: `${domain}/docs/openapi.json` },
            { Content: 'GraphQL Spec', URL: `${domain}/docs/schema.graphql` },
            { Content: 'Angular Client', URL: `${domain}/docs/angular-client.zip` },
            { Content: 'Axios Client', URL: `${domain}/docs/axios-client.zip` }
        ], [
            { name: 'Content', alignment: 'right' },
            { name: 'URL', alignment: 'left' }
        ]);
    }
    async stop() {
        return new Promise((resolve, reject) => {
            if (this.server) {
                this.server.close(err => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
                this.server.unref();
            }
            else {
                resolve();
            }
        });
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", engine_service_1.EngineService)
], Server.prototype, "engine", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", apollo_middleware_1.ApolloMiddleware)
], Server.prototype, "apollo", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", rest_middleware_1.RestMiddleware)
], Server.prototype, "rest", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", config_service_1.ConfigService)
], Server.prototype, "configService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", session_service_1.SessionService)
], Server.prototype, "sessionService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", docs_middleware_1.DocsMiddleware)
], Server.prototype, "docs", void 0);
Server = __decorate([
    typescript_ioc_1.InRequestScope
], Server);
exports.Server = Server;
//# sourceMappingURL=server.js.map