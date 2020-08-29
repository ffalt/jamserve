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
exports.UserSession = void 0;
const rest_1 = require("../../modules/rest");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
const enums_1 = require("../../types/enums");
let UserSession = class UserSession {
};
__decorate([
    rest_1.ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], UserSession.prototype, "id", void 0);
__decorate([
    rest_1.ObjField({ description: 'Session Client', example: 'Jamberry v1' }),
    __metadata("design:type", String)
], UserSession.prototype, "client", void 0);
__decorate([
    rest_1.ObjField({ nullable: true, description: 'Session Expiration', example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], UserSession.prototype, "expires", void 0);
__decorate([
    rest_1.ObjField(() => enums_1.SessionMode, { description: 'Session Mode', example: enums_1.SessionMode.browser }),
    __metadata("design:type", String)
], UserSession.prototype, "mode", void 0);
__decorate([
    rest_1.ObjField({ nullable: true, description: 'Session Platform', example: 'Amiga 500' }),
    __metadata("design:type", String)
], UserSession.prototype, "platform", void 0);
__decorate([
    rest_1.ObjField({ nullable: true, description: 'Session OS', example: 'Atari' }),
    __metadata("design:type", String)
], UserSession.prototype, "os", void 0);
__decorate([
    rest_1.ObjField({ description: 'Session User Agent', example: 'Amiga-AWeb/3.4.167SE”' }),
    __metadata("design:type", String)
], UserSession.prototype, "agent", void 0);
UserSession = __decorate([
    rest_1.ResultType({ description: 'User Session' })
], UserSession);
exports.UserSession = UserSession;
//# sourceMappingURL=user-session.model.js.map