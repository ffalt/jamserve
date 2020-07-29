"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
let GenreService = class GenreService {
    constructor() {
        this.genres = [];
    }
    async refresh(orm) {
        const genreHash = {};
        const trackIDs = await orm.Track.findIDs({});
        for (const id of trackIDs) {
            const track = await orm.Track.oneOrFailByID(id);
            const tag = await track.tag.get();
            let genres = tag === null || tag === void 0 ? void 0 : tag.genres;
            if (!genres || genres.length === 0) {
                genres = ['[No genre]'];
            }
            for (const genre of genres) {
                const data = genreHash[genre] || { roots: {} };
                const rootID = track.root.idOrFail();
                const section = data.roots[rootID] || { count: 0, artists: {}, albums: {}, series: {}, folders: {} };
                section.count++;
                const artistID = track.artist.id();
                if (artistID) {
                    section.artists[artistID] = (section.artists[artistID] || 0) + 1;
                }
                const albumID = await track.album.id();
                if (albumID) {
                    section.albums[albumID] = (section.albums[albumID] || 0) + 1;
                }
                const seriesID = await track.series.id();
                if (seriesID) {
                    section.series[seriesID] = (section.series[seriesID] || 0) + 1;
                }
                const folderID = await track.folder.id();
                if (folderID) {
                    section.folders[folderID] = (section.folders[folderID] || 0) + 1;
                }
                data.roots[rootID] = section;
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
    async getGenres(orm, rootID) {
        if (this.genres.length === 0) {
            await this.refresh(orm);
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
    async index(orm) {
        const genres = await this.getGenres(orm);
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
GenreService = __decorate([
    typescript_ioc_1.InRequestScope
], GenreService);
exports.GenreService = GenreService;
//# sourceMappingURL=genre.service.js.map