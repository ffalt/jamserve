import { FolderType, LastFMLookupType } from '../../types/enums.js';
export class MetadataServiceSimilarArtists {
    constructor(service) {
        this.service = service;
    }
    async getLastFMSimilarArtists(orm, mbArtistID) {
        const lastfm = await this.service.lastFMLookup(orm, LastFMLookupType.artist, mbArtistID);
        if (lastfm && lastfm.artist && lastfm.artist.similar && lastfm.artist.similar.artist) {
            return lastfm.artist.similar.artist;
        }
        return [];
    }
    async findSimilarArtistFolders(orm, similarArtists, page) {
        const names = [];
        similarArtists.forEach(a => {
            if (a.name) {
                names.push(a.name);
            }
        });
        return await orm.Folder.search({ where: { folderType: FolderType.artist, artist: names }, limit: page?.take, offset: page?.skip });
    }
    async findSimilarArtists(orm, similarArtists, page) {
        const names = [];
        similarArtists.forEach(a => {
            if (a.name) {
                names.push(a.name);
            }
        });
        return await orm.Artist.search({ where: { name: names }, limit: page?.take, offset: page?.skip });
    }
    async byArtistIdName(orm, mbArtistID, artist) {
        let similar = [];
        if (mbArtistID) {
            similar = await this.getLastFMSimilarArtists(orm, mbArtistID);
        }
        else if (artist) {
            const a = await this.service.lastFMArtistSearch(orm, artist);
            if (a && a.artist) {
                similar = await this.getLastFMSimilarArtists(orm, a.artist.mbid);
            }
        }
        return similar;
    }
    async byArtist(orm, artist, page) {
        const similar = await this.byArtistIdName(orm, artist.mbArtistID, artist.name);
        if (similar && similar.length > 0) {
            return this.findSimilarArtists(orm, similar, page);
        }
        return { items: [], ...(page || {}), total: 0 };
    }
    async byFolder(orm, folder, page) {
        const similar = await this.byArtistIdName(orm, folder.mbArtistID, folder.artist);
        if (similar && similar.length > 0) {
            return this.findSimilarArtistFolders(orm, similar, page);
        }
        return { items: [], ...(page || {}), total: 0 };
    }
}
//# sourceMappingURL=metadata.service.similar-artists.js.map