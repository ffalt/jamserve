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
exports.GenreIndexQL = exports.GenreIndexGroupQL = exports.GenreQL = exports.Genre = void 0;
const type_graphql_1 = require("type-graphql");
const base_1 = require("../base/base");
let Genre = class Genre {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], Genre.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], Genre.prototype, "trackCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], Genre.prototype, "albumCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], Genre.prototype, "artistCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], Genre.prototype, "seriesCount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], Genre.prototype, "folderCount", void 0);
Genre = __decorate([
    type_graphql_1.ObjectType()
], Genre);
exports.Genre = Genre;
let GenreQL = class GenreQL extends Genre {
};
GenreQL = __decorate([
    type_graphql_1.ObjectType()
], GenreQL);
exports.GenreQL = GenreQL;
let GenreIndexGroupQL = class GenreIndexGroupQL extends base_1.IndexGroup(Genre, GenreQL) {
};
GenreIndexGroupQL = __decorate([
    type_graphql_1.ObjectType()
], GenreIndexGroupQL);
exports.GenreIndexGroupQL = GenreIndexGroupQL;
let GenreIndexQL = class GenreIndexQL extends base_1.Index(GenreIndexGroupQL) {
};
GenreIndexQL = __decorate([
    type_graphql_1.ObjectType()
], GenreIndexQL);
exports.GenreIndexQL = GenreIndexQL;
//# sourceMappingURL=genre.js.map