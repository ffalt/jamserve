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
exports.RestMiddleware = void 0;
const express_1 = __importDefault(require("express"));
const rest_1 = require("../../rest");
const enums_1 = require("../../../types/enums");
const typescript_ioc_1 = require("typescript-ioc");
const logger_1 = require("../../../utils/logger");
const controllers_1 = require("../../engine/rest/controllers");
const config_service_1 = require("../../engine/services/config.service");
const enum_registration_1 = require("../../engine/rest/enum-registration");
const log = logger_1.logger('REST');
enum_registration_1.registerRestEnums();
let RestMiddleware = class RestMiddleware {
    middleware() {
        const api = express_1.default.Router();
        rest_1.buildRestMeta();
        const options = {
            tmpPath: this.configService.getDataPath(['cache', 'uploads']),
            controllers: controllers_1.RestControllers(),
            validateRoles: (user, roles) => {
                const u = user;
                if (roles.length > 0) {
                    if (!user) {
                        return false;
                    }
                    if (roles.includes(enums_1.UserRole.stream) && !u.roleStream) {
                        return false;
                    }
                    if (roles.includes(enums_1.UserRole.admin) && !u.roleAdmin) {
                        return false;
                    }
                    if (roles.includes(enums_1.UserRole.podcast) && !u.rolePodcast) {
                        return false;
                    }
                    if (roles.includes(enums_1.UserRole.upload) && !u.roleUpload) {
                        return false;
                    }
                }
                return true;
            }
        };
        const routeInfos = rest_1.restRouter(api, options);
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
    typescript_ioc_1.Inject,
    __metadata("design:type", config_service_1.ConfigService)
], RestMiddleware.prototype, "configService", void 0);
RestMiddleware = __decorate([
    typescript_ioc_1.InRequestScope
], RestMiddleware);
exports.RestMiddleware = RestMiddleware;
//# sourceMappingURL=rest.middleware.js.map