import { shuffle } from '../../utils/random';
export class MetadataServiceSimilarTracks {
    constructor(service) {
        this.service = service;
    }
    async findSongTrackIDs(orm, songs) {
        const ids = [];
        const vals = [];
        songs.forEach(sim => {
            if (sim.mbid) {
                ids.push(sim);
            }
            else {
                vals.push(sim);
            }
        });
        const result = new Set();
        const mbTrackIDs = ids.map(track => track.mbid || '-').filter(id => id !== '-');
        const list = await orm.Track.find({ where: { tag: { mbTrackID: mbTrackIDs } } });
        for (const sim of ids) {
            const t = await list.find(async (tr) => (await tr.tag.get())?.mbTrackID === sim.mbid);
            if (!t) {
                vals.push(sim);
            }
            else {
                result.add(t.id);
            }
        }
        for (const sim of vals) {
            const id = await orm.Track.findOneID({ where: { name: sim.name, artist: { name: sim.artist } } });
            if (id) {
                result.add(id);
            }
        }
        return [...result];
    }
    async getSimilarSongs(orm, similar) {
        let tracks = [];
        for (const artist of similar) {
            let data;
            if (artist.mbid) {
                data = await this.service.lastFMTopTracksArtistID(orm, artist.mbid);
            }
            else if (artist.name) {
                data = await this.service.lastFMTopTracksArtist(orm, artist.name);
            }
            if (data && data.toptracks && data.toptracks.track) {
                tracks = tracks.concat(data.toptracks.track.map(song => {
                    return {
                        name: song.name,
                        artist: song.artist.name,
                        mbid: song.mbid,
                        url: song.url
                    };
                }));
            }
        }
        return shuffle(tracks);
    }
    async getSimilarArtistTracks(orm, similars, page) {
        if (!similars || similars.length === 0) {
            return { items: [], ...(page || {}), total: 0 };
        }
        const songs = await this.getSimilarSongs(orm, similars);
        const ids = await this.findSongTrackIDs(orm, songs);
        return orm.Track.search({ where: { id: ids }, limit: page?.take, offset: page?.skip });
    }
    async byArtist(orm, artist, page) {
        const similar = await this.service.similarArtists.byArtistIdName(orm, artist.mbArtistID, artist.name);
        return this.getSimilarArtistTracks(orm, similar, page);
    }
    async byFolder(orm, folder, page) {
        const similar = await this.service.similarArtists.byArtistIdName(orm, folder.mbArtistID, folder.artist);
        return this.getSimilarArtistTracks(orm, similar, page);
    }
    async byAlbum(orm, album, page) {
        const artist = await album.artist.get();
        const similar = await this.service.similarArtists.byArtistIdName(orm, album.mbArtistID, artist?.name);
        return this.getSimilarArtistTracks(orm, similar, page);
    }
    async byTrack(orm, track, page) {
        let data;
        const tag = await track.tag.get();
        if (tag?.mbTrackID) {
            data = await this.service.lastFMSimilarTracks(orm, tag.mbTrackID);
        }
        else if (tag?.title && tag?.artist) {
            data = await this.service.lastFMSimilarTracksSearch(orm, tag.title, tag.artist);
        }
        let ids = [];
        if (data && data.similartracks && data.similartracks.track) {
            const songs = data.similartracks.track.map(t => {
                return {
                    name: t.name,
                    artist: t.artist.name,
                    mbid: t.mbid,
                    url: t.url
                };
            });
            ids = await this.findSongTrackIDs(orm, songs);
        }
        return orm.Track.search({ where: { id: ids }, limit: page?.take, offset: page?.skip });
    }
}
//# sourceMappingURL=metadata.service.similar-tracks.js.map