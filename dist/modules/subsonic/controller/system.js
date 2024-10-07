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
import { SubsonicParameterJukebox } from '../model/subsonic-rest-params.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { SubsonicOKResponse, SubsonicOpenSubsonicResponse, SubsonicResponseJukeboxStatus, SubsonicResponseLicense } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';
let SubsonicSystemApi = class SubsonicSystemApi {
    async getLicense(_ctx) {
        return { license: { valid: true, email: 'example@@example.com' } };
    }
    async ping(_ctx) {
        return {};
    }
    async getOpenSubsonicExtensions(_ctx) {
        return {
            openSubsonicExtensions: [
                { name: 'songLyrics', versions: [1] },
                { name: 'formPost', versions: [1] }
            ]
        };
    }
    async jukeboxControl(_query, _ctx) {
        return { jukeboxStatus: { currentIndex: 0, playing: false, gain: 0 } };
    }
};
__decorate([
    SubsonicRoute('/getLicense', () => SubsonicResponseLicense, {
        summary: 'Get License',
        description: 'Get details about the software license.',
        tags: ['System']
    }),
    __param(0, SubsonicCtx()),
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
    __param(0, SubsonicCtx()),
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
    __param(0, SubsonicCtx()),
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
    __param(0, SubsonicParams()),
    __param(1, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterJukebox, Object]),
    __metadata("design:returntype", Promise)
], SubsonicSystemApi.prototype, "jukeboxControl", null);
SubsonicSystemApi = __decorate([
    SubsonicController()
], SubsonicSystemApi);
export { SubsonicSystemApi };
//# sourceMappingURL=system.js.map