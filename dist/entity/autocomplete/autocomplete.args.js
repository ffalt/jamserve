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
exports.AutoCompleteFilterArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
let AutoCompleteFilterArgs = class AutoCompleteFilterArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'query to complete', example: 'awesome' }),
    __metadata("design:type", String)
], AutoCompleteFilterArgs.prototype, "query", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'amount of track names to complete', defaultValue: 0, min: 0, example: 5 }),
    __metadata("design:type", Number)
], AutoCompleteFilterArgs.prototype, "track", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'amount of artist names to complete', defaultValue: 0, min: 0, example: 5 }),
    __metadata("design:type", Number)
], AutoCompleteFilterArgs.prototype, "artist", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'amount of album names to complete', defaultValue: 0, min: 0, example: 5 }),
    __metadata("design:type", Number)
], AutoCompleteFilterArgs.prototype, "album", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'amount of folder names to complete', defaultValue: 0, min: 0, example: 5 }),
    __metadata("design:type", Number)
], AutoCompleteFilterArgs.prototype, "folder", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'amount of playlist names to complete', defaultValue: 0, min: 0, example: 5 }),
    __metadata("design:type", Number)
], AutoCompleteFilterArgs.prototype, "playlist", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'amount of podcast names to complete', defaultValue: 0, min: 0, example: 5 }),
    __metadata("design:type", Number)
], AutoCompleteFilterArgs.prototype, "podcast", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'amount of episode names to complete', defaultValue: 0, min: 0, example: 5 }),
    __metadata("design:type", Number)
], AutoCompleteFilterArgs.prototype, "episode", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'amount of series names to complete', defaultValue: 0, min: 0, example: 5 }),
    __metadata("design:type", Number)
], AutoCompleteFilterArgs.prototype, "series", void 0);
AutoCompleteFilterArgs = __decorate([
    decorators_1.ObjParamsType()
], AutoCompleteFilterArgs);
exports.AutoCompleteFilterArgs = AutoCompleteFilterArgs;
//# sourceMappingURL=autocomplete.args.js.map