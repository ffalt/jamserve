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
                    artistCompilation: await orm.Album.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.compilation], notMbArtistID: consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_ID }),
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
                    artistCompilation: await orm.Artist.countFilter({ rootIDs, albumTypes: [enums_1.AlbumType.compilation], notMbArtistID: consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_ID }),
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
    async getUserStatsDetails(orm, user, list) {
        const result = {
            album: await orm.Album.countList(list, {}, user.id),
            artist: await orm.Artist.countList(list, {}, user.id),
            folder: await orm.Folder.countList(list, {}, user.id),
            track: await orm.Track.countList(list, {}, user.id),
            series: await orm.Series.countList(list, {}, user.id),
            albumTypes: {
                album: await orm.Album.countListFilter(list, { albumTypes: [enums_1.AlbumType.album] }, user),
                compilation: await orm.Album.countListFilter(list, { albumTypes: [enums_1.AlbumType.compilation], mbArtistIDs: [consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_ID] }, user),
                artistCompilation: await orm.Album.countListFilter(list, { albumTypes: [enums_1.AlbumType.compilation], notMbArtistID: consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_ID }, user),
                audiobook: await orm.Album.countListFilter(list, { albumTypes: [enums_1.AlbumType.audiobook] }, user),
                series: await orm.Album.countListFilter(list, { albumTypes: [enums_1.AlbumType.series] }, user),
                soundtrack: await orm.Album.countListFilter(list, { albumTypes: [enums_1.AlbumType.soundtrack] }, user),
                bootleg: await orm.Album.countListFilter(list, { albumTypes: [enums_1.AlbumType.bootleg] }, user),
                live: await orm.Album.countListFilter(list, { albumTypes: [enums_1.AlbumType.live] }, user),
                ep: await orm.Album.countListFilter(list, { albumTypes: [enums_1.AlbumType.ep] }, user),
                unknown: await orm.Album.countListFilter(list, { albumTypes: [enums_1.AlbumType.unknown] }, user),
                single: await orm.Album.countListFilter(list, { albumTypes: [enums_1.AlbumType.single] }, user),
            },
            artistTypes: {
                album: await orm.Artist.countListFilter(list, { albumTypes: [enums_1.AlbumType.album] }, user),
                compilation: await orm.Artist.countListFilter(list, { albumTypes: [enums_1.AlbumType.compilation], mbArtistIDs: [consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_ID] }, user),
                artistCompilation: await orm.Artist.countListFilter(list, { albumTypes: [enums_1.AlbumType.compilation], notMbArtistID: consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_ID }, user),
                audiobook: await orm.Artist.countListFilter(list, { albumTypes: [enums_1.AlbumType.audiobook] }, user),
                series: await orm.Artist.countListFilter(list, { albumTypes: [enums_1.AlbumType.series] }, user),
                soundtrack: await orm.Artist.countListFilter(list, { albumTypes: [enums_1.AlbumType.soundtrack] }, user),
                bootleg: await orm.Artist.countListFilter(list, { albumTypes: [enums_1.AlbumType.bootleg] }, user),
                live: await orm.Artist.countListFilter(list, { albumTypes: [enums_1.AlbumType.live] }, user),
                ep: await orm.Artist.countListFilter(list, { albumTypes: [enums_1.AlbumType.ep] }, user),
                unknown: await orm.Artist.countListFilter(list, { albumTypes: [enums_1.AlbumType.unknown] }, user),
                single: await orm.Artist.countListFilter(list, { albumTypes: [enums_1.AlbumType.single] }, user),
            }
        };
        return result;
    }
    async getUserStats(orm, user) {
        const result = {
            bookmark: await user.bookmarks.count(),
            playlist: await user.playlists.count(),
            favorite: await this.getUserStatsDetails(orm, user, enums_1.ListType.faved),
            played: await this.getUserStatsDetails(orm, user, enums_1.ListType.recent)
        };
        return result;
    }
};
StatsService = __decorate([
    typescript_ioc_1.InRequestScope
], StatsService);
exports.StatsService = StatsService;
//# sourceMappingURL=stats.service.js.map