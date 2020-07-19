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
exports.PlayQueueSetArgs = exports.IncludesPlayQueueArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
let IncludesPlayQueueArgs = class IncludesPlayQueueArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include entries on play queue', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPlayQueueArgs.prototype, "playQueueEntries", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include entry ids on play queue', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPlayQueueArgs.prototype, "playQueueEntriesIDs", void 0);
IncludesPlayQueueArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesPlayQueueArgs);
exports.IncludesPlayQueueArgs = IncludesPlayQueueArgs;
let PlayQueueSetArgs = class PlayQueueSetArgs {
};
__decorate([
    decorators_1.ObjField(() => [String], { nullable: true, description: 'Media Ids of the play queue' }),
    __metadata("design:type", Array)
], PlayQueueSetArgs.prototype, "mediaIDs", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Current Media Id' }),
    __metadata("design:type", String)
], PlayQueueSetArgs.prototype, "currentID", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Position in Current Media', min: 0 }),
    __metadata("design:type", Number)
], PlayQueueSetArgs.prototype, "position", void 0);
PlayQueueSetArgs = __decorate([
    decorators_1.ObjParamsType()
], PlayQueueSetArgs);
exports.PlayQueueSetArgs = PlayQueueSetArgs;
//# sourceMappingURL=playqueue.args.js.map