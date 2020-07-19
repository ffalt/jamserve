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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootPage = exports.Root = exports.RootUpdateStatus = void 0;
const base_model_1 = require("../base/base.model");
const decorators_1 = require("../../modules/rest/decorators");
const enums_1 = require("../../types/enums");
let RootUpdateStatus = class RootUpdateStatus {
};
__decorate([
    decorators_1.ObjField({ description: 'Last Scan Timestamp' }),
    __metadata("design:type", Number)
], RootUpdateStatus.prototype, "lastScan", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Last Error (if any)' }),
    __metadata("design:type", String)
], RootUpdateStatus.prototype, "error", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Is currently scanning?' }),
    __metadata("design:type", Boolean)
], RootUpdateStatus.prototype, "scanning", void 0);
RootUpdateStatus = __decorate([
    decorators_1.ResultType({ description: 'Root Scan Info' })
], RootUpdateStatus);
exports.RootUpdateStatus = RootUpdateStatus;
let Root = class Root extends base_model_1.Base {
};
__decorate([
    decorators_1.ObjField({ description: 'Root Path', roles: [enums_1.UserRole.admin] }),
    __metadata("design:type", String)
], Root.prototype, "path", void 0);
__decorate([
    decorators_1.ObjField(() => RootUpdateStatus, { description: 'Root Update Status' }),
    __metadata("design:type", RootUpdateStatus)
], Root.prototype, "status", void 0);
__decorate([
    decorators_1.ObjField(() => enums_1.RootScanStrategy, { description: 'Root Scan Strategy', example: enums_1.RootScanStrategy.auto }),
    __metadata("design:type", String)
], Root.prototype, "strategy", void 0);
Root = __decorate([
    decorators_1.ResultType({ description: 'Root Data' })
], Root);
exports.Root = Root;
let RootPage = class RootPage extends base_model_1.Page {
};
__decorate([
    decorators_1.ObjField(() => Root, { description: 'List of Roots' }),
    __metadata("design:type", Array)
], RootPage.prototype, "items", void 0);
RootPage = __decorate([
    decorators_1.ResultType({ description: 'Roots Page' })
], RootPage);
exports.RootPage = RootPage;
//# sourceMappingURL=root.model.js.map