"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerScan = exports.ObjLoadTrackMatch = exports.ObjTrackMatch = exports.OnDemandTrackMatch = void 0;
const logger_1 = require("../../../utils/logger");
const enums_1 = require("../../../types/enums");
const dir_name_1 = require("../../../utils/dir-name");
const path_1 = __importDefault(require("path"));
const fs_utils_1 = require("../../../utils/fs-utils");
const artwork_type_1 = require("../../../utils/artwork-type");
const moment_1 = __importDefault(require("moment"));
const log = logger_1.logger('Worker.Scan');
class OnDemandTrackMatch {
}
exports.OnDemandTrackMatch = OnDemandTrackMatch;
class ObjTrackMatch {
    constructor(match) {
        this.match = match;
    }
    async get() {
        return this.match;
    }
}
exports.ObjTrackMatch = ObjTrackMatch;
class ObjLoadTrackMatch {
    constructor(track) {
        this.track = track;
    }
    async get() {
        return WorkerScan.buildTrackMatch(this.track);
    }
}
exports.ObjLoadTrackMatch = ObjLoadTrackMatch;
class WorkerScan {
    constructor(orm, rootID, audioModule, imageModule, changes) {
        this.orm = orm;
        this.rootID = rootID;
        this.audioModule = audioModule;
        this.imageModule = imageModule;
        this.changes = changes;
    }
    async setArtworkValues(file, artwork) {
        const name = path_1.default.basename(file.path);
        const info = await this.imageModule.getImageInfo(file.path);
        artwork.types = artwork_type_1.artWorkImageNameToType(name);
        artwork.format = info === null || info === void 0 ? void 0 : info.format;
        artwork.height = info === null || info === void 0 ? void 0 : info.height;
        artwork.width = info === null || info === void 0 ? void 0 : info.width;
        artwork.statCreated = file.ctime;
        artwork.statModified = file.mtime;
        artwork.fileSize = file.size;
        this.orm.Artwork.persistLater(artwork);
    }
    async buildArtwork(file, folder) {
        log.info('New Artwork', file.path);
        const name = path_1.default.basename(file.path);
        const artwork = this.orm.Artwork.create({ name, path: folder.path });
        await artwork.folder.set(folder);
        await this.setArtworkValues(file, artwork);
        this.changes.artworks.added.add(artwork);
        return artwork;
    }
    async updateArtwork(file, artwork) {
        log.info('Artwork has changed', file.path);
        await this.setArtworkValues(file, artwork);
        this.changes.artworks.updated.add(artwork);
    }
    static async buildTrackMatch(track) {
        const tag = await track.tag.get();
        return {
            artist: (tag === null || tag === void 0 ? void 0 : tag.albumArtist) || (tag === null || tag === void 0 ? void 0 : tag.artist),
            artistSort: (tag === null || tag === void 0 ? void 0 : tag.albumArtistSort) || (tag === null || tag === void 0 ? void 0 : tag.artistSort),
            genres: tag === null || tag === void 0 ? void 0 : tag.genres,
            album: tag === null || tag === void 0 ? void 0 : tag.album,
            series: tag === null || tag === void 0 ? void 0 : tag.series,
            year: tag === null || tag === void 0 ? void 0 : tag.year,
            trackTotal: tag === null || tag === void 0 ? void 0 : tag.trackTotal,
            discTotal: tag === null || tag === void 0 ? void 0 : tag.discTotal,
            disc: tag === null || tag === void 0 ? void 0 : tag.disc,
            track: tag === null || tag === void 0 ? void 0 : tag.trackNr,
            mbArtistID: tag === null || tag === void 0 ? void 0 : tag.mbArtistID,
            mbReleaseID: tag === null || tag === void 0 ? void 0 : tag.mbReleaseID,
            mbAlbumType: `${(tag === null || tag === void 0 ? void 0 : tag.mbAlbumType) || ''}/${(tag === null || tag === void 0 ? void 0 : tag.mbAlbumStatus) || ''}`,
        };
    }
    async setTrackValues(file, track) {
        const data = await this.audioModule.read(file.path);
        const tag = this.orm.Tag.createByScan(data, file.path);
        this.orm.Tag.persistLater(tag);
        const oldTag = await track.tag.get();
        if (oldTag) {
            this.orm.Tag.removeLater(oldTag);
        }
        await track.tag.set(tag);
        track.fileSize = file.size;
        track.statCreated = file.ctime;
        track.statModified = file.mtime;
        this.orm.Track.persistLater(track);
        return WorkerScan.buildTrackMatch(track);
    }
    async buildTrack(file, parent) {
        log.info('New Track', file.path);
        const track = this.orm.Track.create({
            name: fs_utils_1.basenameStripExt(file.path),
            fileName: path_1.default.basename(file.path),
            path: fs_utils_1.ensureTrailingPathSeparator(path_1.default.dirname(file.path))
        });
        await track.folder.set(parent);
        await track.root.set(this.root);
        this.changes.tracks.added.add(track);
        return await this.setTrackValues(file, track);
    }
    async updateTrack(file, track) {
        if (!this.changes.tracks.removed.has(track)) {
            log.info('Track has changed', file.path);
            this.changes.tracks.updated.add(track);
            return await this.setTrackValues(file, track);
        }
    }
    async buildFolder(dir, parent) {
        log.info('New Folder', dir.path);
        const { title, year } = dir_name_1.splitDirectoryName(dir.path);
        const name = path_1.default.basename(dir.path);
        const folder = this.orm.Folder.create({
            level: dir.level,
            path: dir.path,
            name,
            title: name !== title ? title : undefined,
            year,
            folderType: enums_1.FolderType.unknown,
            statCreated: dir.ctime,
            statModified: dir.mtime
        });
        await folder.root.set(this.root);
        if (parent) {
            await folder.parent.set(parent);
        }
        this.orm.Folder.persistLater(folder);
        return folder;
    }
    async buildNode(dir, parent) {
        const folder = await this.buildFolder(dir, parent);
        this.changes.folders.added.add(folder);
        const result = {
            scan: dir,
            folder,
            children: [],
            tracks: [],
            artworksCount: 0,
            changed: true
        };
        for (const subDir of dir.directories) {
            result.children.push(await this.buildNode(subDir, folder));
        }
        for (const file of dir.files) {
            if (file.type === enums_1.FileTyp.audio) {
                result.tracks.push(new ObjTrackMatch(await this.buildTrack(file, folder)));
            }
            else if (file.type === enums_1.FileTyp.image) {
                result.artworksCount += 1;
                await this.buildArtwork(file, folder);
            }
        }
        if (this.orm.em.changesCount() > 1000) {
            log.debug('Syncing Track/Artwork Changes to DB');
            await this.orm.em.flush();
        }
        return result;
    }
    async removeFolder(folder) {
        const removedTracks = await this.orm.Track.findFilter({ childOfID: folder.id });
        const removedFolders = await this.orm.Folder.findFilter({ childOfID: folder.id });
        const removedArtworks = await this.orm.Artwork.findFilter({ childOfID: folder.id });
        removedFolders.push(folder);
        this.changes.folders.removed.append(removedFolders);
        this.changes.artworks.removed.append(removedArtworks);
        this.changes.tracks.removed.append(removedTracks);
    }
    async scanNode(dir, folder) {
        log.debug('Matching:', dir.path);
        const result = {
            scan: dir,
            folder,
            children: [],
            tracks: [],
            artworksCount: 0,
            changed: false
        };
        await this.scanSubfolders(folder, dir, result);
        await this.scanTracks(dir, folder, result);
        await this.scanArtworks(dir, folder, result);
        return result;
    }
    async scanSubfolders(folder, dir, result) {
        const folders = await folder.children.getItems();
        for (const subDir of dir.directories) {
            if (subDir.path !== folder.path) {
                const subFolder = folders.find(f => f.path === subDir.path);
                if (!subFolder) {
                    result.children.push(await this.buildNode(subDir, folder));
                }
                else {
                    result.children.push(await this.scanNode(subDir, subFolder));
                }
            }
        }
        for (const child of folders) {
            const subf = result.children.find(f => f.scan.path === child.path);
            if (!subf) {
                await this.removeFolder(child);
                this.changes.folders.updated.add(folder);
            }
        }
    }
    async scanArtworks(dir, folder, result) {
        const scanArtworks = dir.files.filter(f => f.type === enums_1.FileTyp.image);
        const foundScanArtworks = [];
        const artworks = await folder.artworks.getItems();
        for (const artwork of artworks) {
            const filename = path_1.default.join(artwork.path, artwork.name);
            const scanArtwork = scanArtworks.find(t => t.path == filename);
            if (scanArtwork) {
                foundScanArtworks.push(scanArtwork);
                result.artworksCount += 1;
                if (scanArtwork.size !== artwork.fileSize ||
                    !moment_1.default(scanArtwork.ctime).isSame(artwork.statCreated) ||
                    !moment_1.default(scanArtwork.mtime).isSame(artwork.statModified)) {
                    result.changed = true;
                    await this.updateArtwork(scanArtwork, artwork);
                }
            }
            else {
                log.info('Artwork has been removed', filename);
                result.changed = true;
                this.changes.artworks.removed.add(artwork);
            }
        }
        const newArtworks = scanArtworks.filter(t => !foundScanArtworks.includes(t));
        for (const newArtwork of newArtworks) {
            result.changed = true;
            result.artworksCount += 1;
            await this.buildArtwork(newArtwork, folder);
        }
    }
    async scanTracks(dir, folder, result) {
        const scanTracks = dir.files.filter(f => f.type === enums_1.FileTyp.audio);
        const foundScanTracks = [];
        const tracks = await folder.tracks.getItems();
        for (const track of tracks) {
            const filename = path_1.default.join(track.path, track.fileName);
            const scanTrack = scanTracks.find(t => t.path == filename);
            if (scanTrack) {
                foundScanTracks.push(scanTrack);
                if (scanTrack.size !== track.fileSize ||
                    !moment_1.default(scanTrack.ctime).isSame(track.statCreated) ||
                    !moment_1.default(scanTrack.mtime).isSame(track.statModified)) {
                    const t = await this.updateTrack(scanTrack, track);
                    if (t) {
                        result.tracks.push(new ObjTrackMatch(t));
                    }
                    result.changed = true;
                }
                else {
                    result.tracks.push(new ObjLoadTrackMatch(track));
                }
            }
            else {
                log.info('Track has been removed', filename);
                result.changed = true;
                this.changes.tracks.removed.add(track);
            }
        }
        const newTracks = scanTracks.filter(t => !foundScanTracks.includes(t));
        for (const newTrack of newTracks) {
            result.changed = true;
            result.tracks.push(new ObjTrackMatch(await this.buildTrack(newTrack, folder)));
        }
    }
    async match(dir) {
        this.root = await this.orm.Root.oneOrFailByID(this.rootID);
        const parent = await this.orm.Folder.findOne({ where: { path: dir.path } });
        if (!parent) {
            const oldParent = await this.orm.Folder.findOneFilter({ rootIDs: [this.root.id], level: 0 });
            if (oldParent) {
                await this.removeFolder(oldParent);
            }
        }
        let rootMatch;
        if (!parent) {
            rootMatch = await this.buildNode(dir);
        }
        else {
            rootMatch = await this.scanNode(dir, parent);
        }
        if (this.orm.em.hasChanges()) {
            log.debug('Syncing Track/Artwork Changes to DB');
            await this.orm.em.flush();
        }
        return rootMatch;
    }
}
exports.WorkerScan = WorkerScan;
//# sourceMappingURL=scan.js.map