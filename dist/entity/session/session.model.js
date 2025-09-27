var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { SessionUser } from './session-user.model.js';
import { JAMAPI_VERSION } from '../../modules/engine/rest/version.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let Session = class Session {
};
__decorate([
    ObjectField({ description: 'Api Version', example: JAMAPI_VERSION }),
    __metadata("design:type", String)
], Session.prototype, "version", void 0);
__decorate([
    ObjectField(() => [String], { nullable: true, description: 'Allowed Cookie Domains for CORS', example: ['localhost:4040'] }),
    __metadata("design:type", Array)
], Session.prototype, "allowedCookieDomains", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'JSON Web Token', example: examples.token }),
    __metadata("design:type", String)
], Session.prototype, "jwt", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'User of this session' }),
    __metadata("design:type", SessionUser)
], Session.prototype, "user", void 0);
Session = __decorate([
    ResultType({ description: 'Session Data' })
], Session);
export { Session };
//# sourceMappingURL=session.model.js.map