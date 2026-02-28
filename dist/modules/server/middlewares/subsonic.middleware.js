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
import { subsonicRouter } from '../../subsonic/builder/express.js';
import { UserRole } from '../../../types/enums.js';
import { buildSubsonicMeta } from '../../subsonic/metadata/builder.js';
import { metadataStorage } from '../../subsonic/metadata/metadata-storage.js';
import { ApiResponder } from '../../subsonic/response.js';
import { SubsonicParameterMiddleWare } from '../../subsonic/parameters.js';
import { SubsonicCheckAuthMiddleWare, SubsonicLoginMiddleWare } from '../../subsonic/login.js';
import { SubsonicControllers } from '../../subsonic/controllers.js';
import RateLimit from 'express-rate-limit';
const log = logger('Subsonic');
let SubsonicMiddleware = class SubsonicMiddleware {
    constructor() {
        this.controllers = SubsonicControllers;
    }
    middleware() {
        if (this.controllers.length === 0) {
            throw new Error('No subsonic controllers');
        }
        const router = express.Router();
        router.use(RateLimit(this.configService.rateLimits.subsonic));
        router.use(SubsonicParameterMiddleWare);
        router.use(SubsonicLoginMiddleWare);
        router.use(SubsonicCheckAuthMiddleWare);
        buildSubsonicMeta();
        const metadata = metadataStorage();
        const options = {
            enums: metadata.enums,
            resultTypes: metadata.resultTypes,
            responder: new ApiResponder(this.configService.env.session.allowedCookieDomains),
            tmpPath: this.configService.getDataPath(['cache', 'uploads']),
            validateRoles: (user, roles) => {
                if (roles.length > 0) {
                    if (!user) {
                        return false;
                    }
                    if (roles.includes(UserRole.stream) && !user.roleStream) {
                        return false;
                    }
                    if (roles.includes(UserRole.admin) && !user.roleAdmin) {
                        return false;
                    }
                    if (roles.includes(UserRole.podcast) && !user.rolePodcast) {
                        return false;
                    }
                    if (roles.includes(UserRole.upload) && !user.roleUpload) {
                        return false;
                    }
                }
                return true;
            }
        };
        const routeInfos = subsonicRouter(router, metadata, options);
        if (process.env.NODE_ENV !== 'production') {
            log.table(routeInfos, [
                { name: 'method', alignment: 'right' },
                { name: 'endpoint', alignment: 'left' },
                { name: 'role', alignment: 'right' },
                { name: 'format', alignment: 'left' }
            ]);
        }
        router.use((_req, res) => {
            res.status(404).send('Subsonic Api Path not found');
        });
        return router;
    }
};
__decorate([
    Inject,
    __metadata("design:type", ConfigService)
], SubsonicMiddleware.prototype, "configService", void 0);
SubsonicMiddleware = __decorate([
    InRequestScope
], SubsonicMiddleware);
export { SubsonicMiddleware };
//# sourceMappingURL=subsonic.middleware.js.map