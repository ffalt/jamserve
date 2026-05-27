var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let LandscapeGenreNode = class LandscapeGenreNode {
};
__decorate([
    ObjectField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], LandscapeGenreNode.prototype, "id", void 0);
__decorate([
    ObjectField({ description: 'Name' }),
    __metadata("design:type", String)
], LandscapeGenreNode.prototype, "name", void 0);
__decorate([
    ObjectField({ description: 'Track Count', min: 0 }),
    __metadata("design:type", Number)
], LandscapeGenreNode.prototype, "trackCount", void 0);
__decorate([
    ObjectField({ description: 'Artist Count', min: 0 }),
    __metadata("design:type", Number)
], LandscapeGenreNode.prototype, "artistCount", void 0);
__decorate([
    ObjectField({ description: 'Album Count', min: 0 }),
    __metadata("design:type", Number)
], LandscapeGenreNode.prototype, "albumCount", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'ENAO X coordinate (0=left/organic, 1=right/mechanical)' }),
    __metadata("design:type", Number)
], LandscapeGenreNode.prototype, "noiseX", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'ENAO Y coordinate (0=top/atmospheric, 1=bottom/energetic)' }),
    __metadata("design:type", Number)
], LandscapeGenreNode.prototype, "noiseY", void 0);
LandscapeGenreNode = __decorate([
    ResultType({ description: 'Landscape Genre Node' })
], LandscapeGenreNode);
export { LandscapeGenreNode };
let LandscapeArtistNode = class LandscapeArtistNode {
};
__decorate([
    ObjectField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], LandscapeArtistNode.prototype, "id", void 0);
__decorate([
    ObjectField({ description: 'Name' }),
    __metadata("design:type", String)
], LandscapeArtistNode.prototype, "name", void 0);
__decorate([
    ObjectField({ description: 'Album Count', min: 0 }),
    __metadata("design:type", Number)
], LandscapeArtistNode.prototype, "albumCount", void 0);
__decorate([
    ObjectField({ description: 'Track Count', min: 0 }),
    __metadata("design:type", Number)
], LandscapeArtistNode.prototype, "trackCount", void 0);
__decorate([
    ObjectField(() => [String], { description: 'Genre IDs this artist belongs to', isID: true }),
    __metadata("design:type", Array)
], LandscapeArtistNode.prototype, "genreIDs", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Computed X position (centroid of genre noise coords + jitter)' }),
    __metadata("design:type", Number)
], LandscapeArtistNode.prototype, "noiseX", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Computed Y position (centroid of genre noise coords + jitter)' }),
    __metadata("design:type", Number)
], LandscapeArtistNode.prototype, "noiseY", void 0);
LandscapeArtistNode = __decorate([
    ResultType({ description: 'Landscape Artist Node' })
], LandscapeArtistNode);
export { LandscapeArtistNode };
let LandscapeData = class LandscapeData {
};
__decorate([
    ObjectField(() => [LandscapeGenreNode], { description: 'All genres as scatter plot nodes' }),
    __metadata("design:type", Array)
], LandscapeData.prototype, "genres", void 0);
__decorate([
    ObjectField(() => [LandscapeArtistNode], { description: 'All artists as scatter plot dots' }),
    __metadata("design:type", Array)
], LandscapeData.prototype, "artists", void 0);
__decorate([
    ObjectField({ description: 'Fraction of genres matched to ENAO coordinate data (0-1)' }),
    __metadata("design:type", Number)
], LandscapeData.prototype, "noiseMatchRate", void 0);
LandscapeData = __decorate([
    ResultType({ description: 'Music Collection Landscape Data' })
], LandscapeData);
export { LandscapeData };
//# sourceMappingURL=landscape.model.js.map