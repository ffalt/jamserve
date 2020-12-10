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
const rest_1 = require("../../rest");
const path_1 = __importDefault(require("path"));
let DocsMiddleware = class DocsMiddleware {
    getOpenApiSchema(extended = true) {
        const openapi = rest_1.buildOpenApi(extended);
        return JSON.stringify(openapi, null, '\t');
    }
    async middleware() {
        const api = express_1.default.Router();
        api.get('/schema.graphql', (req, res) => {
            res.type('application/graphql').send(this.apollo.printSchema());
        });
        api.get('/openapi.json', (req, res) => {
            res.type('application/json').send(this.getOpenApiSchema(false));
        });
        api.get('/openapi.ext.json', (req, res) => {
            res.type('application/json').send(this.getOpenApiSchema());
        });
        api.get('/angular-client.zip', async (req, res) => {
            rest_1.ApiBaseResponder.sendBinary(req, res, await rest_1.buildAngularClientZip());
        });
        api.get('/axios-client.zip', async (req, res) => {
            rest_1.ApiBaseResponder.sendBinary(req, res, await rest_1.buildAxiosClientZip());
        });
        api.get('/redoc.standalone.min.js', express_1.default.static(path_1.default.resolve('./static/redoc/redoc.standalone.min.js')));
        api.get('', express_1.default.static(path_1.default.resolve('./static/redoc/index.html')));
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
    typescript_ioc_1.InRequestScope
], DocsMiddleware);
exports.DocsMiddleware = DocsMiddleware;
//# sourceMappingURL=docs.middleware.js.map