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
import { SubsonicRoute } from '../decorators/subsonic-route.js';
import { SubsonicParameters } from '../decorators/subsonic-parameters.js';
import { SubsonicParameterChangePassword, SubsonicParameterUpdateUser, SubsonicParameterUsername } from '../model/subsonic-rest-parameters.js';
import { SubsonicOKResponse, SubsonicResponseUser, SubsonicResponseUsers } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/subsonic-controller.js';
import { SubsonicContext } from '../decorators/subsonic-context.js';
import { SubsonicApiError, SubsonicFormatter } from '../formatter.js';
let SubsonicUserApi = class SubsonicUserApi {
    async getUser(query, { orm, user }) {
        if ((!query.username) || (user.name === query.username)) {
            return { user: SubsonicFormatter.packUser(user) };
        }
        if (!user.roleAdmin) {
            return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.UNAUTH));
        }
        const u = await orm.User.findOne({ where: { name: query.username } });
        if (!u) {
            return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NOT_FOUND));
        }
        return { user: SubsonicFormatter.packUser(u) };
    }
    async getUsers({ orm, user }) {
        if (!user.roleAdmin) {
            return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.UNAUTH));
        }
        const users = await orm.User.all();
        return { users: { user: users.map(element => SubsonicFormatter.packUser(element)) } };
    }
    async createUser(_query, _context) {
        return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NO_USER_MANAGEMENT));
    }
    async changePassword(_query, _context) {
        return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NO_USER_MANAGEMENT));
    }
    async updateUser(_query, _context) {
        return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NO_USER_MANAGEMENT));
    }
    async deleteUser(_query, _context) {
        return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NO_USER_MANAGEMENT));
    }
};
__decorate([
    SubsonicRoute('/getUser', () => SubsonicResponseUser, {
        summary: 'Get User',
        description: 'Get details about a given user, including which authorization roles it has.',
        tags: ['Users']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterUsername, Object]),
    __metadata("design:returntype", Promise)
], SubsonicUserApi.prototype, "getUser", null);
__decorate([
    SubsonicRoute('/getUsers', () => SubsonicResponseUsers, {
        summary: 'Get Users',
        description: 'Get details about all users, including which authorization roles they have.',
        tags: ['Users']
    }),
    __param(0, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubsonicUserApi.prototype, "getUsers", null);
__decorate([
    SubsonicRoute('/createUser', () => SubsonicOKResponse, {
        summary: 'Create User',
        description: 'Creates a new Subsonic user',
        tags: ['Users']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterUpdateUser, Object]),
    __metadata("design:returntype", Promise)
], SubsonicUserApi.prototype, "createUser", null);
__decorate([
    SubsonicRoute('/changePassword', () => SubsonicOKResponse, {
        summary: 'Change Password',
        description: 'Changes the password of an existing Subsonic user. You can only change your own password unless you have admin privileges.',
        tags: ['Users']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterChangePassword, Object]),
    __metadata("design:returntype", Promise)
], SubsonicUserApi.prototype, "changePassword", null);
__decorate([
    SubsonicRoute('/updateUser', () => SubsonicOKResponse, {
        summary: 'Update User',
        description: 'Modifies an existing Subsonic user',
        tags: ['Users']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterUpdateUser, Object]),
    __metadata("design:returntype", Promise)
], SubsonicUserApi.prototype, "updateUser", null);
__decorate([
    SubsonicRoute('/deleteUser', () => SubsonicOKResponse, {
        summary: 'Delete User',
        description: 'Deletes an existing Subsonic user',
        tags: ['Users']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterUsername, Object]),
    __metadata("design:returntype", Promise)
], SubsonicUserApi.prototype, "deleteUser", null);
SubsonicUserApi = __decorate([
    SubsonicController()
], SubsonicUserApi);
export { SubsonicUserApi };
//# sourceMappingURL=user.js.map