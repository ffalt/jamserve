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
exports.AdminResolver = void 0;
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const admin_1 = require("./admin");
class AdminChangeQueueInfo {
}
let AdminResolver = class AdminResolver {
    async adminSettings({ engine }) {
        return engine.settingsService.get();
    }
    async adminQueue(id, { engine }) {
        return engine.ioService.getAdminChangeQueueInfoStatus(id);
    }
};
__decorate([
    type_graphql_1.Authorized(enums_1.UserRole.admin),
    type_graphql_1.Query(() => admin_1.AdminSettingsQL, { description: 'Get the Server Admin Settings' }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminSettings", null);
__decorate([
    type_graphql_1.Authorized(enums_1.UserRole.admin),
    type_graphql_1.Query(() => admin_1.AdminChangeQueueInfoQL, { description: 'Get Queue Information for Admin Change Tasks' }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID, { description: 'Queue Task Id' })), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminQueue", null);
AdminResolver = __decorate([
    type_graphql_1.Resolver(admin_1.AdminSettingsQL)
], AdminResolver);
exports.AdminResolver = AdminResolver;
//# sourceMappingURL=admin.resolver.js.map