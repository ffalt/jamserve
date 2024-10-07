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
import { logger } from '../../../utils/logger.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { SubsonicOKResponse, SubsonicResponseScanStatus } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';
const log = logger('SubsonicApi');
let SubsonicLibraryApi = class SubsonicLibraryApi {
    async getScanStatus({ engine }) {
        return { scanStatus: { scanning: engine.io.scanning } };
    }
    async startScan({ engine, orm }) {
        engine.io.root.startUpRefresh(orm, true).catch(e => log.error(e));
        return {};
    }
};
__decorate([
    SubsonicRoute('/getScanStatus', () => SubsonicResponseScanStatus, {
        summary: 'Scan Status',
        description: 'Returns the current status for media library scanning.',
        tags: ['Admin']
    }),
    __param(0, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubsonicLibraryApi.prototype, "getScanStatus", null);
__decorate([
    SubsonicRoute('/startScan', () => SubsonicOKResponse, {
        summary: 'Start Status',
        description: 'Initiates a rescan of the media libraries. Takes no extra parameters.',
        tags: ['Admin']
    }),
    __param(0, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubsonicLibraryApi.prototype, "startScan", null);
SubsonicLibraryApi = __decorate([
    SubsonicController()
], SubsonicLibraryApi);
export { SubsonicLibraryApi };
//# sourceMappingURL=library.js.map