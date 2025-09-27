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
import { SubsonicRoute } from '../decorators/subsonic-route.js';
import { SubsonicParameters } from '../decorators/subsonic-parameters.js';
import { SubsonicParameterRate, SubsonicParameterScrobble, SubsonicParameterState } from '../model/subsonic-rest-parameters.js';
import { SubsonicOKResponse } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/subsonic-controller.js';
import { SubsonicContext } from '../decorators/subsonic-context.js';
import { SubsonicApiError, SubsonicFormatter } from '../formatter.js';
import { SubsonicHelper } from '../helper.js';
let SubsonicAnnotationApi = class SubsonicAnnotationApi {
    async star(query, { engine, orm, user }) {
        const ids = await SubsonicHelper.collectStateChangeIds(query);
        for (const id of ids) {
            await engine.state.fav(orm, id, false, user);
        }
        return {};
    }
    async unstar(query, { engine, orm, user }) {
        const ids = await SubsonicHelper.collectStateChangeIds(query);
        for (const id of ids) {
            await engine.state.fav(orm, id, true, user);
        }
        return {};
    }
    async setRating(query, { engine, orm, user }) {
        if ((query.rating < 0) || (query.rating > 5)) {
            return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.PARAM_INVALID));
        }
        await engine.state.rate(orm, query.id, query.rating, user);
        return {};
    }
    async scrobble(_query, _context) {
        return {};
    }
};
__decorate([
    SubsonicRoute('/star', () => SubsonicOKResponse, {
        summary: 'Star',
        description: 'Attaches a star to a song, album or artist.',
        tags: ['Annotation']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterState, Object]),
    __metadata("design:returntype", Promise)
], SubsonicAnnotationApi.prototype, "star", null);
__decorate([
    SubsonicRoute('/unstar', () => SubsonicOKResponse, { summary: 'Unstar', description: 'Removes the star from a song, album or artist.', tags: ['Annotation'] }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterState, Object]),
    __metadata("design:returntype", Promise)
], SubsonicAnnotationApi.prototype, "unstar", null);
__decorate([
    SubsonicRoute('/setRating', () => SubsonicOKResponse, { summary: 'Rate', description: 'Sets the rating for a music file.', tags: ['Annotation'] }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterRate, Object]),
    __metadata("design:returntype", Promise)
], SubsonicAnnotationApi.prototype, "setRating", null);
__decorate([
    SubsonicRoute('/scrobble', () => SubsonicOKResponse, { summary: 'Scrobble', description: 'Registers the local playback of one or more media files.', tags: ['Annotation'] }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterScrobble, Object]),
    __metadata("design:returntype", Promise)
], SubsonicAnnotationApi.prototype, "scrobble", null);
SubsonicAnnotationApi = __decorate([
    SubsonicController()
], SubsonicAnnotationApi);
export { SubsonicAnnotationApi };
//# sourceMappingURL=annotation.js.map