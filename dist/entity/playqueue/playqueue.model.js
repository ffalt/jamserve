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
exports.PlayQueue = exports.PlayQueueBase = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
const tag_model_1 = require("../tag/tag.model");
let PlayQueueBase = class PlayQueueBase {
};
__decorate([
    decorators_1.ObjField({ description: 'User Name', example: 'user' }),
    __metadata("design:type", String)
], PlayQueueBase.prototype, "userName", void 0);
__decorate([
    decorators_1.ObjField({ description: 'User Id', isID: true }),
    __metadata("design:type", String)
], PlayQueueBase.prototype, "userID", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Number of Entries', min: 0, example: 5 }),
    __metadata("design:type", Number)
], PlayQueueBase.prototype, "entriesCount", void 0);
__decorate([
    decorators_1.ObjField(() => [String], { nullable: true, description: 'List of Media IDs' }),
    __metadata("design:type", Array)
], PlayQueueBase.prototype, "entriesIDs", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Current Entry Index in PlayQueue', min: 0, example: 1 }),
    __metadata("design:type", Number)
], PlayQueueBase.prototype, "currentIndex", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Position in Current Entry', min: 0, example: 12345 }),
    __metadata("design:type", Number)
], PlayQueueBase.prototype, "mediaPosition", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Created Timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], PlayQueueBase.prototype, "created", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Changed Timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], PlayQueueBase.prototype, "changed", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Last Changed by Client', example: 'Jamberry v1' }),
    __metadata("design:type", String)
], PlayQueueBase.prototype, "changedBy", void 0);
PlayQueueBase = __decorate([
    decorators_1.ResultType({ description: 'PlayQueue' })
], PlayQueueBase);
exports.PlayQueueBase = PlayQueueBase;
let PlayQueue = class PlayQueue extends PlayQueueBase {
};
__decorate([
    decorators_1.ObjField(() => [tag_model_1.MediaBase], { nullable: true, description: 'List of Media Entries' }),
    __metadata("design:type", Array)
], PlayQueue.prototype, "entries", void 0);
PlayQueue = __decorate([
    decorators_1.ResultType({ description: 'PlayQueue' })
], PlayQueue);
exports.PlayQueue = PlayQueue;
//# sourceMappingURL=playqueue.model.js.map