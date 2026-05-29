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
import { Args, Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { LandscapeData } from './landscape.model.js';
import { LandscapeParametersQL } from './landscape.parameters.js';
import { UserRole } from '../../types/enums.js';
let LandscapeResolver = class LandscapeResolver {
    async landscape(parameters, { engine, orm }) {
        return engine.landscape.getLandscape(orm, parameters);
    }
};
__decorate([
    Authorized(UserRole.stream),
    Query(() => LandscapeData, { description: 'Get Music Collection Landscape Data for visualization' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LandscapeParametersQL, Object]),
    __metadata("design:returntype", Promise)
], LandscapeResolver.prototype, "landscape", null);
LandscapeResolver = __decorate([
    Resolver(LandscapeData)
], LandscapeResolver);
export { LandscapeResolver };
//# sourceMappingURL=landscape.resolver.js.map