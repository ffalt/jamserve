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
exports.DocsMiddleware = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const express_1 = __importDefault(require("express"));
const apollo_middleware_1 = require("./apollo.middleware");
const rest_middleware_1 = require("./rest.middleware");
const openapi_1 = require("../../rest/builder/openapi");
const path_1 = __importDefault(require("path"));
const angular_1 = require("../../rest/builder/angular");
const express_responder_1 = require("../../rest/builder/express-responder");
const axios_1 = require("../../rest/builder/axios");
let DocsMiddleware = class DocsMiddleware {
    getOpenApiSchema(extended = true) {
        const openapi = openapi_1.buildOpenApi(extended);
        return JSON.stringify(openapi, null, '\t');
    }
    async middleware() {
        const api = express_1.default.Router();
        api.get('/schema.graphql', (req, res) => {
            res.type('application/graphql');
            res.send(this.apollo.printSchema());
        });
        api.get('/openapi.json', (req, res) => {
            res.type('application/json');
            res.send(this.getOpenApiSchema(false));
        });
        api.get('/openapi.ext.json', (req, res) => {
            res.type('application/json');
            res.send(this.getOpenApiSchema());
        });
        api.get('/angular-client.zip', async (req, res) => {
            const result = await angular_1.buildAngularClientZip();
            res.type('application/zip');
            express_responder_1.ApiBaseResponder.sendBinary(req, res, result);
        });
        api.get('/axios-client.zip', async (req, res) => {
            const result = await axios_1.buildAxiosClientZip();
            res.type('application/zip');
            express_responder_1.ApiBaseResponder.sendBinary(req, res, result);
        });
        api.get('/redoc.standalone.min.js', (req, res) => {
            res.type('text/javascript');
            res.sendFile(path_1.default.resolve('./static/redoc/redoc.standalone.min.js'));
        });
        api.get('', (req, res) => {
            res.sendFile(path_1.default.resolve('./static/redoc/index.html'));
        });
        api.get('/voyager/voyager.min.js', (req, res) => {
            res.type('text/javascript');
            res.sendFile(path_1.default.resolve('./static/voyager/voyager.min.js'));
        });
        api.get('/voyager/voyager.worker.js', (req, res) => {
            res.type('text/javascript');
            res.sendFile(path_1.default.resolve('./static/voyager/voyager.worker.js'));
        });
        api.get('/voyager/voyager.css', (req, res) => {
            res.type('text/css');
            res.sendFile(path_1.default.resolve('./static/voyager/voyager.css'));
        });
        api.get('/voyager/', (req, res) => {
            res.sendFile(path_1.default.resolve('./static/voyager/index.html'));
        });
        api.get('', (req, res) => {
            res.sendFile(path_1.default.resolve('./static/redoc/index.html'));
        });
        return api;
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", apollo_middleware_1.ApolloMiddleware)
], DocsMiddleware.prototype, "apollo", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", rest_middleware_1.RestMiddleware)
], DocsMiddleware.prototype, "rest", void 0);
DocsMiddleware = __decorate([
    typescript_ioc_1.Singleton
], DocsMiddleware);
exports.DocsMiddleware = DocsMiddleware;
//# sourceMappingURL=docs.middleware.js.map