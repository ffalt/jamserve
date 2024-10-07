var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Base, Page } from '../base/base.model.js';
import { ResultType } from '../../modules/rest/decorators/ResultType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
let UserRoles = class UserRoles {
};
__decorate([
    ObjField({ description: 'User is Administrator' }),
    __metadata("design:type", Boolean)
], UserRoles.prototype, "admin", void 0);
__decorate([
    ObjField({ description: 'User has API Access' }),
    __metadata("design:type", Boolean)
], UserRoles.prototype, "stream", void 0);
__decorate([
    ObjField({ description: 'User can upload files' }),
    __metadata("design:type", Boolean)
], UserRoles.prototype, "upload", void 0);
__decorate([
    ObjField({ description: 'User can manage podcasts' }),
    __metadata("design:type", Boolean)
], UserRoles.prototype, "podcast", void 0);
UserRoles = __decorate([
    ResultType()
], UserRoles);
export { UserRoles };
let User = class User extends Base {
};
__decorate([
    ObjField({ description: 'User Email', example: 'user@example.com', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    ObjField(() => UserRoles, { description: 'User Roles' }),
    __metadata("design:type", UserRoles)
], User.prototype, "roles", void 0);
User = __decorate([
    ResultType()
], User);
export { User };
let SubsonicToken = class SubsonicToken {
};
__decorate([
    ObjField({ description: 'Generated Subsonic Token', example: 'kshfis6few68fwefh' }),
    __metadata("design:type", String)
], SubsonicToken.prototype, "token", void 0);
SubsonicToken = __decorate([
    ResultType()
], SubsonicToken);
export { SubsonicToken };
let UserPage = class UserPage extends Page {
};
__decorate([
    ObjField(() => User, { description: 'List of Users' }),
    __metadata("design:type", Array)
], UserPage.prototype, "items", void 0);
UserPage = __decorate([
    ResultType({ description: 'Users Page' })
], UserPage);
export { UserPage };
//# sourceMappingURL=user.model.js.map