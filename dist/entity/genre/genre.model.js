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
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let GenreBase = class GenreBase extends Base {
};
GenreBase = __decorate([
    ResultType({ description: 'Genre' })
], GenreBase);
export { GenreBase };
let Genre = class Genre extends GenreBase {
};
__decorate([
    ObjectField({ description: 'Album Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], Genre.prototype, "albumCount", void 0);
__decorate([
    ObjectField({ description: 'Track Count', min: 0, example: 55 }),
    __metadata("design:type", Number)
], Genre.prototype, "trackCount", void 0);
__decorate([
    ObjectField({ description: 'Artist Count', min: 0, example: 55 }),
    __metadata("design:type", Number)
], Genre.prototype, "artistCount", void 0);
__decorate([
    ObjectField({ description: 'Folder Count', min: 0, example: 55 }),
    __metadata("design:type", Number)
], Genre.prototype, "folderCount", void 0);
Genre = __decorate([
    ResultType({ description: 'Genre' })
], Genre);
export { Genre };
let GenrePage = class GenrePage extends Page {
};
__decorate([
    ObjectField(() => Genre, { description: 'List of Genre' }),
    __metadata("design:type", Array)
], GenrePage.prototype, "items", void 0);
GenrePage = __decorate([
    ResultType({ description: 'Genre Page' })
], GenrePage);
export { GenrePage };
let GenreIndexEntry = class GenreIndexEntry {
};
__decorate([
    ObjectField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], GenreIndexEntry.prototype, "id", void 0);
__decorate([
    ObjectField({ description: 'Name', example: 'Awesome' }),
    __metadata("design:type", String)
], GenreIndexEntry.prototype, "name", void 0);
__decorate([
    ObjectField({ description: 'Track Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], GenreIndexEntry.prototype, "trackCount", void 0);
__decorate([
    ObjectField({ description: 'Artist Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], GenreIndexEntry.prototype, "artistCount", void 0);
__decorate([
    ObjectField({ description: 'Album Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], GenreIndexEntry.prototype, "albumCount", void 0);
__decorate([
    ObjectField({ description: 'Folder Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], GenreIndexEntry.prototype, "folderCount", void 0);
GenreIndexEntry = __decorate([
    ResultType({ description: 'Genre Index Entry' })
], GenreIndexEntry);
export { GenreIndexEntry };
let GenreIndexGroup = class GenreIndexGroup {
};
__decorate([
    ObjectField({ description: 'Genre Group Name', example: 'A' }),
    __metadata("design:type", String)
], GenreIndexGroup.prototype, "name", void 0);
__decorate([
    ObjectField(() => [GenreIndexEntry]),
    __metadata("design:type", Array)
], GenreIndexGroup.prototype, "items", void 0);
GenreIndexGroup = __decorate([
    ResultType({ description: 'Genre Index Group' })
], GenreIndexGroup);
export { GenreIndexGroup };
let GenreIndex = class GenreIndex {
};
__decorate([
    ObjectField({ description: 'Last Change Timestamp' }),
    __metadata("design:type", Number)
], GenreIndex.prototype, "lastModified", void 0);
__decorate([
    ObjectField(() => [GenreIndexGroup], { description: 'Genre Index Groups' }),
    __metadata("design:type", Array)
], GenreIndex.prototype, "groups", void 0);
GenreIndex = __decorate([
    ResultType({ description: 'Genre Index' })
], GenreIndex);
export { GenreIndex };
//# sourceMappingURL=genre.model.js.map