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
exports.TrackLyrics = exports.TrackHealth = exports.TrackPage = exports.Track = exports.TrackBase = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const tag_model_1 = require("../tag/tag.model");
const health_model_1 = require("../health/health.model");
const base_model_1 = require("../base/base.model");
let TrackBase = class TrackBase extends tag_model_1.MediaBase {
};
__decorate([
    decorators_1.ObjField({ description: 'Parent Folder Id', isID: true }),
    __metadata("design:type", String)
], TrackBase.prototype, "parentID", void 0);
TrackBase = __decorate([
    decorators_1.ResultType({ description: 'Track Base' })
], TrackBase);
exports.TrackBase = TrackBase;
let Track = class Track extends TrackBase {
};
Track = __decorate([
    decorators_1.ResultType({ description: 'Track' })
], Track);
exports.Track = Track;
let TrackPage = class TrackPage extends base_model_1.Page {
};
__decorate([
    decorators_1.ObjField(() => Track, { description: 'List of Tracks' }),
    __metadata("design:type", Array)
], TrackPage.prototype, "items", void 0);
TrackPage = __decorate([
    decorators_1.ResultType({ description: 'Tracks Page' })
], TrackPage);
exports.TrackPage = TrackPage;
let TrackHealth = class TrackHealth {
};
__decorate([
    decorators_1.ObjField(() => TrackBase, { description: 'Track' }),
    __metadata("design:type", TrackBase)
], TrackHealth.prototype, "track", void 0);
__decorate([
    decorators_1.ObjField(() => [health_model_1.TrackHealthHint], { description: 'List of Health Hints' }),
    __metadata("design:type", Array)
], TrackHealth.prototype, "health", void 0);
TrackHealth = __decorate([
    decorators_1.ResultType({ description: 'Track Health' })
], TrackHealth);
exports.TrackHealth = TrackHealth;
let TrackLyrics = class TrackLyrics {
};
__decorate([
    decorators_1.ObjField({
        nullable: true,
        description: 'Lyrics',
        example: 'I got a letter from the government\nThe other day\nI opened and read it\nIt said they were suckers\n They wanted me for their army or whatever\n Picture me given’ a damn, I said never.'
    }),
    __metadata("design:type", String)
], TrackLyrics.prototype, "lyrics", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Audio Tag or External Service' }),
    __metadata("design:type", String)
], TrackLyrics.prototype, "source", void 0);
TrackLyrics = __decorate([
    decorators_1.ResultType({ description: 'Track Lyrics (via External Service or Audio Tag)' })
], TrackLyrics);
exports.TrackLyrics = TrackLyrics;
//# sourceMappingURL=track.model.js.map