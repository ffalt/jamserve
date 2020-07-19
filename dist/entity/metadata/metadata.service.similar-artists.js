"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataServiceSimilarArtists = void 0;
const enums_1 = require("../../types/enums");
class MetadataServiceSimilarArtists {
    constructor(service) {
        this.service = service;
    }
    async getLastFMSimilarArtists(mbArtistID) {
        const lastfm = await this.service.lastFMLookup(enums_1.LastFMLookupType.artist, mbArtistID);
        if (lastfm && lastfm.artist && lastfm.artist.similar && lastfm.artist.similar.artist) {
            return lastfm.artist.similar.artist;
        }
        return [];
    }
    async findSimilarArtistFolders(similarArtists, page) {
        const names = [];
        similarArtists.forEach(a => {
            if (a.name) {
                names.push(a.name);
            }
        });
        return await this.service.orm.Folder.search({ folderType: { $in: [enums_1.FolderType.artist] }, artist: { $in: names } }, undefined, page);
    }
    async findSimilarArtists(similarArtists, page) {
        const names = [];
        similarArtists.forEach(a => {
            if (a.name) {
                names.push(a.name);
            }
        });
        return await this.service.orm.Artist.search({ name: { $in: names } }, undefined, page);
    }
    async byArtistIdName(mbArtistID, artist) {
        let similar = [];
        if (mbArtistID) {
            similar = await this.getLastFMSimilarArtists(mbArtistID);
        }
        else if (artist) {
            const a = await this.service.lastFMArtistSearch(artist);
            if (a && a.artist) {
                similar = await this.getLastFMSimilarArtists(a.artist.mbid);
            }
        }
        return similar;
    }
    async byArtist(artist, page) {
        const similar = await this.byArtistIdName(artist.mbArtistID, artist.name);
        if (similar && similar.length > 0) {
            return this.findSimilarArtists(similar, page);
        }
        return { items: [], ...(page || {}), total: 0 };
    }
    async byFolder(folder, page) {
        const similar = await this.byArtistIdName(folder.mbArtistID, folder.artist);
        if (similar && similar.length > 0) {
            return this.findSimilarArtistFolders(similar, page);
        }
        return { items: [], ...(page || {}), total: 0 };
    }
}
exports.MetadataServiceSimilarArtists = MetadataServiceSimilarArtists;
//# sourceMappingURL=metadata.service.similar-artists.js.map