import { AlbumType } from '../../../types/enums.js';
import { cUnknownAlbum, cUnknownArtist, MUSICBRAINZ_VARIOUS_ARTISTS_ID, MUSICBRAINZ_VARIOUS_ARTISTS_NAME } from '../../../types/consts.js';
import { extractAlbumName } from '../../../utils/album-name.js';
import { slugify } from '../../../utils/slug.js';
export function getAlbumName(trackInfo) {
    if (trackInfo.folder.albumType === AlbumType.compilation) {
        return trackInfo.folder.album || cUnknownAlbum;
    }
    return extractAlbumName(trackInfo.tag.album || cUnknownAlbum);
}
export function getAlbumSlug(trackInfo) {
    return slugify(getAlbumName(trackInfo));
}
export class MetaMergerCache {
    constructor(orm, changes, root) {
        this.orm = orm;
        this.changes = changes;
        this.root = root;
        this.artistCache = [];
        this.seriesCache = [];
        this.albumCache = [];
    }
    async buildSeries(trackInfo, artist) {
        const result = this.orm.Series.create({
            name: trackInfo.tag.series || '',
            albumTypes: trackInfo.folder.albumType ? [trackInfo.folder.albumType] : [AlbumType.unknown]
        });
        await result.artist.set(artist);
        await result.roots.add(this.root);
        return result;
    }
    async findSeriesInCache(trackInfo, artistID) {
        if (!trackInfo.tag.series) {
            return;
        }
        const cache = this.seriesCache.find(a => (a.series.name === trackInfo.tag.series) && a.artist.id === artistID);
        return cache?.series;
    }
    async getSeriesByID(id, changes) {
        const cache = this.seriesCache.find(a => a.series.id === id);
        if (cache?.series) {
            return cache.series;
        }
        const series = await this.orm.Series.findOneByID(id);
        if (series) {
            this.seriesCache.push({ series, artist: await series.artist.getOrFail() });
            if (changes && !changes.series.added.has(series)) {
                changes.series.updated.add(series);
            }
        }
        return series || undefined;
    }
    async findOrCreateSeries(trackInfo, artist, album) {
        let series = await this.findSeriesInCache(trackInfo, artist.id);
        if (series) {
            return series;
        }
        series = await this.orm.Series.findOne({ where: { name: trackInfo.tag.series, artist: artist.id } });
        if (!series) {
            series = await this.buildSeries(trackInfo, artist);
            this.changes.series.added.add(series);
        }
        else {
            this.changes.series.updated.add(series);
        }
        await series.albums.add(album);
        this.seriesCache.push({ series, artist });
        return series;
    }
    async buildAlbum(trackInfo, artist) {
        const album = this.orm.Album.create({
            slug: getAlbumSlug(trackInfo),
            name: getAlbumName(trackInfo),
            albumType: trackInfo.folder.albumType || AlbumType.unknown,
            mbArtistID: trackInfo.tag.mbAlbumArtistID || trackInfo.tag.mbArtistID,
            mbReleaseID: trackInfo.tag.mbReleaseID,
            seriesNr: trackInfo.tag.seriesNr,
            year: trackInfo.tag.year,
            duration: 0
        });
        await album.artist.set(artist);
        await album.folders.add(trackInfo.folder);
        await album.roots.add(this.root);
        this.orm.Album.persistLater(album);
        return album;
    }
    async findAlbumInDB(trackInfo, artist) {
        if (trackInfo.tag.mbReleaseID) {
            const album = await this.orm.Album.findOne({ where: { mbReleaseID: trackInfo.tag.mbReleaseID } });
            if (album) {
                return album;
            }
        }
        return await this.orm.Album.findOne({ where: { slug: getAlbumSlug(trackInfo), artist: artist.id } }) || undefined;
    }
    async findAlbumInCache(trackInfo, artist) {
        if (trackInfo.tag.mbReleaseID) {
            const cache = this.albumCache.find(a => a.album.mbReleaseID === trackInfo.tag.mbReleaseID);
            if (cache?.album) {
                return cache.album;
            }
        }
        const name = getAlbumName(trackInfo);
        for (const a of this.albumCache) {
            if ((a.album.name === name) &&
                (a.artist.id === artist.id) &&
                (!trackInfo.tag.seriesNr || (trackInfo.tag.seriesNr === a.album.seriesNr)) &&
                (!trackInfo.tag.series || (trackInfo.tag.series === a.series))) {
                return a.album;
            }
        }
        return;
    }
    async getAlbumByID(id) {
        const cache = this.albumCache.find(a => a.album.id === id);
        if (cache?.album) {
            return cache.album;
        }
        const album = await this.orm.Album.findOneByID(id);
        if (album) {
            this.albumCache.push({ album, artist: await album.artist.getOrFail(), series: (await album.series.get())?.name });
            this.changes.albums.updated.add(album);
        }
        return album || undefined;
    }
    async findOrCreateAlbum(trackInfo, artist) {
        let album = await this.findAlbumInCache(trackInfo, artist);
        if (album) {
            return album;
        }
        album = await this.findAlbumInDB(trackInfo, artist);
        if (!album) {
            album = await this.buildAlbum(trackInfo, artist);
            this.changes.albums.added.add(album);
        }
        else {
            this.changes.albums.updated.add(album);
        }
        this.albumCache.push({ album, artist, series: trackInfo.tag.series });
        return album;
    }
    async findArtistInDB(trackInfo, albumArtist) {
        const mbArtistID = albumArtist ? (trackInfo.tag.mbAlbumArtistID || trackInfo.tag.mbArtistID) : trackInfo.tag.mbArtistID;
        if (mbArtistID) {
            const artist = await this.orm.Artist.findOne({ where: { mbArtistID } });
            if (artist) {
                return artist;
            }
        }
        const slug = slugify((albumArtist ? (trackInfo.tag.albumArtist || trackInfo.tag.artist) : trackInfo.tag.artist) || cUnknownArtist);
        return (await this.orm.Artist.findOne({ where: { slug } })) || undefined;
    }
    async findArtistInCache(trackInfo, albumArtist) {
        let aa = { mbArtistID: trackInfo.tag.mbArtistID, name: trackInfo.tag.artist };
        if (albumArtist && (trackInfo.tag.mbAlbumArtistID || trackInfo.tag.albumArtist)) {
            aa = { mbArtistID: trackInfo.tag.mbAlbumArtistID, name: trackInfo.tag.albumArtist };
        }
        const slug = slugify(aa.name || cUnknownArtist);
        if (aa.mbArtistID) {
            const artist = this.artistCache.find(a => a.artist.mbArtistID === aa.mbArtistID);
            if (artist) {
                return artist.artist;
            }
        }
        const slugArtist = this.artistCache.find(a => a.slugs.includes(slug));
        if (slugArtist) {
            if (!slugArtist.artist.mbArtistID && aa.mbArtistID) {
                slugArtist.artist.mbArtistID = aa.mbArtistID;
            }
            return slugArtist.artist;
        }
        return;
    }
    async getArtistByID(id) {
        const artistCache = this.artistCache.find(a => a.artist.id === id);
        if (artistCache) {
            return artistCache.artist;
        }
        const artist = await this.orm.Artist.findOneByID(id);
        if (artist) {
            this.artistCache.push({ artist, slugs: [artist.slug] });
            this.changes.artists.updated.add(artist);
        }
        return artist || undefined;
    }
    async findCompilationArtist() {
        const artistCache = this.artistCache.find(a => a.artist.mbArtistID === MUSICBRAINZ_VARIOUS_ARTISTS_ID);
        if (artistCache) {
            return artistCache.artist;
        }
        const artist = await this.orm.Artist.findOne({ where: { mbArtistID: MUSICBRAINZ_VARIOUS_ARTISTS_ID } });
        if (artist) {
            this.changes.artists.updated.add(artist);
            this.artistCache.push({ artist, slugs: [artist.slug] });
        }
        return artist || undefined;
    }
    async buildArtist(trackInfo, albumArtist) {
        let aa = { mbArtistID: trackInfo.tag.mbArtistID, name: trackInfo.tag.artist, nameSort: trackInfo.tag.artistSort };
        if (albumArtist && (trackInfo.tag.mbAlbumArtistID || trackInfo.tag.albumArtist)) {
            aa = { mbArtistID: trackInfo.tag.mbAlbumArtistID, name: trackInfo.tag.albumArtist, nameSort: trackInfo.tag.albumArtistSort };
        }
        aa.name = aa.name || cUnknownArtist;
        const artist = this.orm.Artist.create({
            slug: slugify(aa.name),
            name: aa.name,
            nameSort: aa.nameSort || aa.name,
            mbArtistID: aa.mbArtistID,
            albumTypes: trackInfo.folder.albumType ? [trackInfo.folder.albumType] : []
        });
        await artist.roots.add(this.root);
        await artist.folders.add(trackInfo.folder);
        await artist.tracks.add(trackInfo.track);
        this.orm.Artist.persistLater(artist);
        return artist;
    }
    async findOrCreateCompilationArtist() {
        let artist = await this.findCompilationArtist();
        if (!artist) {
            artist = this.orm.Artist.create({
                slug: slugify(MUSICBRAINZ_VARIOUS_ARTISTS_NAME),
                name: MUSICBRAINZ_VARIOUS_ARTISTS_NAME,
                nameSort: MUSICBRAINZ_VARIOUS_ARTISTS_NAME,
                mbArtistID: MUSICBRAINZ_VARIOUS_ARTISTS_ID,
                albumTypes: [AlbumType.compilation]
            });
            this.changes.artists.added.add(artist);
            this.artistCache.push({ artist, slugs: [artist.slug] });
            this.orm.Artist.persistLater(artist);
            return artist;
        }
        else if (!this.changes.artists.added.has(artist)) {
            this.changes.artists.updated.add(artist);
        }
        return artist;
    }
    async findOrCreateArtist(trackInfo, albumArtist) {
        let artist = await this.findArtistInCache(trackInfo, albumArtist);
        if (artist) {
            return artist;
        }
        artist = await this.findArtistInDB(trackInfo, albumArtist);
        if (!artist) {
            const name = (albumArtist ? (trackInfo.tag.albumArtist || trackInfo.tag.artist) : trackInfo.tag.artist) || cUnknownArtist;
            if (name === MUSICBRAINZ_VARIOUS_ARTISTS_NAME) {
                return this.findOrCreateCompilationArtist();
            }
            artist = await this.buildArtist(trackInfo, albumArtist);
            this.changes.artists.added.add(artist);
        }
        else {
            this.changes.artists.updated.add(artist);
        }
        this.artistCache.push({ artist, slugs: [artist.slug] });
        return artist;
    }
}
//# sourceMappingURL=meta-cache.js.map