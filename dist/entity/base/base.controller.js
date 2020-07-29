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
exports.BaseController = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const transform_service_1 = require("../../modules/engine/services/transform.service");
const decorators_1 = require("../../modules/rest/decorators");
const metadata_service_1 = require("../metadata/metadata.service");
let BaseController = class BaseController {
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", transform_service_1.TransformService)
], BaseController.prototype, "transform", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", metadata_service_1.MetaDataService)
], BaseController.prototype, "metadata", void 0);
BaseController = __decorate([
    typescript_ioc_1.InRequestScope,
    decorators_1.Controller('', { abstract: true })
], BaseController);
exports.BaseController = BaseController;
//# sourceMappingURL=base.controller.js.map