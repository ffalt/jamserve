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
import { Arg, Args, Ctx, FieldResolver, ID, Query, Resolver } from 'type-graphql';
import { Artwork, ArtworkPageQL, ArtworkQL } from './artwork';
import { FolderQL } from '../folder/folder';
import { Root as GQLRoot } from 'type-graphql/dist/decorators/Root';
import { ArtworksArgsQL } from './artwork.args';
let ArtworkResolver = class ArtworkResolver {
    async artwork(id, { orm }) {
        return await orm.Artwork.oneOrFailByID(id);
    }
    async artworks({ page, filter, order, list, seed }, { orm, user }) {
        if (list) {
            return await orm.Artwork.findListFilter(list, seed, filter, order, page, user);
        }
        return await orm.Artwork.searchFilter(filter, order, page, user);
    }
    async folder(artwork) {
        return artwork.folder.getOrFail();
    }
};
__decorate([
    Query(() => ArtworkQL, { description: 'Get an Artwork by Id' }),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ArtworkResolver.prototype, "artwork", null);
__decorate([
    Query(() => ArtworkPageQL, { description: 'Search Artworks' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ArtworksArgsQL, Object]),
    __metadata("design:returntype", Promise)
], ArtworkResolver.prototype, "artworks", null);
__decorate([
    FieldResolver(() => FolderQL, { description: 'Get the Navigation Index for Albums' }),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Artwork]),
    __metadata("design:returntype", Promise)
], ArtworkResolver.prototype, "folder", null);
ArtworkResolver = __decorate([
    Resolver(ArtworkQL)
], ArtworkResolver);
export { ArtworkResolver };
//# sourceMappingURL=artwork.resolver.js.map