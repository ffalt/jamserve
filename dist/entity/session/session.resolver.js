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
exports.SessionResolver = void 0;
const type_graphql_1 = require("type-graphql");
const session_1 = require("./session");
const version_1 = require("../../modules/engine/rest/version");
const session_args_1 = require("./session.args");
const Root_1 = require("type-graphql/dist/decorators/Root");
let SessionResolver = class SessionResolver {
    async version() {
        return version_1.JAMAPI_VERSION;
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
    type_graphql_1.Query(() => String, { description: 'Get the API Version' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SessionResolver.prototype, "version", null);
__decorate([
    type_graphql_1.Query(() => session_1.SessionQL, { description: 'Check the Login State' }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionResolver.prototype, "session", null);
__decorate([
    type_graphql_1.Query(() => session_1.SessionPageQL, { description: 'Get a list of all sessions of the current user' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_args_1.SessionsArgs, Object]),
    __metadata("design:returntype", Promise)
], SessionResolver.prototype, "sessions", null);
__decorate([
    type_graphql_1.FieldResolver(() => Date),
    __param(0, Root_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SessionResolver.prototype, "expires", null);
SessionResolver = __decorate([
    type_graphql_1.Resolver(session_1.SessionQL)
], SessionResolver);
exports.SessionResolver = SessionResolver;
//# sourceMappingURL=session.resolver.js.map