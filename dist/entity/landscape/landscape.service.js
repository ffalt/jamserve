var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import fs from 'node:fs';
import path from 'node:path';
import { injectable } from 'inversify';
const CACHE_TTL_MS = 5 * 60 * 1000;
function simpleHash(string_) {
    let h = 0;
    for (const ch of string_) {
        h = Math.trunc(Math.imul(31, h) + (ch.codePointAt(0) ?? 0));
    }
    return Math.abs(h);
}
function normalizeGenreName(name) {
    return name
        .toLowerCase()
        .trim()
        .replaceAll(/\s*\([^)]*\)/g, '')
        .replaceAll(/\s*\[[^\]]*\]/g, '');
}
let LandscapeService = class LandscapeService {
    constructor() {
        this.cacheMap = new Map();
    }
    loadNoiseData() {
        if (!this.noiseData) {
            const filePath = path.resolve('./static/autotagging/every-noise-genres.json');
            const raw = fs.readFileSync(filePath, 'utf8');
            this.noiseData = JSON.parse(raw);
        }
        return this.noiseData;
    }
    matchNoiseCoord(name, noiseMap) {
        const normalized = normalizeGenreName(name);
        if (normalized in noiseMap) {
            return noiseMap[normalized];
        }
        const singular = normalized.slice(0, -1);
        if (normalized.endsWith('s') && singular in noiseMap) {
            return noiseMap[singular];
        }
        for (const key of Object.keys(noiseMap)) {
            if (key.includes(normalized)) {
                return noiseMap[key];
            }
        }
        return undefined;
    }
    clearCache() {
        this.cacheMap.clear();
    }
    async getLandscape(orm, parameters) {
        const cacheKey = [
            parameters?.ignoreUnknownGenres ? '1' : '0',
            parameters?.artistsWithAlbumsOnly ? '1' : '0',
            parameters?.ignoreUnpositionedArtists ? '1' : '0',
            parameters?.minGenreTrackCount ?? 0,
            parameters?.minGenreArtistCount ?? 0,
            parameters?.minArtistTrackCount ?? 0
        ].join(':');
        const now = Date.now();
        const cached = this.cacheMap.get(cacheKey);
        if (cached && now - cached.cachedAt < CACHE_TTL_MS) {
            return cached.data;
        }
        const data = await this.build(orm, parameters);
        this.cacheMap.set(cacheKey, { data, cachedAt: now });
        return data;
    }
    async build(orm, parameters) {
        const noiseMap = this.loadNoiseData();
        const ormGenres = await orm.Genre.find({});
        const genreNodes = [];
        const genreNoiseMap = new Map();
        let matchedCount = 0;
        for (const g of ormGenres) {
            const trackCount = await g.tracks.count();
            const artistCount = await g.artists.count();
            const albumCount = await g.albums.count();
            const coord = this.matchNoiseCoord(g.name, noiseMap);
            if (coord) {
                matchedCount++;
                genreNoiseMap.set(g.id, coord);
            }
            if (parameters?.ignoreUnknownGenres && !coord) {
                continue;
            }
            if (parameters?.minGenreTrackCount !== undefined && trackCount < parameters.minGenreTrackCount) {
                continue;
            }
            if (parameters?.minGenreArtistCount !== undefined && artistCount < parameters.minGenreArtistCount) {
                continue;
            }
            genreNodes.push({
                id: g.id,
                name: g.name,
                trackCount,
                artistCount,
                albumCount,
                noiseX: coord?.x,
                noiseY: coord?.y
            });
        }
        const ormArtists = await orm.Artist.find({});
        const artistNodes = [];
        const jitter = 0.012;
        for (const a of ormArtists) {
            const genres = await a.genres.getItems();
            const genreIDs = genres.map(g => g.id);
            const albumCount = await a.albums.count();
            const trackCount = await a.tracks.count();
            if (parameters?.artistsWithAlbumsOnly && albumCount === 0) {
                continue;
            }
            if (parameters?.minArtistTrackCount !== undefined && trackCount < parameters.minArtistTrackCount) {
                continue;
            }
            const matchedCoords = genreIDs
                .map(id => genreNoiseMap.get(id))
                .filter((c) => c !== undefined);
            let noiseX;
            let noiseY;
            if (matchedCoords.length > 0) {
                const cx = matchedCoords.reduce((s, c) => s + c.x, 0) / matchedCoords.length;
                const cy = matchedCoords.reduce((s, c) => s + c.y, 0) / matchedCoords.length;
                const hash = simpleHash(a.id);
                noiseX = cx + ((hash % 1000) / 1000 - 0.5) * jitter * 2;
                noiseY = cy + (((hash >> 10) % 1000) / 1000 - 0.5) * jitter * 2;
            }
            if (parameters?.ignoreUnpositionedArtists && noiseX === undefined) {
                continue;
            }
            artistNodes.push({
                id: a.id,
                name: a.name,
                albumCount,
                trackCount,
                genreIDs,
                noiseX,
                noiseY
            });
        }
        const noiseMatchRate = ormGenres.length > 0 ? matchedCount / ormGenres.length : 0;
        return {
            genres: genreNodes,
            artists: artistNodes,
            noiseMatchRate
        };
    }
};
LandscapeService = __decorate([
    injectable()
], LandscapeService);
export { LandscapeService };
//# sourceMappingURL=landscape.service.js.map