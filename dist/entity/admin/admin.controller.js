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
exports.AdminController = void 0;
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const admin_1 = require("./admin");
const typescript_ioc_1 = require("typescript-ioc");
const settings_service_1 = require("../settings/settings.service");
const io_service_1 = require("../../modules/engine/services/io.service");
const admin_args_1 = require("./admin.args");
let AdminController = class AdminController {
    async settings() {
        return this.settingsService.get();
    }
    async queueId(id) {
        return this.ioService.getAdminChangeQueueInfoStatus(id);
    }
    async settingsUpdate(args, { orm }) {
        await this.settingsService.updateSettings(orm, args);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", settings_service_1.SettingsService)
], AdminController.prototype, "settingsService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", io_service_1.IoService)
], AdminController.prototype, "ioService", void 0);
__decorate([
    rest_1.Get('/settings/get', () => admin_1.AdminSettings, { description: 'Get the Server Admin Settings', summary: 'Get Settings' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "settings", null);
__decorate([
    rest_1.Get('/queue/id', () => admin_1.AdminChangeQueueInfo, { description: 'Get Queue Information for Admin Change Tasks', summary: 'Get Queue Info' }),
    __param(0, rest_1.QueryParam('id', { description: 'Queue Task Id', isID: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "queueId", null);
__decorate([
    rest_1.Post('/settings/update', { description: 'Update the Server Admin Settings', summary: 'Set Settings' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_args_1.AdminSettingsArgs, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "settingsUpdate", null);
AdminController = __decorate([
    typescript_ioc_1.InRequestScope,
    rest_1.Controller('/admin', { tags: ['Administration'], roles: [enums_1.UserRole.admin] })
], AdminController);
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map