var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { InRequestScope } from 'typescript-ioc';
import { DBObjectType } from '../../types/enums.js';
import { BaseTransformService } from '../base/base.transform.js';
let GenreTransformService = class GenreTransformService extends BaseTransformService {
    async genreBases(orm, list, genreArgs, user) {
        return await Promise.all(list.map(g => this.genreBase(orm, g, {}, user)));
    }
    async genreBase(orm, o, genreArgs, user) {
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            state: genreArgs.genreState ? await this.state(orm, o.id, DBObjectType.genre, user.id) : undefined
        };
    }
    async genre(orm, o, genreArgs, user) {
        return {
            ...(await this.genreBase(orm, o, genreArgs, user)),
            albumCount: await o.albums.count(),
            trackCount: await o.tracks.count(),
            artistCount: await o.artists.count(),
            folderCount: await o.folders.count()
        };
    }
    async genreIndex(orm, result) {
        return this.index(result, async (item) => {
            return {
                id: item.id,
                name: item.name,
                albumCount: await item.albums.count(),
                trackCount: await item.tracks.count(),
                artistCount: await item.artists.count(),
                folderCount: await item.folders.count()
            };
        });
    }
};
GenreTransformService = __decorate([
    InRequestScope
], GenreTransformService);
export { GenreTransformService };
//# sourceMappingURL=genre.transform.js.map