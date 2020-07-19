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
exports.RootController = void 0;
const root_model_1 = require("./root.model");
const user_1 = require("../user/user");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const base_controller_1 = require("../base/base.controller");
const root_args_1 = require("./root.args");
const admin_1 = require("../admin/admin");
const typescript_ioc_1 = require("typescript-ioc");
const io_service_1 = require("../../modules/engine/services/io.service");
const base_args_1 = require("../base/base.args");
let RootController = class RootController extends base_controller_1.BaseController {
    async id(id, rootArgs, user) {
        return this.transform.root(await this.orm.Root.oneOrFail(id), rootArgs, user);
    }
    async search(page, rootArgs, filter, order, user) {
        return await this.orm.Root.searchTransformFilter(filter, [order], page, user, o => this.transform.root(o, rootArgs, user));
    }
    async status(id) {
        return this.transform.rootStatus(await this.orm.Root.oneOrFail(id));
    }
    async create(args) {
        return await this.ioService.createRoot(args.name, args.path, args.strategy);
    }
    async update(id, args) {
        return await this.ioService.updateRoot(id, args.name, args.path, args.strategy);
    }
    async remove(id) {
        return await this.ioService.removeRoot(id);
    }
    async refresh(args) {
        if (args.id) {
            return await this.ioService.refreshRoot(args.id);
        }
        else {
            const result = await this.ioService.refresh();
            return result[result.length - 1];
        }
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", io_service_1.IoService)
], RootController.prototype, "ioService", void 0);
__decorate([
    rest_1.Get('/id', () => root_model_1.Root, { description: 'Get a Root by Id', summary: 'Get Root' }),
    __param(0, rest_1.QueryParam('id', { description: 'Root Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, root_args_1.IncludesRootArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "id", null);
__decorate([
    rest_1.Get('/search', () => root_model_1.RootPage, { description: 'Search Roots' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        root_args_1.IncludesRootArgs,
        root_args_1.RootFilterArgs,
        root_args_1.RootOrderArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "search", null);
__decorate([
    rest_1.Get('/status', () => root_model_1.RootUpdateStatus, { description: 'Get root status by id' }),
    __param(0, rest_1.QueryParam('id', { description: 'Root Id', isID: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "status", null);
__decorate([
    rest_1.Post('/create', () => admin_1.AdminChangeQueueInfo, { description: 'Create a root', roles: [enums_1.UserRole.admin] }),
    __param(0, rest_1.BodyParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [root_args_1.RootMutateArgs]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "create", null);
__decorate([
    rest_1.Post('/update', () => admin_1.AdminChangeQueueInfo, { description: 'Update a root', roles: [enums_1.UserRole.admin] }),
    __param(0, rest_1.BodyParam('id', { description: 'Root Id', isID: true })),
    __param(1, rest_1.BodyParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, root_args_1.RootMutateArgs]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "update", null);
__decorate([
    rest_1.Post('/remove', () => admin_1.AdminChangeQueueInfo, { description: 'Remove a root', roles: [enums_1.UserRole.admin] }),
    __param(0, rest_1.BodyParam('id', { description: 'Root Id', isID: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "remove", null);
__decorate([
    rest_1.Post('/refresh', () => admin_1.AdminChangeQueueInfo, { description: 'Check podcast feeds for new episodes', roles: [enums_1.UserRole.admin] }),
    __param(0, rest_1.BodyParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [root_args_1.RootRefreshArgs]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "refresh", null);
RootController = __decorate([
    rest_1.Controller('/root', { tags: ['Root'], roles: [enums_1.UserRole.stream] })
], RootController);
exports.RootController = RootController;
//# sourceMappingURL=root.controller.js.map