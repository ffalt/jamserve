var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { InRequestScope } from 'typescript-ioc';
import { DBObjectType } from '../../types/enums';
import { NotFoundError } from '../../modules/rest';
let PlayQueueService = class PlayQueueService {
    async getDuration(media) {
        switch (media.objType) {
            case DBObjectType.episode: {
                const episodeTag = await media.obj.tag.get();
                return (episodeTag?.mediaDuration || 0);
            }
            case DBObjectType.track: {
                const trackTag = await media.obj.tag.get();
                return (trackTag?.mediaDuration || 0);
            }
        }
        return 0;
    }
    async get(orm, user) {
        let queue = await orm.PlayQueue.findOne({ where: { user: user.id } });
        if (!queue) {
            queue = orm.PlayQueue.create({});
            await queue.user.set(user);
        }
        return queue;
    }
    async set(orm, args, user, client) {
        let queue = await orm.PlayQueue.findOne({ where: { user: user.id } });
        if (!queue) {
            queue = orm.PlayQueue.create({});
            await queue.user.set(user);
        }
        queue.changedBy = client;
        const ids = args.mediaIDs || [];
        const mediaList = [];
        for (const id of ids) {
            const media = await orm.findInStreamTypes(id);
            if (!media) {
                return Promise.reject(NotFoundError());
            }
            mediaList.push(media);
        }
        const oldEntries = (await queue.entries.getItems()).sort((a, b) => b.position - a.position);
        let duration = 0;
        let position = 1;
        for (const media of mediaList) {
            let entry = oldEntries.pop();
            if (!entry) {
                entry = orm.PlayQueueEntry.create({ playlist: queue, position });
            }
            entry.position = position;
            await entry.track.set(media.objType === DBObjectType.track ? media.obj : undefined);
            await entry.episode.set(media.objType === DBObjectType.episode ? media.obj : undefined);
            duration += await this.getDuration(media);
            position++;
            orm.PlayQueueEntry.persistLater(entry);
        }
        queue.duration = duration;
        for (const o of oldEntries) {
            orm.PlayQueueEntry.removeLater(o);
        }
        orm.PlayQueue.persistLater(queue);
        await orm.em.flush();
    }
    async clear(orm, user) {
        await orm.PlayQueue.removeByQueryAndFlush({ where: { user: user.id } });
    }
};
PlayQueueService = __decorate([
    InRequestScope
], PlayQueueService);
export { PlayQueueService };
//# sourceMappingURL=playqueue.service.js.map