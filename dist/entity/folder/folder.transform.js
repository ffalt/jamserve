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
exports.FolderTransformService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const base_transform_1 = require("../base/base.transform");
const enums_1 = require("../../types/enums");
const metadata_service_1 = require("../metadata/metadata.service");
const genre_transform_1 = require("../genre/genre.transform");
let FolderTransformService = class FolderTransformService extends base_transform_1.BaseTransformService {
    async folderBases(orm, list, folderArgs, user) {
        return await Promise.all(list.map(o => this.folderBase(orm, o, folderArgs, user)));
    }
    async folderBase(orm, o, folderArgs, user) {
        let info;
        if (folderArgs.folderIncInfo) {
            info =
                o.folderType === enums_1.FolderType.artist ?
                    await this.metaData.extInfo.byFolderArtist(orm, o) :
                    await this.metaData.extInfo.byFolderAlbum(orm, o);
        }
        const parentID = o.parent.id();
        return {
            id: o.id,
            name: o.name,
            title: o.title,
            created: o.createdAt.valueOf(),
            type: o.folderType,
            level: o.level,
            parentID,
            genres: folderArgs.folderIncGenres ? await this.Genre.genreBases(orm, await o.genres.getItems(), {}, user) : undefined,
            trackCount: folderArgs.folderIncTrackCount ? await o.tracks.count() : undefined,
            folderCount: folderArgs.folderIncChildFolderCount ? await o.children.count() : undefined,
            artworkCount: folderArgs.folderIncArtworkCount ? await o.children.count() : undefined,
            tag: folderArgs.folderIncTag ? await this.folderTag(o) : undefined,
            parents: folderArgs.folderIncParents ? await this.folderParents(orm, o) : undefined,
            trackIDs: folderArgs.folderIncTrackIDs ? (await o.tracks.getItems()).map(t => t.id) : undefined,
            folderIDs: folderArgs.folderIncFolderIDs ? (await o.children.getItems()).map(t => t.id) : undefined,
            artworkIDs: folderArgs.folderIncArtworkIDs ? (await o.artworks.getItems()).map(t => t.id) : undefined,
            info,
            state: folderArgs.folderIncSimilar ? await this.state(orm, o.id, enums_1.DBObjectType.folder, user.id) : undefined
        };
    }
    async folderChildren(orm, o, folderChildrenArgs, user) {
        const folderArgs = {
            folderIncTag: folderChildrenArgs.folderChildIncTag,
            folderIncState: folderChildrenArgs.folderChildIncState,
            folderIncChildFolderCount: folderChildrenArgs.folderChildIncChildFolderCount,
            folderIncTrackCount: folderChildrenArgs.folderChildIncTrackCount,
            folderIncArtworkCount: folderChildrenArgs.folderChildIncArtworkCount,
            folderIncParents: folderChildrenArgs.folderChildIncParents,
            folderIncInfo: folderChildrenArgs.folderChildIncInfo,
            folderIncSimilar: folderChildrenArgs.folderChildIncSimilar,
            folderIncArtworkIDs: folderChildrenArgs.folderChildIncArtworkIDs,
            folderIncTrackIDs: folderChildrenArgs.folderChildIncTrackIDs,
            folderIncFolderIDs: folderChildrenArgs.folderChildIncFolderIDs,
        };
        return await Promise.all((await o.children.getItems()).map(t => this.folderBase(orm, t, folderArgs, user)));
    }
    async folderIndex(orm, result) {
        return this.index(result, async (item) => {
            return {
                id: item.id,
                name: item.name,
                trackCount: await item.tracks.count()
            };
        });
    }
    async folderTag(o) {
        return {
            album: o.album,
            albumType: o.albumType,
            artist: o.artist,
            artistSort: o.artistSort,
            genres: (await o.genres.getItems()).map(g => g.name),
            year: o.year,
            mbArtistID: o.mbArtistID,
            mbReleaseID: o.mbReleaseID,
            mbReleaseGroupID: o.mbReleaseGroupID
        };
    }
    async folderParents(orm, o) {
        const result = [];
        let parent = o;
        while (parent) {
            parent = await parent.parent.get();
            if (parent) {
                result.unshift({ id: parent.id, name: parent.name });
            }
        }
        return result;
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", metadata_service_1.MetaDataService)
], FolderTransformService.prototype, "metaData", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", genre_transform_1.GenreTransformService)
], FolderTransformService.prototype, "Genre", void 0);
FolderTransformService = __decorate([
    typescript_ioc_1.InRequestScope
], FolderTransformService);
exports.FolderTransformService = FolderTransformService;
//# sourceMappingURL=folder.transform.js.map