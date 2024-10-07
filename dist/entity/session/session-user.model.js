var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { UserRoles } from '../user/user.model.js';
import { ResultType } from '../../modules/rest/decorators/ResultType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
let SessionUser = class SessionUser {
};
__decorate([
    ObjField({ description: 'User ID', isID: true }),
    __metadata("design:type", String)
], SessionUser.prototype, "id", void 0);
__decorate([
    ObjField({ description: 'User Name', example: 'admin' }),
    __metadata("design:type", String)
], SessionUser.prototype, "name", void 0);
__decorate([
    ObjField(() => UserRoles, { description: 'User Roles' }),
    __metadata("design:type", UserRoles)
], SessionUser.prototype, "roles", void 0);
SessionUser = __decorate([
    ResultType()
], SessionUser);
export { SessionUser };
//# sourceMappingURL=session-user.model.js.map