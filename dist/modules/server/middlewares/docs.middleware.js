var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Inject, InRequestScope } from 'typescript-ioc';
import express from 'express';
import { ApolloMiddleware } from './apollo.middleware.js';
import { RestMiddleware } from './rest.middleware.js';
import { ApiBaseResponder, buildAngularClientZip, buildAxiosClientZip, buildOpenApi } from '../../rest/index.js';
import path from 'path';
let DocsMiddleware = class DocsMiddleware {
    getOpenApiSchema(extended = true) {
        const openapi = buildOpenApi(extended);
        return JSON.stringify(openapi, null, '\t');
    }
    async middleware() {
        const api = express.Router();
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
            ApiBaseResponder.sendBinary(req, res, await buildAngularClientZip());
        });
        api.get('/axios-client.zip', async (req, res) => {
            ApiBaseResponder.sendBinary(req, res, await buildAxiosClientZip());
        });
        api.get('*', express.static(path.resolve('./static/redoc/')));
        return api;
    }
};
__decorate([
    Inject,
    __metadata("design:type", ApolloMiddleware)
], DocsMiddleware.prototype, "apollo", void 0);
__decorate([
    Inject,
    __metadata("design:type", RestMiddleware)
], DocsMiddleware.prototype, "rest", void 0);
DocsMiddleware = __decorate([
    InRequestScope
], DocsMiddleware);
export { DocsMiddleware };
//# sourceMappingURL=docs.middleware.js.map