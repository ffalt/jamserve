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
let LandscapeParameters = class LandscapeParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'Ignore genre entries with no ENAO coordinate match' }),
    __metadata("design:type", Boolean)
], LandscapeParameters.prototype, "ignoreUnknownGenres", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Include only artists that have at least one album' }),
    __metadata("design:type", Boolean)
], LandscapeParameters.prototype, "artistsWithAlbumsOnly", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Exclude artists that have no computed noise position (all genres unpositioned)', min: 0 }),
    __metadata("design:type", Boolean)
], LandscapeParameters.prototype, "ignoreUnpositionedArtists", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Minimum track count for a genre to be included', min: 0 }),
    __metadata("design:type", Number)
], LandscapeParameters.prototype, "minGenreTrackCount", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Minimum artist count for a genre to be included', min: 0 }),
    __metadata("design:type", Number)
], LandscapeParameters.prototype, "minGenreArtistCount", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Minimum track count for an artist to be included', min: 0 }),
    __metadata("design:type", Number)
], LandscapeParameters.prototype, "minArtistTrackCount", void 0);
LandscapeParameters = __decorate([
    ObjectParametersType()
], LandscapeParameters);
export { LandscapeParameters };
//# sourceMappingURL=landscape.parameters.js.map