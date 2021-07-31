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
import { Args, Ctx, Query, Resolver } from 'type-graphql';
import { StatsQL } from './stats';
import { StatsArgs } from './stats.args';
let StatsResolver = class StatsResolver {
    async stats(args, { engine, orm }) {
        return await engine.stats.getStats(orm, args?.rootID);
    }
};
__decorate([
    Query(() => StatsQL),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [StatsArgs, Object]),
    __metadata("design:returntype", Promise)
], StatsResolver.prototype, "stats", null);
StatsResolver = __decorate([
    Resolver(StatsQL)
], StatsResolver);
export { StatsResolver };
//# sourceMappingURL=stats.resolver.js.map