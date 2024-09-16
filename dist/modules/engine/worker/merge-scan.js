import { AlbumType, FolderType, RootScanStrategy } from '../../../types/enums.js';
import { splitDirectoryName } from '../../../utils/dir-name.js';
import path from 'path';
import { logger } from '../../../utils/logger.js';
import { MatchNodeMetaStats } from './meta-stats.js';
import { QHelper } from '../../orm/index.js';
const log = logger('IO.MergeScan');
export class WorkerMergeScan {
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
        const name = path.basename(node.path).toLowerCase();
        return !!name.match(/(\[(extra|various)]|^(extra|various)$)/);
    }
    static getMultiAlbumFolderType(node) {
        const a = node.children.find(d => d.folder.folderType === FolderType.artist);
        return a ? FolderType.collection : FolderType.multialbum;
    }
    static getMultipleAlbumFolderType(metaStat, strategy) {
        return (metaStat.hasMultipleArtists || strategy === RootScanStrategy.compilation) ? FolderType.collection : FolderType.artist;
    }
    static getMixedFolderType(node, _, __) {
        return WorkerMergeScan.getMultiAlbumFolderType(node);
    }
    static getTrackFolderType(node, metaStat, strategy) {
        if (metaStat.hasMultipleAlbums && metaStat.albumType === AlbumType.series) {
            return FolderType.artist;
        }
        const dirCount = node.children.filter(d => d.folder.folderType !== FolderType.extras).length;
        if (dirCount > 0) {
            return WorkerMergeScan.getMixedFolderType(node, metaStat, strategy);
        }
        return FolderType.album;
    }
    static getFolderType(node, metaStat, strategy) {
        if (node.folder.level === 0) {
            return FolderType.collection;
        }
        if (WorkerMergeScan.isExtraFolder(node)) {
            return FolderType.extras;
        }
        if (metaStat.trackCount > 0) {
            return this.getTrackFolderType(node, metaStat, strategy);
        }
        if (node.children.length === 0) {
            return FolderType.extras;
        }
        if (metaStat.hasMultipleAlbums) {
            return WorkerMergeScan.getMultipleAlbumFolderType(metaStat, strategy);
        }
        if (node.children.length === 1) {
            return (strategy === RootScanStrategy.compilation) ? FolderType.collection : FolderType.artist;
        }
        if (!metaStat.hasMultipleArtists && !!node.children.find(d => d.folder.folderType === FolderType.artist)) {
            return FolderType.artist;
        }
        return WorkerMergeScan.getMultiAlbumFolderType(node);
    }
    static setFolderType(node, type) {
        if (node.folder.folderType !== type) {
            node.folder.folderType = type;
            node.changed = true;
        }
        switch (type) {
            case FolderType.collection:
                node.folder.mbArtistID = undefined;
                node.folder.mbReleaseID = undefined;
                node.folder.mbAlbumType = undefined;
                node.folder.mbReleaseGroupID = undefined;
                node.folder.artist = undefined;
                node.folder.artistSort = undefined;
                node.folder.album = undefined;
                node.folder.year = undefined;
                break;
            case FolderType.artist:
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
        if (node.folder.folderType !== FolderType.extras) {
            WorkerMergeScan.setFolderType(node, FolderType.multialbum);
        }
        for (const child of node.children) {
            if (child.folder.folderType !== FolderType.extras) {
                if (node.folder.albumType !== child.folder.albumType) {
                    node.folder.albumType = child.folder.albumType;
                    node.changed = true;
                }
            }
            WorkerMergeScan.markMultiAlbumChildDirs(child);
        }
    }
    static markArtistChildDirs(node) {
        if (node.folder.folderType === FolderType.artist) {
            WorkerMergeScan.setFolderType(node, FolderType.collection);
        }
        for (const child of node.children) {
            WorkerMergeScan.markArtistChildDirs(child);
        }
    }
    async buildFolderMeta(node) {
        log.debug('Merge Folder Meta', node.path);
        const metaStat = await MatchNodeMetaStats.buildMetaStat(node, this.strategy);
        const name = path.basename(node.path);
        const { title, year } = splitDirectoryName(node.path);
        const folder = node.folder;
        folder.album = metaStat.album;
        folder.albumType = metaStat.albumType;
        folder.artist = metaStat.artist;
        folder.artistSort = metaStat.artistSort;
        folder.title = title !== name ? title : undefined;
        folder.name = name;
        folder.mbReleaseID = metaStat.mbReleaseID;
        folder.mbReleaseGroupID = metaStat.mbReleaseGroupID;
        folder.mbAlbumType = metaStat.mbAlbumType;
        folder.mbArtistID = metaStat.mbArtistID;
        folder.albumTrackCount = metaStat.trackCount;
        folder.year = (year !== undefined && year > 0) ? year : metaStat.year;
        folder.folderType = WorkerMergeScan.getFolderType(node, metaStat, this.strategy);
        const genreNames = metaStat.genres || [];
        let genres = [];
        if (genreNames.length > 0) {
            genres = await this.orm.Genre.find({ where: { name: QHelper.inOrEqual(genreNames) } });
        }
        await folder.genres.set(genres);
        WorkerMergeScan.setFolderType(node, folder.folderType);
        if (folder.folderType === FolderType.multialbum) {
            WorkerMergeScan.markMultiAlbumChildDirs(node);
        }
        else if (folder.folderType === FolderType.artist) {
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
//# sourceMappingURL=merge-scan.js.map