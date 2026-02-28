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
import path from 'node:path';
import { getMaxAge, ONE_YEAR_MS } from '../../../utils/max-age.js';
import fse from 'fs-extra';
import { logger } from '../../../utils/logger.js';
const log = logger('ConfigService');
let ConfigService = class ConfigService {
    constructor() {
        this.env = {
            domain: process.env.JAM_DOMAIN ?? 'http://localhost',
            host: process.env.JAM_HOST ?? '127.0.0.1',
            port: Number(process.env.JAM_PORT ?? 4040),
            minPasswordLength: Number(process.env.JAM_MIN_PASSWORD_LENGTH ?? 10),
            jwt: {
                secret: process.env.JAM_JWT_SECRET ?? 'keyboard cat is sad because no secret has been set',
                maxAge: getMaxAge(process.env.JAM_JWT_MAXAGE, ONE_YEAR_MS)
            },
            session: {
                secure: process.env.JAM_SESSION_COOKIE_SECURE !== 'false',
                proxy: process.env.JAM_SESSION_TRUST_PROXY === 'true',
                secret: process.env.JAM_SESSION_SECRET ?? 'keyboard cat is sad because no secret has been set',
                allowedCookieDomains: (process.env.JAM_ALLOWED_COOKIE_DOMAINS ?? '').split(',').filter(Boolean),
                maxAge: getMaxAge(process.env.JAM_SESSION_MAXAGE)
            },
            paths: {
                data: process.env.JAM_DATA_PATH ?? './data/',
                frontend: process.env.JAM_FRONTEND_PATH ?? './static/jamberry/'
            },
            db: {
                dialect: process.env.JAM_DB_DIALECT ?? 'sqlite',
                name: process.env.JAM_DB_NAME ?? 'jam',
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
                windowMs: 15 * 60 * 1000,
                limit: 2000
            },
            api: {
                windowMs: 15 * 60 * 1000,
                limit: 1000
            },
            subsonic: {
                windowMs: 15 * 60 * 1000,
                limit: 1000
            },
            docs: {
                windowMs: 10 * 60 * 1000,
                limit: 100
            },
            graphql: {
                windowMs: 10 * 60 * 1000,
                limit: 100
            },
            login: {
                windowMs: 15 * 60 * 1000,
                limit: 5
            }
        };
        this.validateSecrets();
        this.validateSessionCookieSecure();
        this.tools.acoustid.apiKey = process.env.JAM_ACOUSTID_API_KEY ?? '';
        this.tools.lastfm.apiKey = process.env.JAM_LASTFM_API_KEY ?? '';
        const configFirstStartFile = path.resolve(this.getDataPath(['config']), 'firststart.config.json');
        try {
            this.firstStart = fse.readJSONSync(configFirstStartFile);
        }
        catch (error) {
            log.errorMsg('Error loading first start config', error);
            this.firstStart = {
                adminUser: undefined,
                roots: []
            };
        }
    }
    validateSecrets() {
        const weakSecrets = [
            'keyboard cat is dancing',
            'keyboard cat is sad because no secret has been set',
            'your-secret-key',
            'change-me',
            'secret',
            'password'
        ];
        this.validateSecret('JAM_SESSION_SECRET', this.env.session.secret, weakSecrets);
        this.validateSecret('JAM_JWT_SECRET', this.env.jwt.secret, weakSecrets);
    }
    validateSecret(envName, secret, weakSecrets) {
        if (weakSecrets.includes(secret.toLowerCase())) {
            throw new Error(`CRITICAL: ${envName} contains a default/weak value. ` +
                'Please generate a strong random secret:\n' +
                'node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
        }
        if (secret.length < 64) {
            throw new Error(`CRITICAL: ${envName} must be at least 64 characters long (recommended: cryptographically random). ` +
                `Current length: ${secret.length}. ` +
                'Generate a strong secret using:\n' +
                'node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
        }
        const hasVariation = new Set(secret).size > 10;
        if (!hasVariation) {
            throw new Error(`CRITICAL: ${envName} lacks sufficient character variation and may be weak. ` +
                'Use a cryptographically random secret:\n' +
                'node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
        }
    }
    validateSessionCookieSecure() {
        if (!this.env.session.secure) {
            const domain = this.env.domain.toLowerCase();
            const isLocalhost = domain.includes('localhost') || domain.includes('127.0.0.1');
            if (!isLocalhost) {
                log.warn('WARNING: Session cookie "secure" flag is disabled (JAM_SESSION_COOKIE_SECURE=false). ' +
                    'Cookies will be sent over plain HTTP, which may expose sessions to hijacking. ' +
                    'Set JAM_SESSION_COOKIE_SECURE to "true" or remove it (defaults to true) for production deployments.');
            }
        }
    }
};
ConfigService = __decorate([
    InRequestScope,
    __metadata("design:paramtypes", [])
], ConfigService);
export { ConfigService };
//# sourceMappingURL=config.service.js.map