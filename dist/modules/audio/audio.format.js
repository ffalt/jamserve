import { ID3v1_GENRES, ID3v2 } from 'jamp3';
import { cleanGenre } from '../../utils/genres.js';
import { ID3TrackTagRawFormatTypes } from './audio.module.js';
import { AudioFormatType, TagFormatType } from '../../types/enums.js';
export class FORMAT {
    static packJamServeMedia(data) {
        if (!data) {
            return {};
        }
        return {
            mediaFormat: AudioFormatType.mp3,
            mediaDuration: Math.floor(data.durationEstimate * 1000),
            mediaBitRate: data.bitRate,
            mediaSampleRate: data.sampleRate,
            mediaChannels: data.channels,
            mediaEncoded: data.encoded,
            mediaMode: data.mode,
            mediaVersion: `${data.version} ${data.layer}`
        };
    }
    static packProbeJamServeMedia(data, format) {
        if (!data.streams) {
            return {};
        }
        const stream = data.streams.filter(s => s.codec_type === 'audio')[0];
        if (!stream) {
            return {};
        }
        return {
            mediaFormat: format,
            mediaDuration: Math.floor(Number(data.format.duration) * 1000),
            mediaBitRate: Number(data.format.bit_rate),
            mediaSampleRate: Number(stream.sample_rate),
            mediaChannels: stream.channels,
            mediaMode: stream.channel_layout,
            mediaVersion: stream.codec_long_name
        };
    }
    static packFlacMediaInfoJamServeMedia(media) {
        if (!media) {
            return {};
        }
        return {
            mediaFormat: AudioFormatType.flac,
            mediaDuration: Math.floor(media.duration * 1000),
            mediaSampleRate: media.sampleRate,
            mediaEncoded: 'VBR',
            mediaChannels: media.channels
        };
    }
    static parseNum(s) {
        if (s !== undefined) {
            const n = Number(s.trim());
            if (isNaN(n)) {
                return;
            }
            return n;
        }
        return;
    }
    static parseYear(s) {
        if (s === undefined) {
            return;
        }
        s = s.slice(0, 4).trim();
        if (s.length === 4) {
            const n = Number(s);
            if (isNaN(n)) {
                return;
            }
            return n;
        }
        return;
    }
    static packProbeJamServeTag(data) {
        if (!data || !data.format || !data.format.tags) {
            return { format: TagFormatType.none };
        }
        const simple = {};
        Object.keys(data.format.tags).forEach(key => {
            simple[key.toUpperCase().replace(/ /g, '_')] = FORMAT.cleanText(data.format.tags[key]);
        });
        return {
            format: TagFormatType.ffmpeg,
            artist: simple.ARTIST,
            title: simple.TITLE,
            album: simple.ALBUM,
            year: FORMAT.parseNum(simple.DATE),
            trackNr: FORMAT.parseNum(simple.TRACK),
            disc: FORMAT.parseNum(simple.DISC),
            lyrics: simple.LYRICS,
            seriesNr: simple.WORK,
            series: simple.GROUPING,
            genres: simple.GENRE ? cleanGenre(simple.GENRE) : undefined,
            albumArtist: simple.ALBUM_ARTIST,
            albumSort: simple.ALBUM_SORT || simple.ALBUM_SORT_ORDER,
            albumArtistSort: simple.ALBUM_ARTIST_SORT || simple.ALBUM_ARTIST_SORT_ORDER,
            artistSort: simple.ARTIST_SORT || simple.ARTIST_SORT_ORDER,
            titleSort: simple.TITLE_SORT || simple.TITLE_SORT_ORDER,
            mbTrackID: simple.TRACKID,
            mbAlbumType: simple.ALBUMTYPE,
            mbAlbumArtistID: simple.ALBUMARTISTID,
            mbArtistID: simple.ARTISTID,
            mbReleaseID: simple.ALBUMID,
            mbReleaseTrackID: simple.RELEASETRACKID,
            mbReleaseGroupID: simple.RELEASEGROUPID,
            mbRecordingID: simple.RECORDINGID,
            mbAlbumStatus: simple.ALBUMSTATUS,
            mbReleaseCountry: simple.RELEASECOUNTRY
        };
    }
    static packID3v1JamServeTag(data) {
        if (!data) {
            return undefined;
        }
        const simple = data.value;
        const genre = (simple.genreIndex !== undefined && !!ID3v1_GENRES[simple.genreIndex]) ? ID3v1_GENRES[simple.genreIndex] : undefined;
        return {
            format: TagFormatType.id3v1,
            artist: FORMAT.cleanText(simple.artist),
            title: FORMAT.cleanText(simple.title),
            album: FORMAT.cleanText(simple.album),
            year: FORMAT.parseNum(simple.year),
            trackNr: simple.track,
            genres: genre ? [genre] : undefined
        };
    }
    static packID3v2JamServeTag(data) {
        if (!data) {
            return undefined;
        }
        const simple = ID3v2.simplify(data, ['CHAP', 'APIC']);
        const pics = data.frames.filter(f => f.id === 'APIC');
        const format = ID3TrackTagRawFormatTypes[data.head ? data.head.rev : -1] || TagFormatType.none;
        return {
            format,
            album: FORMAT.cleanText(simple.ALBUM),
            albumSort: FORMAT.cleanText(simple.ALBUMSORT),
            albumArtist: FORMAT.cleanText(simple.ALBUMARTIST),
            albumArtistSort: FORMAT.cleanText(simple.ALBUMARTISTSORT),
            artist: FORMAT.cleanText(simple.ARTIST),
            artistSort: FORMAT.cleanText(simple.ARTISTSORT),
            title: FORMAT.cleanText(simple.TITLE),
            titleSort: FORMAT.cleanText(simple.TITLESORT),
            genres: simple.GENRE ? cleanGenre(simple.GENRE) : undefined,
            disc: FORMAT.parseNum(simple.DISCNUMBER),
            discTotal: FORMAT.parseNum(simple.DISCTOTAL),
            trackNr: FORMAT.parseNum(simple.TRACKNUMBER),
            trackTotal: FORMAT.parseNum(simple.TRACKTOTAL),
            lyrics: simple.LYRICS,
            seriesNr: simple.WORK,
            series: simple.GROUPING,
            year: FORMAT.parseYear(simple.ORIGINALDATE) || FORMAT.parseYear(simple.DATE) || FORMAT.parseYear(simple.RELEASETIME),
            mbTrackID: simple.MUSICBRAINZ_TRACKID,
            mbAlbumType: simple.RELEASETYPE,
            mbAlbumArtistID: simple.MUSICBRAINZ_ALBUMARTISTID,
            mbArtistID: simple.MUSICBRAINZ_ARTISTID,
            mbReleaseID: simple.MUSICBRAINZ_ALBUMID,
            mbReleaseTrackID: simple.MUSICBRAINZ_RELEASETRACKID,
            mbReleaseGroupID: simple.MUSICBRAINZ_RELEASEGROUPID,
            mbRecordingID: simple.MUSICBRAINZ_RELEASETRACKID,
            mbAlbumStatus: simple.RELEASESTATUS,
            mbReleaseCountry: simple.RELEASECOUNTRY,
            nrTagImages: pics.length
        };
    }
    static cleanText(s) {
        return s !== undefined ? s.replace(/ {2}/g, ' ').trim() : undefined;
    }
    static packFlacVorbisCommentJamServeTag(comment, pictures) {
        if (!comment || !comment.tag) {
            return undefined;
        }
        const simple = comment.tag;
        return {
            format: TagFormatType.vorbis,
            album: simple.ALBUM,
            albumSort: simple.ALBUMSORT,
            albumArtist: simple.ALBUMARTIST,
            albumArtistSort: simple.ALBUMARTISTSORT,
            artist: simple.ARTIST,
            artistSort: simple.ARTISTSORT,
            genres: simple.GENRE ? cleanGenre(simple.GENRE) : undefined,
            disc: FORMAT.parseNum(simple.DISCNUMBER),
            discTotal: FORMAT.parseNum(simple.DISCTOTAL) || FORMAT.parseNum(simple.TOTALDISCS),
            title: simple.TITLE,
            titleSort: simple.TITLESORT,
            trackNr: FORMAT.parseNum(simple.TRACKNUMBER) || FORMAT.parseNum(simple.TRACK),
            trackTotal: FORMAT.parseNum(simple.TRACKTOTAL) || FORMAT.parseNum(simple.TOTALTRACKS),
            year: FORMAT.parseYear(simple.ORIGINALYEAR) || FORMAT.parseYear(simple.ORIGINALDATE) || FORMAT.parseYear(simple.DATE),
            lyrics: simple.LYRICS,
            seriesNr: simple.WORK,
            series: simple.GROUPING,
            mbTrackID: simple.MUSICBRAINZ_TRACKID,
            mbAlbumType: simple.RELEASETYPE,
            mbAlbumArtistID: simple.MUSICBRAINZ_ALBUMARTISTID,
            mbArtistID: simple.MUSICBRAINZ_ARTISTID,
            mbReleaseID: simple.MUSICBRAINZ_ALBUMID,
            mbReleaseTrackID: simple.MUSICBRAINZ_RELEASETRACKID,
            mbReleaseGroupID: simple.MUSICBRAINZ_RELEASEGROUPID,
            mbRecordingID: simple.MUSICBRAINZ_RELEASETRACKID,
            mbAlbumStatus: simple.RELEASESTATUS,
            mbReleaseCountry: simple.RELEASECOUNTRY,
            nrTagImages: pictures ? pictures.length : undefined
        };
    }
}
//# sourceMappingURL=audio.format.js.map