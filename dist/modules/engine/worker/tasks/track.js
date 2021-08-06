var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TrackWorker_1;
import fse from 'fs-extra';
import path from 'path';
import { ensureTrailingPathSeparator } from '../../../../utils/fs-utils';
import { TrackHealthID } from '../../../../types/enums';
import { processQueue } from '../../../../utils/queue';
import { BaseWorker } from './base';
import { InRequestScope } from 'typescript-ioc';
export class TrackUpdater {
    constructor(orm, audioModule, changes) {
        this.orm = orm;
        this.audioModule = audioModule;
        this.changes = changes;
        this.genresCache = [];
    }
    async updateTrackValues(track, filename) {
        const data = await this.audioModule.read(filename);
        const tag = this.orm.Tag.createByScan(data, filename);
        this.orm.Tag.persistLater(tag);
        const oldTag = await track.tag.get();
        if (oldTag) {
            this.orm.Tag.removeLater(oldTag);
        }
        await track.tag.set(tag);
        const genres = await this.findOrCreateGenres(tag);
        const removedGenreIDs = (await track.genres.getIDs()).filter(id => !genres.find(g => g.id == id));
        this.changes.genres.updated.appendIDs(removedGenreIDs);
        await track.genres.set(genres);
    }
    async findOrCreateGenres(tag) {
        const names = tag.genres || [];
        const genres = [];
        for (const name of names) {
            genres.push(await this.findOrCreateGenre(name));
        }
        return genres;
    }
    async findOrCreateGenre(name) {
        let genre = this.genresCache.find(g => g.name === name);
        if (!genre) {
            genre = await this.orm.Genre.findOne({ where: { name } });
            if (genre) {
                this.genresCache.push(genre);
            }
        }
        if (!genre) {
            genre = this.orm.Genre.create({ name });
            this.orm.Genre.persistLater(genre);
            this.genresCache.push(genre);
            this.changes.genres.added.add(genre);
        }
        return genre;
    }
}
let TrackWorker = TrackWorker_1 = class TrackWorker extends BaseWorker {
    async writeTags(orm, tags, changes) {
        const trackUpdater = new TrackUpdater(orm, this.audioModule, changes);
        for (const writeTag of tags) {
            const track = await orm.Track.findOneByID(writeTag.trackID);
            if (track) {
                const filename = path.join(track.path, track.fileName);
                await this.audioModule.writeRawTag(filename, writeTag.tag);
                await trackUpdater.updateTrackValues(track, filename);
                await TrackWorker_1.updateTrackStats(track);
                orm.Track.persistLater(track);
                changes.tracks.updated.add(track);
                changes.folders.updated.addID(track.folder.id());
            }
        }
    }
    async fix(orm, fixes, changes) {
        const tracks = await orm.Track.findByIDs(fixes.map(t => t.trackID));
        const fixTasks = [];
        for (const track of tracks) {
            changes.tracks.updated.add(track);
            changes.folders.updated.add(await track.folder.get());
            fixTasks.push({
                filename: path.join(track.path, track.fileName),
                fixIDs: fixes.filter(f => f.trackID === track.id).map(f => f.fixID)
            });
        }
        await processQueue(3, fixTasks, async (item) => {
            for (const fixID of item.fixIDs) {
                if ([TrackHealthID.mp3HeaderExists, TrackHealthID.mp3HeaderValid].includes(fixID)) {
                    await this.audioModule.mp3.rewrite(item.filename);
                }
                else if ([TrackHealthID.mp3Garbage, TrackHealthID.mp3MediaValid].includes(fixID)) {
                    await this.audioModule.mp3.fixAudio(item.filename);
                }
                else if ([TrackHealthID.id3v2NoId3v1].includes(fixID)) {
                    await this.audioModule.mp3.removeID3v1(item.filename);
                }
            }
        });
    }
    static async updateTrackStats(track) {
        const stat = await fse.stat(path.join(track.path, track.fileName));
        track.statCreated = stat.ctime;
        track.statModified = stat.mtime;
        track.fileSize = stat.size;
    }
    async rename(orm, trackID, newName, changes) {
        const track = await orm.Track.findOneByID(trackID);
        if (!track) {
            return Promise.reject(Error('Track not found'));
        }
        track.fileName = await this.renameFile(track.path, track.fileName, newName);
        await TrackWorker_1.updateTrackStats(track);
        orm.Track.persistLater(track);
        changes.tracks.updated.add(track);
        changes.folders.updated.add(await track.folder.get());
    }
    async remove(orm, root, trackIDs, changes) {
        const removedTracks = await orm.Track.findByIDs(trackIDs);
        if (removedTracks.length !== trackIDs.length) {
            return Promise.reject(Error('Track not found'));
        }
        for (const track of removedTracks) {
            await this.moveToTrash(root, track.path, track.fileName);
            changes.folders.updated.add(await track.folder.get());
            changes.tracks.removed.add(track);
        }
    }
    async move(orm, trackIDs, newParentID, changes) {
        const tracks = await orm.Track.findByIDs(trackIDs);
        if (tracks.length !== trackIDs.length) {
            return Promise.reject(Error('Track not found'));
        }
        const newParent = await orm.Folder.findOneByID(newParentID);
        if (!newParent) {
            return Promise.reject(Error('Destination Folder not found'));
        }
        for (const track of tracks) {
            if (await fse.pathExists(path.join(newParent.path, track.fileName))) {
                return Promise.reject(Error('File name is already used in folder'));
            }
        }
        changes.folders.updated.add(newParent);
        for (const track of tracks) {
            changes.tracks.updated.add(track);
            const oldParent = await track.folder.get();
            if (oldParent?.id !== newParentID) {
                changes.folders.updated.add(oldParent);
                await fse.move(path.join(track.path, track.fileName), path.join(newParent.path, track.fileName));
                track.path = ensureTrailingPathSeparator(newParent.path);
                await track.root.set(await newParent.root.getOrFail());
                await track.folder.set(newParent);
                await TrackWorker_1.updateTrackStats(track);
                orm.Track.persistLater(track);
            }
        }
    }
    async refresh(orm, trackIDs, changes) {
        const tracks = await orm.Track.findByIDs(trackIDs);
        if (tracks.length !== trackIDs.length) {
            return Promise.reject(Error('Track not found'));
        }
        for (const track of tracks) {
            changes.tracks.updated.add(track);
            changes.folders.updated.add(await track.folder.get());
        }
    }
};
TrackWorker = TrackWorker_1 = __decorate([
    InRequestScope
], TrackWorker);
export { TrackWorker };
//# sourceMappingURL=track.js.map