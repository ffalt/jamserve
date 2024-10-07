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
import { Root, RootPage, RootUpdateStatus } from './root.model.js';
import { UserRole } from '../../types/enums.js';
import { IncludesRootArgs, RootFilterArgs, RootMutateArgs, RootOrderArgs, RootRefreshArgs } from './root.args.js';
import { AdminChangeQueueInfo } from '../admin/admin.js';
import { PageArgs } from '../base/base.args.js';
import { Controller } from '../../modules/rest/decorators/Controller.js';
import { Get } from '../../modules/rest/decorators/Get.js';
import { QueryParam } from '../../modules/rest/decorators/QueryParam.js';
import { QueryParams } from '../../modules/rest/decorators/QueryParams.js';
import { Ctx } from '../../modules/rest/decorators/Ctx.js';
import { BodyParams } from '../../modules/rest/decorators/BodyParams.js';
import { BodyParam } from '../../modules/rest/decorators/BodyParam.js';
import { Post } from '../../modules/rest/decorators/Post.js';
let RootController = class RootController {
    async id(id, rootArgs, { orm, engine, user }) {
        return engine.transform.Root.root(orm, await orm.Root.oneOrFailByID(id), rootArgs, user);
    }
    async search(page, rootArgs, filter, order, { orm, engine, user }) {
        return await orm.Root.searchTransformFilter(filter, [order], page, user, o => engine.transform.Root.root(orm, o, rootArgs, user));
    }
    async status(id, { orm, engine }) {
        return engine.transform.Root.rootStatus(await orm.Root.oneOrFailByID(id));
    }
    async create(args, { engine }) {
        return await engine.io.root.create(args.name, args.path, args.strategy);
    }
    async update(id, args, { engine }) {
        return await engine.io.root.update(id, args.name, args.path, args.strategy);
    }
    async remove(id, { engine }) {
        return await engine.io.root.delete(id);
    }
    async refresh(args, { orm, engine }) {
        if (args.id) {
            return await engine.io.root.refresh(args.id);
        }
        else {
            const result = await engine.io.root.refreshAll(orm);
            return result[result.length - 1];
        }
    }
    async refreshMeta(args, { orm, engine }) {
        if (args.id) {
            return await engine.io.root.refreshMeta(args.id);
        }
        else {
            const result = await engine.io.root.refreshAll(orm);
            return result[result.length - 1];
        }
    }
};
__decorate([
    Get('/id', () => Root, { description: 'Get a Root by Id', summary: 'Get Root' }),
    __param(0, QueryParam('id', { description: 'Root Id', isID: true })),
    __param(1, QueryParams()),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesRootArgs, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "id", null);
__decorate([
    Get('/search', () => RootPage, { description: 'Search Roots' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesRootArgs,
        RootFilterArgs,
        RootOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "search", null);
__decorate([
    Get('/status', () => RootUpdateStatus, { description: 'Get root status by id' }),
    __param(0, QueryParam('id', { description: 'Root Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "status", null);
__decorate([
    Post('/create', () => AdminChangeQueueInfo, { description: 'Create a root', roles: [UserRole.admin] }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RootMutateArgs, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "create", null);
__decorate([
    Post('/update', () => AdminChangeQueueInfo, { description: 'Update a root', roles: [UserRole.admin] }),
    __param(0, BodyParam('id', { description: 'Root Id', isID: true })),
    __param(1, BodyParams()),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RootMutateArgs, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "update", null);
__decorate([
    Post('/remove', () => AdminChangeQueueInfo, { description: 'Remove a root', roles: [UserRole.admin] }),
    __param(0, BodyParam('id', { description: 'Root Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "remove", null);
__decorate([
    Post('/refresh', () => AdminChangeQueueInfo, { description: 'Check & update a root folder for file system changes', roles: [UserRole.admin] }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RootRefreshArgs, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "refresh", null);
__decorate([
    Post('/refreshMeta', () => AdminChangeQueueInfo, { description: 'Rebuild all metadata (Artists/Albums/...) for a root folder', roles: [UserRole.admin] }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RootRefreshArgs, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "refreshMeta", null);
RootController = __decorate([
    Controller('/root', { tags: ['Root'], roles: [UserRole.stream] })
], RootController);
export { RootController };
//# sourceMappingURL=root.controller.js.map