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
exports.RadioIndex = exports.RadioIndexGroup = exports.RadioIndexEntry = exports.RadioPage = exports.Radio = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const base_model_1 = require("../base/base.model");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
let Radio = class Radio extends base_model_1.Base {
};
__decorate([
    decorators_1.ObjField({ description: 'URL', example: 'https://radio.example.com/stream.m3u' }),
    __metadata("design:type", String)
], Radio.prototype, "url", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Homepage', example: 'https://radio.example.com' }),
    __metadata("design:type", String)
], Radio.prototype, "homepage", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Changed Timestamp', example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], Radio.prototype, "changed", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Disabled', example: false }),
    __metadata("design:type", Boolean)
], Radio.prototype, "disabled", void 0);
Radio = __decorate([
    decorators_1.ResultType({ description: 'Radio' })
], Radio);
exports.Radio = Radio;
let RadioPage = class RadioPage extends base_model_1.Page {
};
__decorate([
    decorators_1.ObjField(() => Radio, { description: 'List of Radio' }),
    __metadata("design:type", Array)
], RadioPage.prototype, "items", void 0);
RadioPage = __decorate([
    decorators_1.ResultType({ description: 'Radio Page' })
], RadioPage);
exports.RadioPage = RadioPage;
let RadioIndexEntry = class RadioIndexEntry {
};
__decorate([
    decorators_1.ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], RadioIndexEntry.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Name', example: 'Awesome Webradio' }),
    __metadata("design:type", String)
], RadioIndexEntry.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField({ description: 'URL', example: 'https://radio.example.com/stream.m3u' }),
    __metadata("design:type", String)
], RadioIndexEntry.prototype, "url", void 0);
RadioIndexEntry = __decorate([
    decorators_1.ResultType({ description: 'Radio Index Entry' })
], RadioIndexEntry);
exports.RadioIndexEntry = RadioIndexEntry;
let RadioIndexGroup = class RadioIndexGroup {
};
__decorate([
    decorators_1.ObjField({ description: 'Radio Group Name', example: 'P' }),
    __metadata("design:type", String)
], RadioIndexGroup.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField(() => [RadioIndexEntry]),
    __metadata("design:type", Array)
], RadioIndexGroup.prototype, "items", void 0);
RadioIndexGroup = __decorate([
    decorators_1.ResultType({ description: 'Radio Index Group' })
], RadioIndexGroup);
exports.RadioIndexGroup = RadioIndexGroup;
let RadioIndex = class RadioIndex {
};
__decorate([
    decorators_1.ObjField({ description: 'Last Change Timestamp' }),
    __metadata("design:type", Number)
], RadioIndex.prototype, "lastModified", void 0);
__decorate([
    decorators_1.ObjField(() => [RadioIndexGroup], { description: 'Radio Index Groups' }),
    __metadata("design:type", Array)
], RadioIndex.prototype, "groups", void 0);
RadioIndex = __decorate([
    decorators_1.ResultType({ description: 'Radio Index' })
], RadioIndex);
exports.RadioIndex = RadioIndex;
//# sourceMappingURL=radio.model.js.map