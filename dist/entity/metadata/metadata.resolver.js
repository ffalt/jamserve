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
import { Arg, Ctx, ID, Query, Resolver } from 'type-graphql';
import { ExtendedInfoQL, ExtendedInfoResultQL } from './metadata.model.js';
import { FolderType } from '../../types/enums.js';
let MetadataResolver = class MetadataResolver {
    async folderInfo(id, { orm, engine }) {
        const folder = await orm.Folder.oneOrFailByID(id);
        if (folder.folderType === FolderType.artist) {
            return { info: await engine.metadata.extInfo.byFolderArtist(orm, folder) };
        }
        else {
            return { info: await engine.metadata.extInfo.byFolderArtist(orm, folder) };
        }
    }
    async artistInfo(id, { orm, engine }) {
        const artist = await orm.Artist.oneOrFailByID(id);
        return { info: await engine.metadata.extInfo.byArtist(orm, artist) };
    }
    async albumInfo(id, { orm, engine }) {
        const album = await orm.Album.oneOrFailByID(id);
        return { info: await engine.metadata.extInfo.byAlbum(orm, album) };
    }
    async seriesInfo(id, { orm, engine }) {
        const series = await orm.Series.oneOrFailByID(id);
        return { info: await engine.metadata.extInfo.bySeries(orm, series) };
    }
};
__decorate([
    Query(() => ExtendedInfoResultQL, { description: 'Get Extended Info for Folder by Id' }),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MetadataResolver.prototype, "folderInfo", null);
__decorate([
    Query(() => ExtendedInfoResultQL, { description: 'Get Extended Info for Artist by Id' }),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MetadataResolver.prototype, "artistInfo", null);
__decorate([
    Query(() => ExtendedInfoResultQL, { description: 'Get Extended Info for Album by Id' }),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MetadataResolver.prototype, "albumInfo", null);
__decorate([
    Query(() => ExtendedInfoResultQL, { description: 'Get Extended Info for Series by Id' }),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MetadataResolver.prototype, "seriesInfo", null);
MetadataResolver = __decorate([
    Resolver(ExtendedInfoQL)
], MetadataResolver);
export { MetadataResolver };
//# sourceMappingURL=metadata.resolver.js.map