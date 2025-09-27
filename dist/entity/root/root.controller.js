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
import { IncludesRootParameters, RootFilterParameters, RootMutateParameters, RootOrderParameters, RootRefreshParameters } from './root.parameters.js';
import { AdminChangeQueueInfo } from '../admin/admin.js';
import { PageParameters } from '../base/base.parameters.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';
import { Post } from '../../modules/rest/decorators/post.js';
let RootController = class RootController {
    async id(id, parameters, { orm, engine, user }) {
        return engine.transform.Root.root(orm, await orm.Root.oneOrFailByID(id), parameters, user);
    }
    async search(page, parameters, filter, order, { orm, engine, user }) {
        return await orm.Root.searchTransformFilter(filter, [order], page, user, o => engine.transform.Root.root(orm, o, parameters, user));
    }
    async status(id, { orm, engine }) {
        return engine.transform.Root.rootStatus(await orm.Root.oneOrFailByID(id));
    }
    async create({ name, path, strategy }, { engine }) {
        return await engine.io.root.create(name, path, strategy);
    }
    async update(id, { name, path, strategy }, { engine }) {
        return await engine.io.root.update(id, name, path, strategy);
    }
    async remove(id, { engine }) {
        return await engine.io.root.delete(id);
    }
    async refresh({ id }, { orm, engine }) {
        if (id) {
            return await engine.io.root.refresh(id);
        }
        const result = await engine.io.root.refreshAll(orm);
        return result.at(-1) ?? { id: '' };
    }
    async refreshMeta({ id }, { orm, engine }) {
        if (id) {
            return await engine.io.root.refreshMeta(id);
        }
        const result = await engine.io.root.refreshAll(orm);
        return result.at(-1) ?? { id: '' };
    }
};
__decorate([
    Get('/id', () => Root, { description: 'Get a Root by Id', summary: 'Get Root' }),
    __param(0, QueryParameter('id', { description: 'Root Id', isID: true })),
    __param(1, QueryParameters()),
    __param(2, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesRootParameters, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "id", null);
__decorate([
    Get('/search', () => RootPage, { description: 'Search Roots' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesRootParameters,
        RootFilterParameters,
        RootOrderParameters, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "search", null);
__decorate([
    Get('/status', () => RootUpdateStatus, { description: 'Get root status by id' }),
    __param(0, QueryParameter('id', { description: 'Root Id', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "status", null);
__decorate([
    Post('/create', () => AdminChangeQueueInfo, { description: 'Create a root', roles: [UserRole.admin] }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RootMutateParameters, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "create", null);
__decorate([
    Post('/update', () => AdminChangeQueueInfo, { description: 'Update a root', roles: [UserRole.admin] }),
    __param(0, BodyParameter('id', { description: 'Root Id', isID: true })),
    __param(1, BodyParameters()),
    __param(2, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RootMutateParameters, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "update", null);
__decorate([
    Post('/remove', () => AdminChangeQueueInfo, { description: 'Remove a root', roles: [UserRole.admin] }),
    __param(0, BodyParameter('id', { description: 'Root Id', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "remove", null);
__decorate([
    Post('/refresh', () => AdminChangeQueueInfo, { description: 'Check & update a root folder for file system changes', roles: [UserRole.admin] }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RootRefreshParameters, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "refresh", null);
__decorate([
    Post('/refreshMeta', () => AdminChangeQueueInfo, { description: 'Rebuild all metadata (Artists/Albums/...) for a root folder', roles: [UserRole.admin] }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RootRefreshParameters, Object]),
    __metadata("design:returntype", Promise)
], RootController.prototype, "refreshMeta", null);
RootController = __decorate([
    Controller('/root', { tags: ['Root'], roles: [UserRole.stream] })
], RootController);
export { RootController };
//# sourceMappingURL=root.controller.js.map