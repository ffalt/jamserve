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
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const base_controller_1 = require("../base/base.controller");
const root_args_1 = require("./root.args");
const admin_1 = require("../admin/admin");
const typescript_ioc_1 = require("typescript-ioc");
const io_service_1 = require("../../modules/engine/services/io.service");
const base_args_1 = require("../base/base.args");
let RootController = class RootController extends base_controller_1.BaseController {
    async id(id, rootArgs, { orm, user }) {
        return this.transform.root(orm, await orm.Root.oneOrFailByID(id), rootArgs, user);
    }
    async search(page, rootArgs, filter, order, { orm, user }) {
        return await orm.Root.searchTransformFilter(filter, [order], page, user, o => this.transform.root(orm, o, rootArgs, user));
    }
    async status(id, { orm, user }) {
        return this.transform.rootStatus(await orm.Root.oneOrFailByID(id));
    }
    async create(args, { orm, user }) {
        return await this.ioService.createRoot(args.name, args.path, args.strategy);
    }
    async update(id, args, { orm, user }) {
        return await this.ioService.updateRoot(id, args.name, args.path, args.strategy);
    }
    async remove(id, { orm, user }) {
        return await this.ioService.removeRoot(id);
    }
    async refresh(args, { orm }) {
        if (args.id) {
            return await this.ioService.refreshRoot(args.id);
        }
        else {
            const result = await this.ioService.refresh(orm);
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
    __param(2, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, root_args_1.IncludesRootArgs, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "id", null);
__decorate([
    rest_1.Get('/search', () => root_model_1.RootPage, { description: 'Search Roots' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        root_args_1.IncludesRootArgs,
        root_args_1.RootFilterArgs,
        root_args_1.RootOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "search", null);
__decorate([
    rest_1.Get('/status', () => root_model_1.RootUpdateStatus, { description: 'Get root status by id' }),
    __param(0, rest_1.QueryParam('id', { description: 'Root Id', isID: true })),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "status", null);
__decorate([
    rest_1.Post('/create', () => admin_1.AdminChangeQueueInfo, { description: 'Create a root', roles: [enums_1.UserRole.admin] }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [root_args_1.RootMutateArgs, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "create", null);
__decorate([
    rest_1.Post('/update', () => admin_1.AdminChangeQueueInfo, { description: 'Update a root', roles: [enums_1.UserRole.admin] }),
    __param(0, rest_1.BodyParam('id', { description: 'Root Id', isID: true })),
    __param(1, rest_1.BodyParams()),
    __param(2, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, root_args_1.RootMutateArgs, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "update", null);
__decorate([
    rest_1.Post('/remove', () => admin_1.AdminChangeQueueInfo, { description: 'Remove a root', roles: [enums_1.UserRole.admin] }),
    __param(0, rest_1.BodyParam('id', { description: 'Root Id', isID: true })),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "remove", null);
__decorate([
    rest_1.Post('/refresh', () => admin_1.AdminChangeQueueInfo, { description: 'Check podcast feeds for new episodes', roles: [enums_1.UserRole.admin] }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [root_args_1.RootRefreshArgs, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "refresh", null);
RootController = __decorate([
    typescript_ioc_1.InRequestScope,
    rest_1.Controller('/root', { tags: ['Root'], roles: [enums_1.UserRole.stream] })
], RootController);
exports.RootController = RootController;
//# sourceMappingURL=root.controller.js.map