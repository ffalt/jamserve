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
exports.UserController = void 0;
const user_model_1 = require("./user.model");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const user_args_1 = require("./user.args");
const random_1 = require("../../utils/random");
const base_args_1 = require("../base/base.args");
let UserController = class UserController {
    async id(id, userArgs, { orm, engine, user }) {
        return engine.transform.user(orm, await orm.User.oneOrFailByID(id), userArgs, user);
    }
    async search(page, userArgs, filter, order, { orm, engine, user }) {
        return await orm.User.searchTransformFilter(filter, [order], page, user, o => engine.transform.user(orm, o, userArgs, user));
    }
    async create(args, { orm, engine, user }) {
        await this.validatePassword(orm, engine, args.password, user);
        return engine.transform.user(orm, await engine.user.create(orm, args), {}, user);
    }
    async update(id, args, { orm, engine, user }) {
        await this.validatePassword(orm, engine, args.password, user);
        const u = id === user.id ? user : await orm.User.oneOrFailByID(id);
        if (user.id === id) {
            if (!args.roleAdmin) {
                throw rest_1.InvalidParamError('roleAdmin', `You can't de-admin yourself`);
            }
            if (!args.roleStream) {
                throw rest_1.InvalidParamError('roleStream', `You can't remove api access for yourself`);
            }
        }
        return engine.transform.user(orm, await engine.user.update(orm, u, args), {}, user);
    }
    async remove(id, { orm, engine, user }) {
        if (user.id === id) {
            throw rest_1.InvalidParamError('id', `You can't remove yourself`);
        }
        const u = await orm.User.oneOrFailByID(id);
        await engine.user.remove(orm, u);
    }
    async changePassword(id, args, { orm, engine, user }) {
        const u = await this.checkUserAccess(orm, engine, id, args.password, user);
        return engine.user.setUserPassword(orm, u, args.newPassword);
    }
    async changeEmail(id, args, { orm, engine, user }) {
        const u = await this.checkUserAccess(orm, engine, id, args.password, user);
        return engine.user.setUserEmail(orm, u, args.email);
    }
    async generateUserImage(id, args, { orm, engine, user }) {
        const u = await this.validateUserOrAdmin(orm, id, user);
        await engine.user.generateAvatar(u, args.seed || random_1.randomString(42));
    }
    async uploadUserImage(id, file, { orm, engine, user }) {
        const u = await this.validateUserOrAdmin(orm, id, user);
        return engine.user.setUserImage(u, file.name);
    }
    async validatePassword(orm, engine, password, user) {
        const result = await engine.user.auth(orm, user.name, password);
        if (!result) {
            return Promise.reject(rest_1.UnauthError());
        }
    }
    async checkUserAccess(orm, engine, userID, password, user) {
        await this.validatePassword(orm, engine, password, user);
        if (userID === user.id || user.roleAdmin) {
            return userID === user.id ? user : await orm.User.oneOrFailByID(userID);
        }
        return Promise.reject(rest_1.UnauthError());
    }
    async validateUserOrAdmin(orm, id, user) {
        if (id === user.id) {
            return user;
        }
        if (!user.roleAdmin) {
            throw rest_1.UnauthError();
        }
        return await orm.User.oneOrFailByID(id);
    }
};
__decorate([
    rest_1.Get('/id', () => user_model_1.User, { description: 'Get an User by Id', roles: [enums_1.UserRole.admin], summary: 'Get User' }),
    __param(0, rest_1.QueryParam('id', { description: 'User Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_args_1.IncludesUserArgs, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "id", null);
__decorate([
    rest_1.Get('/search', () => user_model_1.UserPage, { description: 'Search Users', roles: [enums_1.UserRole.admin] }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        user_args_1.IncludesUserArgs,
        user_args_1.UserFilterArgs,
        user_args_1.UserOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "search", null);
__decorate([
    rest_1.Post('/create', () => user_model_1.User, { description: 'Create an User', roles: [enums_1.UserRole.admin], summary: 'Create User' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_args_1.UserMutateArgs, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    rest_1.Post('/update', () => user_model_1.User, { description: 'Update an User', roles: [enums_1.UserRole.admin], summary: 'Update User' }),
    __param(0, rest_1.BodyParam('id', { description: 'User Id', isID: true })),
    __param(1, rest_1.BodyParams()),
    __param(2, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_args_1.UserMutateArgs, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    rest_1.Post('/remove', { description: 'Remove an User', roles: [enums_1.UserRole.admin], summary: 'Remove User' }),
    __param(0, rest_1.BodyParam('id', { description: 'User Id', isID: true })),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
__decorate([
    rest_1.Post('/password/update', { description: 'Set an User Password', roles: [enums_1.UserRole.stream], summary: 'Change Password' }),
    __param(0, rest_1.BodyParam('id', { description: 'User Id', isID: true })),
    __param(1, rest_1.BodyParams()),
    __param(2, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_args_1.UserPasswordUpdateArgs, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
__decorate([
    rest_1.Post('/email/update', { description: 'Set an User Email Address', roles: [enums_1.UserRole.stream], summary: 'Change Email' }),
    __param(0, rest_1.BodyParam('id', { description: 'User Id', isID: true })),
    __param(1, rest_1.BodyParams()),
    __param(2, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_args_1.UserEmailUpdateArgs, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeEmail", null);
__decorate([
    rest_1.Post('/image/random', { description: 'Generate a random User Image', roles: [enums_1.UserRole.stream], summary: 'Set Random Image' }),
    __param(0, rest_1.BodyParam('id', { description: 'User Id', isID: true })),
    __param(1, rest_1.BodyParams()),
    __param(2, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_args_1.UserGenerateImageArgs, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "generateUserImage", null);
__decorate([
    rest_1.Post('/image/upload', { description: 'Upload an User Image', roles: [enums_1.UserRole.stream], summary: 'Upload Image' }),
    __param(0, rest_1.BodyParam('id', { description: 'User Id', isID: true })),
    __param(1, rest_1.Upload('image')),
    __param(2, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, rest_1.UploadFile, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadUserImage", null);
UserController = __decorate([
    rest_1.Controller('/user', { tags: ['User'] })
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map