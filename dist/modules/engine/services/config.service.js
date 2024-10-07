var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ThirdPartyConfig } from '../../../config/thirdparty.config.js';
import { InRequestScope } from 'typescript-ioc';
import path from 'path';
import { getMaxAge } from '../../../utils/max-age.js';
import fse from 'fs-extra';
let ConfigService = class ConfigService {
    constructor() {
        this.env = {
            domain: process.env.JAM_DOMAIN || 'http://localhost',
            host: process.env.JAM_HOST || '127.0.0.1',
            port: Number(process.env.JAM_PORT) || 4040,
            jwt: {
                secret: process.env.JAM_JWT_SECRET || 'keyboard cat is sad because no secret has been set',
                maxAge: getMaxAge(process.env.JAM_JWT_MAXAGE)
            },
            session: {
                secure: process.env.JAM_SESSION_COOKIE_SECURE === 'true',
                proxy: process.env.JAM_SESSION_TRUST_PROXY === 'true',
                secret: process.env.JAM_SESSION_SECRET || 'keyboard cat is sad because no secret has been set',
                allowedCookieDomains: (process.env.JAM_ALLOWED_COOKIE_DOMAINS || '').split(','),
                maxAge: getMaxAge(process.env.JAM_SESSION_MAXAGE)
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
        this.getDataPath = (parts) => path.resolve(this.env.paths.data, ...parts);
        this.tools = ThirdPartyConfig;
        this.rateLimits = {
            frontend: {
                windowMs: 10 * 60 * 1000,
                limit: 1000
            },
            docs: {
                windowMs: 10 * 60 * 1000,
                limit: 100
            },
            graphlql: {
                windowMs: 10 * 60 * 1000,
                limit: 1000
            }
        };
        const configFirstStartFile = path.resolve(this.getDataPath(['config']), 'firststart.config.json');
        try {
            this.firstStart = fse.readJSONSync(configFirstStartFile);
        }
        catch (e) {
            console.error('Error loading first start config', e);
            this.firstStart = {
                adminUser: undefined,
                roots: []
            };
        }
    }
};
ConfigService = __decorate([
    InRequestScope,
    __metadata("design:paramtypes", [])
], ConfigService);
export { ConfigService };
//# sourceMappingURL=config.service.js.map