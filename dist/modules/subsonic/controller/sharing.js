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
import { SubsonicParameterID, SubsonicParameterShare } from '../model/subsonic-rest-parameters.js';
import { SubsonicRoute } from '../decorators/subsonic-route.js';
import { SubsonicParameters } from '../decorators/subsonic-parameters.js';
import { SubsonicOKResponse, SubsonicResponseShares } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/subsonic-controller.js';
import { SubsonicContext } from '../decorators/subsonic-context.js';
import { SubsonicApiError, SubsonicFormatter } from '../formatter.js';
let SubsonicSharingApi = class SubsonicSharingApi {
    async getShares(_context) {
        return { shares: {} };
    }
    async createShare(_query, _context) {
        return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NO_SHARING));
    }
    async updateShare(_query, _context) {
        return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NO_SHARING));
    }
    async deleteShare(_query, _context) {
        return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NO_SHARING));
    }
};
__decorate([
    SubsonicRoute('/getShares', () => SubsonicResponseShares, {
        summary: 'Get Shares',
        description: 'Returns information about shared media this user is allowed to manage.',
        tags: ['Sharing']
    }),
    __param(0, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubsonicSharingApi.prototype, "getShares", null);
__decorate([
    SubsonicRoute('/createShare', () => SubsonicOKResponse, {
        summary: 'Create Share',
        description: 'Creates a public URL that can be used by anyone to stream music or video from the Subsonic server.',
        tags: ['Sharing']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterShare, Object]),
    __metadata("design:returntype", Promise)
], SubsonicSharingApi.prototype, "createShare", null);
__decorate([
    SubsonicRoute('/updateShare', () => SubsonicOKResponse, {
        summary: 'Update Share',
        description: 'Updates the description and/or expiration date for an existing share.',
        tags: ['Sharing']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterShare, Object]),
    __metadata("design:returntype", Promise)
], SubsonicSharingApi.prototype, "updateShare", null);
__decorate([
    SubsonicRoute('/deleteShare', () => SubsonicOKResponse, {
        summary: 'Delete Share',
        description: 'Deletes an existing share.',
        tags: ['Sharing']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterID, Object]),
    __metadata("design:returntype", Promise)
], SubsonicSharingApi.prototype, "deleteShare", null);
SubsonicSharingApi = __decorate([
    SubsonicController()
], SubsonicSharingApi);
export { SubsonicSharingApi };
//# sourceMappingURL=sharing.js.map