var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { MetadataType } from '../../types/enums.js';
import { Entity, Property } from '../../modules/orm/index.js';
import { Base } from '../base/base.js';
let Metadata = class Metadata extends Base {
};
__decorate([
    Property(() => String),
    __metadata("design:type", String)
], Metadata.prototype, "name", void 0);
__decorate([
    Property(() => MetadataType),
    __metadata("design:type", String)
], Metadata.prototype, "dataType", void 0);
__decorate([
    Property(() => String),
    __metadata("design:type", String)
], Metadata.prototype, "data", void 0);
Metadata = __decorate([
    Entity()
], Metadata);
export { Metadata };
//# sourceMappingURL=metadata.js.map