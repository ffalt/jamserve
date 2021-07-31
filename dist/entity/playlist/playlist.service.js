var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { InRequestScope } from 'typescript-ioc';
import { DBObjectType } from '../../types/enums';
import { NotFoundError } from '../../modules/rest';
let PlaylistService = class PlaylistService {
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
    async create(orm, args, user) {
        const playlist = orm.Playlist.create({
            name: args.name,
            comment: args.comment,
            isPublic: args.isPublic,
            changed: Date.now(),
            duration: 0
        });
        await playlist.user.set(user);
        const ids = args.mediaIDs || [];
        let position = 1;
        let duration = 0;
        for (const id of ids) {
            const media = await orm.findInStreamTypes(id);
            if (!media) {
                return Promise.reject(NotFoundError());
            }
            duration += await this.getDuration(media);
            const entry = orm.PlaylistEntry.create({ position });
            await entry.playlist.set(playlist);
            await entry.track.set(media.objType === DBObjectType.track ? media.obj : undefined);
            await entry.episode.set(media.objType === DBObjectType.episode ? media.obj : undefined);
            orm.PlaylistEntry.persistLater(entry);
            position++;
        }
        playlist.duration = duration;
        await orm.Playlist.persistAndFlush(playlist);
        return playlist;
    }
    async updateEntries(orm, ids, args, playlist) {
        const mediaList = await orm.findListInStreamTypes(ids);
        const oldEntries = (await playlist.entries.getItems()).sort((a, b) => b.position - a.position);
        let duration = 0;
        let position = 1;
        for (const media of mediaList) {
            let entry = oldEntries.pop();
            if (!entry) {
                entry = orm.PlaylistEntry.create({ position });
            }
            entry.position = position;
            await entry.playlist.set(playlist);
            await entry.track.set(media.objType === DBObjectType.track ? media.obj : undefined);
            await entry.episode.set(media.objType === DBObjectType.episode ? media.obj : undefined);
            duration += await this.getDuration(media);
            position++;
            orm.PlaylistEntry.persistLater(entry);
        }
        orm.PlaylistEntry.removeListLater(oldEntries);
        return duration;
    }
    async update(orm, args, playlist) {
        playlist.name = (args.name !== undefined) ? args.name : playlist.name;
        playlist.isPublic = (args.isPublic !== undefined) ? args.isPublic : playlist.isPublic;
        playlist.comment = (args.comment !== undefined) ? args.comment : playlist.comment;
        playlist.duration = await this.updateEntries(orm, args.mediaIDs || [], args, playlist);
        orm.Playlist.persistLater(playlist);
        await orm.em.flush();
    }
    async remove(orm, playlist) {
        await orm.Playlist.removeAndFlush(playlist);
    }
};
PlaylistService = __decorate([
    InRequestScope
], PlaylistService);
export { PlaylistService };
//# sourceMappingURL=playlist.service.js.map