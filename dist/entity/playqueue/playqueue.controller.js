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
import { PlayQueue } from './playqueue.model.js';
import { UserRole } from '../../types/enums.js';
import { IncludesTrackParameters } from '../track/track.parameters.js';
import { IncludesPlayQueueParameters, PlayQueueSetParameters } from './playqueue.parameters.js';
import { IncludesEpisodeParameters } from '../episode/episode.parameters.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
let PlayQueueController = class PlayQueueController {
    async get(queueParameters, trackParameters, episodeParameters, { orm, engine, user }) {
        return engine.transform.playQueue(orm, await engine.playQueue.get(orm, user), queueParameters, trackParameters, episodeParameters, user);
    }
    async set(parameters, { req, engine, orm, user }) {
        await engine.playQueue.set(orm, parameters, user, req.session.client ?? 'unknown');
    }
    async clear({ orm, engine, user }) {
        await engine.playQueue.clear(orm, user);
    }
};
__decorate([
    Get('/get', () => PlayQueue, { description: 'Get a PlayQueue for the calling user', summary: 'Get PlayQueue' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [IncludesPlayQueueParameters,
        IncludesTrackParameters,
        IncludesEpisodeParameters, Object]),
    __metadata("design:returntype", Promise)
], PlayQueueController.prototype, "get", null);
__decorate([
    Post('/set', { description: 'Create/update the PlayQueue for the calling user', summary: 'Set PlayQueue' }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayQueueSetParameters, Object]),
    __metadata("design:returntype", Promise)
], PlayQueueController.prototype, "set", null);
__decorate([
    Post('/clear', { description: 'Clear the PlayQueue for the calling user', summary: 'Clear PlayQueue' }),
    __param(0, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlayQueueController.prototype, "clear", null);
PlayQueueController = __decorate([
    Controller('/playqueue', { tags: ['PlayQueue'], roles: [UserRole.stream] })
], PlayQueueController);
export { PlayQueueController };
//# sourceMappingURL=playqueue.controller.js.map