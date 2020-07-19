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
exports.StatsService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const orm_service_1 = require("../../modules/engine/services/orm.service");
const enums_1 = require("../../types/enums");
const consts_1 = require("../../types/consts");
const base_1 = require("../base/base");
let StatsService = class StatsService {
    constructor() {
        this.stats = [];
    }
    async refresh() {
        this.stats = [];
    }
    async getStats(rootID) {
        let stat = this.stats.find(s => s.rootID === rootID);
        if (!stat) {
            const inAlbumTypes = (albumType) => {
                return base_1.QHelper.inStringArray('albumTypes', [albumType])[0];
            };
            let rootsWhere = {};
            let rootWhere = {};
            if (rootID) {
                rootsWhere = { roots: { id: rootID } };
                rootWhere = { root: { id: rootID } };
            }
            stat = {
                rootID,
                album: await this.orm.Album.count(rootsWhere),
                series: await this.orm.Series.count(rootsWhere),
                albumTypes: {
                    album: await this.orm.Album.count({ ...rootsWhere, albumType: { $eq: enums_1.AlbumType.album } }),
                    compilation: await this.orm.Album.count({ ...rootsWhere, albumType: { $eq: enums_1.AlbumType.compilation }, mbArtistID: { $eq: consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_ID } }),
                    artistCompilation: await this.orm.Album.count({ ...rootsWhere, albumType: { $eq: enums_1.AlbumType.compilation }, mbArtistID: { $ne: consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_ID } }),
                    audiobook: await this.orm.Album.count({ ...rootsWhere, albumType: { $eq: enums_1.AlbumType.audiobook } }),
                    series: await this.orm.Album.count({ ...rootsWhere, albumType: { $eq: enums_1.AlbumType.series } }),
                    soundtrack: await this.orm.Album.count({ ...rootsWhere, albumType: { $eq: enums_1.AlbumType.soundtrack } }),
                    bootleg: await this.orm.Album.count({ ...rootsWhere, albumType: { $eq: enums_1.AlbumType.bootleg } }),
                    live: await this.orm.Album.count({ ...rootsWhere, albumType: { $eq: enums_1.AlbumType.live } }),
                    ep: await this.orm.Album.count({ ...rootsWhere, albumType: { $eq: enums_1.AlbumType.ep } }),
                    unknown: await this.orm.Album.count({ ...rootsWhere, albumType: { $eq: enums_1.AlbumType.unknown } }),
                    single: await this.orm.Album.count({ ...rootsWhere, albumType: { $eq: enums_1.AlbumType.single } })
                },
                artist: await this.orm.Artist.count(rootsWhere),
                artistTypes: {
                    album: await this.orm.Artist.count({ ...rootsWhere, ...inAlbumTypes(enums_1.AlbumType.album) }),
                    compilation: await this.orm.Artist.count({ ...rootsWhere, ...inAlbumTypes(enums_1.AlbumType.compilation), mbArtistID: { $eq: consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_ID } }),
                    artistCompilation: await this.orm.Artist.count({ ...rootsWhere, ...inAlbumTypes(enums_1.AlbumType.compilation), mbArtistID: { $ne: consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_ID } }),
                    audiobook: await this.orm.Artist.count({ ...rootsWhere, ...inAlbumTypes(enums_1.AlbumType.audiobook) }),
                    series: await this.orm.Artist.count({ ...rootsWhere, ...inAlbumTypes(enums_1.AlbumType.series) }),
                    soundtrack: await this.orm.Artist.count({ ...rootsWhere, ...inAlbumTypes(enums_1.AlbumType.soundtrack) }),
                    bootleg: await this.orm.Artist.count({ ...rootsWhere, ...inAlbumTypes(enums_1.AlbumType.bootleg) }),
                    live: await this.orm.Artist.count({ ...rootsWhere, ...inAlbumTypes(enums_1.AlbumType.live) }),
                    ep: await this.orm.Artist.count({ ...rootsWhere, ...inAlbumTypes(enums_1.AlbumType.ep) }),
                    unknown: await this.orm.Artist.count({ ...rootsWhere, ...inAlbumTypes(enums_1.AlbumType.unknown) }),
                    single: await this.orm.Artist.count({ ...rootsWhere, ...inAlbumTypes(enums_1.AlbumType.single) })
                },
                folder: await this.orm.Folder.count(rootWhere),
                track: await this.orm.Track.count(rootWhere)
            };
            this.stats.push(stat);
        }
        return stat;
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], StatsService.prototype, "orm", void 0);
StatsService = __decorate([
    typescript_ioc_1.Singleton
], StatsService);
exports.StatsService = StatsService;
//# sourceMappingURL=stats.service.js.map