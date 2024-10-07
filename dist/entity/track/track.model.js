var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { MediaBase } from '../tag/tag.model.js';
import { TrackHealthHint } from '../health/health.model.js';
import { Page } from '../base/base.model.js';
import { ResultType } from '../../modules/rest/decorators/ResultType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
let TrackBase = class TrackBase extends MediaBase {
};
__decorate([
    ObjField({ description: 'Parent Folder Id', isID: true }),
    __metadata("design:type", String)
], TrackBase.prototype, "parentID", void 0);
TrackBase = __decorate([
    ResultType({ description: 'Track Base' })
], TrackBase);
export { TrackBase };
let Track = class Track extends TrackBase {
};
Track = __decorate([
    ResultType({ description: 'Track' })
], Track);
export { Track };
let TrackPage = class TrackPage extends Page {
};
__decorate([
    ObjField(() => Track, { description: 'List of Tracks' }),
    __metadata("design:type", Array)
], TrackPage.prototype, "items", void 0);
TrackPage = __decorate([
    ResultType({ description: 'Tracks Page' })
], TrackPage);
export { TrackPage };
let TrackHealth = class TrackHealth {
};
__decorate([
    ObjField(() => TrackBase, { description: 'Track' }),
    __metadata("design:type", TrackBase)
], TrackHealth.prototype, "track", void 0);
__decorate([
    ObjField(() => [TrackHealthHint], { description: 'List of Health Hints' }),
    __metadata("design:type", Array)
], TrackHealth.prototype, "health", void 0);
TrackHealth = __decorate([
    ResultType({ description: 'Track Health' })
], TrackHealth);
export { TrackHealth };
let TrackLyrics = class TrackLyrics {
};
__decorate([
    ObjField({
        nullable: true,
        description: 'Lyrics',
        example: 'I got a letter from the government\nThe other day\nI opened and read it\nIt said they were suckers\n They wanted me for their army or whatever\n Picture me given’ a damn, I said never.'
    }),
    __metadata("design:type", String)
], TrackLyrics.prototype, "lyrics", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Audio Tag or External Service' }),
    __metadata("design:type", String)
], TrackLyrics.prototype, "source", void 0);
TrackLyrics = __decorate([
    ResultType({ description: 'Track Lyrics (via External Service or Audio Tag)' })
], TrackLyrics);
export { TrackLyrics };
//# sourceMappingURL=track.model.js.map