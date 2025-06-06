var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { bcryptComparePassword, bcryptPassword } from '../../utils/bcrypt.js';
import { SessionMode, UserRole } from '../../types/enums.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import path from 'path';
import fse from 'fs-extra';
import { ConfigService } from '../../modules/engine/services/config.service.js';
import { fileDeleteIfExists } from '../../utils/fs-utils.js';
import { ImageModule } from '../../modules/image/image.module.js';
import commonPassword from 'common-password-checker';
import { randomString } from '../../utils/random.js';
import { InvalidParamError, UnauthError } from '../../modules/deco/express/express-error.js';
import { hashMD5 } from '../../utils/md5.js';
import { SubsonicFormatter } from '../../modules/subsonic/formatter.js';
let UserService = class UserService {
    constructor() {
        this.userAvatarPath = this.configService.getDataPath(['images']);
    }
    async findByName(orm, name) {
        if (!name || name.trim().length === 0) {
            return Promise.reject(UnauthError('Invalid Username'));
        }
        return await orm.User.findOne({ where: { name } });
    }
    async findByID(orm, id) {
        const user = await orm.User.findOneByID(id);
        return user || undefined;
    }
    async auth(orm, name, pass) {
        if ((!pass) || (!pass.length)) {
            return Promise.reject(InvalidParamError('password', 'Invalid Password'));
        }
        const user = await this.findByName(orm, name);
        if (!user) {
            return Promise.reject(InvalidParamError('username', 'Invalid Username'));
        }
        if (!(await bcryptComparePassword(pass, user.hash))) {
            return Promise.reject(InvalidParamError('password', 'Invalid Password'));
        }
        return user;
    }
    async authJWT(orm, jwtPayload) {
        if (!jwtPayload?.id) {
            return Promise.reject(InvalidParamError('token', 'Invalid token'));
        }
        return await orm.User.findOneByID(jwtPayload.id);
    }
    static listfyRoles(user) {
        const result = [];
        if (user.roleAdmin) {
            result.push(UserRole.admin);
        }
        if (user.roleStream) {
            result.push(UserRole.stream);
        }
        if (user.rolePodcast) {
            result.push(UserRole.podcast);
        }
        if (user.roleUpload) {
            result.push(UserRole.upload);
        }
        return result;
    }
    avatarImageFilename(user) {
        return path.join(this.userAvatarPath, `avatar-${user.id}.png`);
    }
    async getImage(orm, user, size, format) {
        const filename = this.avatarImageFilename(user);
        let exists = await fse.pathExists(filename);
        if (!exists) {
            await this.generateAvatar(user);
            exists = await fse.pathExists(filename);
        }
        if (exists) {
            return this.imageModule.get(user.id, filename, size, format);
        }
        return;
    }
    async generateAvatar(user, seed) {
        const filename = this.avatarImageFilename(user);
        await fileDeleteIfExists(filename);
        await this.imageModule.generateAvatar(seed || user.name, filename);
        await this.imageModule.clearImageCacheByIDs([user.id]);
    }
    async setUserImage(user, filename) {
        const destName = this.avatarImageFilename(user);
        await this.imageModule.createAvatar(filename, destName);
        await fileDeleteIfExists(filename);
        await this.imageModule.clearImageCacheByIDs([user.id]);
    }
    async validatePassword(password) {
        if ((!password) || (!password.trim().length)) {
            return Promise.reject(InvalidParamError('Invalid Password'));
        }
        if (password.length < 4) {
            return Promise.reject(InvalidParamError('Password is too short'));
        }
        if (commonPassword(password)) {
            return Promise.reject(Error('Your password is found in the most frequently used password list and too easy to guess'));
        }
    }
    async setUserPassword(orm, user, pass) {
        await this.validatePassword(pass);
        user.hash = await bcryptPassword(pass);
        await orm.User.persistAndFlush(user);
    }
    async setUserEmail(orm, user, email) {
        if ((!email) || (!email.trim().length)) {
            return Promise.reject(InvalidParamError('email', 'Invalid Email'));
        }
        user.email = email;
        await orm.User.persistAndFlush(user);
    }
    async remove(orm, user) {
        await orm.User.removeAndFlush(user);
        await this.imageModule.clearImageCacheByIDs([user.id]);
        await fileDeleteIfExists(this.avatarImageFilename(user));
    }
    async createUser(orm, name, email, pass, roleAdmin, roleStream, roleUpload, rolePodcast) {
        const hashAndSalt = await bcryptPassword(pass);
        const user = orm.User.create({ name, hash: hashAndSalt, email, roleAdmin, roleStream, roleUpload, rolePodcast });
        await orm.User.persistAndFlush(user);
        return user;
    }
    async create(orm, args) {
        if (!args.name || args.name.trim().length === 0) {
            return Promise.reject(InvalidParamError('name', 'Invalid Username'));
        }
        const existingUser = await orm.User.findOne({ where: { name: args.name } });
        if (existingUser) {
            return Promise.reject(InvalidParamError('name', 'Username already exists'));
        }
        const pass = randomString(32);
        return await this.createUser(orm, args.name, args.email || '', pass, !!args.roleAdmin, !!args.roleStream, !!args.roleUpload, !!args.rolePodcast);
    }
    async update(orm, user, args) {
        if (!args.name || args.name.trim().length === 0) {
            return Promise.reject(InvalidParamError('name', 'Invalid Username'));
        }
        const existingUser = await orm.User.findOne({ where: { name: args.name } });
        if (existingUser && existingUser.id !== user.id) {
            return Promise.reject(InvalidParamError('name', 'Username already exists'));
        }
        user.name = args.name;
        user.email = args.email || user.email;
        user.roleAdmin = !!args.roleAdmin;
        user.rolePodcast = !!args.rolePodcast;
        user.roleStream = !!args.roleStream;
        user.roleUpload = !!args.roleUpload;
        await orm.User.persistAndFlush(user);
        return user;
    }
    async authSubsonicPassword(orm, name, pass) {
        if ((!pass) || (!pass.length)) {
            return Promise.reject(SubsonicFormatter.ERRORS.PARAM_MISSING);
        }
        const user = await orm.User.findOne({ where: { name } });
        if (!user) {
            return Promise.reject(SubsonicFormatter.ERRORS.LOGIN_FAILED);
        }
        const session = await orm.Session.findOne({ where: { user: user.id, mode: SessionMode.subsonic } });
        if (!session) {
            return Promise.reject(SubsonicFormatter.ERRORS.LOGIN_FAILED);
        }
        if (pass !== session.jwth) {
            return Promise.reject(SubsonicFormatter.ERRORS.LOGIN_FAILED);
        }
        return user;
    }
    async authSubsonicToken(orm, name, token, salt) {
        if (!name || name.trim().length === 0) {
            return Promise.reject(SubsonicFormatter.ERRORS.PARAM_MISSING);
        }
        if ((!token) || (!token.length)) {
            return Promise.reject(SubsonicFormatter.ERRORS.PARAM_MISSING);
        }
        const user = await orm.User.findOne({ where: { name } });
        if (!user) {
            return Promise.reject(SubsonicFormatter.ERRORS.LOGIN_FAILED);
        }
        const session = await orm.Session.findOne({ where: { user: user.id, mode: SessionMode.subsonic } });
        if (!session) {
            return Promise.reject(SubsonicFormatter.ERRORS.LOGIN_FAILED);
        }
        const t = hashMD5(session.jwth + salt);
        if (token !== t) {
            return Promise.reject(SubsonicFormatter.ERRORS.LOGIN_FAILED);
        }
        return user;
    }
};
__decorate([
    Inject,
    __metadata("design:type", ConfigService)
], UserService.prototype, "configService", void 0);
__decorate([
    Inject,
    __metadata("design:type", ImageModule)
], UserService.prototype, "imageModule", void 0);
UserService = __decorate([
    InRequestScope,
    __metadata("design:paramtypes", [])
], UserService);
export { UserService };
//# sourceMappingURL=user.service.js.map