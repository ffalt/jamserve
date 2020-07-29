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
exports.PingController = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const ping_model_1 = require("./ping.model");
const version_1 = require("../../modules/engine/rest/version");
const typescript_ioc_1 = require("typescript-ioc");
let PingController = class PingController {
    ping() {
        return { version: version_1.JAMAPI_VERSION };
    }
};
__decorate([
    decorators_1.Get(() => ping_model_1.Ping, { description: 'Is the Api online?', summary: 'Ping' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", ping_model_1.Ping)
], PingController.prototype, "ping", null);
PingController = __decorate([
    typescript_ioc_1.InRequestScope,
    decorators_1.Controller('/ping', { tags: ['Access'] })
], PingController);
exports.PingController = PingController;
//# sourceMappingURL=ping.controller.js.map