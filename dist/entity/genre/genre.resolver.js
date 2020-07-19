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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreResolver = void 0;
const type_graphql_1 = require("type-graphql");
const genre_1 = require("./genre");
let GenreResolver = class GenreResolver {
    async genres({ engine }) {
        return engine.genreService.getGenres();
    }
    async genresIndex({ engine }) {
        return await engine.genreService.index();
    }
};
__decorate([
    type_graphql_1.Query(() => [genre_1.GenreQL], { description: 'Get a list of genres found in the library' }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "genres", null);
__decorate([
    type_graphql_1.Query(() => genre_1.GenreIndexQL, { description: 'Get the Navigation Index for Genres' }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "genresIndex", null);
GenreResolver = __decorate([
    type_graphql_1.Resolver(genre_1.GenreQL)
], GenreResolver);
exports.GenreResolver = GenreResolver;
//# sourceMappingURL=genre.resolver.js.map