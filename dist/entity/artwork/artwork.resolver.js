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
exports.ArtworkResolver = void 0;
const type_graphql_1 = require("type-graphql");
const artwork_1 = require("./artwork");
const folder_1 = require("../folder/folder");
const Root_1 = require("type-graphql/dist/decorators/Root");
const artwork_args_1 = require("./artwork.args");
let ArtworkResolver = class ArtworkResolver {
    async artwork(id, { orm }) {
        return await orm.Artwork.oneOrFailByID(id);
    }
    async artworks({ page, filter, order, list }, { orm, user }) {
        if (list) {
            return await orm.Artwork.findListFilter(list, filter, order, page, user);
        }
        return await orm.Artwork.searchFilter(filter, order, page, user);
    }
    async folder(artwork, { orm }) {
        return artwork.folder.getOrFail();
    }
};
__decorate([
    type_graphql_1.Query(() => artwork_1.ArtworkQL, { description: 'Get an Artwork by Id' }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ArtworkResolver.prototype, "artwork", null);
__decorate([
    type_graphql_1.Query(() => artwork_1.ArtworkPageQL, { description: 'Search Artworks' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artwork_args_1.ArtworksArgsQL, Object]),
    __metadata("design:returntype", Promise)
], ArtworkResolver.prototype, "artworks", null);
__decorate([
    type_graphql_1.FieldResolver(() => folder_1.FolderQL, { description: 'Get the Navigation Index for Albums' }),
    __param(0, Root_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artwork_1.Artwork, Object]),
    __metadata("design:returntype", Promise)
], ArtworkResolver.prototype, "folder", null);
ArtworkResolver = __decorate([
    type_graphql_1.Resolver(artwork_1.ArtworkQL)
], ArtworkResolver);
exports.ArtworkResolver = ArtworkResolver;
//# sourceMappingURL=artwork.resolver.js.map