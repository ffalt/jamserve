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
import { Stats, UserStats } from './stats.model.js';
import { StatsFilter } from './stats.filter.js';
import { UserRole } from '../../types/enums.js';
import { Controller } from '../../modules/rest/decorators/Controller.js';
import { Get } from '../../modules/rest/decorators/Get.js';
import { QueryParams } from '../../modules/rest/decorators/QueryParams.js';
import { Ctx } from '../../modules/rest/decorators/Ctx.js';
let StatsController = class StatsController {
    async get(filter, { orm, engine }) {
        return await engine.stats.getStats(orm, filter?.rootID);
    }
    async user({ orm, engine, user }) {
        return engine.stats.getUserStats(orm, user);
    }
};
__decorate([
    Get(() => Stats, { description: 'Get count stats for Folders/Tracks/Albums/...', summary: 'Get Stats' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [StatsFilter, Object]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "get", null);
__decorate([
    Get('/user', () => UserStats, { description: 'Get count stats for the calling User: Playlists/Favorites/Played', summary: 'Get User Stats' }),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "user", null);
StatsController = __decorate([
    Controller('/stats', { tags: ['Various'], roles: [UserRole.stream] })
], StatsController);
export { StatsController };
//# sourceMappingURL=stats.controller.js.map