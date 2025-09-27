var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { SubsonicParameterJukebox } from '../model/subsonic-rest-parameters.js';
import { SubsonicRoute } from '../decorators/subsonic-route.js';
import { SubsonicParameters } from '../decorators/subsonic-parameters.js';
import { SubsonicOKResponse, SubsonicOpenSubsonicResponse, SubsonicResponseJukeboxStatus, SubsonicResponseLicense, SubsonicResponseScanStatus } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/subsonic-controller.js';
import { SubsonicContext } from '../decorators/subsonic-context.js';
import { SubsonicApiError, SubsonicFormatter } from '../formatter.js';
import { logger } from '../../../utils/logger.js';
const log = logger('SubsonicApi');
let SubsonicSystemApi = class SubsonicSystemApi {
    async getLicense(_context) {
        return { license: { valid: true, email: 'example@@example.com' } };
    }
    async ping(_context) {
        return {};
    }
    async getOpenSubsonicExtensions(_context) {
        return {
            openSubsonicExtensions: [
                { name: 'songLyrics', versions: [1] },
                { name: 'formPost', versions: [1] }
            ]
        };
    }
    async jukeboxControl(_query, { user }) {
        if (!user.roleAdmin) {
            return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.UNAUTH));
        }
        return { jukeboxStatus: { currentIndex: 0, playing: false, gain: 0 } };
    }
    async getScanStatus({ engine }) {
        return { scanStatus: { scanning: engine.io.scanning } };
    }
    async startScan({ engine, orm, user }) {
        if (!user.roleAdmin) {
            return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.UNAUTH));
        }
        if (!engine.io.scanning) {
            engine.io.root.refreshAllMeta(orm)
                .catch((error) => {
                log.error(error);
            });
        }
        return {};
    }
};
__decorate([
    SubsonicRoute('/getLicense', () => SubsonicResponseLicense, {
        summary: 'Get License',
        description: 'Get details about the software license.',
        tags: ['System']
    }),
    __param(0, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubsonicSystemApi.prototype, "getLicense", null);
__decorate([
    SubsonicRoute('/ping', () => SubsonicOKResponse, {
        summary: 'Ping',
        description: 'Used to test connectivity with the server.',
        tags: ['System']
    }),
    __param(0, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubsonicSystemApi.prototype, "ping", null);
__decorate([
    SubsonicRoute('/getOpenSubsonicExtensions', () => SubsonicOpenSubsonicResponse, {
        summary: 'OpenSubsonic Extensions',
        description: 'List the OpenSubsonic extensions supported by this server.',
        tags: ['System']
    }),
    __param(0, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubsonicSystemApi.prototype, "getOpenSubsonicExtensions", null);
__decorate([
    SubsonicRoute('/jukeboxControl', () => SubsonicResponseJukeboxStatus, {
        summary: 'Jukebox Control',
        description: 'Controls the jukebox, i.e., playback directly on the server\'s audio hardware.',
        tags: ['System']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterJukebox, Object]),
    __metadata("design:returntype", Promise)
], SubsonicSystemApi.prototype, "jukeboxControl", null);
__decorate([
    SubsonicRoute('/getScanStatus', () => SubsonicResponseScanStatus, {
        summary: 'Scan Status',
        description: 'Returns the current status for media library scanning.',
        tags: ['System']
    }),
    __param(0, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubsonicSystemApi.prototype, "getScanStatus", null);
__decorate([
    SubsonicRoute('/startScan', () => SubsonicOKResponse, {
        summary: 'Start Status',
        description: 'Initiates a rescan of the media libraries. Takes no extra parameters.',
        tags: ['System']
    }),
    __param(0, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubsonicSystemApi.prototype, "startScan", null);
SubsonicSystemApi = __decorate([
    SubsonicController()
], SubsonicSystemApi);
export { SubsonicSystemApi };
//# sourceMappingURL=system.js.map