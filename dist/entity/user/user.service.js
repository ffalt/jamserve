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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const hash_1 = require("../../utils/hash");
const enums_1 = require("../../types/enums");
const typescript_ioc_1 = require("typescript-ioc");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const config_service_1 = require("../../modules/engine/services/config.service");
const fs_utils_1 = require("../../utils/fs-utils");
const image_module_1 = require("../../modules/image/image.module");
const common_password_checker_1 = __importDefault(require("common-password-checker"));
const random_1 = require("../../utils/random");
let UserService = class UserService {
    constructor() {
        this.userAvatarPath = this.configService.getDataPath(['images']);
    }
    async findByName(orm, name) {
        if (!name || name.trim().length === 0) {
            return Promise.reject(Error('Invalid Username'));
        }
        return await orm.User.findOne({ where: { name } });
    }
    async findByID(orm, id) {
        const user = await orm.User.findOneByID(id);
        return user || undefined;
    }
    async auth(orm, name, pass) {
        if ((!pass) || (!pass.length)) {
            return Promise.reject(Error('Invalid Password'));
        }
        const user = await this.findByName(orm, name);
        if (!user) {
            return Promise.reject(Error('Invalid Username'));
        }
        const hash = hash_1.hashSaltSHA512(pass, user.salt);
        if (hash !== user.hash) {
            return Promise.reject(Error('Invalid Password'));
        }
        return user;
    }
    async authJWT(orm, jwtPayload) {
        if (!jwtPayload || !jwtPayload.id) {
            return Promise.reject(Error('Invalid token'));
        }
        return await orm.User.findOneByID(jwtPayload.id);
    }
    static listfyRoles(user) {
        const result = [];
        if (user.roleAdmin) {
            result.push(enums_1.UserRole.admin);
        }
        if (user.roleStream) {
            result.push(enums_1.UserRole.stream);
        }
        if (user.rolePodcast) {
            result.push(enums_1.UserRole.podcast);
        }
        if (user.roleUpload) {
            result.push(enums_1.UserRole.upload);
        }
        return result;
    }
    avatarImageFilename(user) {
        return path_1.default.join(this.userAvatarPath, `avatar-${user.id}.png`);
    }
    async getImage(orm, user, size, format) {
        const filename = this.avatarImageFilename(user);
        let exists = await fs_extra_1.default.pathExists(filename);
        if (!exists) {
            await this.generateAvatar(user);
            exists = await fs_extra_1.default.pathExists(filename);
        }
        if (exists) {
            return this.imageModule.get(user.id, filename, size, format);
        }
    }
    async generateAvatar(user, seed) {
        const filename = this.avatarImageFilename(user);
        await fs_utils_1.fileDeleteIfExists(filename);
        await this.imageModule.generateAvatar(seed || user.name, filename);
        await this.imageModule.clearImageCacheByIDs([user.id]);
    }
    async setUserImage(user, filename, mimetype) {
        const destName = this.avatarImageFilename(user);
        await this.imageModule.createAvatar(filename, destName);
        await fs_utils_1.fileDeleteIfExists(filename);
        await this.imageModule.clearImageCacheByIDs([user.id]);
    }
    async testPassword(password) {
        if ((!password) || (!password.trim().length)) {
            return Promise.reject(Error('Invalid Password'));
        }
        if (password.length < 4) {
            return Promise.reject(Error('Password is too short'));
        }
        if (common_password_checker_1.default(password)) {
            return Promise.reject(Error('Your password is found in the most frequently used password list and too easy to guess'));
        }
    }
    async setUserPassword(orm, user, pass) {
        await this.testPassword(pass);
        const pw = hash_1.hashAndSaltSHA512(pass);
        user.salt = pw.salt;
        user.hash = pw.hash;
        await orm.User.persistAndFlush(user);
    }
    async setUserEmail(orm, user, email) {
        if ((!email) || (!email.trim().length)) {
            return Promise.reject(Error('Invalid Email'));
        }
        user.email = email;
        await orm.User.persistAndFlush(user);
    }
    async remove(orm, user) {
        await orm.User.removeAndFlush(user);
        await this.imageModule.clearImageCacheByIDs([user.id]);
        await fs_utils_1.fileDeleteIfExists(this.avatarImageFilename(user));
    }
    async createUser(orm, name, email, pass, roleAdmin, roleStream, roleUpload, rolePodcast) {
        const pw = hash_1.hashAndSaltSHA512(pass);
        const user = orm.User.create({ name: name || '', salt: pw.salt, hash: pw.hash, email, roleAdmin, roleStream, roleUpload, rolePodcast });
        await orm.User.persistAndFlush(user);
        return user;
    }
    async create(orm, args) {
        if (!args.name || args.name.trim().length === 0) {
            return Promise.reject(Error('Invalid Username'));
        }
        const existingUser = await orm.User.findOne({ where: { name: args.name } });
        if (existingUser) {
            return Promise.reject(Error('Username already exists'));
        }
        const pass = random_1.randomString(16);
        return await this.createUser(orm, args.name, args.email || '', pass, !!args.roleAdmin, !!args.roleStream, !!args.roleUpload, !!args.rolePodcast);
    }
    async update(orm, user, args) {
        if (!args.name || args.name.trim().length === 0) {
            return Promise.reject(Error('Invalid Username'));
        }
        const existingUser = await orm.User.findOne({ where: { name: args.name } });
        if (existingUser && existingUser.id !== user.id) {
            return Promise.reject(Error('Username already exists'));
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
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", config_service_1.ConfigService)
], UserService.prototype, "configService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", image_module_1.ImageModule)
], UserService.prototype, "imageModule", void 0);
UserService = __decorate([
    typescript_ioc_1.InRequestScope,
    __metadata("design:paramtypes", [])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map