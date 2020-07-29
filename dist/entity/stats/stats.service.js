"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const enums_1 = require("../../types/enums");
const consts_1 = require("../../types/consts");
const orm_1 = require("../../modules/orm");
let StatsService = class StatsService {
    constructor() {
        this.stats = [];
    }
    async refresh() {
        this.stats = [];
    }
    async getStats(orm, rootID) {
        let stat = this.stats.find(s => s.rootID === rootID);
        if (!stat) {
            const inAlbumTypes = (albumType) => {
                return orm_1.QHelper.inStringArray('albumTypes', [albumType])[0];
            };
            let rootIDs;
            if (rootID) {
                rootIDs = [rootID];
            }
            stat = {
                rootID,
                album: await orm.Album.countFilter({ rootIDs }),
                series: await orm.Series.countFilter({ rootIDs }),
                artist: await orm.Artist.countFilter({ rootIDs }),
                folder: await orm.Folder.countFilter({ rootIDs }),
                track: await orm.Track.countFilter({ rootIDs }),
                albumTypes: {
                    album: await orm.Album.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.album] }),
                    compilation: await orm.Album.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.compilation], mbArtistIDs: [consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_ID] }),
                    artistCompilation: await orm.Album.count({
                        include: orm_1.QHelper.includeQueries([{ roots: [{ id: orm_1.QHelper.inOrEqual(rootIDs) }] }]),
                        where: { albumType: enums_1.AlbumType.compilation, mbArtistID: { [orm_1.Op.ne]: consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_ID } }
                    }),
                    audiobook: await orm.Album.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.audiobook] }),
                    series: await orm.Album.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.series] }),
                    soundtrack: await orm.Album.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.soundtrack] }),
                    bootleg: await orm.Album.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.bootleg] }),
                    live: await orm.Album.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.live] }),
                    ep: await orm.Album.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.ep] }),
                    unknown: await orm.Album.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.unknown] }),
                    single: await orm.Album.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.single] }),
                },
                artistTypes: {
                    album: await orm.Artist.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.album] }),
                    compilation: await orm.Artist.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.compilation], mbArtistIDs: [consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_ID] }),
                    artistCompilation: await orm.Artist.count({
                        include: orm_1.QHelper.includeQueries([{ roots: [{ id: orm_1.QHelper.inOrEqual(rootIDs) }] }]),
                        where: { ...inAlbumTypes(enums_1.AlbumType.compilation), mbArtistID: { [orm_1.Op.ne]: consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_ID } }
                    }),
                    audiobook: await orm.Artist.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.audiobook] }),
                    series: await orm.Artist.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.series] }),
                    soundtrack: await orm.Artist.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.soundtrack] }),
                    bootleg: await orm.Artist.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.bootleg] }),
                    live: await orm.Artist.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.live] }),
                    ep: await orm.Artist.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.ep] }),
                    unknown: await orm.Artist.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.unknown] }),
                    single: await orm.Artist.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.single] }),
                }
            };
            this.stats.push(stat);
        }
        return stat;
    }
};
StatsService = __decorate([
    typescript_ioc_1.InRequestScope
], StatsService);
exports.StatsService = StatsService;
//# sourceMappingURL=stats.service.js.map