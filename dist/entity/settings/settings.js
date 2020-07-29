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
exports.Settings = void 0;
const base_1 = require("../base/base");
const orm_1 = require("../../modules/orm");
let Settings = class Settings extends base_1.Base {
};
__decorate([
    orm_1.Property(() => String),
    __metadata("design:type", String)
], Settings.prototype, "section", void 0);
__decorate([
    orm_1.Property(() => String),
    __metadata("design:type", String)
], Settings.prototype, "version", void 0);
__decorate([
    orm_1.Property(() => String),
    __metadata("design:type", String)
], Settings.prototype, "data", void 0);
Settings = __decorate([
    orm_1.Entity()
], Settings);
exports.Settings = Settings;
//# sourceMappingURL=settings.js.map