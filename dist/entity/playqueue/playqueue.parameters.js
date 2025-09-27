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
let IncludesPlayQueueParameters = class IncludesPlayQueueParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'include entries on play queue', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPlayQueueParameters.prototype, "playQueueEntries", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include entry ids on play queue', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPlayQueueParameters.prototype, "playQueueEntriesIDs", void 0);
IncludesPlayQueueParameters = __decorate([
    ObjectParametersType()
], IncludesPlayQueueParameters);
export { IncludesPlayQueueParameters };
let PlayQueueSetParameters = class PlayQueueSetParameters {
};
__decorate([
    ObjectField(() => [String], { nullable: true, description: 'Media Ids of the play queue' }),
    __metadata("design:type", Array)
], PlayQueueSetParameters.prototype, "mediaIDs", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Current Media Id' }),
    __metadata("design:type", String)
], PlayQueueSetParameters.prototype, "currentID", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Position in Current Media', min: 0 }),
    __metadata("design:type", Number)
], PlayQueueSetParameters.prototype, "position", void 0);
PlayQueueSetParameters = __decorate([
    ObjectParametersType()
], PlayQueueSetParameters);
export { PlayQueueSetParameters };
//# sourceMappingURL=playqueue.parameters.js.map