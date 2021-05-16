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
const log = logger_1.logger('IO.Scan');
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
        this.genresCache = [];
    }
    async setArtworkValues(file, artwork) {
        const name = path_1.default.basename(file.path);
        const info = await this.imageModule.getImageInfo(file.path);
        artwork.types = artwork_type_1.artWorkImageNameToType(name);
        artwork.format = info?.format;
        artwork.height = info?.height;
        artwork.width = info?.width;
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
    static async buildTrackMatch(track) {
        const tag = await track.tag.get();
        return {
            artist: tag?.albumArtist || tag?.artist,
            artistSort: tag?.albumArtistSort || tag?.artistSort,
            genres: tag?.genres,
            album: tag?.album,
            series: tag?.series,
            year: tag?.year,
            trackTotal: tag?.trackTotal,
            discTotal: tag?.discTotal,
            disc: tag?.disc,
            track: tag?.trackNr,
            mbArtistID: tag?.mbArtistID,
            mbReleaseID: tag?.mbReleaseID,
            mbAlbumType: `${tag?.mbAlbumType || ''}/${tag?.mbAlbumStatus || ''}`,
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
        const genres = await this.findOrCreateGenres(tag);
        await track.genres.set(genres);
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
            log.info('Updating Track', file.path);
            this.changes.tracks.updated.add(track);
        }
        if (this.changes.tracks.updated.has(track)) {
            return await this.setTrackValues(file, track);
        }
        return;
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
    createNode(dir, folder) {
        return {
            scan: dir,
            folder,
            children: [],
            tracks: [],
            artworksCount: 0,
            changed: false
        };
    }
    async buildNode(dir, parent) {
        const folder = await this.buildFolder(dir, parent);
        this.changes.folders.added.add(folder);
        const result = this.createNode(dir, folder);
        result.changed = true;
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
        await this.flushIfEnough();
        return result;
    }
    async flushIfEnough() {
        if (this.orm.em.changesCount() > 1000) {
            log.debug('Syncing Track/Artwork Changes to DB');
            await this.orm.em.flush();
        }
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
        const result = this.createNode(dir, folder);
        await this.scanSubfolders(folder, dir, result);
        await this.scanTracks(dir, folder, result);
        await this.scanArtworks(dir, folder, result);
        await this.flushIfEnough();
        return result;
    }
    async scanSubfolders(folder, dir, result) {
        const folders = await folder.children.getItems();
        for (const subDir of dir.directories) {
            if (subDir.path !== folder.path) {
                const subFolder = folders.find(f => f.path === subDir.path);
                result.children.push(!subFolder ? await this.buildNode(subDir, folder) : await this.scanNode(subDir, subFolder));
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
            await this.scanArtwork(artwork, scanArtworks, foundScanArtworks, result);
        }
        const newArtworks = scanArtworks.filter(t => !foundScanArtworks.includes(t));
        for (const newArtwork of newArtworks) {
            result.changed = true;
            result.artworksCount += 1;
            await this.buildArtwork(newArtwork, folder);
        }
    }
    async scanArtwork(artwork, scanArtworks, foundScanArtworks, result) {
        const filename = path_1.default.join(artwork.path, artwork.name);
        const scanArtwork = scanArtworks.find(t => t.path == filename);
        if (!scanArtwork) {
            log.info('Artwork has been removed', filename);
            result.changed = true;
            this.changes.artworks.removed.add(artwork);
            return;
        }
        foundScanArtworks.push(scanArtwork);
        result.artworksCount += 1;
        if (scanArtwork.size !== artwork.fileSize ||
            !moment_1.default(scanArtwork.ctime).isSame(artwork.statCreated) ||
            !moment_1.default(scanArtwork.mtime).isSame(artwork.statModified)) {
            result.changed = true;
            await this.updateArtwork(scanArtwork, artwork);
        }
    }
    async scanTracks(dir, folder, result) {
        const scanTracks = dir.files.filter(f => f.type === enums_1.FileTyp.audio);
        const foundScanTracks = [];
        const tracks = await folder.tracks.getItems();
        for (const track of tracks) {
            await this.scanTrack(track, scanTracks, foundScanTracks, result);
        }
        const newTracks = scanTracks.filter(t => !foundScanTracks.includes(t));
        for (const newTrack of newTracks) {
            result.changed = true;
            result.tracks.push(new ObjTrackMatch(await this.buildTrack(newTrack, folder)));
        }
    }
    async scanTrack(track, scanTracks, foundScanTracks, result) {
        const filename = path_1.default.join(track.path, track.fileName);
        const scanTrack = scanTracks.find(t => t.path == filename);
        if (!scanTrack) {
            log.info('Track has been removed', filename);
            result.changed = true;
            this.changes.tracks.removed.add(track);
            return;
        }
        foundScanTracks.push(scanTrack);
        if (this.changes.tracks.updated.has(track) ||
            scanTrack.size !== track.fileSize ||
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
    async match(dir) {
        this.root = await this.orm.Root.oneOrFailByID(this.rootID);
        const parent = await this.orm.Folder.findOne({ where: { path: dir.path } });
        if (!parent) {
            const oldParent = await this.orm.Folder.findOneFilter({ rootIDs: [this.root.id], level: 0 });
            if (oldParent) {
                await this.removeFolder(oldParent);
            }
        }
        const rootMatch = !parent ? await this.buildNode(dir) : await this.scanNode(dir, parent);
        if (this.orm.em.hasChanges()) {
            log.debug('Syncing Track/Artwork Changes to DB');
            await this.orm.em.flush();
        }
        return rootMatch;
    }
}
exports.WorkerScan = WorkerScan;
//# sourceMappingURL=scan.js.map