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
    async folderBases(orm, list, folderParameters, user) {
        return await Promise.all(list.map(o => this.folderBase(orm, o, folderParameters, user)));
    }
    async folderInfo(orm, o) {
        return o.folderType === FolderType.artist ?
            await this.metaData.extInfo.byFolderArtist(orm, o) :
            await this.metaData.extInfo.byFolderAlbum(orm, o);
    }
    async folderGenres(orm, o, user) {
        return this.Genre.genreBases(orm, await o.genres.getItems(), {}, user);
    }
    async folderBase(orm, o, folderParameters, user) {
        return {
            id: o.id,
            name: o.name,
            title: o.title,
            created: o.createdAt.valueOf(),
            type: o.folderType,
            level: o.level,
            parentID: o.parent.id(),
            genres: folderParameters.folderIncGenres ? await this.folderGenres(orm, o, user) : undefined,
            trackCount: folderParameters.folderIncTrackCount ? await o.tracks.count() : undefined,
            folderCount: folderParameters.folderIncChildFolderCount ? await o.children.count() : undefined,
            artworkCount: folderParameters.folderIncArtworkCount ? await o.children.count() : undefined,
            tag: folderParameters.folderIncTag ? await this.folderTag(o) : undefined,
            parents: folderParameters.folderIncParents ? await this.folderParents(orm, o) : undefined,
            trackIDs: folderParameters.folderIncTrackIDs ? await o.tracks.getIDs() : undefined,
            folderIDs: folderParameters.folderIncFolderIDs ? await o.children.getIDs() : undefined,
            artworkIDs: folderParameters.folderIncArtworkIDs ? await o.artworks.getIDs() : undefined,
            info: folderParameters.folderIncInfo ? await this.folderInfo(orm, o) : undefined,
            state: folderParameters.folderIncSimilar ? await this.state(orm, o.id, DBObjectType.folder, user.id) : undefined
        };
    }
    async folderChildren(orm, o, folderChildrenParameters, user) {
        const folderParameters = {
            folderIncTag: folderChildrenParameters.folderChildIncTag,
            folderIncState: folderChildrenParameters.folderChildIncState,
            folderIncChildFolderCount: folderChildrenParameters.folderChildIncChildFolderCount,
            folderIncTrackCount: folderChildrenParameters.folderChildIncTrackCount,
            folderIncArtworkCount: folderChildrenParameters.folderChildIncArtworkCount,
            folderIncParents: folderChildrenParameters.folderChildIncParents,
            folderIncInfo: folderChildrenParameters.folderChildIncInfo,
            folderIncSimilar: folderChildrenParameters.folderChildIncSimilar,
            folderIncArtworkIDs: folderChildrenParameters.folderChildIncArtworkIDs,
            folderIncTrackIDs: folderChildrenParameters.folderChildIncTrackIDs,
            folderIncFolderIDs: folderChildrenParameters.folderChildIncFolderIDs
        };
        const items = await o.children.getItems();
        return await Promise.all(items.map(t => this.folderBase(orm, t, folderParameters, user)));
    }
    async folderIndex(_orm, result) {
        return this.index(result, async (item) => {
            return {
                id: item.id,
                name: item.name,
                trackCount: await item.tracks.count()
            };
        });
    }
    async folderTag(o) {
        const genres = await o.genres.getItems();
        return {
            album: o.album,
            albumType: o.albumType,
            artist: o.artist,
            artistSort: o.artistSort,
            genres: genres.map(g => g.name),
            year: o.year,
            mbArtistID: o.mbArtistID,
            mbReleaseID: o.mbReleaseID,
            mbReleaseGroupID: o.mbReleaseGroupID
        };
    }
    async folderParents(_orm, o) {
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