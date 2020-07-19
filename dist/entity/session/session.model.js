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
exports.Session = void 0;
const session_user_model_1 = require("./session-user.model");
const rest_1 = require("../../modules/rest");
const version_1 = require("../../modules/engine/rest/version");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
let Session = class Session {
};
__decorate([
    rest_1.ObjField({ description: 'Api Version', example: version_1.JAMAPI_VERSION }),
    __metadata("design:type", String)
], Session.prototype, "version", void 0);
__decorate([
    rest_1.ObjField(() => [String], { description: 'Allowed Cookie Domains for CORS', example: ['localhost:4040'] }),
    __metadata("design:type", Array)
], Session.prototype, "allowedCookieDomains", void 0);
__decorate([
    rest_1.ObjField({ nullable: true, description: 'JSON Web Token', example: example_consts_1.examples.token }),
    __metadata("design:type", String)
], Session.prototype, "jwt", void 0);
__decorate([
    rest_1.ObjField({ nullable: true, description: 'User of this session' }),
    __metadata("design:type", session_user_model_1.SessionUser)
], Session.prototype, "user", void 0);
Session = __decorate([
    rest_1.ResultType({ description: 'Session Data' })
], Session);
exports.Session = Session;
//# sourceMappingURL=session.model.js.map