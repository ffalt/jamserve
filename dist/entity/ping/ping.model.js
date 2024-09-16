var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ObjField, ResultType } from '../../modules/rest/index.js';
import { JAMAPI_VERSION } from '../../modules/engine/rest/version.js';
let Ping = class Ping {
};
__decorate([
    ObjField({ description: 'Jam Api Version', example: JAMAPI_VERSION }),
    __metadata("design:type", String)
], Ping.prototype, "version", void 0);
Ping = __decorate([
    ResultType()
], Ping);
export { Ping };
//# sourceMappingURL=ping.model.js.map