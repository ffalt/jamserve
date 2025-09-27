var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let FavParameters = class FavParameters {
};
__decorate([
    ObjectField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], FavParameters.prototype, "id", void 0);
__decorate([
    ObjectField({ description: 'add or remove the item fav', example: false, defaultValue: false }),
    __metadata("design:type", Boolean)
], FavParameters.prototype, "remove", void 0);
FavParameters = __decorate([
    ObjectParametersType()
], FavParameters);
export { FavParameters };
let RateParameters = class RateParameters {
};
__decorate([
    ObjectField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], RateParameters.prototype, "id", void 0);
__decorate([
    ObjectField({ description: 'Rating', example: false, min: 0, max: 5 }),
    __metadata("design:type", Number)
], RateParameters.prototype, "rating", void 0);
RateParameters = __decorate([
    ObjectParametersType()
], RateParameters);
export { RateParameters };
let StatesParameters = class StatesParameters {
};
__decorate([
    ObjectField(() => [String], { description: 'IDs', isID: true }),
    __metadata("design:type", Array)
], StatesParameters.prototype, "ids", void 0);
StatesParameters = __decorate([
    ObjectParametersType()
], StatesParameters);
export { StatesParameters };
//# sourceMappingURL=state.parameters.js.map