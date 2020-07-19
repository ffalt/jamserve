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
exports.StatsResolver = void 0;
const type_graphql_1 = require("type-graphql");
const stats_1 = require("./stats");
const stats_args_1 = require("./stats.args");
let StatsResolver = class StatsResolver {
    async stats(args, { engine }) {
        return await engine.statsService.getStats(args === null || args === void 0 ? void 0 : args.rootID);
    }
};
__decorate([
    type_graphql_1.Query(() => stats_1.StatsQL),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [stats_args_1.StatsArgs, Object]),
    __metadata("design:returntype", Promise)
], StatsResolver.prototype, "stats", null);
StatsResolver = __decorate([
    type_graphql_1.Resolver(stats_1.StatsQL)
], StatsResolver);
exports.StatsResolver = StatsResolver;
//# sourceMappingURL=stats.resolver.js.map