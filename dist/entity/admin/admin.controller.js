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
import { BodyParams, Controller, Ctx, Get, Post, QueryParam } from '../../modules/rest';
import { UserRole } from '../../types/enums';
import { AdminChangeQueueInfo, AdminSettings } from './admin';
import { AdminSettingsArgs } from './admin.args';
let AdminController = class AdminController {
    async settings({ engine }) {
        return engine.settings.get();
    }
    async queueId(id, { engine }) {
        return engine.io.getAdminChangeQueueInfoStatus(id);
    }
    async settingsUpdate(args, { engine, orm }) {
        await engine.settings.updateSettings(orm, args);
    }
};
__decorate([
    Get('/settings/get', () => AdminSettings, { description: 'Get the Server Admin Settings', summary: 'Get Settings' }),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "settings", null);
__decorate([
    Get('/queue/id', () => AdminChangeQueueInfo, { description: 'Get Queue Information for Admin Change Tasks', summary: 'Get Queue Info' }),
    __param(0, QueryParam('id', { description: 'Queue Task Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "queueId", null);
__decorate([
    Post('/settings/update', { description: 'Update the Server Admin Settings', summary: 'Set Settings' }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AdminSettingsArgs, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "settingsUpdate", null);
AdminController = __decorate([
    Controller('/admin', { tags: ['Administration'], roles: [UserRole.admin] })
], AdminController);
export { AdminController };
//# sourceMappingURL=admin.controller.js.map