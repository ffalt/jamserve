var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { SubsonicParameterCaptions, SubsonicParameterCoverArt, SubsonicParameterHLS, SubsonicParameterID, SubsonicParameterLyrics, SubsonicParameterLyricsByID, SubsonicParameterStream, SubsonicParameterUsername } from '../model/subsonic-rest-parameters.js';
import { logger } from '../../../utils/logger.js';
import { DBObjectType } from '../../../types/enums.js';
import { SubsonicRoute } from '../decorators/subsonic-route.js';
import { SubsonicParameters } from '../decorators/subsonic-parameters.js';
import { SubsonicResponseLyrics, SubsonicResponseLyricsList } from '../model/subsonic-rest-data.js';
import { ApiImageTypes, ApiStreamTypes } from '../../../types/consts.js';
import { SubsonicController } from '../decorators/subsonic-controller.js';
import { SubsonicContext } from '../decorators/subsonic-context.js';
import { SubsonicApiError, SubsonicFormatter } from '../formatter.js';
import path from 'node:path';
const log = logger('SubsonicApi');
let SubsonicMediaRetrievalApi = class SubsonicMediaRetrievalApi {
    async stream(query, { orm, engine, user }) {
        const o = await orm.findInStreamTypes(query.id);
        if (!o?.obj) {
            return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NOT_FOUND));
        }
        const options = {
            maxBitRate: query.maxBitRate !== undefined && query.maxBitRate > 0 ? query.maxBitRate : undefined,
            format: query.format,
            timeOffset: query.timeOffset !== undefined && query.timeOffset > 0 ? query.timeOffset : undefined
        };
        switch (o.objType) {
            case DBObjectType.track: {
                const result = await engine.stream.streamTrack(o.obj, options);
                engine.nowPlaying.reportTrack(orm, o.obj, user)
                    .catch((error) => {
                    log.error(error);
                });
                return result;
            }
            case DBObjectType.episode: {
                const result = await engine.stream.streamEpisode(o.obj, options);
                engine.nowPlaying.reportEpisode(orm, o.obj, user)
                    .catch((error) => {
                    log.error(error);
                });
                return result;
            }
            default:
        }
        return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.PARAM_INVALID));
    }
    async download(query, { orm, engine, user }) {
        if (!query.id) {
            return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NOT_FOUND));
        }
        const o = await orm.findInDownloadTypes(query.id);
        if (!o?.obj) {
            return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NOT_FOUND));
        }
        return engine.download.getObjDownload(o.obj, o.objType, undefined, user);
    }
    async getLyricsBySongId(query, { engine, orm }) {
        const track = await orm.Track.findOneOrFailByID(query.id);
        const tag = await track.tag.get();
        const structuredLyrics = [];
        let hasSynced = false;
        let hasUnssynced = false;
        const splitLyrics = (lyrics) => {
            return {
                lang: 'und',
                synced: false,
                line: lyrics.split('\n').map(value => ({ value }))
            };
        };
        if (tag?.syncedlyrics) {
            structuredLyrics.push(splitLyrics(tag.syncedlyrics));
            hasSynced = true;
        }
        if (tag?.lyrics) {
            structuredLyrics.push(splitLyrics(tag.lyrics));
            hasUnssynced = true;
        }
        if (!hasSynced) {
            const slyrics = await engine.audio.extractTagLyrics(path.join(track.path, track.fileName));
            if (slyrics) {
                const l = {
                    lang: slyrics.language || 'und',
                    synced: true,
                    line: slyrics.events.map(value => ({ value: value.text, start: value.timestamp }))
                };
                structuredLyrics.push(l);
            }
        }
        if (tag?.artist && tag.title) {
            const trackLyrics = await engine.metadata.lyricsLrcLibByTrackTag(orm, track, tag);
            if (trackLyrics.syncedLyrics && !hasSynced) {
                structuredLyrics.push(splitLyrics(trackLyrics.syncedLyrics));
                hasUnssynced = true;
            }
            if (trackLyrics.lyrics && !hasUnssynced) {
                structuredLyrics.push(splitLyrics(trackLyrics.lyrics));
            }
            if (!hasSynced && !hasUnssynced) {
                const lyrics = await engine.metadata.lyricsOVH(orm, tag.artist, tag.title);
                if (lyrics?.lyrics) {
                    structuredLyrics.push(splitLyrics(lyrics.lyrics));
                }
            }
        }
        return { lyricsList: { structuredLyrics } };
    }
    async getLyrics(query, { orm, engine }) {
        if (!query.artist || !query.title) {
            return { lyrics: { value: '' } };
        }
        const lyrics = await engine.metadata.lyricsOVH(orm, query.artist, query.title);
        if (!lyrics?.lyrics) {
            return { lyrics: { value: '' } };
        }
        return { lyrics: { artist: query.artist, title: query.title, value: lyrics.lyrics.replaceAll('\r\n', '\n') } };
    }
    async getCoverArt(query, { orm, engine }) {
        const o = await orm.findInImageTypes(query.id);
        if (!o?.obj) {
            return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NOT_FOUND));
        }
        return engine.image.getObjImage(orm, o.obj, o.objType, query.size);
    }
    async getAvatar(query, { orm, engine }) {
        const name = query.username;
        const user = await engine.user.findByName(orm, name);
        if (!user) {
            return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NOT_FOUND));
        }
        return engine.image.getObjImage(orm, user, DBObjectType.user);
    }
    async getCaptions(_query, _context) {
        return {};
    }
    async hls(_query, _context) {
        return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NOT_IMPLEMENTED));
    }
};
__decorate([
    SubsonicRoute('/stream', {
        summary: 'Stream',
        description: 'Streams a given media file.',
        tags: ['Media Retrieval'],
        binary: ApiStreamTypes
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterStream, Object]),
    __metadata("design:returntype", Promise)
], SubsonicMediaRetrievalApi.prototype, "stream", null);
__decorate([
    SubsonicRoute('/download', {
        summary: 'Download',
        description: 'Downloads a given media file. Similar to stream, but this method returns the original media data without transcoding or downsampling.',
        tags: ['Media Retrieval'],
        binary: ApiStreamTypes
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterID, Object]),
    __metadata("design:returntype", Promise)
], SubsonicMediaRetrievalApi.prototype, "download", null);
__decorate([
    SubsonicRoute('/getLyricsBySongId', () => SubsonicResponseLyricsList, {
        summary: 'Synchronized Lyrics',
        description: 'Searches for and returns lyrics for a given song.',
        tags: ['Media Retrieval']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterLyricsByID, Object]),
    __metadata("design:returntype", Promise)
], SubsonicMediaRetrievalApi.prototype, "getLyricsBySongId", null);
__decorate([
    SubsonicRoute('/getLyrics', () => SubsonicResponseLyrics, {
        summary: 'Lyrics',
        description: 'Searches for and returns lyrics for a given song.',
        tags: ['Media Retrieval']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterLyrics, Object]),
    __metadata("design:returntype", Promise)
], SubsonicMediaRetrievalApi.prototype, "getLyrics", null);
__decorate([
    SubsonicRoute('/getCoverArt', {
        summary: 'Cover Art',
        description: 'Returns a cover art image.',
        tags: ['Media Retrieval'],
        binary: ApiImageTypes
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterCoverArt, Object]),
    __metadata("design:returntype", Promise)
], SubsonicMediaRetrievalApi.prototype, "getCoverArt", null);
__decorate([
    SubsonicRoute('/getAvatar', {
        summary: 'Avatar',
        description: 'Returns the avatar (personal image) for a user.',
        tags: ['Media Retrieval'],
        binary: ApiImageTypes
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterUsername, Object]),
    __metadata("design:returntype", Promise)
], SubsonicMediaRetrievalApi.prototype, "getAvatar", null);
__decorate([
    SubsonicRoute('/getCaptions', {
        summary: 'Captions',
        description: 'Returns captions (subtitles) for a video. Use getVideoInfo to get a list of available captions.',
        tags: ['Media Retrieval']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterCaptions, Object]),
    __metadata("design:returntype", Promise)
], SubsonicMediaRetrievalApi.prototype, "getCaptions", null);
__decorate([
    SubsonicRoute('/hls.m3u8', {
        summary: 'HLS',
        description: 'Creates an HLS (HTTP Live Streaming) playlist used for streaming video or audio.',
        tags: ['Media Retrieval'],
        binary: ['application/vnd.apple.mpegurl']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterHLS, Object]),
    __metadata("design:returntype", Promise)
], SubsonicMediaRetrievalApi.prototype, "hls", null);
SubsonicMediaRetrievalApi = __decorate([
    SubsonicController()
], SubsonicMediaRetrievalApi);
export { SubsonicMediaRetrievalApi };
//# sourceMappingURL=media.js.map