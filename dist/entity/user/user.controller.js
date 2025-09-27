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
import { SubsonicToken, User, UserPage } from './user.model.js';
import { UserRole } from '../../types/enums.js';
import { IncludesUserParameters, UserEmailUpdateParameters, UserFilterParameters, UserGenerateImageParameters, UserSubsonicTokenGenerateParameters, UserMutateParameters, UserOrderParameters, UserPasswordUpdateParameters } from './user.parameters.js';
import { randomString } from '../../utils/random.js';
import { PageParameters } from '../base/base.parameters.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';
import { invalidParameterError, notFoundError, unauthError } from '../../modules/deco/express/express-error.js';
import { UploadFile } from '../../modules/deco/definitions/upload-file.js';
import { Upload } from '../../modules/rest/decorators/upload.js';
let UserController = UserController_1 = class UserController {
    async id(id, parameters, { orm, engine, user }) {
        return engine.transform.User.user(orm, await orm.User.oneOrFailByID(id), parameters, user);
    }
    async search(page, parameters, filter, order, { orm, engine, user }) {
        return await orm.User.searchTransformFilter(filter, [order], page, user, o => engine.transform.User.user(orm, o, parameters, user));
    }
    async create(parameters, { orm, engine, user }) {
        await UserController_1.validatePassword(orm, engine, parameters.password, user);
        return engine.transform.User.user(orm, await engine.user.create(orm, parameters), {}, user);
    }
    async update(id, parameters, { orm, engine, user }) {
        await UserController_1.validatePassword(orm, engine, parameters.password, user);
        const u = id === user.id ? user : await orm.User.oneOrFailByID(id);
        if (user.id === id) {
            if (!parameters.roleAdmin) {
                throw invalidParameterError('roleAdmin', `You can't de-admin yourself`);
            }
            if (!parameters.roleStream) {
                throw invalidParameterError('roleStream', `You can't remove api access for yourself`);
            }
        }
        return engine.transform.User.user(orm, await engine.user.update(orm, u, parameters), {}, user);
    }
    async remove(id, { orm, engine, user }) {
        if (user.id === id) {
            throw invalidParameterError('id', `You can't remove yourself`);
        }
        const u = await orm.User.oneOrFailByID(id);
        await engine.user.remove(orm, u);
    }
    async changePassword(id, parameters, { orm, engine, user }) {
        const u = await this.checkUserAccess(orm, engine, id, parameters.password, user);
        return engine.user.setUserPassword(orm, u, parameters.newPassword);
    }
    async changeEmail(id, parameters, { orm, engine, user }) {
        const u = await this.checkUserAccess(orm, engine, id, parameters.password, user);
        return engine.user.setUserEmail(orm, u, parameters.email);
    }
    async generateUserImage(id, parameters, { orm, engine, user }) {
        const u = await UserController_1.validateUserOrAdmin(orm, id, user);
        await engine.user.generateAvatar(u, parameters.seed ?? randomString(42));
    }
    async uploadUserImage(id, file, { orm, engine, user }) {
        const u = await UserController_1.validateUserOrAdmin(orm, id, user);
        return engine.user.setUserImage(u, file.name);
    }
    async generateSubsonicToken(id, parameters, { orm, engine, user }) {
        const u = await this.checkUserAccess(orm, engine, id, parameters.password, user);
        const session = await engine.session.createSubsonic(u.id);
        if (!session) {
            return Promise.reject(notFoundError());
        }
        return { token: session.jwth };
    }
    static async validatePassword(orm, engine, password, user) {
        const result = await engine.user.auth(orm, user.name, password);
        if (!result) {
            return Promise.reject(unauthError());
        }
    }
    async checkUserAccess(orm, engine, userID, password, user) {
        await UserController_1.validatePassword(orm, engine, password, user);
        if (userID === user.id || user.roleAdmin) {
            return userID === user.id ? user : await orm.User.oneOrFailByID(userID);
        }
        return Promise.reject(unauthError());
    }
    static async validateUserOrAdmin(orm, id, user) {
        if (id === user.id) {
            return user;
        }
        if (!user.roleAdmin) {
            throw unauthError();
        }
        return await orm.User.oneOrFailByID(id);
    }
};
__decorate([
    Get('/id', () => User, { description: 'Get an User by Id', roles: [UserRole.admin], summary: 'Get User' }),
    __param(0, QueryParameter('id', { description: 'User Id', isID: true })),
    __param(1, QueryParameters()),
    __param(2, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesUserParameters, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "id", null);
__decorate([
    Get('/search', () => UserPage, { description: 'Search Users', roles: [UserRole.admin] }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesUserParameters,
        UserFilterParameters,
        UserOrderParameters, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "search", null);
__decorate([
    Post('/create', () => User, { description: 'Create an User', roles: [UserRole.admin], summary: 'Create User' }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserMutateParameters, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    Post('/update', () => User, { description: 'Update an User', roles: [UserRole.admin], summary: 'Update User' }),
    __param(0, BodyParameter('id', { description: 'User Id', isID: true })),
    __param(1, BodyParameters()),
    __param(2, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UserMutateParameters, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    Post('/remove', { description: 'Remove an User', roles: [UserRole.admin], summary: 'Remove User' }),
    __param(0, BodyParameter('id', { description: 'User Id', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
__decorate([
    Post('/password/update', { description: 'Set an User Password', roles: [UserRole.stream], summary: 'Change Password' }),
    __param(0, BodyParameter('id', { description: 'User Id', isID: true })),
    __param(1, BodyParameters()),
    __param(2, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UserPasswordUpdateParameters, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
__decorate([
    Post('/email/update', { description: 'Set an User Email Address', roles: [UserRole.stream], summary: 'Change Email' }),
    __param(0, BodyParameter('id', { description: 'User Id', isID: true })),
    __param(1, BodyParameters()),
    __param(2, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UserEmailUpdateParameters, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeEmail", null);
__decorate([
    Post('/image/random', { description: 'Generate a random User Image', roles: [UserRole.stream], summary: 'Set Random Image' }),
    __param(0, BodyParameter('id', { description: 'User Id', isID: true })),
    __param(1, BodyParameters()),
    __param(2, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UserGenerateImageParameters, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "generateUserImage", null);
__decorate([
    Post('/image/upload', { description: 'Upload an User Image', roles: [UserRole.stream], summary: 'Upload Image' }),
    __param(0, BodyParameter('id', { description: 'User Id', isID: true })),
    __param(1, Upload('image')),
    __param(2, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UploadFile, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadUserImage", null);
__decorate([
    Post('/subsonic/generate', () => SubsonicToken, { description: 'Generate a subsonic client token', roles: [UserRole.stream], summary: 'Subsonic Token' }),
    __param(0, BodyParameter('id', { description: 'User Id', isID: true })),
    __param(1, BodyParameters()),
    __param(2, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UserSubsonicTokenGenerateParameters, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "generateSubsonicToken", null);
UserController = UserController_1 = __decorate([
    Controller('/user', { tags: ['User'] })
], UserController);
export { UserController };
//# sourceMappingURL=user.controller.js.map