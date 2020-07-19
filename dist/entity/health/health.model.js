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
exports.TrackHealthHint = exports.FolderHealthHint = exports.HealthHint = exports.HealthHintDetail = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const enums_1 = require("../../types/enums");
let HealthHintDetail = class HealthHintDetail {
};
__decorate([
    decorators_1.ObjField({ description: 'Hint Description' }),
    __metadata("design:type", String)
], HealthHintDetail.prototype, "reason", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Expected Value' }),
    __metadata("design:type", String)
], HealthHintDetail.prototype, "expected", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Actual Value' }),
    __metadata("design:type", String)
], HealthHintDetail.prototype, "actual", void 0);
HealthHintDetail = __decorate([
    decorators_1.ResultType({ description: 'Health Hint Detail' })
], HealthHintDetail);
exports.HealthHintDetail = HealthHintDetail;
let HealthHint = class HealthHint {
};
__decorate([
    decorators_1.ObjField({ description: 'Health Hint Name' }),
    __metadata("design:type", String)
], HealthHint.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField(() => [HealthHintDetail], { nullable: true, description: 'List of Health Hints' }),
    __metadata("design:type", Array)
], HealthHint.prototype, "details", void 0);
HealthHint = __decorate([
    decorators_1.ResultType({ description: 'Health Hint' })
], HealthHint);
exports.HealthHint = HealthHint;
let FolderHealthHint = class FolderHealthHint extends HealthHint {
};
__decorate([
    decorators_1.ObjField(() => enums_1.FolderHealthID, { description: 'Folder Health Hint ID' }),
    __metadata("design:type", String)
], FolderHealthHint.prototype, "id", void 0);
FolderHealthHint = __decorate([
    decorators_1.ResultType({ description: 'Folder Health Hint' })
], FolderHealthHint);
exports.FolderHealthHint = FolderHealthHint;
let TrackHealthHint = class TrackHealthHint extends HealthHint {
};
__decorate([
    decorators_1.ObjField(() => enums_1.TrackHealthID, { description: 'Track Health Hint ID' }),
    __metadata("design:type", String)
], TrackHealthHint.prototype, "id", void 0);
TrackHealthHint = __decorate([
    decorators_1.ResultType({ description: 'Track Health Hint' })
], TrackHealthHint);
exports.TrackHealthHint = TrackHealthHint;
//# sourceMappingURL=health.model.js.map