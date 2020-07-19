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
exports.Stats = exports.StatsAlbumTypes = void 0;
const decorators_1 = require("../../modules/rest/decorators");
let StatsAlbumTypes = class StatsAlbumTypes {
};
__decorate([
    decorators_1.ObjField({ description: 'Number of Type Album', min: 0, example: 10 }),
    __metadata("design:type", Number)
], StatsAlbumTypes.prototype, "album", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Number of Various Artists Type Compilation', min: 0, example: 9 }),
    __metadata("design:type", Number)
], StatsAlbumTypes.prototype, "compilation", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Number of Single Artists Type Compilation', min: 0, example: 8 }),
    __metadata("design:type", Number)
], StatsAlbumTypes.prototype, "artistCompilation", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Number of Type Live', min: 0, example: 7 }),
    __metadata("design:type", Number)
], StatsAlbumTypes.prototype, "live", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Number of Type Live', min: 0, example: 6 }),
    __metadata("design:type", Number)
], StatsAlbumTypes.prototype, "audiobook", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Number of Type Live', min: 0, example: 5 }),
    __metadata("design:type", Number)
], StatsAlbumTypes.prototype, "soundtrack", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Number of Type Series', min: 0, example: 4 }),
    __metadata("design:type", Number)
], StatsAlbumTypes.prototype, "series", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Number of Type Live', min: 0, example: 3 }),
    __metadata("design:type", Number)
], StatsAlbumTypes.prototype, "bootleg", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Number of Type Live', min: 0, example: 2 }),
    __metadata("design:type", Number)
], StatsAlbumTypes.prototype, "ep", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Number of Type Live', min: 0, example: 1 }),
    __metadata("design:type", Number)
], StatsAlbumTypes.prototype, "single", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Number of Type Unknown', min: 0, example: 0 }),
    __metadata("design:type", Number)
], StatsAlbumTypes.prototype, "unknown", void 0);
StatsAlbumTypes = __decorate([
    decorators_1.ResultType({ description: 'Library Stats by Album Type' })
], StatsAlbumTypes);
exports.StatsAlbumTypes = StatsAlbumTypes;
let Stats = class Stats {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Root ID', isID: true }),
    __metadata("design:type", String)
], Stats.prototype, "rootID", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Number of Tracks', min: 0, example: 555 }),
    __metadata("design:type", Number)
], Stats.prototype, "track", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Number of Folders', min: 0, example: 55 }),
    __metadata("design:type", Number)
], Stats.prototype, "folder", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Number of Series', min: 0, example: 5 }),
    __metadata("design:type", Number)
], Stats.prototype, "series", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Number of Artists', min: 0, example: 5 }),
    __metadata("design:type", Number)
], Stats.prototype, "artist", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Detailed Artists Stats', min: 0, example: 5 }),
    __metadata("design:type", StatsAlbumTypes)
], Stats.prototype, "artistTypes", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Number of Albums', min: 0, example: 5 }),
    __metadata("design:type", Number)
], Stats.prototype, "album", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Detailed Album Stats', min: 0, example: 5 }),
    __metadata("design:type", StatsAlbumTypes)
], Stats.prototype, "albumTypes", void 0);
Stats = __decorate([
    decorators_1.ResultType({ description: 'Library Stats' })
], Stats);
exports.Stats = Stats;
//# sourceMappingURL=stats.model.js.map