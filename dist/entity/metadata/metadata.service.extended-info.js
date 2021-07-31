import { logger } from '../../utils/logger';
import { MetaDataFormat } from './metadata.format';
import { LastFMLookupType, MusicBrainzLookupType, MusicBrainzSearchType } from '../../types/enums';
const log = logger('Metadata');
export class MetadataServiceExtendedInfo {
    constructor(service) {
        this.service = service;
    }
    async getWikiDataExtendedInfo(orm, id, lang) {
        const wiki = await this.service.wikidataSummary(orm, id, lang);
        if (wiki && wiki.summary) {
            return MetaDataFormat.formatWikipediaExtendedInfo(wiki.summary.url, wiki.summary.summary);
        }
        return;
    }
    async getMusicBrainzIDWikipediaArtistInfo(orm, mbArtistID) {
        const result = await this.service.musicbrainzLookup(orm, MusicBrainzLookupType.artist, mbArtistID);
        if (result && result.artist && result.artist.relations) {
            let rel = result.artist.relations.find(r => r.type === 'wikidata');
            if (rel && rel.url && rel.url.resource) {
                const list = rel.url.resource.split('/');
                const id = list[list.length - 1];
                const res = this.getWikiDataExtendedInfo(orm, id, 'en');
                if (res) {
                    return res;
                }
            }
            rel = result.artist.relations.find(r => r.type === 'wikipedia');
            if (rel && rel.url && rel.url.resource) {
                const list = rel.url.resource.split('/');
                const title = list[list.length - 1];
                const lang = list[2].split('.')[0];
                const wiki = await this.service.wikipediaSummary(orm, title, lang);
                if (wiki && wiki.summary) {
                    return MetaDataFormat.formatWikipediaExtendedInfo(wiki.summary.url, wiki.summary.summary);
                }
            }
        }
        return;
    }
    async getMusicBrainzIDWikipediaAlbumInfo(orm, mbReleaseID) {
        const lookup = await this.service.musicbrainzLookup(orm, MusicBrainzLookupType.release, mbReleaseID);
        if (lookup && lookup.release && lookup.release.relations) {
            const rel = lookup.release.relations.find(r => r.type === 'wikidata');
            if (rel && rel.url && rel.url.resource) {
                const list = rel.url.resource.split('/');
                const id = list[list.length - 1];
                return this.getWikiDataExtendedInfo(orm, id, 'en');
            }
        }
        return;
    }
    async getLastFMArtistInfo(orm, mbArtistID) {
        const lookup = await this.service.lastFMLookup(orm, LastFMLookupType.artist, mbArtistID);
        if (lookup && lookup.artist && lookup.artist.bio && lookup.artist.bio.content) {
            return MetaDataFormat.formatLastFMExtendedInfo(lookup.artist.url, lookup.artist.bio.content);
        }
        return;
    }
    async getLastFMAlbumInfo(orm, mbReleaseID) {
        const lookup = await this.service.lastFMLookup(orm, LastFMLookupType.album, mbReleaseID);
        if (lookup && lookup.album && lookup.album.wiki && lookup.album.wiki.content) {
            return MetaDataFormat.formatLastFMExtendedInfo(lookup.album.url, lookup.album.wiki.content);
        }
        return;
    }
    async getArtistInfoByMusicBrainzID(orm, mbArtistID) {
        const info = await this.getMusicBrainzIDWikipediaArtistInfo(orm, mbArtistID);
        if (info) {
            return info;
        }
        return this.getLastFMArtistInfo(orm, mbArtistID);
    }
    async getAlbumInfoByMusicBrainzID(orm, mbReleaseID) {
        const info = await this.getMusicBrainzIDWikipediaAlbumInfo(orm, mbReleaseID);
        if (info) {
            return info;
        }
        return this.getLastFMAlbumInfo(orm, mbReleaseID);
    }
    async getArtistInfoByName(orm, artistName) {
        const res = await this.service.musicbrainzSearch(orm, MusicBrainzSearchType.artist, { artist: artistName });
        let result;
        if (res && res.artists && res.artists.length === 1) {
            result = await this.getArtistInfoByMusicBrainzID(orm, res.artists[0].id);
        }
        if (!result) {
            const lastfm = await this.service.lastFMArtistSearch(orm, artistName);
            if (lastfm && lastfm.artist && lastfm.artist.mbid) {
                result = await this.getArtistInfoByMusicBrainzID(orm, lastfm.artist.mbid);
            }
        }
        return result;
    }
    async getAlbumInfoByName(orm, albumName, artistName) {
        const res = await this.service.musicbrainzSearch(orm, MusicBrainzSearchType.release, { release: albumName, artist: artistName });
        let info;
        if (res && res.releases && res.releases.length > 1) {
            info = await this.getAlbumInfoByMusicBrainzID(orm, res.releases[0].id);
        }
        if (!info) {
            const lastfm = await this.service.lastFMAlbumSearch(orm, albumName, artistName);
            if (lastfm && lastfm.album && lastfm.album.mbid) {
                info = await this.getAlbumInfoByMusicBrainzID(orm, lastfm.album.mbid);
            }
        }
        return info;
    }
    async byArtist(orm, artist) {
        let info;
        try {
            if (artist.mbArtistID) {
                info = await this.getArtistInfoByMusicBrainzID(orm, artist.mbArtistID);
            }
            if (!info && artist.name) {
                info = await this.getArtistInfoByName(orm, artist.name);
            }
        }
        catch (e) {
            log.error(e);
        }
        return info;
    }
    async bySeries(orm, series) {
        try {
            if (series.name) {
                const info = await this.getArtistInfoByName(orm, series.name);
                if (info) {
                    return info;
                }
            }
        }
        catch (e) {
            log.error(e);
        }
        return;
    }
    async byAlbum(orm, album) {
        let info;
        try {
            if (album.mbReleaseID) {
                info = await this.getAlbumInfoByMusicBrainzID(orm, album.mbReleaseID);
            }
            const artist = await album.artist.get();
            if (!info && album.name && artist) {
                info = await this.getAlbumInfoByName(orm, album.name, artist.name);
            }
        }
        catch (e) {
            log.error(e);
        }
        return info;
    }
    async byFolderArtist(orm, folder) {
        let info;
        try {
            if (folder.mbArtistID) {
                info = await this.getArtistInfoByMusicBrainzID(orm, folder.mbArtistID);
            }
            if (!info && folder.artist) {
                info = await this.getArtistInfoByName(orm, folder.artist);
            }
        }
        catch (e) {
            log.error(e);
        }
        return info;
    }
    async byFolderAlbum(orm, folder) {
        let info;
        try {
            if (folder.mbReleaseID) {
                info = await this.getAlbumInfoByMusicBrainzID(orm, folder.mbReleaseID);
            }
            if (!info && folder.album && folder.artist) {
                info = await this.getAlbumInfoByName(orm, folder.album, folder.artist);
            }
        }
        catch (e) {
            log.error(e);
        }
        return info;
    }
}
//# sourceMappingURL=metadata.service.extended-info.js.map