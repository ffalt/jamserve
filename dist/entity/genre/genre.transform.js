"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreTransformService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const enums_1 = require("../../types/enums");
const base_transform_1 = require("../base/base.transform");
let GenreTransformService = class GenreTransformService extends base_transform_1.BaseTransformService {
    async genreBases(orm, list, genreArgs, user) {
        return await Promise.all(list.map(g => this.genreBase(orm, g, {}, user)));
    }
    async genreBase(orm, o, genreArgs, user) {
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            state: genreArgs.genreState ? await this.state(orm, o.id, enums_1.DBObjectType.genre, user.id) : undefined
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
    typescript_ioc_1.InRequestScope
], GenreTransformService);
exports.GenreTransformService = GenreTransformService;
//# sourceMappingURL=genre.transform.js.map