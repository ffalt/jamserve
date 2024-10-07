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
import { SubsonicParameterID, SubsonicParameterPodcastChannel, SubsonicParameterPodcastChannels, SubsonicParameterPodcastEpisodesNewest } from '../model/subsonic-rest-params.js';
import { logger } from '../../../utils/logger.js';
import { EpisodeOrderFields, PodcastStatus } from '../../../types/enums.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { SubsonicOKResponse, SubsonicResponseNewestPodcasts, SubsonicResponsePodcasts } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';
import { SubsonicFormatter } from '../formatter.js';
import { SubsonicHelper } from '../helper.js';
const log = logger('SubsonicApi');
let SubsonicPodcastApi = class SubsonicPodcastApi {
    async getPodcasts(query, { orm, engine, user }) {
        let includeEpisodes = true;
        if (query.includeEpisodes !== undefined) {
            includeEpisodes = query.includeEpisodes;
        }
        let podcastList = [];
        if (query.id) {
            const podcast = await orm.Podcast.findOneOrFailByID(query.id);
            podcastList.push(podcast);
        }
        else {
            podcastList = await orm.Podcast.all();
        }
        const channel = [];
        for (const podcast of podcastList) {
            const pod = await SubsonicFormatter.packPodcast(podcast, (engine.podcast.isDownloading(podcast.id) ? PodcastStatus.downloading : undefined));
            if (includeEpisodes) {
                pod.episode = await SubsonicHelper.prepareEpisodes(engine, orm, await orm.Episode.findFilter({ podcastIDs: [podcast.id] }, [{ orderBy: EpisodeOrderFields.date, orderDesc: true }]), user);
            }
            channel.push(pod);
        }
        const podcasts = { channel };
        return { podcasts };
    }
    async getNewestPodcasts(query, { orm, engine, user }) {
        const episodes = await orm.Episode.findFilter({}, [{ orderBy: EpisodeOrderFields.date, orderDesc: true }], { take: query.count || 20, skip: query.offset || 0 }, user);
        const newestPodcasts = {};
        newestPodcasts.episode = await SubsonicHelper.prepareEpisodes(engine, orm, episodes, user);
        return { newestPodcasts };
    }
    async createPodcastChannel(query, { orm, engine }) {
        await engine.podcast.create(orm, query.url);
        return {};
    }
    async deletePodcastChannel(query, { orm, engine }) {
        const podcast = await orm.Podcast.findOneOrFailByID(query.id);
        engine.podcast.remove(orm, podcast).catch(e => log.error(e));
        return {};
    }
    async refreshPodcasts({ orm, engine }) {
        engine.podcast.refreshPodcasts(orm).catch(e => log.error(e));
        return {};
    }
    async downloadPodcastEpisode(query, { orm, engine }) {
        const episode = await orm.Episode.findOneOrFailByID(query.id);
        if (!episode.path) {
            engine.episode.downloadEpisode(orm, episode).catch(e => log.error(e));
        }
        return {};
    }
    async deletePodcastEpisode(query, { orm, engine }) {
        const episode = await orm.Episode.findOneOrFailByID(query.id);
        await engine.episode.deleteEpisode(orm, episode);
        return {};
    }
};
__decorate([
    SubsonicRoute('/getPodcasts', () => SubsonicResponsePodcasts, {
        summary: 'Get Podcasts',
        description: 'Returns all Podcast channels the server subscribes to, and (optionally) their episodes.',
        tags: ['Podcasts']
    }),
    __param(0, SubsonicParams()),
    __param(1, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterPodcastChannels, Object]),
    __metadata("design:returntype", Promise)
], SubsonicPodcastApi.prototype, "getPodcasts", null);
__decorate([
    SubsonicRoute('/getNewestPodcasts', () => SubsonicResponseNewestPodcasts, {
        summary: 'Get Newest Podcast Episodes',
        description: 'Returns the most recently published Podcast episodes.',
        tags: ['Podcasts']
    }),
    __param(0, SubsonicParams()),
    __param(1, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterPodcastEpisodesNewest, Object]),
    __metadata("design:returntype", Promise)
], SubsonicPodcastApi.prototype, "getNewestPodcasts", null);
__decorate([
    SubsonicRoute('/createPodcastChannel', () => SubsonicOKResponse, {
        summary: 'Create Podcasts',
        description: 'Adds a new Podcast channel.',
        tags: ['Podcasts']
    }),
    __param(0, SubsonicParams()),
    __param(1, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterPodcastChannel, Object]),
    __metadata("design:returntype", Promise)
], SubsonicPodcastApi.prototype, "createPodcastChannel", null);
__decorate([
    SubsonicRoute('/deletePodcastChannel', () => SubsonicOKResponse, {
        summary: 'Delete Podcasts',
        description: 'Deletes a Podcast channel.',
        tags: ['Podcasts']
    }),
    __param(0, SubsonicParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterID, Object]),
    __metadata("design:returntype", Promise)
], SubsonicPodcastApi.prototype, "deletePodcastChannel", null);
__decorate([
    SubsonicRoute('/refreshPodcasts', () => SubsonicOKResponse, {
        summary: 'Refresh Podcasts',
        description: 'Requests the server to check for new Podcast episodes.',
        tags: ['Podcasts']
    }),
    __param(0, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubsonicPodcastApi.prototype, "refreshPodcasts", null);
__decorate([
    SubsonicRoute('/downloadPodcastEpisode', () => SubsonicOKResponse, {
        summary: 'Download Podcast Episode',
        description: 'Request the server to start downloading a given Podcast episode.',
        tags: ['Podcasts']
    }),
    __param(0, SubsonicParams()),
    __param(1, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterID, Object]),
    __metadata("design:returntype", Promise)
], SubsonicPodcastApi.prototype, "downloadPodcastEpisode", null);
__decorate([
    SubsonicRoute('/deletePodcastEpisode', () => SubsonicOKResponse, {
        summary: 'Delete Podcast Episode',
        description: 'Deletes a Podcast episode.',
        tags: ['Podcasts']
    }),
    __param(0, SubsonicParams()),
    __param(1, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterID, Object]),
    __metadata("design:returntype", Promise)
], SubsonicPodcastApi.prototype, "deletePodcastEpisode", null);
SubsonicPodcastApi = __decorate([
    SubsonicController()
], SubsonicPodcastApi);
export { SubsonicPodcastApi };
//# sourceMappingURL=podcast.js.map