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
exports.UserPage = exports.User = exports.UserRoles = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const base_model_1 = require("../base/base.model");
let UserRoles = class UserRoles {
};
__decorate([
    decorators_1.ObjField({ description: 'User is Administrator' }),
    __metadata("design:type", Boolean)
], UserRoles.prototype, "admin", void 0);
__decorate([
    decorators_1.ObjField({ description: 'User has API Access' }),
    __metadata("design:type", Boolean)
], UserRoles.prototype, "stream", void 0);
__decorate([
    decorators_1.ObjField({ description: 'User can upload files' }),
    __metadata("design:type", Boolean)
], UserRoles.prototype, "upload", void 0);
__decorate([
    decorators_1.ObjField({ description: 'User can manage podcasts' }),
    __metadata("design:type", Boolean)
], UserRoles.prototype, "podcast", void 0);
UserRoles = __decorate([
    decorators_1.ResultType()
], UserRoles);
exports.UserRoles = UserRoles;
let User = class User extends base_model_1.Base {
};
__decorate([
    decorators_1.ObjField({ description: 'User Email', example: 'user@example.com', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    decorators_1.ObjField(() => UserRoles, { description: 'User Roles' }),
    __metadata("design:type", UserRoles)
], User.prototype, "roles", void 0);
User = __decorate([
    decorators_1.ResultType()
], User);
exports.User = User;
let UserPage = class UserPage extends base_model_1.Page {
};
__decorate([
    decorators_1.ObjField(() => User, { description: 'List of Users' }),
    __metadata("design:type", Array)
], UserPage.prototype, "items", void 0);
UserPage = __decorate([
    decorators_1.ResultType({ description: 'Users Page' })
], UserPage);
exports.UserPage = UserPage;
//# sourceMappingURL=user.model.js.map