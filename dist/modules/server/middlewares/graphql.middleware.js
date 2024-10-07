var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import express from 'express';
import { Inject, InRequestScope } from 'typescript-ioc';
import { logger } from '../../../utils/logger.js';
import { ConfigService } from '../../engine/services/config.service.js';
import { ApolloMiddleware } from './apollo.middleware.js';
import path from 'path';
import RateLimit from 'express-rate-limit';
const log = logger('Graphql');
let GraphqlMiddleware = class GraphqlMiddleware {
    async playground() {
        const api = express.Router();
        api.get('*', express.static(path.resolve('./static/graphql/')));
        return api;
    }
    async middleware(configService) {
        const graphql = express.Router();
        graphql.use(RateLimit(configService.rateLimits.graphlql));
        log.debug(`registering graphql playground`);
        graphql.use('/playground', await this.playground());
        log.debug(`registering graphql api middleware`);
        graphql.use('/', await this.apollo.middleware());
        return graphql;
    }
};
__decorate([
    Inject,
    __metadata("design:type", ConfigService)
], GraphqlMiddleware.prototype, "configService", void 0);
__decorate([
    Inject,
    __metadata("design:type", ApolloMiddleware)
], GraphqlMiddleware.prototype, "apollo", void 0);
GraphqlMiddleware = __decorate([
    InRequestScope
], GraphqlMiddleware);
export { GraphqlMiddleware };
//# sourceMappingURL=graphql.middleware.js.map