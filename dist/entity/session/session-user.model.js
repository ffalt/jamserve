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
exports.SessionUser = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const user_model_1 = require("../user/user.model");
let SessionUser = class SessionUser {
};
__decorate([
    decorators_1.ObjField({ description: 'User ID', isID: true }),
    __metadata("design:type", String)
], SessionUser.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField({ description: 'User Name', example: 'admin' }),
    __metadata("design:type", String)
], SessionUser.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField(() => user_model_1.UserRoles, { description: 'User Roles' }),
    __metadata("design:type", user_model_1.UserRoles)
], SessionUser.prototype, "roles", void 0);
SessionUser = __decorate([
    decorators_1.ResultType()
], SessionUser);
exports.SessionUser = SessionUser;
//# sourceMappingURL=session-user.model.js.map