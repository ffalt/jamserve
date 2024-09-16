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
var UserController_1;
import { User, UserPage } from './user.model.js';
import { BodyParam, BodyParams, Controller, Ctx, Get, InvalidParamError, Post, QueryParam, QueryParams, UnauthError, Upload, UploadFile } from '../../modules/rest/index.js';
import { UserRole } from '../../types/enums.js';
import { IncludesUserArgs, UserEmailUpdateArgs, UserFilterArgs, UserGenerateImageArgs, UserMutateArgs, UserOrderArgs, UserPasswordUpdateArgs } from './user.args.js';
import { randomString } from '../../utils/random.js';
import { PageArgs } from '../base/base.args.js';
let UserController = UserController_1 = class UserController {
    async id(id, userArgs, { orm, engine, user }) {
        return engine.transform.User.user(orm, await orm.User.oneOrFailByID(id), userArgs, user);
    }
    async search(page, userArgs, filter, order, { orm, engine, user }) {
        return await orm.User.searchTransformFilter(filter, [order], page, user, o => engine.transform.User.user(orm, o, userArgs, user));
    }
    async create(args, { orm, engine, user }) {
        await UserController_1.validatePassword(orm, engine, args.password, user);
        return engine.transform.User.user(orm, await engine.user.create(orm, args), {}, user);
    }
    async update(id, args, { orm, engine, user }) {
        await UserController_1.validatePassword(orm, engine, args.password, user);
        const u = id === user.id ? user : await orm.User.oneOrFailByID(id);
        if (user.id === id) {
            if (!args.roleAdmin) {
                throw InvalidParamError('roleAdmin', `You can't de-admin yourself`);
            }
            if (!args.roleStream) {
                throw InvalidParamError('roleStream', `You can't remove api access for yourself`);
            }
        }
        return engine.transform.User.user(orm, await engine.user.update(orm, u, args), {}, user);
    }
    async remove(id, { orm, engine, user }) {
        if (user.id === id) {
            throw InvalidParamError('id', `You can't remove yourself`);
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
        const u = await UserController_1.validateUserOrAdmin(orm, id, user);
        await engine.user.generateAvatar(u, args.seed || randomString(42));
    }
    async uploadUserImage(id, file, { orm, engine, user }) {
        const u = await UserController_1.validateUserOrAdmin(orm, id, user);
        return engine.user.setUserImage(u, file.name);
    }
    static async validatePassword(orm, engine, password, user) {
        const result = await engine.user.auth(orm, user.name, password);
        if (!result) {
            return Promise.reject(UnauthError());
        }
    }
    async checkUserAccess(orm, engine, userID, password, user) {
        await UserController_1.validatePassword(orm, engine, password, user);
        if (userID === user.id || user.roleAdmin) {
            return userID === user.id ? user : await orm.User.oneOrFailByID(userID);
        }
        return Promise.reject(UnauthError());
    }
    static async validateUserOrAdmin(orm, id, user) {
        if (id === user.id) {
            return user;
        }
        if (!user.roleAdmin) {
            throw UnauthError();
        }
        return await orm.User.oneOrFailByID(id);
    }
};
__decorate([
    Get('/id', () => User, { description: 'Get an User by Id', roles: [UserRole.admin], summary: 'Get User' }),
    __param(0, QueryParam('id', { description: 'User Id', isID: true })),
    __param(1, QueryParams()),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesUserArgs, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "id", null);
__decorate([
    Get('/search', () => UserPage, { description: 'Search Users', roles: [UserRole.admin] }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesUserArgs,
        UserFilterArgs,
        UserOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "search", null);
__decorate([
    Post('/create', () => User, { description: 'Create an User', roles: [UserRole.admin], summary: 'Create User' }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserMutateArgs, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    Post('/update', () => User, { description: 'Update an User', roles: [UserRole.admin], summary: 'Update User' }),
    __param(0, BodyParam('id', { description: 'User Id', isID: true })),
    __param(1, BodyParams()),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UserMutateArgs, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    Post('/remove', { description: 'Remove an User', roles: [UserRole.admin], summary: 'Remove User' }),
    __param(0, BodyParam('id', { description: 'User Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
__decorate([
    Post('/password/update', { description: 'Set an User Password', roles: [UserRole.stream], summary: 'Change Password' }),
    __param(0, BodyParam('id', { description: 'User Id', isID: true })),
    __param(1, BodyParams()),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UserPasswordUpdateArgs, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
__decorate([
    Post('/email/update', { description: 'Set an User Email Address', roles: [UserRole.stream], summary: 'Change Email' }),
    __param(0, BodyParam('id', { description: 'User Id', isID: true })),
    __param(1, BodyParams()),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UserEmailUpdateArgs, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeEmail", null);
__decorate([
    Post('/image/random', { description: 'Generate a random User Image', roles: [UserRole.stream], summary: 'Set Random Image' }),
    __param(0, BodyParam('id', { description: 'User Id', isID: true })),
    __param(1, BodyParams()),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UserGenerateImageArgs, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "generateUserImage", null);
__decorate([
    Post('/image/upload', { description: 'Upload an User Image', roles: [UserRole.stream], summary: 'Upload Image' }),
    __param(0, BodyParam('id', { description: 'User Id', isID: true })),
    __param(1, Upload('image')),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UploadFile, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadUserImage", null);
UserController = UserController_1 = __decorate([
    Controller('/user', { tags: ['User'] })
], UserController);
export { UserController };
//# sourceMappingURL=user.controller.js.map