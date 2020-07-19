"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataServiceSimilarTracks = void 0;
const random_1 = require("../../utils/random");
class MetadataServiceSimilarTracks {
    constructor(service) {
        this.service = service;
    }
    async findSongTrackIDs(songs) {
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
        const list = await this.service.orm.Track.find({ tag: { mbTrackID: { $in: mbTrackIDs } } });
        ids.forEach(sim => {
            const t = list.find(tr => { var _a; return ((_a = tr.tag) === null || _a === void 0 ? void 0 : _a.mbTrackID) === sim.mbid; });
            if (!t) {
                vals.push(sim);
            }
            else {
                result.add(t.id);
            }
        });
        for (const sim of vals) {
            const id = await this.service.orm.Track.findOneID({ name: { $eq: sim.name }, artist: { name: { $eq: sim.artist } } });
            if (id) {
                result.add(id);
            }
        }
        return [...result];
    }
    async getSimilarSongs(similar) {
        let tracks = [];
        for (const artist of similar) {
            let data;
            if (artist.mbid) {
                data = await this.service.lastFMTopTracksArtistID(artist.mbid);
            }
            else if (artist.name) {
                data = await this.service.lastFMTopTracksArtist(artist.name);
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
        return random_1.shuffle(tracks);
    }
    async getSimilarArtistTracks(similars, page) {
        if (!similars || similars.length === 0) {
            return { items: [], ...(page || {}), total: 0 };
        }
        const songs = await this.getSimilarSongs(similars);
        const ids = await this.findSongTrackIDs(songs);
        return this.service.orm.Track.search({ id: ids }, undefined, page);
    }
    async byArtist(artist, page) {
        const similar = await this.service.similarArtists.byArtistIdName(artist.mbArtistID, artist.name);
        return this.getSimilarArtistTracks(similar, page);
    }
    async byFolder(folder, page) {
        const similar = await this.service.similarArtists.byArtistIdName(folder.mbArtistID, folder.artist);
        return this.getSimilarArtistTracks(similar, page);
    }
    async byAlbum(album, page) {
        const similar = await this.service.similarArtists.byArtistIdName(album.mbArtistID, album.artist.name);
        return this.getSimilarArtistTracks(similar, page);
    }
    async byTrack(track, page) {
        var _a, _b, _c;
        let data;
        if ((_a = track.tag) === null || _a === void 0 ? void 0 : _a.mbTrackID) {
            data = await this.service.lastFMSimilarTracks(track.tag.mbTrackID);
        }
        else if (((_b = track.tag) === null || _b === void 0 ? void 0 : _b.title) && ((_c = track.tag) === null || _c === void 0 ? void 0 : _c.artist)) {
            data = await this.service.lastFMSimilarTracksSearch(track.tag.title, track.tag.artist);
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
            ids = await this.findSongTrackIDs(songs);
        }
        return this.service.orm.Track.search({ id: ids }, undefined, page);
    }
}
exports.MetadataServiceSimilarTracks = MetadataServiceSimilarTracks;
//# sourceMappingURL=metadata.service.similar-tracks.js.map