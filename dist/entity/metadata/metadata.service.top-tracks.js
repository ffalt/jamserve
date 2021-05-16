"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataServiceTopTracks = void 0;
class MetadataServiceTopTracks {
    constructor(service) {
        this.service = service;
    }
    async byArtistName(orm, artist, page) {
        const result = await this.service.lastFMTopTracksArtist(orm, artist);
        if (result && result.toptracks && result.toptracks.track) {
            const songs = result.toptracks.track.map(t => {
                return {
                    name: t.name,
                    artist: t.artist.name,
                    mbid: t.mbid,
                    url: t.url
                };
            });
            const ids = await this.service.similarTracks.findSongTrackIDs(orm, songs);
            return orm.Track.search({ where: { id: ids }, limit: page?.take, offset: page?.skip });
        }
        return { items: [], ...(page || {}), total: 0 };
    }
}
exports.MetadataServiceTopTracks = MetadataServiceTopTracks;
//# sourceMappingURL=metadata.service.top-tracks.js.map