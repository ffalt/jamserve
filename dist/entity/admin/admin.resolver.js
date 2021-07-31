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
import { UserRole } from '../../types/enums';
import { Arg, Authorized, Ctx, ID, Query, Resolver } from 'type-graphql';
import { AdminChangeQueueInfoQL, AdminSettingsQL } from './admin';
class AdminChangeQueueInfo {
}
let AdminResolver = class AdminResolver {
    async adminSettings({ engine }) {
        return engine.settings.get();
    }
    async adminQueue(id, { engine }) {
        return engine.io.getAdminChangeQueueInfoStatus(id);
    }
};
__decorate([
    Authorized(UserRole.admin),
    Query(() => AdminSettingsQL, { description: 'Get the Server Admin Settings' }),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminSettings", null);
__decorate([
    Authorized(UserRole.admin),
    Query(() => AdminChangeQueueInfoQL, { description: 'Get Queue Information for Admin Change Tasks' }),
    __param(0, Arg('id', () => ID, { description: 'Queue Task Id' })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminQueue", null);
AdminResolver = __decorate([
    Resolver(AdminSettingsQL)
], AdminResolver);
export { AdminResolver };
//# sourceMappingURL=admin.resolver.js.map