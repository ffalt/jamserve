var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ObjParamsType } from '../../modules/rest/decorators/ObjParamsType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
let CredentialsArgs = class CredentialsArgs {
};
__decorate([
    ObjField({ description: 'User password', example: 'secret' }),
    __metadata("design:type", String)
], CredentialsArgs.prototype, "password", void 0);
__decorate([
    ObjField({ description: 'User name', example: 'you' }),
    __metadata("design:type", String)
], CredentialsArgs.prototype, "username", void 0);
__decorate([
    ObjField({ description: 'User client', example: 'Jamberry v1' }),
    __metadata("design:type", String)
], CredentialsArgs.prototype, "client", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Generate JSON Web Token', example: true }),
    __metadata("design:type", Boolean)
], CredentialsArgs.prototype, "jwt", void 0);
CredentialsArgs = __decorate([
    ObjParamsType()
], CredentialsArgs);
export { CredentialsArgs };
//# sourceMappingURL=auth.args.js.map