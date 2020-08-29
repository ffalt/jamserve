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
exports.Page = exports.Base = void 0;
const state_model_1 = require("../state/state.model");
const decorators_1 = require("../../modules/rest/decorators");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
let Base = class Base {
};
__decorate([
    decorators_1.ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], Base.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Name', example: 'Awesome' }),
    __metadata("design:type", String)
], Base.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'User State Info' }),
    __metadata("design:type", state_model_1.State)
], Base.prototype, "state", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Created Timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], Base.prototype, "created", void 0);
Base = __decorate([
    decorators_1.ResultType()
], Base);
exports.Base = Base;
let Page = class Page {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Items starting from offset position', min: 0, example: 0 }),
    __metadata("design:type", Number)
], Page.prototype, "skip", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Amount of returned items', min: 0, example: 25 }),
    __metadata("design:type", Number)
], Page.prototype, "take", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Total amount of available items', min: 0, example: 123 }),
    __metadata("design:type", Number)
], Page.prototype, "total", void 0);
Page = __decorate([
    decorators_1.ResultType()
], Page);
exports.Page = Page;
//# sourceMappingURL=base.model.js.map