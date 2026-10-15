import { logger } from '../../../utils/logger.js';
import { FileTyp, FolderType } from '../../../types/enums.js';
import { splitDirectoryName } from '../../../utils/dir-name.js';
import path from 'node:path';
import { basenameStripExtension, ensureTrailingPathSeparator } from '../../../utils/fs-utils.js';
import { artWorkImageNameToType } from '../../../utils/artwork-type.js';
import { isSameDate } from '../../../utils/date-time.js';
import { TrackUpdater } from './tasks/track.js';
const log = logger('IO.Scan');
export class OnDemandTrackMatch {
}
export class ObjTrackMatch {
    constructor(match) {
        this.match = match;
    }
    async get() {
        return this.match;
    }
}
export class ObjLoadTrackMatch {
    constructor(track) {
        this.track = track;
    }
    async get() {
        return WorkerScan.buildTrackMatch(this.track);
    }
}
export class WorkerScan {
    constructor(orm, rootID, audioModule, imageModule, changes) {
        this.orm = orm;
        this.rootID = rootID;
        this.imageModule = imageModule;
        this.changes = changes;
        this.childFolders = new Map();
        this.folderTracks = new Map();
        this.folderArtworks = new Map();
        this.trackUpdater = new TrackUpdater(orm, audioModule, changes);
    }
    async setArtworkValues(file, artwork) {
        const name = path.basename(file.path);
        const info = await this.imageModule.getImageInfo(file.path);
        artwork.types = artWorkImageNameToType(name);
        artwork.format = info.format;
        artwork.height = info.height;
        artwork.width = info.width;
        artwork.statCreated = file.ctime;
        artwork.statModified = file.mtime;
        artwork.fileSize = file.size;
        this.orm.Artwork.persistLater(artwork);
    }
    async buildArtwork(file, folder) {
        log.info('New Artwork', file.path);
        const name = path.basename(file.path);
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
    static buildMbAlbumType(tag) {
        if (!tag?.mbAlbumType && !tag?.mbAlbumStatus) {
            return;
        }
        return `${tag.mbAlbumType ?? ''}/${tag.mbAlbumStatus ?? ''}`;
    }
    static async buildTrackMatch(track) {
        const tag = await track.tag.get();
        return {
            artist: tag?.albumArtist ?? tag?.artist,
            artistSort: tag?.albumArtistSort ?? tag?.artistSort,
            genres: tag?.genres,
            album: tag?.album,
            series: tag?.series,
            year: tag?.year,
            mbArtistID: tag?.mbAlbumArtistID ?? tag?.mbArtistID,
            mbReleaseID: tag?.mbReleaseID,
            mbReleaseGroupID: tag?.mbReleaseGroupID,
            mbAlbumType: this.buildMbAlbumType(tag)
        };
    }
    async setTrackValues(file, track) {
        track.fileSize = file.size;
        track.statCreated = file.ctime;
        track.statModified = file.mtime;
        await this.trackUpdater.updateTrackValues(track, file.path);
        this.orm.Track.persistLater(track);
        return WorkerScan.buildTrackMatch(track);
    }
    async buildTrack(file, parent) {
        log.info('New Track', file.path);
        const track = this.orm.Track.create({
            name: basenameStripExtension(file.path),
            fileName: path.basename(file.path),
            path: ensureTrailingPathSeparator(path.dirname(file.path))
        });
        await track.folder.set(parent);
        await track.root.set(this.root);
        this.changes.tracks.added.add(track);
        return await this.setTrackValues(file, track);
    }
    async updateTrack(file, track) {
        if (this.changes.tracks.removed.has(track)) {
            return;
        }
        log.info('Updating Track', file.path);
        this.changes.tracks.updated.add(track);
        return await this.setTrackValues(file, track);
    }
    async buildFolder(dir, parent) {
        log.info('New Folder', dir.path);
        const { title, year } = splitDirectoryName(dir.path);
        const name = path.basename(dir.path);
        const folder = this.orm.Folder.create({
            level: dir.level,
            path: ensureTrailingPathSeparator(dir.path),
            name,
            title: name === title ? undefined : title,
            year,
            folderType: FolderType.unknown,
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
    static createNode(dir, folder) {
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
        const result = WorkerScan.createNode(dir, folder);
        result.changed = true;
        for (const subDir of dir.directories) {
            result.children.push(await this.buildNode(subDir, folder));
        }
        for (const file of dir.files) {
            if (file.type === FileTyp.audio) {
                result.tracks.push(new ObjTrackMatch(await this.buildTrack(file, folder)));
            }
            else if (file.type === FileTyp.image) {
                result.artworksCount += 1;
                await this.buildArtwork(file, folder);
            }
        }
        await this.flushIfEnough();
        return result;
    }
    async flushIfEnough() {
        if (this.orm.em.changesCount() <= 1000) {
            return;
        }
        log.debug('Syncing Track/Artwork Changes to DB');
        await this.orm.em.flush();
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
    updateFolderStats(dir, folder) {
        if (isSameDate(dir.ctime, folder.statCreated) && isSameDate(dir.mtime, folder.statModified)) {
            return;
        }
        folder.statCreated = dir.ctime;
        folder.statModified = dir.mtime;
        this.orm.Folder.persistLater(folder);
    }
    async scanNode(dir, folder) {
        log.debug('Matching:', dir.path);
        const result = WorkerScan.createNode(dir, folder);
        this.updateFolderStats(dir, folder);
        await this.scanSubfolders(folder, dir, result);
        await this.scanTracks(dir, folder, result);
        await this.scanArtworks(dir, folder, result);
        await this.flushIfEnough();
        return result;
    }
    static filesByPath(dir, type) {
        const result = new Map();
        for (const file of dir.files) {
            if (file.type === type) {
                result.set(file.path, file);
            }
        }
        return result;
    }
    async scanSubfolders(folder, dir, result) {
        const folders = this.childFolders.get(folder.id) ?? [];
        const folderMap = new Map(folders.map(f => [f.path, f]));
        for (const subDir of dir.directories) {
            if (subDir.path === folder.path) {
                continue;
            }
            const subFolder = folderMap.get(subDir.path);
            result.children.push(subFolder ? await this.scanNode(subDir, subFolder) : await this.buildNode(subDir, folder));
        }
        for (const child of folders) {
            const subf = result.children.some(f => f.scan.path === child.path);
            if (subf) {
                continue;
            }
            await this.removeFolder(child);
            this.changes.folders.updated.add(folder);
        }
    }
    async scanArtworks(dir, folder, result) {
        const scanArtworks = WorkerScan.filesByPath(dir, FileTyp.image);
        const artworks = this.folderArtworks.get(folder.id) ?? [];
        for (const artwork of artworks) {
            await this.scanArtwork(artwork, scanArtworks, result);
        }
        for (const newArtwork of scanArtworks.values()) {
            result.changed = true;
            result.artworksCount += 1;
            await this.buildArtwork(newArtwork, folder);
        }
    }
    async scanArtwork(artwork, scanArtworks, result) {
        const filename = path.join(artwork.path, artwork.name);
        const scanArtwork = scanArtworks.get(filename);
        if (!scanArtwork) {
            log.info('Artwork has been removed', filename);
            result.changed = true;
            this.changes.artworks.removed.add(artwork);
            return;
        }
        scanArtworks.delete(filename);
        result.artworksCount += 1;
        if (scanArtwork.size === artwork.fileSize && isSameDate(scanArtwork.ctime, artwork.statCreated) && isSameDate(scanArtwork.mtime, artwork.statModified)) {
            return;
        }
        result.changed = true;
        await this.updateArtwork(scanArtwork, artwork);
    }
    async scanTracks(dir, folder, result) {
        const scanTracks = WorkerScan.filesByPath(dir, FileTyp.audio);
        const tracks = this.folderTracks.get(folder.id) ?? [];
        for (const track of tracks) {
            await this.scanTrack(track, scanTracks, result);
        }
        for (const newTrack of scanTracks.values()) {
            result.changed = true;
            result.tracks.push(new ObjTrackMatch(await this.buildTrack(newTrack, folder)));
        }
    }
    async scanTrack(track, scanTracks, result) {
        const filename = path.join(track.path, track.fileName);
        const scanTrack = scanTracks.get(filename);
        if (!scanTrack) {
            log.info('Track has been removed', filename);
            result.changed = true;
            this.changes.tracks.removed.add(track);
            return;
        }
        scanTracks.delete(filename);
        if (this.changes.tracks.updated.has(track) ||
            scanTrack.size !== track.fileSize ||
            !isSameDate(scanTrack.ctime, track.statCreated) ||
            !isSameDate(scanTrack.mtime, track.statModified)) {
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
    static groupByID(items, id) {
        const result = new Map();
        for (const item of items) {
            const key = id(item);
            if (!key) {
                continue;
            }
            const list = result.get(key);
            if (list) {
                list.push(item);
            }
            else {
                result.set(key, [item]);
            }
        }
        return result;
    }
    async loadArtworks(folderIDs) {
        const result = [];
        for (let start = 0; start < folderIDs.length; start += WorkerScan.LOAD_BATCH_SIZE) {
            const ids = folderIDs.slice(start, start + WorkerScan.LOAD_BATCH_SIZE);
            result.push(...await this.orm.Artwork.find({ where: { folder: ids } }));
        }
        return result;
    }
    async preload() {
        const folders = await this.orm.Folder.find({ where: { root: this.root.id } });
        this.childFolders = WorkerScan.groupByID(folders, folder => folder.parent.id());
        const tracks = await this.orm.Track.find({ where: { root: this.root.id } });
        this.folderTracks = WorkerScan.groupByID(tracks, track => track.folder.id());
        const artworks = await this.loadArtworks(folders.map(folder => folder.id));
        this.folderArtworks = WorkerScan.groupByID(artworks, artwork => artwork.folder.id());
    }
    async match(dir) {
        this.root = await this.orm.Root.oneOrFailByID(this.rootID);
        await this.preload();
        const parent = await this.orm.Folder.findOne({ where: { path: dir.path } });
        if (!parent) {
            const oldParent = await this.orm.Folder.findOneFilter({ rootIDs: [this.root.id], level: 0 });
            if (oldParent) {
                await this.removeFolder(oldParent);
            }
        }
        const rootMatch = parent ? await this.scanNode(dir, parent) : await this.buildNode(dir);
        if (this.orm.em.hasChanges()) {
            log.debug('Syncing Track/Artwork Changes to DB');
            await this.orm.em.flush();
        }
        return rootMatch;
    }
}
WorkerScan.LOAD_BATCH_SIZE = 500;
//# sourceMappingURL=scan.js.map