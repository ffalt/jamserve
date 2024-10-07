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
let FavArgs = class FavArgs {
};
__decorate([
    ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], FavArgs.prototype, "id", void 0);
__decorate([
    ObjField({ description: 'add or remove the item fav', example: false, defaultValue: false }),
    __metadata("design:type", Boolean)
], FavArgs.prototype, "remove", void 0);
FavArgs = __decorate([
    ObjParamsType()
], FavArgs);
export { FavArgs };
let RateArgs = class RateArgs {
};
__decorate([
    ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], RateArgs.prototype, "id", void 0);
__decorate([
    ObjField({ description: 'Rating', example: false, min: 0, max: 5 }),
    __metadata("design:type", Number)
], RateArgs.prototype, "rating", void 0);
RateArgs = __decorate([
    ObjParamsType()
], RateArgs);
export { RateArgs };
let StatesArgs = class StatesArgs {
};
__decorate([
    ObjField(() => [String], { description: 'IDs', isID: true }),
    __metadata("design:type", Array)
], StatesArgs.prototype, "ids", void 0);
StatesArgs = __decorate([
    ObjParamsType()
], StatesArgs);
export { StatesArgs };
//# sourceMappingURL=state.args.js.map