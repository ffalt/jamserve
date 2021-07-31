var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Inject, InRequestScope } from 'typescript-ioc';
import { BaseTransformService } from '../base/base.transform';
import { IoService } from '../../modules/engine/services/io.service';
let RootTransformService = class RootTransformService extends BaseTransformService {
    async root(orm, o, rootArgs, user) {
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            path: user.roleAdmin ? o.path : undefined,
            status: this.ioService.getRootStatus(o.id),
            strategy: o.strategy
        };
    }
    rootStatus(root) {
        return this.ioService.getRootStatus(root.id);
    }
};
__decorate([
    Inject,
    __metadata("design:type", IoService)
], RootTransformService.prototype, "ioService", void 0);
RootTransformService = __decorate([
    InRequestScope
], RootTransformService);
export { RootTransformService };
//# sourceMappingURL=root.transform.js.map