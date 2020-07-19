"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatesArgs = exports.RateArgs = exports.FavArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
let FavArgs = class FavArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], FavArgs.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField({ description: 'add or remove the item fav', example: false, defaultValue: false }),
    __metadata("design:type", Boolean)
], FavArgs.prototype, "remove", void 0);
FavArgs = __decorate([
    decorators_1.ObjParamsType()
], FavArgs);
exports.FavArgs = FavArgs;
let RateArgs = class RateArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], RateArgs.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Rating', example: false, min: 0, max: 5 }),
    __metadata("design:type", Number)
], RateArgs.prototype, "rating", void 0);
RateArgs = __decorate([
    decorators_1.ObjParamsType()
], RateArgs);
exports.RateArgs = RateArgs;
let StatesArgs = class StatesArgs {
};
__decorate([
    decorators_1.ObjField(() => [String], { description: 'IDs', isID: true }),
    __metadata("design:type", Array)
], StatesArgs.prototype, "ids", void 0);
StatesArgs = __decorate([
    decorators_1.ObjParamsType()
], StatesArgs);
exports.StatesArgs = StatesArgs;
//# sourceMappingURL=state.args.js.map