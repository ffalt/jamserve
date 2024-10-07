var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { State } from '../state/state.model.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ResultType } from '../../modules/rest/decorators/ResultType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
let Base = class Base {
};
__decorate([
    ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], Base.prototype, "id", void 0);
__decorate([
    ObjField({ description: 'Name', example: 'Awesome' }),
    __metadata("design:type", String)
], Base.prototype, "name", void 0);
__decorate([
    ObjField({ nullable: true, description: 'User State Info' }),
    __metadata("design:type", State)
], Base.prototype, "state", void 0);
__decorate([
    ObjField({ description: 'Created Timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], Base.prototype, "created", void 0);
Base = __decorate([
    ResultType()
], Base);
export { Base };
let Page = class Page {
};
__decorate([
    ObjField({ nullable: true, description: 'Items starting from offset position', min: 0, example: 0 }),
    __metadata("design:type", Number)
], Page.prototype, "skip", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Amount of returned items', min: 0, example: 25 }),
    __metadata("design:type", Number)
], Page.prototype, "take", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Total amount of available items', min: 0, example: 123 }),
    __metadata("design:type", Number)
], Page.prototype, "total", void 0);
Page = __decorate([
    ResultType()
], Page);
export { Page };
//# sourceMappingURL=base.model.js.map