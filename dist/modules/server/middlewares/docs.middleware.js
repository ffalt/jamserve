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
import path from 'path';
import { buildOpenApi } from '../../rest/builder/openapi.js';
import { buildAngularClientZip } from '../../rest/builder/angular.js';
import { buildAxiosClientZip } from '../../rest/builder/axios.js';
import { ApiResponder } from '../../rest/response.js';
import { buildSubsonicOpenApi } from '../../subsonic/builder/openapi.js';
import RateLimit from 'express-rate-limit';
let DocsMiddleware = class DocsMiddleware {
    getOpenApiSchema() {
        const openapi = buildOpenApi();
        return JSON.stringify(openapi, null, '\t');
    }
    getSubsonicOpenApiSchema() {
        const openapi = buildSubsonicOpenApi();
        return JSON.stringify(openapi, null, '\t');
    }
    middleware(configService) {
        const api = express.Router();
        api.use(RateLimit(configService.rateLimits.docs));
        const subsonicEntry = path.resolve('./static/api-docs/subsonic.html');
        const jamEntry = path.resolve('./static/api-docs/jam.html');
        const explorerJS = path.resolve('./static/api-docs/openapi-explorer.min.js');
        api.get('/schema.graphql', (req, res) => {
            res.type('application/graphql').send(this.apollo.printSchema());
        });
        api.get('/openapi.json', (req, res) => {
            res.type('application/json').send(this.getOpenApiSchema());
        });
        api.get('/subsonic-openapi.json', (req, res) => {
            res.type('application/json').send(this.getSubsonicOpenApiSchema());
        });
        api.get('/angular-client.zip', async (req, res) => {
            (new ApiResponder()).sendBinary(req, res, await buildAngularClientZip());
        });
        api.get('/axios-client.zip', async (req, res) => {
            (new ApiResponder()).sendBinary(req, res, await buildAxiosClientZip());
        });
        api.get('/subsonic/', (_req, res) => res.sendFile(subsonicEntry));
        api.get('/', (_req, res) => res.sendFile(jamEntry));
        api.get('/openapi-explorer.min.js', (_req, res) => res.sendFile(explorerJS));
        api.get('/subsonic.js', (req, res) => {
            const subsonic_config = `document.addEventListener('DOMContentLoaded', (event) => {
const explorer = document.getElementsByTagName('openapi-explorer')[0];  
setTimeout(() => {
	explorer.setAuthenticationConfiguration('UserAuth', {token: '${req.user?.name || ''}'});
	// explorer.setAuthenticationConfiguration('PasswordAuth', {token: 'dev'}); 
	explorer.setAuthenticationConfiguration('VersionAuth', {token: '1.16.0'});
	explorer.setAuthenticationConfiguration('ClientAuth', {token: 'Api Docs Test Client'});
}, 1000);
});`;
            res.type('text/javascript');
            res.send(subsonic_config);
        });
        return api;
    }
};
__decorate([
    Inject,
    __metadata("design:type", ApolloMiddleware)
], DocsMiddleware.prototype, "apollo", void 0);
DocsMiddleware = __decorate([
    InRequestScope
], DocsMiddleware);
export { DocsMiddleware };
//# sourceMappingURL=docs.middleware.js.map