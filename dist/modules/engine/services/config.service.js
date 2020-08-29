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
exports.ConfigService = void 0;
const thirdparty_config_1 = require("../../../config/thirdparty.config");
const typescript_ioc_1 = require("typescript-ioc");
const path_1 = __importDefault(require("path"));
const max_age_1 = require("../../../utils/max-age");
let ConfigService = class ConfigService {
    constructor() {
        this.env = {
            host: process.env.JAM_HOST || '127.0.0.1',
            port: Number(process.env.JAM_PORT) || 4040,
            jwt: {
                secret: process.env.JAM_JWT_SECRET || 'keyboard cat is sad because no secret has been set',
                maxAge: max_age_1.getMaxAge(process.env.JAM_JWT_MAXAGE),
            },
            session: {
                secure: process.env.JAM_SESSION_COOKIE_SECURE === 'true',
                proxy: process.env.JAM_SESSION_TRUST_PROXY === 'true',
                secret: process.env.JAM_SESSION_SECRET || 'keyboard cat is sad because no secret has been set',
                allowedCookieDomains: (process.env.JAM_ALLOWED_COOKIE_DOMAINS || '').split(','),
                maxAge: max_age_1.getMaxAge(process.env.JAM_SESSION_MAXAGE)
            },
            paths: {
                data: process.env.JAM_DATA_PATH || './data/',
                frontend: process.env.JAM_FRONTEND_PATH || './static/jamberry/'
            },
            db: {
                dialect: process.env.JAM_DB_DIALECT || 'sqlite',
                name: process.env.JAM_DB_NAME || 'jam',
                user: process.env.JAM_DB_USER,
                password: process.env.JAM_DB_PASSWORD,
                socket: process.env.JAM_DB_SOCKET,
                host: process.env.JAM_DB_HOST,
                port: Number(process.env.JAM_DB_PORT) || undefined
            }
        };
        this.getDataPath = (parts) => path_1.default.resolve(this.env.paths.data, ...parts);
        this.tools = thirdparty_config_1.ThirdPartyConfig;
        const configFirstStartFile = path_1.default.resolve(this.getDataPath(['config']), 'firststart.config.js');
        try {
            this.firstStart = require(configFirstStartFile);
        }
        catch (e) {
            this.firstStart = {
                adminUser: undefined,
                roots: []
            };
        }
    }
};
ConfigService = __decorate([
    typescript_ioc_1.InRequestScope,
    __metadata("design:paramtypes", [])
], ConfigService);
exports.ConfigService = ConfigService;
//# sourceMappingURL=config.service.js.map