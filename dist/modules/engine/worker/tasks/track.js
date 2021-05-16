"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackWorker = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const fs_utils_1 = require("../../../../utils/fs-utils");
const enums_1 = require("../../../../types/enums");
const queue_1 = require("../../../../utils/queue");
const base_1 = require("./base");
const typescript_ioc_1 = require("typescript-ioc");
let TrackWorker = class TrackWorker extends base_1.BaseWorker {
    async writeTags(orm, tags, changes) {
        for (const writeTag of tags) {
            const track = await orm.Track.findOneByID(writeTag.trackID);
            if (track) {
                const filename = path_1.default.join(track.path, track.fileName);
                await this.audioModule.writeRawTag(filename, writeTag.tag);
                const oldTag = await track.tag.get();
                if (oldTag) {
                    orm.Tag.removeLater(oldTag);
                }
                const result = await this.audioModule.read(filename);
                const tag = orm.Tag.createByScan(result, filename);
                orm.Tag.persistLater(tag);
                await track.tag.set(tag);
                await this.updateTrackStats(track);
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
                filename: path_1.default.join(track.path, track.fileName),
                fixIDs: fixes.filter(f => f.trackID === track.id).map(f => f.fixID)
            });
        }
        await queue_1.processQueue(3, fixTasks, async (item) => {
            for (const fixID of item.fixIDs) {
                if ([enums_1.TrackHealthID.mp3HeaderExists, enums_1.TrackHealthID.mp3HeaderValid].includes(fixID)) {
                    await this.audioModule.mp3.rewrite(item.filename);
                }
                else if ([enums_1.TrackHealthID.mp3Garbage, enums_1.TrackHealthID.mp3MediaValid].includes(fixID)) {
                    await this.audioModule.mp3.fixAudio(item.filename);
                }
                else if ([enums_1.TrackHealthID.id3v2NoId3v1].includes(fixID)) {
                    await this.audioModule.mp3.removeID3v1(item.filename);
                }
            }
        });
    }
    async updateTrackStats(track) {
        const stat = await fs_extra_1.default.stat(path_1.default.join(track.path, track.fileName));
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
        await this.updateTrackStats(track);
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
            if (await fs_extra_1.default.pathExists(path_1.default.join(newParent.path, track.fileName))) {
                return Promise.reject(Error('File name is already used in folder'));
            }
        }
        changes.folders.updated.add(newParent);
        for (const track of tracks) {
            changes.tracks.updated.add(track);
            const oldParent = await track.folder.get();
            if (oldParent?.id !== newParentID) {
                changes.folders.updated.add(oldParent);
                await fs_extra_1.default.move(path_1.default.join(track.path, track.fileName), path_1.default.join(newParent.path, track.fileName));
                track.path = fs_utils_1.ensureTrailingPathSeparator(newParent.path);
                await track.root.set(await newParent.root.getOrFail());
                await track.folder.set(newParent);
                await this.updateTrackStats(track);
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
TrackWorker = __decorate([
    typescript_ioc_1.InRequestScope
], TrackWorker);
exports.TrackWorker = TrackWorker;
//# sourceMappingURL=track.js.map