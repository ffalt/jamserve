var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Inject, InRequestScope } from 'typescript-ioc';
import { NotFoundError } from '../../modules/rest/builder';
import { DBObjectType } from '../../types/enums';
import { logger } from '../../utils/logger';
import { StateService } from '../state/state.service';
const log = logger('NowPlayingService');
let NowPlayingService = class NowPlayingService {
    constructor() {
        this.playing = [];
    }
    async getNowPlaying() {
        return this.playing;
    }
    clear() {
        this.playing = [];
    }
    async report(orm, entries, user) {
        await this.stateService.reportPlaying(orm, entries, user);
    }
    async reportEpisode(orm, episode, user) {
        this.playing = this.playing.filter(np => (np.user.id !== user.id));
        const result = { time: Date.now(), episode, user };
        this.playing.push(result);
        this.report(orm, [
            { id: episode.id, type: DBObjectType.episode },
            { id: episode.podcast.idOrFail(), type: DBObjectType.podcast },
        ], user).catch(e => log.error(e));
        return result;
    }
    async reportTrack(orm, track, user) {
        this.playing = this.playing.filter(np => (np.user.id !== user.id));
        const result = { time: Date.now(), track, user };
        this.playing.push(result);
        this.report(orm, [
            { id: track.id, type: DBObjectType.track },
            { id: track.album.id(), type: DBObjectType.album },
            { id: track.artist.id(), type: DBObjectType.artist },
            { id: track.folder.id(), type: DBObjectType.folder },
            { id: track.series.id(), type: DBObjectType.series },
            { id: track.root.id(), type: DBObjectType.root },
        ], user).catch(e => log.error(e));
        return result;
    }
    async scrobble(orm, id, user) {
        const result = await orm.findInStreamTypes(id);
        if (!result) {
            return Promise.reject(NotFoundError());
        }
        switch (result.objType) {
            case DBObjectType.track:
                return await this.reportTrack(orm, result.obj, user);
            case DBObjectType.episode:
                return this.reportEpisode(orm, result.obj, user);
            default:
                return Promise.reject(Error('Invalid Object Type for Scrobbling'));
        }
    }
};
__decorate([
    Inject,
    __metadata("design:type", StateService)
], NowPlayingService.prototype, "stateService", void 0);
NowPlayingService = __decorate([
    InRequestScope
], NowPlayingService);
export { NowPlayingService };
//# sourceMappingURL=nowplaying.service.js.map