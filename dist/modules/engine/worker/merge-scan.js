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
    constructor(strategy, changes) {
        this.strategy = strategy;
        this.changes = changes;
    }
    async merge(matchRoot) {
        this.markChangedParents(matchRoot);
        await this.mergeNode(matchRoot);
    }
    static isExtraFolder(node) {
        const name = path_1.default.basename(node.scan.path).toLowerCase();
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
        if (node.scan.level === 0) {
            return enums_1.FolderType.collection;
        }
        if (WorkerMergeScan.isExtraFolder(node)) {
            return enums_1.FolderType.extras;
        }
        if (metaStat.trackCount > 0) {
            if (metaStat.hasMultipleAlbums && node.folder.albumType === enums_1.AlbumType.series) {
                return enums_1.FolderType.artist;
            }
            const dirCount = node.children.filter(d => d.folder.folderType !== enums_1.FolderType.extras).length;
            if (dirCount > 0) {
                return WorkerMergeScan.getMixedFolderType(node, metaStat, strategy);
            }
            return enums_1.FolderType.album;
        }
        if (node.children.length === 0) {
            return (node.tracks.length === 0) ? enums_1.FolderType.extras : enums_1.FolderType.album;
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
        node.folder.folderType = type;
        switch (type) {
            case enums_1.FolderType.collection:
                node.folder.albumType = undefined;
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
            if (node.folder.folderType !== enums_1.FolderType.extras) {
                node.folder.albumType = child.folder.albumType;
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
        log.debug('Merge Folder Meta', node.scan.path);
        const metaStat = await meta_stats_1.MatchNodeMetaStats.buildMetaStat(node, this.strategy);
        const nameSplit = dir_name_1.splitDirectoryName(node.scan.path);
        const folder = node.folder;
        folder.album = metaStat.album;
        folder.albumType = metaStat.albumType;
        folder.artist = metaStat.artist;
        folder.artistSort = metaStat.artistSort;
        folder.title = nameSplit.title;
        folder.name = nameSplit.title || folder.name;
        folder.genres = metaStat.genres || [];
        folder.mbReleaseID = metaStat.mbReleaseID;
        folder.mbReleaseGroupID = metaStat.mbReleaseGroupID;
        folder.mbAlbumType = metaStat.mbAlbumType;
        folder.mbArtistID = metaStat.mbArtistID;
        folder.albumTrackCount = metaStat.trackCount;
        folder.year = (nameSplit.year !== undefined && nameSplit.year > 0) ? nameSplit.year : metaStat.year;
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
            if (!this.changes.folders.added.has(node.folder) && !this.changes.folders.removed.has(node.folder)) {
                this.changes.folders.updated.add(node.folder);
            }
        }
        node.changed = changed;
    }
}
exports.WorkerMergeScan = WorkerMergeScan;
//# sourceMappingURL=merge-scan.js.map