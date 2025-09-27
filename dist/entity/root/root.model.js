var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Base, Page } from '../base/base.model.js';
import { RootScanStrategy, UserRole } from '../../types/enums.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let RootUpdateStatus = class RootUpdateStatus {
};
__decorate([
    ObjectField({ description: 'Last Scan Timestamp' }),
    __metadata("design:type", Number)
], RootUpdateStatus.prototype, "lastScan", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Last Error (if any)' }),
    __metadata("design:type", String)
], RootUpdateStatus.prototype, "error", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Is currently scanning?' }),
    __metadata("design:type", Boolean)
], RootUpdateStatus.prototype, "scanning", void 0);
RootUpdateStatus = __decorate([
    ResultType({ description: 'Root Scan Info' })
], RootUpdateStatus);
export { RootUpdateStatus };
let Root = class Root extends Base {
};
__decorate([
    ObjectField({ description: 'Root Path', roles: [UserRole.admin] }),
    __metadata("design:type", String)
], Root.prototype, "path", void 0);
__decorate([
    ObjectField(() => RootUpdateStatus, { description: 'Root Update Status' }),
    __metadata("design:type", RootUpdateStatus)
], Root.prototype, "status", void 0);
__decorate([
    ObjectField(() => RootScanStrategy, { description: 'Root Scan Strategy', example: RootScanStrategy.auto }),
    __metadata("design:type", String)
], Root.prototype, "strategy", void 0);
Root = __decorate([
    ResultType({ description: 'Root Data' })
], Root);
export { Root };
let RootPage = class RootPage extends Page {
};
__decorate([
    ObjectField(() => Root, { description: 'List of Roots' }),
    __metadata("design:type", Array)
], RootPage.prototype, "items", void 0);
RootPage = __decorate([
    ResultType({ description: 'Roots Page' })
], RootPage);
export { RootPage };
//# sourceMappingURL=root.model.js.map