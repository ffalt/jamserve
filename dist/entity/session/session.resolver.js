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
import { Root as GQLRoot, Args, Ctx, FieldResolver, Query, Resolver } from 'type-graphql';
import { SessionPageQL, SessionQL } from './session.js';
import { JAMAPI_VERSION } from '../../modules/engine/rest/version.js';
import { SessionsArgs } from './session.args.js';
let SessionResolver = class SessionResolver {
    async version() {
        return JAMAPI_VERSION;
    }
    async session({ orm, user }) {
        return await orm.Session.oneOrFail({ where: { user: user.id } });
    }
    async sessions({ page, filter, order }, { orm, user }) {
        return await orm.Session.searchFilter(filter, order, page, user);
    }
    async expires(timestamp) {
        return new Date(timestamp);
    }
};
__decorate([
    Query(() => String, { description: 'Get the API Version' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SessionResolver.prototype, "version", null);
__decorate([
    Query(() => SessionQL, { description: 'Check the Login State' }),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionResolver.prototype, "session", null);
__decorate([
    Query(() => SessionPageQL, { description: 'Get a list of all sessions of the current user' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SessionsArgs, Object]),
    __metadata("design:returntype", Promise)
], SessionResolver.prototype, "sessions", null);
__decorate([
    FieldResolver(() => Date),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SessionResolver.prototype, "expires", null);
SessionResolver = __decorate([
    Resolver(SessionQL)
], SessionResolver);
export { SessionResolver };
//# sourceMappingURL=session.resolver.js.map