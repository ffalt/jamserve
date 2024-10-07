var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { examples } from '../../modules/engine/rest/example.consts.js';
import { SessionMode } from '../../types/enums.js';
import { ResultType } from '../../modules/rest/decorators/ResultType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
let UserSession = class UserSession {
};
__decorate([
    ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], UserSession.prototype, "id", void 0);
__decorate([
    ObjField({ description: 'Session Client', example: 'Jamberry v1' }),
    __metadata("design:type", String)
], UserSession.prototype, "client", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Session Expiration', example: examples.timestamp }),
    __metadata("design:type", Number)
], UserSession.prototype, "expires", void 0);
__decorate([
    ObjField(() => SessionMode, { description: 'Session Mode', example: SessionMode.browser }),
    __metadata("design:type", String)
], UserSession.prototype, "mode", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Session Platform', example: 'Amiga 500' }),
    __metadata("design:type", String)
], UserSession.prototype, "platform", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Session OS', example: 'Atari' }),
    __metadata("design:type", String)
], UserSession.prototype, "os", void 0);
__decorate([
    ObjField({ description: 'Session User Agent', example: 'Amiga-AWeb/3.4.167SE”' }),
    __metadata("design:type", String)
], UserSession.prototype, "agent", void 0);
UserSession = __decorate([
    ResultType({ description: 'User Session' })
], UserSession);
export { UserSession };
//# sourceMappingURL=user-session.model.js.map