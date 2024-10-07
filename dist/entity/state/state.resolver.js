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
import { Arg, Ctx, ID, Int, Mutation, Query, Resolver } from 'type-graphql';
import { StateQL } from './state.js';
import { NotFoundError } from '../../modules/deco/express/express-error.js';
let StateResolver = class StateResolver {
    async state(id, { orm, user }) {
        const result = await orm.findInStateTypes(id);
        if (!result) {
            return Promise.reject(NotFoundError());
        }
        return await orm.State.findOrCreate(result.obj.id, result.objType, user.id);
    }
    async fav(id, remove, { engine, orm, user }) {
        return await engine.state.fav(orm, id, remove, user);
    }
    async rate(id, rating, { engine, orm, user }) {
        return await engine.state.rate(orm, id, rating, user);
    }
};
__decorate([
    Query(() => StateQL, { description: `Get User State (fav/rate/etc) for Base Objects` }),
    __param(0, Arg('id', () => ID, { description: 'Object Id' })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StateResolver.prototype, "state", null);
__decorate([
    Mutation(() => StateQL),
    __param(0, Arg('id', () => ID)),
    __param(1, Arg('remove', () => Boolean, { nullable: true })),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], StateResolver.prototype, "fav", null);
__decorate([
    Mutation(() => StateQL),
    __param(0, Arg('id', () => ID)),
    __param(1, Arg('rating', () => Int)),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], StateResolver.prototype, "rate", null);
StateResolver = __decorate([
    Resolver(StateQL)
], StateResolver);
export { StateResolver };
//# sourceMappingURL=state.resolver.js.map