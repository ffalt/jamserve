var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { MetaDataType } from '../../types/enums';
import { Entity, Property } from '../../modules/orm';
import { Base } from '../base/base';
let MetaData = class MetaData extends Base {
};
__decorate([
    Property(() => String),
    __metadata("design:type", String)
], MetaData.prototype, "name", void 0);
__decorate([
    Property(() => MetaDataType),
    __metadata("design:type", String)
], MetaData.prototype, "dataType", void 0);
__decorate([
    Property(() => String),
    __metadata("design:type", String)
], MetaData.prototype, "data", void 0);
MetaData = __decorate([
    Entity()
], MetaData);
export { MetaData };
//# sourceMappingURL=metadata.js.map