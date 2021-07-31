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
import { buildRestMeta, restRouter } from '../../rest';
import { UserRole } from '../../../types/enums';
import { Inject, InRequestScope } from 'typescript-ioc';
import { logger } from '../../../utils/logger';
import { RestControllers } from '../../engine/rest/controllers';
import { ConfigService } from '../../engine/services/config.service';
import { registerRestEnums } from '../../engine/rest/enum-registration';
const log = logger('REST');
registerRestEnums();
let RestMiddleware = class RestMiddleware {
    middleware() {
        const api = express.Router();
        buildRestMeta();
        const options = {
            tmpPath: this.configService.getDataPath(['cache', 'uploads']),
            controllers: RestControllers(),
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
        const routeInfos = restRouter(api, options);
        if (process.env.NODE_ENV !== 'production') {
            log.table(routeInfos, [
                { name: 'method', alignment: 'right' },
                { name: 'endpoint', alignment: 'left' },
                { name: 'role', alignment: 'right' },
                { name: 'format', alignment: 'left' }
            ]);
        }
        api.use((req, res) => {
            res.status(404).send('Api Path not found');
        });
        return api;
    }
};
__decorate([
    Inject,
    __metadata("design:type", ConfigService)
], RestMiddleware.prototype, "configService", void 0);
RestMiddleware = __decorate([
    InRequestScope
], RestMiddleware);
export { RestMiddleware };
//# sourceMappingURL=rest.middleware.js.map