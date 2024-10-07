var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Inject, InRequestScope } from 'typescript-ioc';
import { BaseTransformService } from '../base/base.transform.js';
import { DBObjectType, FolderType } from '../../types/enums.js';
import { MetaDataService } from '../metadata/metadata.service.js';
import { GenreTransformService } from '../genre/genre.transform.js';
let FolderTransformService = class FolderTransformService extends BaseTransformService {
    async folderBases(orm, list, folderArgs, user) {
        return await Promise.all(list.map(o => this.folderBase(orm, o, folderArgs, user)));
    }
    async folderInfo(orm, o) {
        return o.folderType === FolderType.artist ?
            await this.metaData.extInfo.byFolderArtist(orm, o) :
            await this.metaData.extInfo.byFolderAlbum(orm, o);
    }
    async folderGenres(orm, o, user) {
        return this.Genre.genreBases(orm, await o.genres.getItems(), {}, user);
    }
    async folderBase(orm, o, folderArgs, user) {
        return {
            id: o.id,
            name: o.name,
            title: o.title,
            created: o.createdAt.valueOf(),
            type: o.folderType,
            level: o.level,
            parentID: o.parent.id(),
            genres: folderArgs.folderIncGenres ? await this.folderGenres(orm, o, user) : undefined,
            trackCount: folderArgs.folderIncTrackCount ? await o.tracks.count() : undefined,
            folderCount: folderArgs.folderIncChildFolderCount ? await o.children.count() : undefined,
            artworkCount: folderArgs.folderIncArtworkCount ? await o.children.count() : undefined,
            tag: folderArgs.folderIncTag ? await this.folderTag(o) : undefined,
            parents: folderArgs.folderIncParents ? await this.folderParents(orm, o) : undefined,
            trackIDs: folderArgs.folderIncTrackIDs ? await o.tracks.getIDs() : undefined,
            folderIDs: folderArgs.folderIncFolderIDs ? await o.children.getIDs() : undefined,
            artworkIDs: folderArgs.folderIncArtworkIDs ? await o.artworks.getIDs() : undefined,
            info: folderArgs.folderIncInfo ? await this.folderInfo(orm, o) : undefined,
            state: folderArgs.folderIncSimilar ? await this.state(orm, o.id, DBObjectType.folder, user.id) : undefined
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
            folderIncFolderIDs: folderChildrenArgs.folderChildIncFolderIDs
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
    Inject,
    __metadata("design:type", MetaDataService)
], FolderTransformService.prototype, "metaData", void 0);
__decorate([
    Inject,
    __metadata("design:type", GenreTransformService)
], FolderTransformService.prototype, "Genre", void 0);
FolderTransformService = __decorate([
    InRequestScope
], FolderTransformService);
export { FolderTransformService };
//# sourceMappingURL=folder.transform.js.map