"use strict";
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
class TrackWorker extends base_1.BaseWorker {
    async writeTags(tags, changes) {
        for (const tag of tags) {
            const track = await this.orm.Track.findOne(tag.trackID);
            if (track) {
                const filename = path_1.default.join(track.path, track.fileName);
                await this.audioModule.writeRawTag(filename, tag.tag);
                await this.updateTrackStats(track);
                changes.tracks.updated.add(track);
                changes.folders.updated.add(track.folder);
            }
        }
    }
    async fix(fixes, changes) {
        const tracks = await this.orm.Track.find(fixes.map(t => t.trackID));
        const fixTasks = [];
        for (const track of tracks) {
            changes.tracks.updated.add(track);
            changes.folders.updated.add(track.folder);
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
        track.statCreated = stat.ctime.valueOf();
        track.statModified = stat.mtime.valueOf();
        track.fileSize = stat.size;
    }
    async rename(trackID, newName, changes) {
        const track = await this.orm.Track.findOne(trackID);
        if (!track) {
            return Promise.reject(Error('Track not found'));
        }
        track.fileName = await this.renameFile(track.path, track.fileName, newName);
        await this.updateTrackStats(track);
        this.orm.orm.em.persistLater(track);
        changes.tracks.updated.add(track);
        changes.folders.updated.add(track.folder);
    }
    async remove(root, trackIDs, changes) {
        const removedTracks = await this.orm.Track.find(trackIDs);
        if (removedTracks.length !== trackIDs.length) {
            return Promise.reject(Error('Track not found'));
        }
        for (const track of removedTracks) {
            await this.moveToTrash(root, track.path, track.fileName);
            changes.folders.updated.add(track.folder);
            changes.tracks.removed.add(track);
        }
    }
    async move(trackIDs, newParentID, changes) {
        const tracks = await this.orm.Track.find(trackIDs);
        if (tracks.length !== trackIDs.length) {
            return Promise.reject(Error('Track not found'));
        }
        const newParent = await this.orm.Folder.findOne(newParentID);
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
            const oldParent = track.folder;
            if (oldParent.id !== newParentID) {
                changes.folders.updated.add(oldParent);
                await fs_extra_1.default.move(path_1.default.join(track.path, track.fileName), path_1.default.join(newParent.path, track.fileName));
                track.path = fs_utils_1.ensureTrailingPathSeparator(newParent.path);
                track.root = newParent.root;
                track.folder = newParent;
                await this.updateTrackStats(track);
                this.orm.orm.em.persistLater(track);
            }
        }
    }
    async refresh(trackIDs, changes) {
        const tracks = await this.orm.Track.find(trackIDs);
        if (tracks.length !== trackIDs.length) {
            return Promise.reject(Error('Track not found'));
        }
        for (const track of tracks) {
            changes.tracks.updated.add(track);
            changes.folders.updated.add(track.folder);
        }
    }
}
exports.TrackWorker = TrackWorker;
//# sourceMappingURL=track.js.map