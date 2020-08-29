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
exports.StatsController = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const stats_model_1 = require("./stats.model");
const stats_filter_1 = require("./stats.filter");
const enums_1 = require("../../types/enums");
let StatsController = class StatsController {
    async get(filter, { orm, engine }) {
        return await engine.stats.getStats(orm, filter === null || filter === void 0 ? void 0 : filter.rootID);
    }
};
__decorate([
    decorators_1.Get(() => stats_model_1.Stats, { description: 'Get count Stats for Folders/Tracks/Albums/...', summary: 'Get Stats' }),
    __param(0, decorators_1.QueryParams()),
    __param(1, decorators_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [stats_filter_1.StatsFilter, Object]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "get", null);
StatsController = __decorate([
    decorators_1.Controller('/stats', { tags: ['Various'], roles: [enums_1.UserRole.stream] })
], StatsController);
exports.StatsController = StatsController;
//# sourceMappingURL=stats.controller.js.map