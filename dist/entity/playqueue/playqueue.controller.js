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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayQueueController = void 0;
const playqueue_model_1 = require("./playqueue.model");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const track_args_1 = require("../track/track.args");
const playqueue_args_1 = require("./playqueue.args");
const episode_args_1 = require("../episode/episode.args");
let PlayQueueController = class PlayQueueController {
    async get(playqueueArgs, trackArgs, episodeArgs, { orm, engine, user }) {
        return engine.transform.playQueue(orm, await engine.playQueue.get(orm, user), playqueueArgs, trackArgs, episodeArgs, user);
    }
    async set(args, { req, engine, orm, user }) {
        await engine.playQueue.set(orm, args, user, req.session?.client || 'unknown');
    }
    async clear({ orm, engine, user }) {
        await engine.playQueue.clear(orm, user);
    }
};
__decorate([
    rest_1.Get('/get', () => playqueue_model_1.PlayQueue, { description: 'Get a PlayQueue for the calling user', summary: 'Get PlayQueue' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [playqueue_args_1.IncludesPlayQueueArgs,
        track_args_1.IncludesTrackArgs,
        episode_args_1.IncludesEpisodeArgs, Object]),
    __metadata("design:returntype", Promise)
], PlayQueueController.prototype, "get", null);
__decorate([
    rest_1.Post('/set', { description: 'Create/update the PlayQueue for the calling user', summary: 'Set PlayQueue' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [playqueue_args_1.PlayQueueSetArgs, Object]),
    __metadata("design:returntype", Promise)
], PlayQueueController.prototype, "set", null);
__decorate([
    rest_1.Post('/clear', { description: 'Clear the PlayQueue for the calling user', summary: 'Clear PlayQueue' }),
    __param(0, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlayQueueController.prototype, "clear", null);
PlayQueueController = __decorate([
    rest_1.Controller('/playqueue', { tags: ['PlayQueue'], roles: [enums_1.UserRole.stream] })
], PlayQueueController);
exports.PlayQueueController = PlayQueueController;
//# sourceMappingURL=playqueue.controller.js.map