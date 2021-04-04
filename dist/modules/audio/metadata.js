"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawTagToID3v2 = exports.trackTagToRawTag = exports.id3v2ToFlacMetaData = exports.id3v2ToRawTag = exports.flacToRawTag = exports.flacToRawTagPictures = exports.flacToRawTagChapters = exports.flacToRawTagBase = exports.prepareResponseTag = void 0;
const jamp3_1 = require("jamp3");
const moment_1 = __importDefault(require("moment"));
const block_picture_1 = require("./formats/flac/lib/block.picture");
const block_vorbiscomment_1 = require("./formats/flac/lib/block.vorbiscomment");
function prepareFrame(frame) {
    if (frame && frame.value && frame.value.bin) {
        const binValue = frame.value;
        binValue.bin = binValue.bin.toString('base64');
    }
    if (frame && frame.subframes) {
        frame.subframes.forEach(prepareFrame);
    }
}
function prepareResponseTag(tag) {
    Object.keys(tag.frames).forEach(key => {
        const frames = tag.frames[key];
        if (frames) {
            frames.forEach(prepareFrame);
        }
    });
}
exports.prepareResponseTag = prepareResponseTag;
function flacToRawTagBase(builder, simple) {
    builder
        .album(simple.ALBUM)
        .albumSort(simple.ALBUMSORT)
        .originalAlbum(simple.ORIGINALALBUM)
        .originalArtist(simple.ORIGINALARTIST)
        .originalDate(simple.ORIGINALDATE)
        .title(simple.TITLE)
        .titleSort(simple.TITLESORT)
        .work(simple.WORK)
        .artist(simple.ARTIST)
        .artistSort(simple.ARTISTSORT)
        .albumArtist(simple.ALBUMARTIST)
        .albumArtistSort(simple.ALBUMARTISTSORT)
        .artists(simple.ARTISTS)
        .isCompilation(simple.COMPILATION)
        .grouping(simple.GROUPING)
        .date(simple.DATE)
        .composer(simple.COMPOSER)
        .composerSort(simple.COMPOSER)
        .remixer(simple.REMIXER)
        .label(simple.LABEL)
        .subtitle(simple.SUBTITLE)
        .discSubtitle(simple.DISCSUBTITLE)
        .lyricist(simple.LYRICIST)
        .genre(simple.GENRE)
        .bpm(simple.BPM)
        .mood(simple.MOOD)
        .lyrics(simple.LYRICS)
        .mediaType(simple.MEDIA)
        .language(simple.LANGUAGE)
        .encoder(simple.ENCODEDBY || simple['ENCODED-BY'])
        .encoderSettings(simple.ENCODERSETTINGS)
        .initialKey(simple.KEY)
        .copyright(simple.COPYRIGHT)
        .isrc(simple.ISRC)
        .barcode(simple.BARCODE)
        .asin(simple.ASIN)
        .catalogNumber(simple.CATALOGNUMBER)
        .script(simple.SCRIPT)
        .license(simple.LICENSE)
        .website(simple.WEBSITE)
        .movement(simple.MOVEMENTNAME)
        .movementNr(simple.MOVEMENT, simple.MOVEMENTTOTAL)
        .writer(simple.WRITER)
        .track(simple.TRACKNUMBER, simple.TRACKTOTAL || simple.TOTALTRACKS)
        .disc(simple.DISCNUMBER, simple.DISCTOTAL || simple.TOTALDISCS)
        .musicianCredit('instrument', simple.PERFORMER)
        .involved('arranger', simple.ARRANGER)
        .involved('engineer', simple.ENGINEER)
        .involved('producer', simple.PRODUCER)
        .involved('DJ-mix', simple.DJMIXER)
        .involved('mix', simple.MIXER)
        .mbAlbumStatus(simple.RELEASESTATUS)
        .mbAlbumType(simple.RELEASETYPE)
        .mbAlbumReleaseCountry(simple.RELEASECOUNTRY)
        .mbTrackID(simple.MUSICBRAINZ_TRACKID)
        .mbReleaseTrackID(simple.MUSICBRAINZ_RELEASETRACKID)
        .mbAlbumID(simple.MUSICBRAINZ_ALBUMID)
        .mbOriginalAlbumID(simple.MUSICBRAINZ_ORIGINALALBUMID)
        .mbArtistID(simple.MUSICBRAINZ_ARTISTID)
        .mbOriginalArtistID(simple.MUSICBRAINZ_ORIGINALARTISTID)
        .mbAlbumArtistID(simple.MUSICBRAINZ_ALBUMARTISTID)
        .mbReleaseGroupID(simple.MUSICBRAINZ_RELEASEGROUPID)
        .mbWorkID(simple.MUSICBRAINZ_WORKID)
        .mbTRMID(simple.MUSICBRAINZ_TRMID)
        .mbDiscID(simple.MUSICBRAINZ_DISCID)
        .acoustidID(simple.ACOUSTID_ID)
        .acoustidFingerprint(simple.ACOUSTID_FINGERPRINT)
        .musicIPPUID(simple.MUSICIP_PUID)
        .custom('CATALOGUE', simple.CATALOGUE)
        .custom('VERSION', simple.VERSION)
        .custom('ACCURATERIPRESULT', simple.ACCURATERIPRESULT)
        .custom('UPC', simple.UPC)
        .custom('EAN', simple.EAN)
        .custom('UPN', simple.UPN)
        .custom('STYLE', simple.STYLE)
        .custom('LOCATION', simple.LOCATION)
        .custom('PERIOD', simple.PERIOD)
        .custom('SOLOISTS', simple.SOLOISTS)
        .custom('PARTNUMBER', simple.PARTNUMBER)
        .custom('LABELNO', simple.LABELNO)
        .custom('OPUS', simple.OPUS)
        .custom('PART', simple.PART)
        .custom('SOURCE', simple.SOURCE)
        .custom('SOURCEMEDIA', simple.SOURCEMEDIA)
        .custom('SHOWMOVEMENT', simple.SHOWMOVEMENT)
        .custom('ORIGINALYEAR', simple.ORIGINALYEAR)
        .custom('REPLAYGAIN_ALBUM_GAIN', simple.REPLAYGAIN_ALBUM_GAIN)
        .custom('REPLAYGAIN_ALBUM_PEAK', simple.REPLAYGAIN_ALBUM_PEAK)
        .custom('REPLAYGAIN_TRACK_GAIN', simple.REPLAYGAIN_TRACK_GAIN)
        .custom('REPLAYGAIN_TRACK_PEAK', simple.REPLAYGAIN_TRACK_PEAK)
        .comment('comment', simple.COMMENT)
        .comment('description', simple.DESCRIPTION);
}
exports.flacToRawTagBase = flacToRawTagBase;
function flacToRawTagChapters(builder, simple) {
    const pad = '000';
    let nr = 1;
    let id = `CHAPTER${pad.substring(0, pad.length - nr.toString().length)}${nr.toString()}`;
    while (simple[id]) {
        const chapterTime = moment_1.default(simple[id]).valueOf() || 0;
        const chapterID = simple[`${id}ID`] || id;
        const chapterName = simple[`${id}NAME`];
        const chapterURL = simple[`${id}URL`];
        const subframeBuilder = new jamp3_1.ID3V24TagBuilder('utf8');
        subframeBuilder.title(chapterName).website(chapterURL);
        builder.chapter(chapterID, chapterTime, chapterTime, 0, 0, subframeBuilder.buildFrames());
        nr++;
        id = `CHAPTER${pad.substring(0, pad.length - nr.toString().length)}${nr.toString()}`;
    }
}
exports.flacToRawTagChapters = flacToRawTagChapters;
function flacToRawTagPictures(builder, flacInfo) {
    if (flacInfo.pictures) {
        for (const pic of flacInfo.pictures) {
            builder.picture(pic.pictureType, pic.description, pic.mimeType, pic.pictureData);
        }
    }
}
exports.flacToRawTagPictures = flacToRawTagPictures;
async function flacToRawTag(flacInfo) {
    if (!flacInfo || !flacInfo.comment || !flacInfo.comment.tag) {
        return;
    }
    const simple = flacInfo.comment.tag;
    const builder = new jamp3_1.ID3V24TagBuilder('utf8');
    flacToRawTagBase(builder, simple);
    flacToRawTagChapters(builder, simple);
    flacToRawTagPictures(builder, flacInfo);
    const tag = { version: 4, frames: builder.rawBuilder.build() };
    prepareResponseTag(tag);
    return tag;
}
exports.flacToRawTag = flacToRawTag;
async function id3v2ToRawTag(id3v2tag) {
    const tag = {
        version: id3v2tag.head ? id3v2tag.head.ver : 4,
        frames: {}
    };
    id3v2tag.frames.forEach(frame => {
        const f = tag.frames[frame.id] || [];
        f.push({ id: frame.id, value: frame.value });
        tag.frames[frame.id] = f;
    });
    prepareResponseTag(tag);
    return tag;
}
exports.id3v2ToRawTag = id3v2ToRawTag;
async function id3v2ToFlacMetaData(tag, imageModule) {
    const DropFramesList = [
        'TSIZ',
        'APIC'
    ];
    const simple = jamp3_1.ID3v2.simplify(tag, DropFramesList);
    const comments = [];
    Object.keys(simple).forEach(key => {
        comments.push(`${key}=${simple[key].toString()}`);
    });
    const result = [block_vorbiscomment_1.BlockVorbiscomment.createVorbisCommentBlock('jamserve', comments)];
    const pics = tag.frames.filter(frame => frame.id === 'APIC');
    for (const pic of pics) {
        if (pic.value.bin && pic.value.mimeType) {
            const imageInfo = await imageModule.getImageInfoBuffer(pic.value.bin);
            const picBlock = block_picture_1.MetaDataBlockPicture.createPictureBlock(pic.value.pictureType, pic.value.mimeType, pic.value.description, imageInfo.width, imageInfo.height, imageInfo.colorDepth, imageInfo.colors, pic.value.bin);
            result.push(picBlock);
        }
    }
    return result;
}
exports.id3v2ToFlacMetaData = id3v2ToFlacMetaData;
function trackTagToRawTag(tag) {
    const builder = new jamp3_1.ID3V24TagBuilder('utf8');
    builder.artist(tag.artist)
        .album(tag.album)
        .title(tag.title)
        .genre(tag.genres ? tag.genres.join(' / ') : undefined)
        .track(tag.trackNr, tag.trackTotal)
        .disc(tag.disc, tag.discTotal)
        .date(tag.year ? tag.year.toString() : undefined);
    return { version: 4, frames: builder.rawBuilder.build() };
}
exports.trackTagToRawTag = trackTagToRawTag;
function rawFrameToID3v2(frame) {
    if (frame && frame.value && frame.value.bin) {
        const bin = frame.value.bin;
        if (typeof bin === 'string') {
            frame.value.bin = Buffer.from(bin, 'base64');
        }
    }
    if (frame && frame.subframes) {
        frame.subframes.forEach(rawFrameToID3v2);
    }
}
function rawTagToID3v2(tag) {
    const frames = [];
    Object.keys(tag.frames).map(id => {
        const f = tag.frames[id] || [];
        f.forEach(frame => {
            rawFrameToID3v2(frame);
            frames.push(frame);
        });
        return;
    });
    return {
        id: jamp3_1.ITagID.ID3v2,
        head: {
            ver: tag.version,
            rev: 0,
            size: 0,
            valid: true
        },
        start: 0,
        end: 0,
        frames
    };
}
exports.rawTagToID3v2 = rawTagToID3v2;
//# sourceMappingURL=metadata.js.map