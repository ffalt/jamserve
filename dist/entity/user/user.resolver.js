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
exports.UserResolver = void 0;
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const user_1 = require("./user");
const user_service_1 = require("./user.service");
const user_args_1 = require("./user.args");
const session_1 = require("../session/session");
const bookmark_1 = require("../bookmark/bookmark");
let UserResolver = class UserResolver {
    async user(id, { orm }) {
        return await orm.User.oneOrFailByID(id);
    }
    async users({ page, filter, order }, { orm, user }) {
        return await orm.User.searchFilter(filter, order, page, user);
    }
    async userIndex({ filter }, { orm, user }) {
        return await orm.User.indexFilter(filter, user);
    }
    roles(user) {
        return user_service_1.UserService.listfyRoles(user);
    }
    async sessions(user, { orm }) {
        return user.sessions.getItems();
    }
    async bookmarks(user, { orm }) {
        return user.bookmarks.getItems();
    }
};
__decorate([
    type_graphql_1.Authorized(enums_1.UserRole.admin),
    type_graphql_1.Query(() => user_1.UserQL),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "user", null);
__decorate([
    type_graphql_1.Authorized(enums_1.UserRole.admin),
    type_graphql_1.Query(() => user_1.UserPageQL),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_args_1.UsersArgs, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    type_graphql_1.Authorized(enums_1.UserRole.admin),
    type_graphql_1.Query(() => user_1.UserIndexQL),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_args_1.UserIndexArgs, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "userIndex", null);
__decorate([
    type_graphql_1.FieldResolver(() => [enums_1.UserRole]),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User]),
    __metadata("design:returntype", Array)
], UserResolver.prototype, "roles", null);
__decorate([
    type_graphql_1.FieldResolver(() => [session_1.SessionQL]),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "sessions", null);
__decorate([
    type_graphql_1.FieldResolver(() => [bookmark_1.BookmarkQL]),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "bookmarks", null);
UserResolver = __decorate([
    type_graphql_1.Resolver(user_1.UserQL)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.resolver.js.map