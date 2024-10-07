var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Base, Page } from '../base/base.model.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ResultType } from '../../modules/rest/decorators/ResultType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
let Radio = class Radio extends Base {
};
__decorate([
    ObjField({ description: 'URL', example: 'https://radio.example.com/stream.m3u' }),
    __metadata("design:type", String)
], Radio.prototype, "url", void 0);
__decorate([
    ObjField({ description: 'Homepage', example: 'https://radio.example.com' }),
    __metadata("design:type", String)
], Radio.prototype, "homepage", void 0);
__decorate([
    ObjField({ description: 'Changed Timestamp', example: examples.timestamp }),
    __metadata("design:type", Number)
], Radio.prototype, "changed", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Disabled', example: false }),
    __metadata("design:type", Boolean)
], Radio.prototype, "disabled", void 0);
Radio = __decorate([
    ResultType({ description: 'Radio' })
], Radio);
export { Radio };
let RadioPage = class RadioPage extends Page {
};
__decorate([
    ObjField(() => Radio, { description: 'List of Radio' }),
    __metadata("design:type", Array)
], RadioPage.prototype, "items", void 0);
RadioPage = __decorate([
    ResultType({ description: 'Radio Page' })
], RadioPage);
export { RadioPage };
let RadioIndexEntry = class RadioIndexEntry {
};
__decorate([
    ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], RadioIndexEntry.prototype, "id", void 0);
__decorate([
    ObjField({ description: 'Name', example: 'Awesome Webradio' }),
    __metadata("design:type", String)
], RadioIndexEntry.prototype, "name", void 0);
__decorate([
    ObjField({ description: 'URL', example: 'https://radio.example.com/stream.m3u' }),
    __metadata("design:type", String)
], RadioIndexEntry.prototype, "url", void 0);
RadioIndexEntry = __decorate([
    ResultType({ description: 'Radio Index Entry' })
], RadioIndexEntry);
export { RadioIndexEntry };
let RadioIndexGroup = class RadioIndexGroup {
};
__decorate([
    ObjField({ description: 'Radio Group Name', example: 'P' }),
    __metadata("design:type", String)
], RadioIndexGroup.prototype, "name", void 0);
__decorate([
    ObjField(() => [RadioIndexEntry]),
    __metadata("design:type", Array)
], RadioIndexGroup.prototype, "items", void 0);
RadioIndexGroup = __decorate([
    ResultType({ description: 'Radio Index Group' })
], RadioIndexGroup);
export { RadioIndexGroup };
let RadioIndex = class RadioIndex {
};
__decorate([
    ObjField({ description: 'Last Change Timestamp' }),
    __metadata("design:type", Number)
], RadioIndex.prototype, "lastModified", void 0);
__decorate([
    ObjField(() => [RadioIndexGroup], { description: 'Radio Index Groups' }),
    __metadata("design:type", Array)
], RadioIndex.prototype, "groups", void 0);
RadioIndex = __decorate([
    ResultType({ description: 'Radio Index' })
], RadioIndex);
export { RadioIndex };
//# sourceMappingURL=radio.model.js.map