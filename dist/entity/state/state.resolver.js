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
exports.StateResolver = void 0;
const type_graphql_1 = require("type-graphql");
const state_1 = require("./state");
const builder_1 = require("../../modules/rest/builder");
let StateResolver = class StateResolver {
    async state(id, { engine, user }) {
        const result = await engine.stateService.findInStateTypes(id);
        if (!result) {
            return Promise.reject(builder_1.NotFoundError());
        }
        return await engine.orm.State.findOrCreate(result.obj.id, result.objType, user.id);
    }
    async fav(id, remove, { engine, user }) {
        return await engine.stateService.fav(id, remove, user);
    }
    async rate(id, rating, { engine, user }) {
        return await engine.stateService.rate(id, rating, user);
    }
};
__decorate([
    type_graphql_1.Query(() => state_1.StateQL, { description: `Get User State (fav/rate/etc) for Base Objects` }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID, { description: 'Object Id' })),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StateResolver.prototype, "state", null);
__decorate([
    type_graphql_1.Mutation(() => state_1.StateQL),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)),
    __param(1, type_graphql_1.Arg('remove', () => Boolean, { nullable: true })),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], StateResolver.prototype, "fav", null);
__decorate([
    type_graphql_1.Mutation(() => state_1.StateQL),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)),
    __param(1, type_graphql_1.Arg('rating', () => type_graphql_1.Int)),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], StateResolver.prototype, "rate", null);
StateResolver = __decorate([
    type_graphql_1.Resolver(state_1.StateQL)
], StateResolver);
exports.StateResolver = StateResolver;
//# sourceMappingURL=state.resolver.js.map