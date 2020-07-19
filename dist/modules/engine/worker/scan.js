"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerScan = void 0;
const logger_1 = require("../../../utils/logger");
const enums_1 = require("../../../types/enums");
const dir_name_1 = require("../../../utils/dir-name");
const path_1 = __importDefault(require("path"));
const fs_utils_1 = require("../../../utils/fs-utils");
const artwork_type_1 = require("../../../utils/artwork-type");
const log = logger_1.logger('Worker.Scan');
class WorkerScan {
    constructor(orm, root, audioModule, imageModule, changes) {
        this.orm = orm;
        this.root = root;
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
        const artwork = this.orm.Artwork.create({ name, path: folder.path, folder });
        await this.setArtworkValues(file, artwork);
        this.changes.artworks.added.add(artwork);
        return artwork;
    }
    async updateArtwork(file, artwork) {
        log.info('Artwork has changed', file.path);
        await this.setArtworkValues(file, artwork);
        this.changes.artworks.updated.add(artwork);
    }
    async setTrackValues(file, track) {
        const data = await this.audioModule.read(file.path);
        const tag = this.orm.Tag.create(data);
        this.orm.orm.em.persistLater(tag);
        const oldTag = await track.tag;
        if (oldTag) {
            this.orm.orm.em.removeLater(oldTag);
        }
        track.tag = tag;
        track.fileSize = file.size;
        track.statCreated = file.ctime;
        track.statModified = file.mtime;
        this.orm.orm.em.persistLater(track);
    }
    async buildTrack(file, parent) {
        log.info('New Track', file.path);
        const track = this.orm.Track.create({
            name: fs_utils_1.basenameStripExt(file.path),
            fileName: path_1.default.basename(file.path),
            path: fs_utils_1.ensureTrailingPathSeparator(path_1.default.dirname(file.path)),
            folder: parent,
            root: this.root
        });
        await this.setTrackValues(file, track);
        this.changes.tracks.added.add(track);
        return track;
    }
    async updateTrack(file, track) {
        if (!this.changes.tracks.removed.has(track)) {
            log.info('Track has changed', file.path);
            await this.setTrackValues(file, track);
            this.changes.tracks.updated.add(track);
        }
    }
    async buildFolder(dir, parent) {
        log.info('New Folder', dir.path);
        const { title, year } = dir_name_1.splitDirectoryName(dir.path);
        const folder = this.orm.Folder.create({
            level: dir.level,
            path: dir.path,
            name: title,
            title,
            year,
            folderType: enums_1.FolderType.unknown,
            root: this.root,
            parent,
            statCreated: dir.ctime,
            statModified: dir.mtime
        });
        this.orm.orm.em.persistLater(folder);
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
            artworks: [],
            changed: true
        };
        for (const subDir of dir.directories) {
            result.children.push(await this.buildNode(subDir, folder));
        }
        for (const file of dir.files) {
            if (file.type === enums_1.FileTyp.audio) {
                result.tracks.push(await this.buildTrack(file, folder));
            }
            else if (file.type === enums_1.FileTyp.image) {
                result.artworks.push(await this.buildArtwork(file, folder));
            }
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
            artworks: [],
            changed: false
        };
        await this.scanSubfolders(folder, dir, result);
        await this.scanTracks(dir, folder, result);
        await this.scanArtworks(dir, folder, result);
        return result;
    }
    async scanSubfolders(folder, dir, result) {
        await this.orm.Folder.populate(folder, 'children');
        const folders = folder.children.getItems();
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
        await this.orm.Folder.populate(folder, 'artworks');
        const artworks = folder.artworks.getItems();
        for (const artwork of artworks) {
            const filename = path_1.default.join(artwork.path, artwork.name);
            const scanArtwork = scanArtworks.find(t => t.path == filename);
            if (scanArtwork) {
                foundScanArtworks.push(scanArtwork);
                result.artworks.push(artwork);
                if (scanArtwork.size !== artwork.fileSize ||
                    scanArtwork.ctime !== artwork.statCreated ||
                    scanArtwork.mtime !== artwork.statModified) {
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
            result.artworks.push(await this.buildArtwork(newArtwork, folder));
        }
    }
    async scanTracks(dir, folder, result) {
        const scanTracks = dir.files.filter(f => f.type === enums_1.FileTyp.audio);
        const foundScanTracks = [];
        await this.orm.Folder.populate(folder, ['tracks', 'artworks']);
        const tracks = folder.tracks.getItems();
        for (const track of tracks) {
            const filename = path_1.default.join(track.path, track.fileName);
            const scanTrack = scanTracks.find(t => t.path == filename);
            if (scanTrack) {
                foundScanTracks.push(scanTrack);
                result.tracks.push(track);
                if (scanTrack.size !== track.fileSize ||
                    scanTrack.ctime !== track.statCreated ||
                    scanTrack.mtime !== track.statModified) {
                    await this.updateTrack(scanTrack, track);
                    result.changed = true;
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
            result.tracks.push(await this.buildTrack(newTrack, folder));
        }
    }
    async match(dir) {
        const parent = await this.orm.Folder.findOne({ path: { $eq: dir.path } });
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
        return rootMatch;
    }
}
exports.WorkerScan = WorkerScan;
//# sourceMappingURL=scan.js.map