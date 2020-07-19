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
exports.GenreService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const orm_service_1 = require("../../modules/engine/services/orm.service");
let GenreService = class GenreService {
    constructor() {
        this.genres = [];
    }
    async refresh() {
        var _a, _b, _c, _d, _e;
        const genreHash = {};
        const trackIDs = await this.orm.Track.findIDs({});
        for (const id of trackIDs) {
            const track = await this.orm.Track.oneOrFail(id);
            await this.orm.Track.populate(track, 'tag');
            let genres = (_a = track.tag) === null || _a === void 0 ? void 0 : _a.genres;
            if (!genres || genres.length === 0) {
                genres = ['[No genre]'];
            }
            for (const genre of genres) {
                const data = genreHash[genre] || { roots: {} };
                const section = data.roots[track.root.id] || { count: 0, artists: {}, albums: {}, series: {}, folders: {} };
                section.count++;
                if ((_b = track.artist) === null || _b === void 0 ? void 0 : _b.id) {
                    section.artists[track.artist.id] = (section.artists[track.artist.id] || 0) + 1;
                }
                if ((_c = track.album) === null || _c === void 0 ? void 0 : _c.id) {
                    section.albums[track.album.id] = (section.albums[track.album.id] || 0) + 1;
                }
                if ((_d = track.series) === null || _d === void 0 ? void 0 : _d.id) {
                    section.series[track.series.id] = (section.series[track.series.id] || 0) + 1;
                }
                if ((_e = track.folder) === null || _e === void 0 ? void 0 : _e.id) {
                    section.folders[track.folder.id] = (section.folders[track.folder.id] || 0) + 1;
                }
                data.roots[track.root.id] = section;
                genreHash[genre] = data;
            }
        }
        this.genres = Object.keys(genreHash).map(key => {
            const data = genreHash[key];
            return {
                name: key,
                sections: Object.keys(data.roots).map(sec => {
                    const section = data.roots[sec];
                    return {
                        rootID: sec,
                        artistCount: Object.keys(section.artists).length,
                        albumCount: Object.keys(section.albums).length,
                        seriesCount: Object.keys(section.series).length,
                        folderCount: Object.keys(section.folders).length,
                        trackCount: section.count
                    };
                })
            };
        });
    }
    async getGenres(rootID) {
        if (this.genres.length === 0) {
            await this.refresh();
        }
        return this.genres.map(g => {
            const genre = {
                name: g.name,
                albumCount: 0,
                artistCount: 0,
                trackCount: 0,
                seriesCount: 0,
                folderCount: 0
            };
            g.sections.forEach(section => {
                if (!rootID || section.rootID === rootID) {
                    genre.albumCount += section.albumCount;
                    genre.artistCount += section.artistCount;
                    genre.trackCount += section.trackCount;
                    genre.seriesCount += section.seriesCount;
                    genre.folderCount += section.folderCount;
                }
            });
            return genre;
        }).filter(genre => genre.trackCount > 0).sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    }
    async index() {
        const genres = await this.getGenres();
        const map = new Map();
        for (const entry of genres) {
            const char = entry.name[0] || '?';
            const list = map.get(char) || [];
            list.push(entry);
            map.set(char, list);
        }
        const groups = [];
        for (const [group, value] of map) {
            groups.push({
                name: group,
                items: value
            });
        }
        return { lastModified: Date.now(), groups };
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], GenreService.prototype, "orm", void 0);
GenreService = __decorate([
    typescript_ioc_1.Singleton
], GenreService);
exports.GenreService = GenreService;
//# sourceMappingURL=genre.service.js.map