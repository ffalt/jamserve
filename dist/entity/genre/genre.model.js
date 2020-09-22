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
exports.GenreIndex = exports.GenreIndexGroup = exports.GenreIndexEntry = exports.GenrePage = exports.Genre = exports.GenreBase = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const base_model_1 = require("../base/base.model");
let GenreBase = class GenreBase extends base_model_1.Base {
};
GenreBase = __decorate([
    decorators_1.ResultType({ description: 'Genre' })
], GenreBase);
exports.GenreBase = GenreBase;
let Genre = class Genre extends GenreBase {
};
__decorate([
    decorators_1.ObjField({ description: 'Album Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], Genre.prototype, "albumCount", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Track Count', min: 0, example: 55 }),
    __metadata("design:type", Number)
], Genre.prototype, "trackCount", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Artist Count', min: 0, example: 55 }),
    __metadata("design:type", Number)
], Genre.prototype, "artistCount", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Folder Count', min: 0, example: 55 }),
    __metadata("design:type", Number)
], Genre.prototype, "folderCount", void 0);
Genre = __decorate([
    decorators_1.ResultType({ description: 'Genre' })
], Genre);
exports.Genre = Genre;
let GenrePage = class GenrePage extends base_model_1.Page {
};
__decorate([
    decorators_1.ObjField(() => Genre, { description: 'List of Genre' }),
    __metadata("design:type", Array)
], GenrePage.prototype, "items", void 0);
GenrePage = __decorate([
    decorators_1.ResultType({ description: 'Genre Page' })
], GenrePage);
exports.GenrePage = GenrePage;
let GenreIndexEntry = class GenreIndexEntry {
};
__decorate([
    decorators_1.ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], GenreIndexEntry.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Name', example: 'Awesome' }),
    __metadata("design:type", String)
], GenreIndexEntry.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Track Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], GenreIndexEntry.prototype, "trackCount", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Artist Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], GenreIndexEntry.prototype, "artistCount", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Album Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], GenreIndexEntry.prototype, "albumCount", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Folder Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], GenreIndexEntry.prototype, "folderCount", void 0);
GenreIndexEntry = __decorate([
    decorators_1.ResultType({ description: 'Genre Index Entry' })
], GenreIndexEntry);
exports.GenreIndexEntry = GenreIndexEntry;
let GenreIndexGroup = class GenreIndexGroup {
};
__decorate([
    decorators_1.ObjField({ description: 'Genre Group Name', example: 'A' }),
    __metadata("design:type", String)
], GenreIndexGroup.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField(() => [GenreIndexEntry]),
    __metadata("design:type", Array)
], GenreIndexGroup.prototype, "items", void 0);
GenreIndexGroup = __decorate([
    decorators_1.ResultType({ description: 'Genre Index Group' })
], GenreIndexGroup);
exports.GenreIndexGroup = GenreIndexGroup;
let GenreIndex = class GenreIndex {
};
__decorate([
    decorators_1.ObjField({ description: 'Last Change Timestamp' }),
    __metadata("design:type", Number)
], GenreIndex.prototype, "lastModified", void 0);
__decorate([
    decorators_1.ObjField(() => [GenreIndexGroup], { description: 'Genre Index Groups' }),
    __metadata("design:type", Array)
], GenreIndex.prototype, "groups", void 0);
GenreIndex = __decorate([
    decorators_1.ResultType({ description: 'Genre Index' })
], GenreIndex);
exports.GenreIndex = GenreIndex;
//# sourceMappingURL=genre.model.js.map