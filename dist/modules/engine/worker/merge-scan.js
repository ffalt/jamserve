"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerMergeScan = void 0;
const enums_1 = require("../../../types/enums");
const dir_name_1 = require("../../../utils/dir-name");
const path_1 = __importDefault(require("path"));
const logger_1 = require("../../../utils/logger");
const meta_stats_1 = require("./meta-stats");
const log = logger_1.logger('Worker.MergeScan');
class WorkerMergeScan {
    constructor(orm, strategy, changes) {
        this.orm = orm;
        this.strategy = strategy;
        this.changes = changes;
    }
    async mergeMatch(matchRoot) {
        const mergeRoot = WorkerMergeScan.buildNodes(matchRoot);
        return this.merge(mergeRoot);
    }
    async merge(mergeRoot) {
        this.markChangedParents(mergeRoot);
        await this.mergeNode(mergeRoot);
        if (this.orm.em.hasChanges()) {
            log.debug('Syncing Folder Changes to DB');
            await this.orm.em.flush();
        }
    }
    static isExtraFolder(node) {
        const name = path_1.default.basename(node.path).toLowerCase();
        return !!name.match(/(\[(extra|various)]|^(extra|various)$)/);
    }
    static getMultiAlbumFolderType(node) {
        const a = node.children.find(d => {
            return (d.folder.folderType === enums_1.FolderType.artist);
        });
        return a ? enums_1.FolderType.collection : enums_1.FolderType.multialbum;
    }
    static getMixedFolderType(node, _, __) {
        return WorkerMergeScan.getMultiAlbumFolderType(node);
    }
    static getFolderType(node, metaStat, strategy) {
        if (node.folder.level === 0) {
            return enums_1.FolderType.collection;
        }
        if (WorkerMergeScan.isExtraFolder(node)) {
            return enums_1.FolderType.extras;
        }
        if (metaStat.trackCount > 0) {
            if (metaStat.hasMultipleAlbums && metaStat.albumType === enums_1.AlbumType.series) {
                return enums_1.FolderType.artist;
            }
            const dirCount = node.children.filter(d => d.folder.folderType !== enums_1.FolderType.extras).length;
            if (dirCount > 0) {
                return WorkerMergeScan.getMixedFolderType(node, metaStat, strategy);
            }
            return enums_1.FolderType.album;
        }
        if (node.children.length === 0) {
            return (metaStat.trackCount === 0) ? enums_1.FolderType.extras : enums_1.FolderType.album;
        }
        if (metaStat.hasMultipleAlbums) {
            return (metaStat.hasMultipleArtists || strategy === enums_1.RootScanStrategy.compilation) ? enums_1.FolderType.collection : enums_1.FolderType.artist;
        }
        if (node.children.length === 1) {
            return (strategy === enums_1.RootScanStrategy.compilation) ? enums_1.FolderType.collection : enums_1.FolderType.artist;
        }
        if (!metaStat.hasMultipleArtists && node.children.filter(d => d.folder.folderType === enums_1.FolderType.artist).length > 0) {
            return enums_1.FolderType.artist;
        }
        return WorkerMergeScan.getMultiAlbumFolderType(node);
    }
    static setFolderType(node, type) {
        if (node.folder.folderType !== type) {
            node.folder.folderType = type;
            node.changed = true;
        }
        switch (type) {
            case enums_1.FolderType.collection:
                node.folder.mbArtistID = undefined;
                node.folder.mbReleaseID = undefined;
                node.folder.mbAlbumType = undefined;
                node.folder.mbReleaseGroupID = undefined;
                node.folder.artist = undefined;
                node.folder.artistSort = undefined;
                node.folder.album = undefined;
                node.folder.year = undefined;
                break;
            case enums_1.FolderType.artist:
                node.folder.mbReleaseID = undefined;
                node.folder.mbAlbumType = undefined;
                node.folder.mbReleaseGroupID = undefined;
                node.folder.album = undefined;
                node.folder.year = undefined;
                break;
            default:
        }
    }
    static markMultiAlbumChildDirs(node) {
        if (node.folder.folderType !== enums_1.FolderType.extras) {
            WorkerMergeScan.setFolderType(node, enums_1.FolderType.multialbum);
        }
        for (const child of node.children) {
            if (child.folder.folderType !== enums_1.FolderType.extras) {
                if (node.folder.albumType !== child.folder.albumType) {
                    node.folder.albumType = child.folder.albumType;
                    node.changed = true;
                }
            }
            WorkerMergeScan.markMultiAlbumChildDirs(child);
        }
    }
    static markArtistChildDirs(node) {
        if (node.folder.folderType === enums_1.FolderType.artist) {
            WorkerMergeScan.setFolderType(node, enums_1.FolderType.collection);
        }
        for (const child of node.children) {
            WorkerMergeScan.markArtistChildDirs(child);
        }
    }
    async buildFolderMeta(node) {
        log.debug('Merge Folder Meta', node.path);
        const metaStat = await meta_stats_1.MatchNodeMetaStats.buildMetaStat(node, this.strategy);
        const name = path_1.default.basename(node.path);
        const { title, year } = dir_name_1.splitDirectoryName(node.path);
        const folder = node.folder;
        folder.album = metaStat.album;
        folder.albumType = metaStat.albumType;
        folder.artist = metaStat.artist;
        folder.artistSort = metaStat.artistSort;
        folder.title = title !== name ? title : undefined;
        folder.name = name;
        folder.genres = metaStat.genres || [];
        folder.mbReleaseID = metaStat.mbReleaseID;
        folder.mbReleaseGroupID = metaStat.mbReleaseGroupID;
        folder.mbAlbumType = metaStat.mbAlbumType;
        folder.mbArtistID = metaStat.mbArtistID;
        folder.albumTrackCount = metaStat.trackCount;
        folder.year = (year !== undefined && year > 0) ? year : metaStat.year;
        folder.folderType = WorkerMergeScan.getFolderType(node, metaStat, this.strategy);
        WorkerMergeScan.setFolderType(node, folder.folderType);
        if (folder.folderType === enums_1.FolderType.multialbum) {
            WorkerMergeScan.markMultiAlbumChildDirs(node);
        }
        else if (folder.folderType === enums_1.FolderType.artist) {
            for (const child of node.children) {
                WorkerMergeScan.markArtistChildDirs(child);
            }
        }
        this.orm.Folder.persistLater(folder);
    }
    async mergeNode(node) {
        for (const child of node.children) {
            await this.mergeNode(child);
        }
        if (node.changed) {
            await this.buildFolderMeta(node);
        }
    }
    markChangedParents(node) {
        let changed = node.changed;
        for (const child of node.children) {
            this.markChangedParents(child);
            if (child.changed) {
                changed = true;
            }
        }
        if (changed) {
            if (!this.changes.folders.added.hasID(node.folder.id) && !this.changes.folders.removed.hasID(node.folder.id)) {
                this.changes.folders.updated.addID(node.folder.id);
            }
        }
        node.changed = changed;
    }
    static buildNodes(node) {
        return {
            path: node.scan.path,
            children: node.children.map(c => WorkerMergeScan.buildNodes(c)),
            tracks: node.tracks,
            nrOfTracks: node.tracks.length,
            folder: node.folder,
            changed: node.changed
        };
    }
}
exports.WorkerMergeScan = WorkerMergeScan;
//# sourceMappingURL=merge-scan.js.map